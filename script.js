// ============================================
// BeEngineer Programming Camp - Main Script
// ============================================

/**
 * DOMContentLoaded イベント
 * ページ読み込み完了後に実行
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // 持ち物チェックリスト機能を初期化
  initChecklistFeature();
  
  // スムーススクロール機能を初期化
  initSmoothScroll();
  
  // ハンバーガーメニュー機能を初期化
  initHamburgerMenu();
  
  // プログラムカードのトグル機能を初期化（SP版のみ）
  initProgramCardToggle();
  
  // 学習プログラムのタブ機能を初期化（SP版のみ）
  initProgramTabs();
  
  // スケジュールのトグル機能を初期化（SP版のみ）
  initScheduleToggle();
  
  // アクセス方法のトグル機能を初期化（SP版のみ）
  initAccessToggle();
  
  // 持ち物リストのトグル機能を初期化（SP版のみ）
  initItemsToggle();
  
  // ブログメニューのサブメニュートグル機能を初期化（SP版のみ）
  initBlogSubmenuToggle();
  
  // フロアマップのトグル機能を初期化（SP版のみ）
  initFloormapToggle();
  
  // フロアマップのタブ機能を初期化（PC版）
  initFloormapTabs();
  
  // スクロールスパイ機能を初期化
  initScrollSpy();
  
  // スケジュールタブの切り替え機能を初期化
  initScheduleTabs();
  
  // アクセスタブの切り替え機能を初期化
  initAccessTabs();
  
  // ご案内セクションのトグル機能を初期化（SP版のみ）
  initGuideToggle();
  
  // LINEアカウントセクションのトグル機能を初期化（SP版のみ）
  initLineToggle();
  
  // フッターのキャラクター画像をSP版でロゴの隣に配置
  initFooterCharacters();
  
});

/**
 * 持ち物チェックリスト機能
 * localStorageでチェック状態を保存・復元
 */
function initChecklistFeature() {
  const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  
  if (checklistItems.length === 0) {
    // チェックリストが存在しない場合は処理をスキップ
    return;
  }
  
  // ページ読み込み時に保存された状態を復元
  checklistItems.forEach(item => {
    const itemKey = item.getAttribute('data-item');
    const savedState = localStorage.getItem(itemKey);
    
    if (savedState === 'true') {
      item.checked = true;
      item.parentElement.classList.add('checked');
    }
  });
  
  // チェック状態の変更を監視
  checklistItems.forEach(item => {
    item.addEventListener('change', function() {
      const itemKey = this.getAttribute('data-item');
      localStorage.setItem(itemKey, this.checked);
      
      if (this.checked) {
        this.parentElement.classList.add('checked');
      } else {
        this.parentElement.classList.remove('checked');
      }
    });
  });
}

