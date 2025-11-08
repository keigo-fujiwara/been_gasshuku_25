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
 * 日付をタップして詳細の表示/非表示を切り替え
 * SP版では時間と内容を交互に表示
 */
function initScheduleToggle() {
  const scheduleRows = document.querySelectorAll('[data-schedule-row]');
  
  if (scheduleRows.length === 0) {
    // スケジュール行が存在しない場合は処理をスキップ
    return;
  }
  
  scheduleRows.forEach(row => {
    const dayLabel = row.querySelector('.day-label');
    
    if (!dayLabel) {
      return;
    }
    
    // SP版用に時間と内容を交互に配置
    restructureScheduleForMobile(row);
    
    // 日付ラベルをクリックした時の処理
    dayLabel.addEventListener('click', function() {
      // SP版（768px以下）の場合のみトグル機能を有効化
      if (window.innerWidth <= 768) {
        row.classList.toggle('active');
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、全ての行を開いた状態にする
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      scheduleRows.forEach(row => {
        row.classList.remove('active');
      });
    }
  });
}

/**
 * スケジュールをSP版用に再構築
 * 時間と内容を交互に表示する形式に変更
 */
function restructureScheduleForMobile(row) {
  const timeCell = row.querySelector('.schedule-detail:nth-child(2)');
  const activityCell = row.querySelector('.schedule-detail:nth-child(3)');
  
  if (!timeCell || !activityCell) {
    return;
  }
  
  const timeSlots = Array.from(timeCell.querySelectorAll('.time-slot'));
  const activities = Array.from(activityCell.querySelectorAll('.activity'));
  
  // SP版用のコンテナを作成
  const mobileContainer = document.createElement('div');
  mobileContainer.className = 'schedule-mobile-container';
  
  // 時間と内容を交互に追加
  timeSlots.forEach((timeSlot, index) => {
    if (activities[index]) {
      const pair = document.createElement('div');
      pair.className = 'schedule-pair';
      
      pair.appendChild(timeSlot.cloneNode(true));
      pair.appendChild(activities[index].cloneNode(true));
      
      mobileContainer.appendChild(pair);
    }
  });
  
  // 元のセルにモバイルコンテナを追加
  timeCell.appendChild(mobileContainer);
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

