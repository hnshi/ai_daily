-- ========================================
-- 只插入示例数据（表已存在，跳过建表）
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