/**
 * スムーススクロール機能
 * ページ内リンクをクリックした際に滑らかにスクロール
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // '#' のみ、または空の場合はスキップ
      if (href === '#' || href === '') {
        return;
      }
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // URLを更新（履歴に追加）
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });
}

/**
 * ハンバーガーメニュー機能（SP用）
 * サイドバーの開閉を制御
 */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  
  if (!hamburger || !sidebar || !overlay) {
    // 要素が存在しない場合は処理をスキップ
    return;
  }
  
  // ハンバーガーボタンクリック
  hamburger.addEventListener('click', function() {
    toggleMenu();
  });
  
  // オーバーレイクリック
  overlay.addEventListener('click', function() {
    closeMenu();
  });
  
  // サイドバーのリンククリック時にメニューを閉じる
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      // SP表示の場合のみメニューを閉じる
      if (window.innerWidth <= 768) {
        // ブログメニュー（サブメニューを持つ親リンク）の場合は閉じない
        if (this.parentElement.classList.contains('has-submenu')) {
          return;
        }
        closeMenu();
      }
    });
  });
  
  // メニュー開閉の切り替え
  function toggleMenu() {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // body のスクロールを制御
    if (sidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // メニューを閉じる
  function closeMenu() {
    hamburger.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * プログラムカードのトグル機能（SP版のみ）
 * カードヘッダーをタップして内容の表示/非表示を切り替え
 */
function initProgramCardToggle() {
  const programCards = document.querySelectorAll('[data-program-card]');
  
  if (programCards.length === 0) {
    // プログラムカードが存在しない場合は処理をスキップ
    return;
  }
  
  programCards.forEach(card => {
    const cardHeader = card.querySelector('.card-header');
    
    if (!cardHeader) {
      return;
    }
    
    // カードヘッダーをクリックした時の処理
    cardHeader.addEventListener('click', function() {
      // SP版（768px以下）の場合のみトグル機能を有効化
      if (window.innerWidth <= 768) {
        card.classList.toggle('active');
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、全てのカードを開いた状態にする
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      programCards.forEach(card => {
        card.classList.remove('active');
      });
    }
  });
}

/**
 * スケジュールのトグル機能（SP版のみ）
 * SP版でもPC版と同じデザインを保持
 */
function initScheduleToggle() {
  // SP版では特別な処理は不要（CSSで制御）
  return;
}

/**
 * アクセス方法のトグル機能（SP版のみ）
 * 各項目をタップして詳細の表示/非表示を切り替え
 */
function initAccessToggle() {
  const accessItems = document.querySelectorAll('[data-access-item]');
  
  if (accessItems.length === 0) {
    // アクセス項目が存在しない場合は処理をスキップ
    return;
  }
  
  accessItems.forEach(item => {
    const header = item.querySelector('.access-item-header');
    
    if (!header) {
      return;
    }
    
    // ヘッダーをクリックした時の処理
    header.addEventListener('click', function() {
      // SP版（768px以下）の場合のみトグル機能を有効化
      if (window.innerWidth <= 768) {
        item.classList.toggle('active');
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、全ての項目を閉じる
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      accessItems.forEach(item => {
        item.classList.remove('active');
      });
    }
  });
}

/**
 * 持ち物リストのトグル機能（SP版のみ）
 * ヘッダーをタップして詳細の表示/非表示を切り替え
 */
function initItemsToggle() {
  const itemsMobile = document.querySelector('[data-items-mobile]');
  
  if (!itemsMobile) {
    // 持ち物リストのモバイル版が存在しない場合は処理をスキップ
    return;
  }
  
  const header = itemsMobile.querySelector('.items-mobile-header');
  
  if (!header) {
    return;
  }
  
  // ヘッダーをクリックした時の処理
  header.addEventListener('click', function() {
    // SP版（768px以下）の場合のみトグル機能を有効化
    if (window.innerWidth <= 768) {
      itemsMobile.classList.toggle('active');
    }
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、閉じる
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      itemsMobile.classList.remove('active');
    }
  });
}

/**
 * ブログメニューのサブメニュートグル機能（SP版のみ）
 * ブログメニューをタップしてサブメニューの表示/非表示を切り替え
 */
function initBlogSubmenuToggle() {
  const blogMenuItem = document.querySelector('.sidebar-nav .has-submenu');
  
  if (!blogMenuItem) {
    // ブログメニューが存在しない場合は処理をスキップ
    return;
  }
  
  const blogLink = blogMenuItem.querySelector('a');
  
  if (!blogLink) {
    return;
  }
  
  // ブログメニューリンクをクリックした時の処理
  blogLink.addEventListener('click', function(e) {
    // SP版（768px以下）の場合のみトグル機能を有効化
    if (window.innerWidth <= 768) {
      e.preventDefault();
      blogMenuItem.classList.toggle('active');
      
      // サブメニューが開いた場合、スクロールして画面内に表示
      if (blogMenuItem.classList.contains('active')) {
        // アニメーション完了後にスクロール
        setTimeout(() => {
          const submenu = blogMenuItem.querySelector('.submenu');
          
          if (submenu) {
            // サブメニューの最後の項目（3日目）を取得
            const lastItem = submenu.querySelector('li:last-child');
            
            if (lastItem) {
              // 最後の項目を画面内に表示
              lastItem.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
              });
            }
          }
        }, 150);
      }
    }
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、閉じる
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      blogMenuItem.classList.remove('active');
    }
  });
}

/**
 * フロアマップのトグル機能
 * SP版でフロアマップをアコーディオン形式で開閉
 */
function initFloormapToggle() {
  const floormapItems = document.querySelectorAll('[data-floormap-item]');
  
  if (floormapItems.length === 0) {
    return;
  }
  
  floormapItems.forEach(item => {
    const header = item.querySelector('[data-floormap-header]');
    
    if (!header) return;
    
    header.addEventListener('click', function() {
      // SP版でのみ動作（768px以下）
      if (window.innerWidth <= 768) {
        // クリックされたアイテムの開閉を切り替え
        item.classList.toggle('active');
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、全て開く
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      floormapItems.forEach(item => {
        item.classList.remove('active');
      });
    }
  });
}

/**
 * フロアマップのタブ機能（PC版）
 * タブをクリックして各階を切り替え（アクセスと同じ形式）
 */
function initFloormapTabs() {
  const tabButtons = document.querySelectorAll('.floormap-tab-btn');
  const floormapItems = document.querySelectorAll('[data-floor-content]');
  
  if (tabButtons.length === 0 || floormapItems.length === 0) {
    return;
  }
  
  // 初期状態でPC版の場合、1Fを表示
  if (window.innerWidth > 768) {
    const firstTab = document.querySelector('.floormap-tab-btn[data-floor="floor-1f"]');
    const firstContent = document.querySelector('[data-floor-content="floor-1f"]');
    if (firstTab && firstContent) {
      firstTab.classList.add('active');
      firstContent.classList.add('active');
    }
  }
  
  // タブボタンをクリックした時の処理
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // PC版（768px超）の場合のみタブ機能を有効化
      if (window.innerWidth > 768) {
        const floorId = this.getAttribute('data-floor');
        const targetContent = document.querySelector(`[data-floor-content="${floorId}"]`);
        
        // すべてのタブとコンテンツから active クラスを削除
        tabButtons.forEach(btn => btn.classList.remove('active'));
        floormapItems.forEach(item => item.classList.remove('active'));
        
        // クリックされたタブと対応するコンテンツに active クラスを追加
        this.classList.add('active');
        if (targetContent) {
          targetContent.classList.add('active');
        }
      }
    });
  });
  
  // ウィンドウリサイズ時の処理
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      // SP版に戻った場合は、タブのactiveクラスをリセット
      tabButtons.forEach(btn => btn.classList.remove('active'));
      floormapItems.forEach(item => item.classList.remove('active'));
    } else {
      // PC版に戻った場合は、1Fをデフォルト表示
      const hasActive = Array.from(floormapItems).some(item => item.classList.contains('active'));
      if (!hasActive) {
        const firstTab = document.querySelector('.floormap-tab-btn[data-floor="floor-1f"]');
        const firstContent = document.querySelector('[data-floor-content="floor-1f"]');
        if (firstTab && firstContent) {
          firstTab.classList.add('active');
          firstContent.classList.add('active');
        }
      }
    }
  });
}

