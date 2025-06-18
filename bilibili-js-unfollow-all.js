const delay = ms => new Promise(res => setTimeout(res, ms));

async function unfollowCurrentPage() {
  const cards = document.querySelectorAll('.relation-card');
  console.log(`🎯 当前页面找到 ${cards.length} 个关注用户，开始取消关注...`);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const trigger = card.querySelector('.follow-btn__trigger');

    if (!trigger || !trigger.innerText.includes('已关注')) {
      console.warn(`⏩ 第 ${i + 1} 个用户无“已关注”按钮，跳过`);
      continue;
    }

    trigger.click();
    await delay(300);

    const allButtons = document.querySelectorAll('.vui-dropdown-item, .vui-dropdown-option, .vui-dropdown-menu li');
    const unfollow = Array.from(allButtons).find(el => el.innerText.includes('取消关注'));

    if (unfollow) {
      unfollow.click();
      console.log(`✅ 已取消第 ${i + 1} 个`);
    } else {
      console.warn(`⚠️ 第 ${i + 1} 个未找到“取消关注”选项`);
    }

    await delay(1000); // 控制取消速度，防止触发风控
  }
}

async function autoUnfollowAllPages(maxPages = 50) {
  let page = 1;

  while (page <= maxPages) {
    console.log(`📄 正在处理第 ${page} 页...`);
    await unfollowCurrentPage();

    // 获取下一页按钮
    const nextBtn = Array.from(document.querySelectorAll('button.vui_button'))
      .find(btn => btn.innerText.includes('下一页') && !btn.disabled);

    if (nextBtn) {
      nextBtn.click();
      console.log('➡️ 正在翻到下一页...');
      page++;
      await delay(3000); // 等待页面加载
    } else {
      console.log('🏁 没有找到“下一页”按钮，或已到最后一页，任务完成！');
      break;
    }
  }
}

autoUnfollowAllPages(); // 可设置最大页数如 autoUnfollowAllPages(10)
