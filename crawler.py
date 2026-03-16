#!/usr/bin/env python3
"""
AI日氪 - 自动化资讯爬虫
功能：从多个 AI 资讯源抓取最新内容，AI 摘要，写入 Supabase 数据库
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import requests
import feedparser
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
import re

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Supabase 配置
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# 初始化 Supabase 客户端
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 分类映射
CATEGORY_MAP = {
    'model': '大模型',
    'tool': 'AI工具',
    'solo': 'AI一人项目',
    'funding': '融资动态',
    'research': '学术前沿'
}

# 资讯源配置
NEWS_SOURCES = [
    {
        'name': 'TechCrunch AI',
        'url': 'https://techcrunch.com/category/artificial-intelligence/feed/',
        'type': 'rss',
        'category': 'model',
        'source': 'TechCrunch'
    },
    {
        'name': 'The Verge AI',
        'url': 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
        'type': 'rss',
        'category': 'tool',
        'source': 'The Verge'
    },
    {
        'name': 'MIT Technology Review',
        'url': 'https://www.technologyreview.com/feed/',
        'type': 'rss',
        'category': 'research',
        'source': 'MIT Tech Review'
    },
    {
        'name': '36氪 AI',
        'url': 'https://36kr.com/feed',
        'type': 'rss',
        'category': 'funding',
        'source': '36氪'
    },
    {
        'name': '量子位',
        'url': 'https://www.qbitai.com/feed',
        'type': 'rss',
        'category': 'research',
        'source': '量子位'
    },
    {
        'name': '机器之心',
        'url': 'https://www.jiqizhixin.com/rss',
        'type': 'rss',
        'category': 'research',
        'source': '机器之心'
    }
]


def fetch_rss_feed(url: str) -> Optional[List[Dict]]:
    """抓取 RSS feed"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        feed = feedparser.parse(response.content)
        articles = []

        for entry in feed.entries[:20]:  # 每个源最多抓取 20 条
            try:
                # 提取发布时间
                published_at = entry.get('published')
                if published_at:
                    published_at = datetime.strptime(published_at, '%a, %d %b %Y %H:%M:%S %z')
                else:
                    published_at = datetime.now()

                articles.append({
                    'title': entry.get('title', '').strip(),
                    'summary': extract_text_from_html(entry.get('summary', entry.get('description', ''))),
                    'url': entry.get('link', ''),
                    'published_at': published_at
                })
            except Exception as e:
                logger.warning(f"解析 RSS 条目失败: {e}")
                continue

        return articles

    except Exception as e:
        logger.error(f"抓取 RSS 失败 {url}: {e}")
        return None


def extract_text_from_html(html_content: str) -> str:
    """从 HTML 中提取纯文本"""
    if not html_content:
        return ""

    soup = BeautifulSoup(html_content, 'html.parser')

    # 移除 script 和 style 标签
    for script in soup(["script", "style"]):
        script.decompose()

    text = soup.get_text()

    # 清理文本
    text = re.sub(r'\s+', ' ', text)  # 合并多个空格
    text = text.strip()

    # 限制摘要长度
    max_length = 500
    if len(text) > max_length:
        text = text[:max_length] + "..."

    return text


def generate_ai_summary(text: str) -> str:
    """使用 OpenAI 生成摘要（可选）"""
    if not OPENAI_API_KEY:
        return text

    try:
        import openai
        openai.api_key = OPENAI_API_KEY

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "你是一个专业的AI资讯编辑。请将以下新闻内容总结成200字以内的中文摘要，保留核心信息。"
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            max_tokens=300,
            temperature=0.7
        )

        summary = response.choices[0].message.content.strip()
        return summary

    except Exception as e:
        logger.warning(f"AI 摘要生成失败: {e}")
        return text


def save_to_supabase(articles: List[Dict]) -> int:
    """保存文章到 Supabase 数据库"""
    saved_count = 0

    for article in articles:
        try:
            # 检查是否已存在（通过 URL 去重）
            existing = supabase.table('articles').select('id').eq('url', article['url']).execute()

            if existing.data:
                logger.info(f"文章已存在，跳过: {article['title'][:50]}...")
                continue

            # 插入新文章
            data = {
                'title': article['title'],
                'summary': article['summary'],
                'category': article['category'],
                'source': article['source'],
                'url': article['url'],
                'published_at': article['published_at'].isoformat()
            }

            result = supabase.table('articles').insert(data).execute()

            if result.data:
                saved_count += 1
                logger.info(f"✅ 已保存: {article['title'][:50]}...")

        except Exception as e:
            logger.error(f"保存文章失败: {e}")
            continue

    return saved_count


def deduplicate_by_title(articles: List[Dict]) -> List[Dict]:
    """基于标题去重"""
    seen = set()
    unique_articles = []

    for article in articles:
        title_normalized = article['title'].lower().strip()
        if title_normalized not in seen:
            seen.add(title_normalized)
            unique_articles.append(article)

    return unique_articles


def filter_recent_articles(articles: List[Dict], hours: int = 72) -> List[Dict]:
    """只保留最近 N 小时的文章"""
    cutoff = datetime.now() - timedelta(hours=hours)

    recent_articles = [
        article for article in articles
        if article['published_at'] > cutoff
    ]

    logger.info(f"筛选后保留 {len(recent_articles)}/{len(articles)} 篇最近 {hours} 小时的文章")
    return recent_articles


def main():
    """主函数"""
    logger.info("=" * 60)
    logger.info("AI日氪 - 资讯爬虫启动")
    logger.info("=" * 60)

    # 验证配置
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.error("❌ 缺少 Supabase 配置，请设置 SUPABASE_URL 和 SUPABASE_KEY")
        sys.exit(1)

    if OPENAI_API_KEY:
        logger.info("✅ 已启用 AI 摘要功能")
    else:
        logger.info("⚠️  未配置 OpenAI API，跳过 AI 摘要")

    all_articles = []

    # 抓取所有源
    for source in NEWS_SOURCES:
        logger.info(f"\n正在抓取: {source['name']}")
        articles = fetch_rss_feed(source['url'])

        if articles:
            # 添加分类和来源
            for article in articles:
                article['category'] = source['category']
                article['source'] = source['source']

                # 可选：AI 摘要
                if OPENAI_API_KEY and len(article['summary']) > 100:
                    try:
                        article['summary'] = generate_ai_summary(article['summary'])
                    except Exception as e:
                        logger.warning(f"AI 摘要失败: {e}")

            all_articles.extend(articles)
            logger.info(f"✅ 成功抓取 {len(articles)} 篇文章")
        else:
            logger.warning(f"❌ 抓取失败")

    # 去重和筛选
    logger.info(f"\n总共抓取 {len(all_articles)} 篇文章")

    # 基于标题去重
    all_articles = deduplicate_by_title(all_articles)
    logger.info(f"去重后剩余 {len(all_articles)} 篇文章")

    # 只保留最近 3 天的文章
    all_articles = filter_recent_articles(all_articles, hours=72)

    # 按发布时间排序
    all_articles.sort(key=lambda x: x['published_at'], reverse=True)

    # 保存到数据库
    logger.info(f"\n开始保存到数据库...")
    saved_count = save_to_supabase(all_articles)

    logger.info("=" * 60)
    logger.info(f"✅ 任务完成！成功保存 {saved_count}/{len(all_articles)} 篇文章")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