/**
 * スクロールスパイ機能
 * ページをスクロールした際に、現在表示されているセクションに対応するメニューをハイライト
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) {
    return;
  }
  
  // 各セクションのIDとメニューリンクのマップを作成
  const linkMap = new Map();
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      linkMap.set(href.substring(1), link);
    }
  });
  
  // Intersection Observer のオプション
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // 上部20%、下部70%の範囲でトリガー
    threshold: 0
  };
  
  // 現在アクティブなセクションを追跡
  let currentActiveSection = null;
  
  // Intersection Observer のコールバック
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      const sectionId = entry.target.id;
      const link = linkMap.get(sectionId);
      
      if (!link) return;
      
      if (entry.isIntersecting) {
        // セクションが表示されている場合
        // 既存のアクティブ状態をクリア
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        
        // 現在のセクションのリンクをアクティブに
        link.classList.add('active');
        currentActiveSection = sectionId;
      }
    });
  };
  
  // Intersection Observer を作成
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  // 各セクションを監視
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // メニューをクリックした時にもアクティブ状態を更新
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        // 全てのアクティブ状態をクリア
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        // クリックされたリンクをアクティブに
        this.classList.add('active');
      }
    });
  });
  
  // ページ読み込み時に初期状態を設定
  setTimeout(() => {
    const scrollPosition = window.scrollY;
    let foundActive = false;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
        const link = linkMap.get(section.id);
        if (link) {
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          link.classList.add('active');
          foundActive = true;
        }
      }
    });
    
    // どのセクションにも該当しない場合は、最初のリンク（トップ）をアクティブに
    if (!foundActive && navLinks.length > 0) {
      navLinks[0].classList.add('active');
    }
  }, 100);
}

/**
 * スケジュールタブの切り替え機能
 */
