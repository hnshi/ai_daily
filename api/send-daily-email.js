import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hnshi.github.io/ai-daily';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// 读取邮件模板
const emailTemplate = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa; padding: 20px; color: #1a1a1a; line-height: 1.6; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; }
        .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
        .header .subtitle { font-size: 16px; opacity: 0.9; }
        .header .date { font-size: 14px; opacity: 0.8; margin-top: 12px; padding: 6px 16px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; display: inline-block; }
        .stats { display: flex; justify-content: center; gap: 30px; padding: 20px 30px; background: #f8f9fa; border-bottom: 1px solid #e9ecef; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 24px; font-weight: 700; color: #667eea; }
        .stat-label { font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 30px; }
        .section-title { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1a1a1a; display: flex; align-items: center; gap: 8px; }
        .section-title::before { content: ''; display: block; width: 4px; height: 24px; background: #667eea; border-radius: 2px; }
        .article-item { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e9ecef; }
        .article-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .article-category { display: inline-block; padding: 4px 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 12px; font-weight: 600; border-radius: 12px; margin-bottom: 8px; }
        .article-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #1a1a1a; line-height: 1.4; }
        .article-summary { font-size: 15px; color: #6c757d; margin-bottom: 12px; line-height: 1.6; }
        .article-meta { display: flex; gap: 16px; font-size: 13px; color: #adb5bd; margin-bottom: 12px; }
        .article-meta span { display: flex; align-items: center; gap: 4px; }
        .read-more-btn { display: inline-block; padding: 10px 24px; background: #667eea; color: white; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer-links { margin-bottom: 16px; }
        .footer-links a { color: #667eea; text-decoration: none; margin: 0 12px; font-size: 14px; }
        .footer-text { font-size: 13px; color: #6c757d; line-height: 1.6; }
        .unsubscribe { margin-top: 16px; padding-top: 16px; border-top: 1px solid #dee2e6; }
        .unsubscribe a { color: #adb5bd; text-decoration: underline; font-size: 12px; }
        @media only screen and (max-width: 620px) { body { padding: 10px; } .header { padding: 30px 20px; } .header h1 { font-size: 24px; } .stats { gap: 20px; padding: 15px 20px; } .stat-value { font-size: 20px; } .content { padding: 20px; } .article-title { font-size: 16px; } .article-summary { font-size: 14px; } }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>AI Daily 日报</h1>
            <p class="subtitle">每天 5 分钟，掌握 AI 前沿动态</p>
            <div class="date">{{DATE}}</div>
        </div>
        <div class="stats">
            <div class="stat-item"><div class="stat-value">{{TOTAL_ARTICLES}}</div><div class="stat-label">今日资讯</div></div>
            <div class="stat-item"><div class="stat-value">{{TOTAL_CATEGORIES}}</div><div class="stat-label">覆盖领域</div></div>
            <div class="stat-item"><div class="stat-value">{{TOTAL_SUBSCRIBERS}}</div><div class="stat-label">订阅用户</div></div>
        </div>
        <div class="content">
            <div class="section-title">今日热点</div>
            {{ARTICLES}}
        </div>
        <div class="footer">
            <div class="footer-links">
                <a href="{{WEBSITE_URL}}">访问网站</a>
                <a href="{{GITHUB_URL}}">GitHub</a>
            </div>
            <p class="footer-text">这封邮件由 AI Daily 自动发送<br>你收到这封邮件是因为你订阅了我们的每日日报</p>
            <div class="unsubscribe">
                <a href="{{UNSUBSCRIBE_URL}}">点击退订邮件</a>
            </div>
        </div>
    </div>
</body>
</html>
`;

// 获取当天日期（北京时间 UTC+8）
function getBeijingDate() {
  const now = new Date();
  const utcDate = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  return utcDate.toISOString().split('T')[0];
}

// 格式化日期显示
function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return date.toLocaleDateString('zh-CN', options);
}

// 生成文章 HTML
function generateArticlesHTML(articles, websiteUrl) {
  return articles.map(article => {
    const articleUrl = article.url
      ? article.url
      : `https://www.google.com/search?q=${encodeURIComponent(article.title)}`;

    const readMoreText = article.url ? '阅读原文 →' : '查看详情 →';

    return `
      <div class="article-item">
        <div class="article-category">${article.category || 'AI动态'}</div>
        <div class="article-title">${article.title}</div>
        <div class="article-summary">${article.summary || '暂无摘要'}</div>
        <div class="article-meta">
          <span>📅 ${new Date(article.created_at).toLocaleDateString('zh-CN')}</span>
          ${article.source ? `<span>📍 ${article.source}</span>` : ''}
        </div>
        <a href="${articleUrl}" class="read-more-btn" target="_blank">${readMoreText}</a>
      </div>
    `;
  }).join('');
}

// 获取订阅用户列表
async function getSubscribers() {
  // 临时返回测试邮箱，请替换为你的实际邮箱
  const testEmails = ['your-email@example.com'];
  return testEmails;

  // 实际实现（需要先在 Supabase 创建 subscribers 表）：
  // const { data, error } = await supabase
  //   .from('subscribers')
  //   .select('email')
  //   .eq('status', 'active');
  // return error ? [] : data.map(s => s.email);
}

// 获取最新文章
async function getLatestArticles(days = 1) {
  try {
    const today = new Date();
    const startDate = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('获取文章失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('获取文章异常:', error);
    return [];
  }
}

// 发送邮件
async function sendEmail(to, htmlContent) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'AI Daily <noreply@resend.dev>',
      to: to,
      subject: `🤖 AI Daily - ${formatDateDisplay(getBeijingDate())}`,
      html: htmlContent,
    });

    if (error) {
      console.error(`发送邮件失败 [${to}]:`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`发送邮件异常 [${to}]:`, error);
    return { success: false, error };
  }
}

// 主函数
export default async function handler(req, res) {
  // 允许 GET 和 POST 请求（方便测试）
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 验证 Cron Job 密钥（可选，Cron Job 调用时才验证）
  const cronSecret = req.headers['x-cron-secret'];
  if (cronSecret && cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('开始发送每日邮件...');
  const startTime = Date.now();

  try {
    // 获取最新文章
    const articles = await getLatestArticles(1);
    console.log(`获取到 ${articles.length} 篇文章`);

    if (articles.length === 0) {
      console.log('没有新文章，跳过发送');
      return res.status(200).json({
        message: '没有新文章需要发送',
        timestamp: new Date().toISOString()
      });
    }

    // 获取订阅用户
    const subscribers = await getSubscribers();
    console.log(`获取到 ${subscribers.length} 个订阅用户`);

    if (subscribers.length === 0) {
      console.log('没有订阅用户，跳过发送');
      return res.status(200).json({
        message: '没有订阅用户',
        timestamp: new Date().toISOString()
      });
    }

    // 计算统计数据
    const categories = [...new Set(articles.map(a => a.category))].length;
    const currentDate = getBeijingDate();

    // 生成文章 HTML
    const articlesHTML = generateArticlesHTML(articles, process.env.WEBSITE_URL || 'https://ai-daily.vercel.app');

    // 替换模板变量
    let emailContent = emailTemplate
      .replace('{{DATE}}', formatDateDisplay(currentDate))
      .replace('{{TOTAL_ARTICLES}}', articles.length)
      .replace('{{TOTAL_CATEGORIES}}', categories)
      .replace('{{TOTAL_SUBSCRIBERS}}', subscribers.length)
      .replace('{{ARTICLES}}', articlesHTML)
      .replace('{{WEBSITE_URL}}', process.env.WEBSITE_URL || 'https://ai-daily.vercel.app')
      .replace('{{GITHUB_URL}}', 'https://github.com/hnshi/ai_daily')
      .replace('{{UNSUBSCRIBE_URL}}', process.env.WEBSITE_URL + '/unsubscribe');

    // 发送邮件
    let successCount = 0;
    let failureCount = 0;
    const results = [];

    for (const email of subscribers) {
      const result = await sendEmail(email, emailContent);
      if (result.success) {
        successCount++;
        console.log(`✓ 邮件发送成功: ${email}`);
      } else {
        failureCount++;
        console.log(`✗ 邮件发送失败: ${email}`);
      }
      results.push({ email, ...result });
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    return res.status(200).json({
      message: '邮件发送完成',
      timestamp: new Date().toISOString(),
      statistics: {
        total: subscribers.length,
        success: successCount,
        failure: failureCount,
        articles: articles.length,
        duration: `${duration}s`
      },
      results: results
    });

  } catch (error) {
    console.error('邮件发送出错:', error);
    return res.status(500).json({
      error: '邮件发送失败',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
