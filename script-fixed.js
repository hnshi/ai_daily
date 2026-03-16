/* ====================================
   script.js · AI日氪 交互逻辑（修复版）
   ==================================== */

// ===== Supabase 配置 =====
const SUPABASE_URL = 'https://pkveggrcoftgxvxtkbnj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrdmVnZ3Jjb2Z0Z3h2eHRrYm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDI0NTksImV4cCI6MjA4OTIxODQ1OX0.mo8px2ta-qIBIPFG6x2YLV0LNnqJUxLppHhjRidCLKs';

// 初始化 Supabase 客户端
let supabase;
function initSupabase() {
  if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase 客户端已初始化');
    return true;
  } else {
    console.error('❌ Supabase SDK 未加载，请检查 script 标签');
    return false;
  }
}

// 尝试立即初始化，如果失败则等待 DOMContentLoaded
if (!initSupabase()) {
  document.addEventListener('DOMContentLoaded', initSupabase);
}

// ===== 全局数据 =====
let newsData = [];

// ===== 从数据库加载资讯 =====
async function loadNewsFromDB() {
  try {
    console.log('🔄 开始从数据库加载资讯...');

    if (!supabase) {
      console.warn('⚠️ Supabase 未初始化，使用降级数据');
      loadFallbackData();
      return;
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;

    // 转换数据格式
    newsData = data.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      category: item.category,
      categoryName: getCategoryName(item.category),
      source: item.source,
      time: formatTimeAgo(item.published_at),
      url: item.url || `#article-${item.id}`
    }));

    console.log(`✅ 已加载 ${newsData.length} 条资讯`);
    renderNewsCards();
  } catch (error) {
    console.error('❌ 加载资讯失败:', error);
    showToast('加载资讯失败，请刷新页面重试', 'error');
    loadFallbackData();
  }
}

// 获取分类中文名
function getCategoryName(category) {
  const map = {
    model: '大模型',
    tool: 'AI工具',
    solo: 'AI一人项目',
    funding: '融资动态',
    research: '学术前沿'
  };
  return map[category] || category;
}

// 格式化时间
function formatTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return '刚刚';
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN');
}

// 降级数据（数据库加载失败时使用）
function loadFallbackData() {
  console.log('📦 加载降级数据...');
  newsData = [
    {
      id: 1,
      title: 'GPT-5正式发布：多模态能力全面升级，推理速度提升300%',
      summary: 'OpenAI今日凌晨宣布GPT-5正式上线，新版本在数学推理、代码生成、图像理解等方面均取得突破性进展。',
      category: 'model',
      categoryName: '大模型',
      source: 'OpenAI官博',
      time: '2小时前',
      url: '#article-1'
    },
    {
      id: 2,
      title: 'Midjourney V7发布：生成图像达到"以假乱真"新高度',
      summary: 'Midjourney最新版本V7正式上线，在人物细节、光影效果和场景一致性上均有显著提升。',
      category: 'tool',
      categoryName: 'AI工具',
      source: 'The Verge',
      time: '4小时前',
      url: '#article-2'
    },
    {
      id: 3,
      title: '国内AI独角兽完成50亿融资，估值突破300亿人民币',
      summary: '国内某知名AI大模型创业公司今日宣布完成新一轮融资，由红杉资本领投。',
      category: 'funding',
      categoryName: '融资动态',
      source: '36氪',
      time: '6小时前',
      url: '#article-3'
    },
    {
      id: 4,
      title: '斯坦福研究：AI辅助诊断准确率首次超越人类医生',
      summary: '斯坦福医学院最新研究显示，针对早期肺癌筛查，AI系统的诊断准确率达到97.3%。',
      category: 'research',
      categoryName: '学术前沿',
      source: 'Nature Medicine',
      time: '8小时前',
      url: '#article-4'
    },
    {
      id: 5,
      title: 'Google NotebookLM新增中文支持，AI读书笔记工具彻底出圈',
      summary: 'Google旗下AI笔记工具NotebookLM正式支持中文，用户可上传任意文档，让AI自动生成摘要。',
      category: 'tool',
      categoryName: 'AI工具',
      source: 'Google Blog',
      time: '10小时前',
      url: '#article-5'
    },
    {
      id: 6,
      title: 'AI开发者3人团队年入百万，打造自动化内容工具链',
      summary: '一位独立开发者用 AI 工具组合打造了一条自动化内容生产链，涵盖文案生成、AI绘画、视频剪辑。',
      category: 'solo',
      categoryName: 'AI一人项目',
      source: '独立开发者社区',
      time: '11小时前',
      url: '#article-6'
    }
  ];
  renderNewsCards();
}