function initScheduleTabs() {
  const tabButtons = document.querySelectorAll('.schedule-tabs .tab-btn');
  const tabContents = document.querySelectorAll('.schedule-row.tab-content');
  
  if (tabButtons.length === 0 || tabContents.length === 0) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      const targetContent = document.getElementById(targetTab);
      
      // 同じタブを押した場合は閉じる（トグル機能）
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        updateScheduleTabEmoji(this, false);
        if (targetContent) {
          targetContent.classList.remove('active');
        }
      } else {
        // すべてのタブボタンの絵文字を📅に戻す
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          updateScheduleTabEmoji(btn, false);
        });
        tabContents.forEach(content => content.classList.remove('active'));
        
        // クリックされたタブボタンとそのコンテンツにactiveクラスを追加
        this.classList.add('active');
        updateScheduleTabEmoji(this, true);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      }
    });
  });
}

/**
 * スケジュールタブボタンの絵文字を更新
 * @param {HTMLElement} button - タブボタン要素
 * @param {boolean} isActive - アクティブ状態かどうか
 */
function updateScheduleTabEmoji(button, isActive) {
  const emojiSpan = button.querySelector('.tab-emoji');
  if (emojiSpan) {
    emojiSpan.textContent = isActive ? '🍁' : '📅';
  }
}

/**
 * アクセスタブの切り替え機能
 * お車/電車・バス/京都駅からのアクセス情報をタブで切り替え
 */
function initAccessTabs() {
  const tabButtons = document.querySelectorAll('.access-tab-btn');
  const tabContents = document.querySelectorAll('.access-tab-content');
  
  if (tabButtons.length === 0 || tabContents.length === 0) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-access-tab');
      
      // すべてのタブボタンとコンテンツからactiveクラスを削除
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // クリックされたタブボタンとそのコンテンツにactiveクラスを追加
      this.classList.add('active');
      const targetContent = document.getElementById('access-' + targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/**
 * ご案内セクションのトグル機能（SP版のみ）
 * ヘッダーをタップして詳細の表示/非表示を切り替え
 */
function initGuideToggle() {
  const guideWrapper = document.querySelector('[data-guide-toggle]');
  
  if (!guideWrapper) {
    // ご案内セクションが存在しない場合は処理をスキップ
    return;
  }
  
  const header = guideWrapper.querySelector('.guide-toggle-header');
  
  if (!header) {
    return;
  }
  
  // ヘッダーをクリックした時の処理
  header.addEventListener('click', function() {
    // SP版（768px以下）の場合のみトグル機能を有効化
    if (window.innerWidth <= 768) {
      guideWrapper.classList.toggle('active');
    }
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、開いた状態にする
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      guideWrapper.classList.remove('active');
    }
  });
}

/**
 * LINEアカウントセクションのトグル機能（SP版のみ）
 * ヘッダーをタップして詳細の表示/非表示を切り替え
 */
function initLineToggle() {
  const lineBox = document.querySelector('[data-line-toggle]');
  
  if (!lineBox) {
    // LINEアカウントセクションが存在しない場合は処理をスキップ
    return;
  }
  
  const header = lineBox.querySelector('.line-toggle-header');
  
  if (!header) {
    return;
  }
  
  // ヘッダーをクリックした時の処理
  header.addEventListener('click', function() {
    // SP版（768px以下）の場合のみトグル機能を有効化
    if (window.innerWidth <= 768) {
      lineBox.classList.toggle('active');
    }
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、開いた状態にする
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      lineBox.classList.remove('active');
    }
  });
}

