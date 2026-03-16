-- ========================================
-- AI日氪数据库表结构设计
-- ========================================

-- 1. 资讯表 (articles)
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'tool',
  source VARCHAR(200),
  source_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_locked BOOLEAN DEFAULT FALSE,
  is_hot BOOLEAN DEFAULT FALSE
);

-- 创建索引，提升查询性能
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_is_locked ON articles(is_locked);

-- 启用 RLS（开发阶段允许所有访问，后续可调整）
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all" ON articles FOR SELECT USING (true);
CREATE POLICY "Enable insert for all" ON articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON articles FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON articles FOR DELETE USING (true);

-- 2. 订阅表 (subscriptions)
CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  status VARCHAR(50) DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_subscriptions_email ON subscriptions(email);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- 启用 RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON subscriptions FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON subscriptions FOR DELETE USING (true);

-- 3. 用户表 (users) - 后续扩展用
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT,
  name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for all" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON users FOR DELETE USING (true);

-- 4. 浏览记录表 (article_views) - 可选，用于统计
CREATE TABLE article_views (
  id BIGSERIAL PRIMARY KEY,
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(50)
);

CREATE INDEX idx_views_article_id ON article_views(article_id);
CREATE INDEX idx_views_viewed_at ON article_views(viewed_at DESC);

-- 启用 RLS
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read for all" ON article_views FOR SELECT USING (true);
CREATE POLICY "Enable insert for all" ON article_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON article_views FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON article_views FOR DELETE USING (true);

-- ========================================
-- 插入示例数据
-- ========================================

INSERT INTO articles (title, summary, content, category, source, source_url, is_hot) VALUES
(
  'GPT-5正式发布：多模态能力全面升级，推理速度提升300%',
  'OpenAI今日凌晨宣布GPT-5正式上线，新版本在数学推理、代码生成、图像理解等方面均取得突破性进展。据OpenAI CEO Sam Altman表示，GPT-5是迄今为止最接近AGI的模型。',
  '旧金山，2026年3月16日 — OpenAI 在今日凌晨召开的发布会上正式推出了备受期待的新一代大语言模型 GPT-5，这一版本在多个核心能力上实现了跨越式提升。',
  'model',
  'OpenAI官博',
  'https://openai.com/blog',
  true
),
(
  'Midjourney V7发布：生成图像达到"以假乱真"新高度',
  'Midjourney最新版本V7正式上线，在人物细节、光影效果和场景一致性上均有显著提升，专业摄影师表示已难以分辨AI作品与真实照片。',
  'Midjourney V7 最重要的改进包括：更真实的人物纹理、更精准的光影处理、更好的一致性控制。',
  'tool',
  'The Verge',
  'https://theverge.com/ai',
  false
),
(
  '国内AI独角兽完成50亿融资，估值突破300亿人民币',
  '国内某知名AI大模型创业公司今日宣布完成新一轮融资，由红杉资本领投，多家顶级机构跟投，此轮融资将主要用于模型训练算力扩充和海外市场拓展。',
  '本轮融资由红杉资本中国基金领投，高瓴创投、IDG资本等跟投。',
  'funding',
  '36氪',
  'https://36kr.com',
  false
),
(
  '斯坦福研究：AI辅助诊断准确率首次超越人类医生',
  '斯坦福医学院最新研究显示，针对早期肺癌筛查，AI系统的诊断准确率达到97.3%，超越了人类放射科医生的平均水平94.1%，引发医疗界广泛讨论。',
  '这项研究涉及超过10万例医学影像数据，AI模型经过深度训练后展现出卓越的诊断能力。',
  'research',
  'Nature Medicine',
  'https://nature.com/nm',
  false
),
(
  'Google NotebookLM新增中文支持，AI读书笔记工具彻底出圈',
  'Google旗下AI笔记工具NotebookLM正式支持中文，用户可上传任意文档，让AI自动生成摘要、问答和思维导图，国内用户测试反馈普遍良好。',
  'NotebookLM 的中文支持包括：中文文档解析、中文问答生成、中文思维导图输出。',
  'tool',
  'Google Blog',
  'https://blog.google',
  false
),
(
  'AI开发者3人团队年入百万，打造自动化内容工具链',
  '一位独立开发者用 AI 工具组合打造了一条自动化内容生产链，涵盖文案生成、AI绘画、视频剪辑和自动发布，3人团队月营收突破10万美元。',
  '工具链包括：GPT-4 生成文案、Midjourney 生成插图、Runway 生成视频、自动化发布脚本。',
  'solo',
  '独立开发者社区',
  'https://indiehackers.com',
  false
);

INSERT INTO subscriptions (email, plan, status) VALUES
('demo@example.com', 'pro', 'active');
