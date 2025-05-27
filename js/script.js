/**
 * Inf-Bench 网站交互脚本
 * 包含导航控制、内容互动、图片查看和引用复制功能
 */

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 初始化导航监听
  initNavigation();
  // 初始化内容交互
  initContentInteractions();
  // 初始化图片查看器
  initImageViewer();
  // 初始化引用复制功能
  initCitationCopy();
  // 初始化回到顶部按钮
  initBackToTop();
  
  // 检查语法
  syntaxSelfCheck();
});

/**
 * 初始化导航功能
 * 包括平滑滚动、导航高亮和移动菜单
 */
function initNavigation() {
  // 获取导航元素
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  
  // 处理导航链接点击
  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      
      // 如果是移动菜单，点击后关闭菜单
      if (nav.classList.contains('menu-open')) {
        nav.classList.remove('menu-open');
      }
      
      // 获取目标元素ID
      const targetId = link.getAttribute('href').substring(1);
      // 平滑滚动到目标位置
      scrollToSection(targetId);
    });
  });
  
  // 处理移动菜单切换
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('menu-open');
    });
  }
  
  // 滚动监听，更新活动导航项
  window.addEventListener('scroll', () => {
    throttle(updateActiveNav, 100)();
    
    // 如果有导航栏，处理滚动样式
    if (nav) {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });
  
  // 初始加载时更新活动导航
  updateActiveNav();
}

/**
 * 平滑滚动到指定部分
 * @param {string} targetId 目标元素ID
 */
function scrollToSection(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    // 获取导航栏高度作为偏移
    const navHeight = document.getElementById('main-nav')?.offsetHeight || 0;
    
    // 计算目标位置，考虑导航栏高度
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
    
    // 平滑滚动到位置
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * 更新当前活动导航项
 */
function updateActiveNav() {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // 获取导航栏高度作为偏移
  const navHeight = document.getElementById('main-nav')?.offsetHeight || 0;
  // 额外偏移量，让当前部分更容易被识别
  const offset = 150;
  
  // 当前滚动位置
  const scrollPosition = window.scrollY + navHeight + offset;
  
  // 检查每个部分的位置
  let currentSectionId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSectionId = section.id;
    }
  });
  
  // 更新活动导航项
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSectionId}`) {
      link.classList.add('active');
    }
  });
}

/**
 * 初始化内容交互功能
 * 包括可折叠内容块和答案显示
 */
function initContentInteractions() {
  // 可折叠内容块
  const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
  collapsibleHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const block = header.closest('.collapsible-block');
      block.classList.toggle('active');
    });
  });
  
  // 答案显示按钮
  const answerButtons = document.querySelectorAll('.show-answer-btn');
  answerButtons.forEach(button => {
    button.addEventListener('click', () => {
      const answerBlock = button.nextElementSibling;
      
      // 如果答案块为隐藏状态，显示它
      if (answerBlock.style.display === 'none' || getComputedStyle(answerBlock).display === 'none') {
        answerBlock.style.display = 'block';
        button.textContent = 'Hide Answer';
      } else {
        answerBlock.style.display = 'none';
        button.textContent = 'Show Answer';
      }
    });
  });
}

/**
 * 初始化图片查看器
 */
function initImageViewer() {
  // 获取图片查看器元素
  const imageViewer = document.getElementById('image-viewer');
  const fullImage = document.getElementById('full-image');
  const imageCaption = document.getElementById('image-caption');
  const closeButton = document.querySelector('.close-viewer');
  
  // 处理所有内容图片的点击
  const contentImages = document.querySelectorAll('.example-image, .world-image, .content-image');
  contentImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      openImageViewer(img.src, img.alt);
    });
  });
  
  // 处理选项图片的点击
  const optionImages = document.querySelectorAll('.option-image');
  optionImages.forEach(img => {
    img.addEventListener('click', () => {
      openImageViewer(img.src, img.alt);
    });
  });
  
  // 关闭图片查看器
  if (closeButton) {
    closeButton.addEventListener('click', closeImageViewer);
  }
  
  // 点击图片查看器的背景也可以关闭
  if (imageViewer) {
    imageViewer.addEventListener('click', (event) => {
      if (event.target === imageViewer) {
        closeImageViewer();
      }
    });
  }
  
  /**
   * 打开图片查看器
   * @param {string} imgSrc 图片路径
   * @param {string} caption 图片标题
   */
  function openImageViewer(imgSrc, caption) {
    if (!imageViewer || !fullImage) return;
    
    // 设置图片和标题
    fullImage.src = imgSrc;
    if (imageCaption && caption) {
      imageCaption.textContent = caption;
    }
    
    // 显示图片查看器
    imageViewer.style.display = 'block';
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * 关闭图片查看器
   */
  function closeImageViewer() {
    if (!imageViewer) return;
    
    // 隐藏图片查看器
    imageViewer.style.display = 'none';
    
    // 恢复背景滚动
    document.body.style.overflow = '';
  }
}

/**
 * 初始化引用复制功能
 */
function initCitationCopy() {
  const copyButton = document.getElementById('copy-citation');
  const citationText = document.getElementById('citation-text');
  const copyFeedback = document.getElementById('copy-feedback');
  
  if (copyButton && citationText && copyFeedback) {
    copyButton.addEventListener('click', async () => {
      const text = citationText.textContent;
      
      try {
        await copyToClipboard(text);
        
        // 显示复制成功反馈
        copyFeedback.classList.add('visible');
        
        // 2秒后隐藏反馈
        setTimeout(() => {
          copyFeedback.classList.remove('visible');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy citation:', err);
      }
    });
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} text 要复制的文本
 * @returns {Promise<boolean>} 复制是否成功
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      // 使用现代Clipboard API
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 备用方法: 创建临时文本区域
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // 执行复制命令
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}

/**
 * 初始化回到顶部按钮
 */
function initBackToTop() {
  const backToTopButton = document.getElementById('back-to-top');
  
  if (backToTopButton) {
    // 监听滚动事件，显示/隐藏按钮
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
    
    // 点击按钮回到顶部
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/**
 * 节流函数 - 限制函数执行频率
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间(ms)
 * @returns {Function} 节流后的函数
 */
function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

/**
 * 去抖动函数 - 延迟函数执行
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间(ms)
 * @returns {Function} 去抖动后的函数
 */
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  }
}

/**
 * 语法自检功能
 */
function syntaxSelfCheck() {
  try {
    console.log("JavaScript syntax check passed");
    
    // 基本功能检查
    console.assert(
      typeof scrollToSection === 'function', 
      "scrollToSection function is defined"
    );
    console.assert(
      typeof initNavigation === 'function', 
      "initNavigation function is defined"
    );
    
    // 导航功能检查
    const nav = document.getElementById('main-nav');
    console.assert(
      nav !== null, 
      "Navigation element exists"
    );
    
    // 内容交互检查
    const exampleCard = document.querySelector('.example-card');
    console.assert(
      exampleCard !== null, 
      "Example card element exists"
    );
    
    // 图片查看器检查
    const imageViewer = document.getElementById('image-viewer');
    console.assert(
      imageViewer !== null, 
      "Image viewer element exists"
    );
    
  } catch (error) {
    console.error("Syntax error:", error.message);
  }
}