/**
 * 学習プログラムのタブ機能（SP版のみ）
 * タブをクリックして各CHAPTERの表示/非表示を切り替え
 */
function initProgramTabs() {
  const tabButtons = document.querySelectorAll('.program-tab-btn');
  const tabContents = document.querySelectorAll('.program-card[data-tab-content]');
  
  if (tabButtons.length === 0 || tabContents.length === 0) {
    return;
  }
  
  // タブボタンをクリックした時の処理
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // SP版（768px以下）の場合のみタブ機能を有効化
      if (window.innerWidth <= 768) {
        const tabNumber = this.getAttribute('data-tab');
        const targetContent = document.querySelector(`.program-card[data-tab-content="${tabNumber}"]`);
        
        // 同じタブを押した場合は非表示に（トグル機能）
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          if (targetContent) {
            targetContent.classList.remove('active');
          }
        } else {
          // すべてのタブとコンテンツから active クラスを削除
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          
          // クリックされたタブと対応するコンテンツに active クラスを追加
          this.classList.add('active');
          if (targetContent) {
            targetContent.classList.add('active');
          }
        }
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、すべてのカードを表示
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
    }
  });
}

/**
 * フッターのキャラクター画像をSP版でロゴの隣に配置
 */
function initFooterCharacters() {
  const logoWrapper = document.querySelector('.footer-logo-wrapper');
  const footerContent = document.querySelector('.footer-content');
  const charLeft = document.querySelector('.footer-character-left');
  const charRight = document.querySelector('.footer-character-right');
  
  if (!logoWrapper || !footerContent || !charLeft || !charRight) {
    return;
  }
  
  // 元の位置を記憶
  const originalParent = footerContent;
  
  function arrangeCharacters() {
    if (window.innerWidth <= 768) {
      // SP版：キャラクター画像をロゴの隣に移動
      if (charLeft.parentElement !== logoWrapper) {
        logoWrapper.insertBefore(charLeft, logoWrapper.firstChild);
      }
      if (charRight.parentElement !== logoWrapper) {
        logoWrapper.appendChild(charRight);
      }
    } else {
      // PC版：キャラクター画像を元の位置に戻す
      if (charLeft.parentElement !== originalParent) {
        originalParent.insertBefore(charLeft, originalParent.firstChild);
      }
      if (charRight.parentElement !== originalParent) {
        originalParent.appendChild(charRight);
      }
    }
  }
  
  // 初期配置
  arrangeCharacters();
  
  // ウィンドウリサイズ時に再配置
  window.addEventListener('resize', arrangeCharacters);
}

/**
 * チェックリストをリセット（デバッグ用）
 * 必要に応じてコンソールから実行: resetChecklist()
 */
function resetChecklist() {
  const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  
  checklistItems.forEach(item => {
    const itemKey = item.getAttribute('data-item');
    localStorage.removeItem(itemKey);
    item.checked = false;
    item.parentElement.classList.remove('checked');
  });
  
  console.log('チェックリストがリセットされました');
}