// 渲染资讯卡片（使用数据库数据）
function renderNewsCards() {
  console.log('🎨 开始渲染资讯卡片...');
  const grid = document.getElementById('newsGrid');

  if (!grid) {
    console.error('❌ 找不到 newsGrid 元素');
    return;
  }

  // 清空现有内容
  grid.innerHTML = '';

  newsData.forEach((item, index) => {
    const isHot = index === 0;
    const hotBadge = isHot ? '<span class="news-hot">🔥 今日最热</span>' : '';

    const card = document.createElement('article');
    card.className = `news-card ${isHot ? 'hot' : ''} reveal`;
    card.dataset.cat = item.category;
    card.dataset.id = item.id;
    card.onclick = () => openArticle(item.id);

    card.innerHTML = `
      <div class="news-meta">
        <span class="news-tag tag-${item.category}">${item.categoryName}</span>
        ${hotBadge}
        <span class="news-time">${item.time}</span>
      </div>
      <h3 class="news-title">${item.title}</h3>
      <p class="news-summary">${item.summary}</p>
      <div class="news-footer">
        <span class="news-source">📰 ${item.source}</span>
        <span class="news-readmore">阅读全文 →</span>
      </div>
    `;

    grid.appendChild(card);
  });

  console.log(`✅ 渲染了 ${newsData.length} 张卡片`);

  // 添加 reveal 动画
  const targets = grid.querySelectorAll('.news-card');
  targets.forEach(el => {
    revealObserver.observe(el);
  });
}

// ===== NAV 滚动效果 =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ===== 汉堡菜单 =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  console.log('🍔 汉堡菜单已切换');
});

// 点击外部关闭
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-inner')) {
    navLinks.classList.remove('open');
  }
});

// ===== 搜索面板 =====
const searchBtn = document.getElementById('searchBtn');
const searchPanel = document.getElementById('searchPanel');
const searchBackdrop = document.getElementById('searchBackdrop');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// 打开搜索面板
function openSearch() {
  console.log('🔍 打开搜索面板');
  searchPanel.classList.add('open');
  searchInput.focus();
  document.body.style.overflow = 'hidden';
}

// 关闭搜索面板
function closeSearch() {
  console.log('❌ 关闭搜索面板');
  searchPanel.classList.remove('open');
  searchInput.value = '';
  renderSearchResults('');
  document.body.style.overflow = '';
}

// 点击打开/关闭
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    console.log('👆 点击了搜索按钮');
    openSearch();
  });
}
if (searchBackdrop) {
  searchBackdrop.addEventListener('click', closeSearch);
}

// 快捷键
document.addEventListener('keydown', (e) => {
  // Ctrl+K 打开搜索
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    console.log('⌨️ Ctrl+K 快捷键被触发');
    if (searchPanel.classList.contains('open')) {
      closeSearch();
    } else {
      openSearch();
    }
  }

  // Esc 关闭搜索
  if (e.key === 'Escape' && searchPanel.classList.contains('open')) {
    closeSearch();
  }
});

// 搜索输入监听
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    renderSearchResults(query);
  });
}

// 渲染搜索结果
function renderSearchResults(query) {
  if (!query) {
    searchResults.innerHTML = `
      <div class="search-empty">
        <p>输入关键词开始搜索</p>
      </div>
    `;
    return;
  }

  const filtered = newsData.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.summary.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    searchResults.innerHTML = `
      <div class="search-empty">
        <p>没有找到相关资讯</p>
      </div>
    `;
    return;
  }

  console.log(`🔎 搜索到 ${filtered.length} 条结果`);

  searchResults.innerHTML = filtered.map(item => `
    <div class="search-result-item" onclick="openArticle(${item.id}); closeSearch();">
      <span class="result-tag ${getTagClass(item.category)}">${item.categoryName}</span>
      <div class="result-content">
        <div class="result-title">${highlightMatch(item.title, query)}</div>
        <div class="result-summary">${item.summary}</div>
      </div>
    </div>
  `).join('');
}

// 高亮匹配文字
function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// 获取标签样式类
function getTagClass(category) {
  const map = {
    model: 'tag-model',
    tool: 'tag-tool',
    solo: 'tag-solo',
    funding: 'tag-funding',
    research: 'tag-research'
  };
  return map[category] || '';
}

// ===== 资讯详情跳转 =====
function openArticle(id) {
  console.log(`📖 打开资讯 #${id}`);
  const article = newsData.find(item => item.id === id);
  if (article) {
    // 先跳转到详情页占位符（稍后会创建真正的详情页）
    window.location.href = `article.html?id=${id}`;
  }
}

// ===== 订阅处理 =====
async function handleSubscribe(inputId) {
  console.log(`📧 处理订阅: ${inputId}`);
  const input = document.getElementById(inputId);
  const email = input.value.trim();

  if (!email) {
    shakeInput(input);
    showToast('请先输入你的邮箱地址 📧', 'warning');
    return;
  }

  if (!isValidEmail(email)) {
    shakeInput(input);
    showToast('邮箱格式不正确，请检查一下 🤔', 'warning');
    return;
  }

  try {
    // 插入订阅到数据库
    if (supabase) {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{ email: email }])
        .select();

      if (error) {
        // 如果邮箱已存在，算作订阅成功
        if (error.code === '23505') {
          console.log('邮箱已订阅过');
        } else {
          throw error;
        }
      }
    }

    // 模拟订阅成功
    input.value = '';
    showToast('🎉 订阅成功！欢迎加入 AI日氪大家庭！');

    // 更新订阅人数（小彩蛋）
    const counts = document.querySelectorAll('.hero-hint strong, .subscribe-cta p strong');
    counts.forEach(el => {
      if (el.textContent.includes('12,847')) {
        el.textContent = '12,848';
      }
    });
  } catch (error) {
    console.error('订阅失败:', error);
    showToast('订阅失败，请稍后重试', 'error');
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeInput(input) {
  input.style.animation = 'none';
  input.offsetHeight; // reflow
  input.style.animation = 'shake 0.4s ease';
  input.addEventListener('animationend', () => {
    input.style.animation = '';
  }, { once: true });
}

// ===== Toast 通知 =====
let toastTimer;
function showToast(msg, type = 'success') {
  console.log(`🔔 显示 Toast: ${msg}`);
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  toastMsg.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== 资讯分类筛选 =====
function filterNews(cat, btn) {
  console.log(`🏷️ 筛选分类: ${cat}`);
  // 更新按钮状态
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // 筛选卡片
  const cards = document.querySelectorAll('.news-card');
  cards.forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = '';
      card.style.animation = 'fadeInUp 0.4s ease both';
    } else {
      card.style.display = 'none';
    }
  });
}

// ===== 滚动显示动画 =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// 给各区块元素添加 reveal 类
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM 已加载');

  const targets = document.querySelectorAll(
    '.feature-card, .news-card, .pricing-card, .testimonial-card'
  );
  targets.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// 等待页面完全加载后再加载数据
window.addEventListener('load', () => {
  console.log('🚀 页面加载完成，开始加载数据');
  // 延迟一点确保 Supabase 已初始化
  setTimeout(() => {
    loadNewsFromDB();
  }, 500);
});

// ===== Enter键提交 =====
['heroEmail', 'ctaEmail'].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSubscribe(id);
      }
    });
  }
});

// ===== CSS 注入：shake 动画 =====
const extraStyle = document.createElement('style');
extraStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }

  .news-card {
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
  }
`;
document.head.appendChild(extraStyle);

console.log('✅ script.js 加载完成');
