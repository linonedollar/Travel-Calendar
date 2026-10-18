import json
import re
import sys

def build_integration():
    with open('scratch/calendar_full_data.json', 'r', encoding='utf-8') as f:
        calendar_data = json.load(f)
        
    calendar_json_str = json.dumps(calendar_data, ensure_ascii=False)

    calendar_css = """
    /* ========================================================
       MAIN TOP VIEW TABS (CHECKLIST vs CALENDAR)
       ======================================================== */
    .main-tabs-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      padding: 8px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
      position: sticky;
      top: 12px;
      z-index: 100;
    }

    .main-tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 20px;
      border: 2px solid transparent;
      background: #f8fafc;
      border-radius: var(--radius-md);
      font-size: 1.05rem;
      font-weight: 800;
      color: #64748b;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .main-tab-btn:hover {
      background: #e0f2fe;
      color: #0369a1;
      border-color: #bae6fd;
    }

    .main-tab-btn.active {
      background: linear-gradient(135deg, #091e3a 0%, #0284c7 100%);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 6px 18px rgba(2, 132, 199, 0.35);
    }

    .tab-count-badge {
      font-size: 0.8rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 9999px;
      background: #e2e8f0;
      color: #475569;
      transition: all 0.2s;
    }

    .main-tab-btn.active .tab-count-badge {
      background: rgba(255, 255, 255, 0.22);
      color: #fff;
    }

    .tab-count-badge.gold {
      background: #fef3c7;
      color: #b45309;
    }

    .main-tab-btn.active .tab-count-badge.gold {
      background: #f59e0b;
      color: #fff;
    }

    /* Views */
    .view-panel {
      display: none;
      animation: fadeIn 0.3s ease;
    }
    .view-panel.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ========================================================
       CALENDAR VIEW STYLING
       ======================================================== */
    .cal-hero-banner {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0284c7 100%);
      color: #fff;
      border-radius: var(--radius-lg);
      padding: 32px 32px;
      box-shadow: var(--shadow-md);
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
    }

    .cal-hero-banner::after {
      content: "✈️🚢🎡🦁✨";
      position: absolute;
      right: 20px;
      bottom: -15px;
      font-size: 5rem;
      opacity: 0.12;
      pointer-events: none;
    }

    .cal-quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 20px;
    }

    .cal-stat-card {
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cal-stat-icon {
      font-size: 1.8rem;
    }

    .cal-stat-val {
      font-size: 1.1rem;
      font-weight: 800;
      color: #fff;
    }

    .cal-stat-label {
      font-size: 0.78rem;
      color: #cbd5e1;
    }

    /* Calendar Toolbar */
    .cal-toolbar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: var(--shadow-sm);
    }

    .cal-search-wrap {
      flex: 1;
      min-width: 260px;
      position: relative;
    }

    .cal-search-input {
      width: 100%;
      padding: 10px 14px 10px 38px;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 0.92rem;
      background: #f8fafc;
      color: var(--text);
      outline: none;
      transition: all 0.2s;
    }

    .cal-search-input:focus {
      background: #fff;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }

    .cal-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.95rem;
      pointer-events: none;
      opacity: 0.6;
    }

    .cal-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    /* Day Navigation Chips */
    .cal-day-pills-wrap {
      margin-bottom: 24px;
    }

    .cal-day-pills {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 10px;
      scrollbar-width: thin;
    }

    .cal-day-pills::-webkit-scrollbar {
      height: 6px;
    }

    .cal-day-pills::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }

    .cal-day-pill {
      flex-shrink: 0;
      padding: 10px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      min-width: 90px;
    }

    .cal-day-pill:hover {
      border-color: var(--primary);
      background: #f0f9ff;
      transform: translateY(-2px);
    }

    .cal-day-pill.active {
      background: var(--disney-navy);
      border-color: var(--disney-navy);
      color: #fff;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
    }

    .cal-day-pill-top {
      font-size: 0.8rem;
      font-weight: 700;
      color: #64748b;
    }
    .cal-day-pill.active .cal-day-pill-top {
      color: #93c5fd;
    }

    .cal-day-pill-date {
      font-size: 0.98rem;
      font-weight: 800;
      margin: 2px 0;
    }

    .cal-day-pill-tag {
      font-size: 0.72rem;
      padding: 2px 6px;
      border-radius: 9999px;
      background: #e2e8f0;
      color: #475569;
      display: inline-block;
      white-space: nowrap;
    }
    .cal-day-pill.active .cal-day-pill-tag {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }

    /* Day Cards */
    .cal-day-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      margin-bottom: 28px;
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: box-shadow 0.2s;
    }

    .cal-day-card:hover {
      box-shadow: var(--shadow-md);
    }

    .cal-day-card-header {
      padding: 20px 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
    }

    .cal-day-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .cal-day-number-badge {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #fff;
      font-size: 1.05rem;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: var(--radius-sm);
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);
    }

    .cal-day-number-badge.cruise {
      background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
      box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
    }

    .cal-day-title-main {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--disney-navy);
      line-height: 1.35;
    }

    .cal-day-title-sub {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .cal-day-header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cal-day-check-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--border);
      background: #fff;
      color: #64748b;
      transition: all 0.2s;
    }

    .cal-day-check-btn:hover {
      border-color: var(--success);
      color: var(--success);
      background: var(--success-light);
    }

    .cal-day-check-btn.checked {
      background: var(--success);
      color: #fff;
      border-color: var(--success);
    }

    .cal-day-toggle-btn {
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 9999px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .cal-day-toggle-btn:hover {
      background: #e2e8f0;
      color: var(--text);
    }

    /* Day Card Route Summary Bar */
    .cal-route-bar {
      padding: 10px 24px;
      background: #f0fdf4;
      border-bottom: 1px solid #dcfce7;
      font-size: 0.86rem;
      color: #166534;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    /* Timeline Section */
    .cal-timeline-body {
      padding: 24px;
      position: relative;
    }

    .cal-timeline-container {
      position: relative;
    }

    .cal-timeline-container::before {
      content: "";
      position: absolute;
      top: 15px;
      bottom: 25px;
      left: 17px;
      width: 2px;
      background: #e2e8f0;
    }

    .cal-timeline-item {
      position: relative;
      padding-left: 48px;
      margin-bottom: 30px;
    }

    .cal-timeline-item:last-child {
      margin-bottom: 0;
    }

    .cal-timeline-dot {
      position: absolute;
      left: 10px;
      top: 5px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid var(--primary);
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
      z-index: 2;
      transition: transform 0.2s;
    }

    .cal-timeline-item:hover .cal-timeline-dot {
      transform: scale(1.25);
      border-color: var(--accent);
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2);
    }

    .cal-time-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 12px;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 700;
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      margin-bottom: 8px;
    }

    .cal-event-title-h4 {
      font-size: 1.08rem;
      font-weight: 800;
      color: var(--disney-navy);
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .cal-event-content-p {
      font-size: 0.93rem;
      color: #334155;
      line-height: 1.7;
      margin-bottom: 12px;
      white-space: pre-line;
    }

    /* Highlight Feature Boxes */
    .cal-feature-card {
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      margin-top: 10px;
      font-size: 0.88rem;
      line-height: 1.6;
    }

    /* Video Transition Card (Gold/Purple) */
    .cal-video-card {
      background: linear-gradient(135deg, #faf5ff 0%, #fdf4ff 100%);
      border: 1px solid #f3e8ff;
      border-left: 4px solid #a855f7;
      color: #581c87;
    }
    .cal-video-header {
      font-weight: 800;
      color: #7e22ce;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
      font-size: 0.92rem;
    }

    /* Transit Card (Blue) */
    .cal-transit-card {
      background: #f0f9ff;
      border: 1px solid #e0f2fe;
      border-left: 4px solid #0284c7;
      color: #0c4a6e;
    }
    .cal-transit-header {
      font-weight: 800;
      color: #0369a1;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
      font-size: 0.92rem;
    }

    /* Dining Card (Orange) */
    .cal-dining-card {
      background: #fff7ed;
      border: 1px solid #ffedd5;
      border-left: 4px solid #f97316;
      color: #7c2d12;
    }
    .cal-dining-header {
      font-weight: 800;
      color: #c2410c;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
      font-size: 0.92rem;
    }

    /* Alert Card (Red) */
    .cal-alert-card {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      border-left: 4px solid #ef4444;
      color: #7f1d1d;
    }
    .cal-alert-header {
      font-weight: 800;
      color: #b91c1c;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
      font-size: 0.92rem;
    }

    .cal-tip-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .cal-tip-list li {
      margin-bottom: 4px;
    }
    .cal-tip-list li:last-child {
      margin-bottom: 0;
    }

    /* Print styling */
    @media print {
      body {
        background: #fff !important;
        padding: 0 !important;
      }
      .main-tabs-bar, .toolbar, .sync-bar, .cal-toolbar, .cal-day-pills-wrap, .floating-tools, .add-custom-wrap, .smart-input-card, .cat-nav, .item-del-btn, .cal-day-toggle-btn, .cal-day-check-btn {
        display: none !important;
      }
      .cal-day-card {
        page-break-inside: avoid;
        box-shadow: none !important;
        border: 1px solid #ccc !important;
        margin-bottom: 20px !important;
      }
      .view-panel {
        display: block !important;
      }
    }
    """

    calendar_html = """
    <!-- Top-level Navigation Tabs (Checklist vs Calendar) -->
    <nav class="main-tabs-bar" id="mainTabsBar">
      <button type="button" class="main-tab-btn active" data-tab="checklist" id="tabBtnChecklist">
        <span class="tab-icon">🧳</span>
        <span class="tab-label">行李行前檢核表</span>
        <span class="tab-count-badge" id="tabChecklistCount">113 項</span>
      </button>
      <button type="button" class="main-tab-btn" data-tab="calendar" id="tabBtnCalendar">
        <span class="tab-icon">📅</span>
        <span class="tab-label">10天精緻蜜月行事曆</span>
        <span class="tab-count-badge gold">10/21～10/30</span>
      </button>
    </nav>
    """

    calendar_view_html = """
    <!-- ==========================================
         VIEW 2: 10-DAY HONEYMOON CALENDAR VIEW
         ========================================== -->
    <div id="viewCalendar" class="view-panel">

      <!-- Calendar Hero Banner -->
      <section class="cal-hero-banner">
        <div class="badge-pill">📅 2026/10/21 ～ 10/30 • 10 天 9 夜完整行程大綱</div>
        <h2 style="font-size: clamp(1.5rem, 3.2vw, 2.2rem); font-weight: 900; line-height: 1.25; margin-bottom: 8px;">
          星宇航空 × 迪士尼探險號 10天精緻蜜月行事曆
        </h2>
        <p style="font-size: 0.95rem; color: #cbd5e1; max-width: 820px; line-height: 1.6;">
          完整收錄每日分時動線、招牌影音三轉場拍攝機位、交通捷運轉乘指引、必吃在地美食與重要提醒。支援天數過濾、關鍵字即時搜尋與單日勾選完成！
        </p>

        <div class="cal-quick-stats">
          <div class="cal-stat-card">
            <span class="cal-stat-icon">🚢</span>
            <div>
              <div class="cal-stat-val">4 天 3 夜</div>
              <div class="cal-stat-label">迪士尼探險號海上巡航</div>
            </div>
          </div>
          <div class="cal-stat-card">
            <span class="cal-stat-icon">🏨</span>
            <div>
              <div class="cal-stat-val">雙渡假村</div>
              <div class="cal-stat-label">香格里拉 ＋ 悅樂聖淘沙</div>
            </div>
          </div>
          <div class="cal-stat-card">
            <span class="cal-stat-icon">🎬</span>
            <div>
              <div class="cal-stat-val">3 大招牌轉場</div>
              <div class="cal-stat-label">手拿鏡放大・邁步・拉走</div>
            </div>
          </div>
          <div class="cal-stat-card">
            <span class="cal-stat-icon">🎡</span>
            <div>
              <div class="cal-stat-val">雙主題樂園</div>
              <div class="cal-stat-label">環球影城 ＋ S.E.A.水族館</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Calendar Filter & Search Toolbar -->
      <div class="cal-toolbar">
        <div class="cal-search-wrap">
          <span class="cal-search-icon">🔍</span>
          <input type="text" id="calSearchInput" class="cal-search-input" placeholder="搜尋行事曆（如：卡丁車、斜坡滑車、亞坤、烤鴨、肉骨茶、水族館、轉場、退稅...）">
        </div>
        <div class="cal-actions">
          <button type="button" class="btn" id="calExpandAllBtn">展開全部</button>
          <button type="button" class="btn" id="calCollapseAllBtn">收合全部</button>
          <button type="button" class="btn btn-primary-action" id="calPrintBtn">🖨️ 列印行程表</button>
        </div>
      </div>

      <!-- Day Navigation Pills -->
      <div class="cal-day-pills-wrap">
        <div class="cal-day-pills" id="calDayPills">
          <div class="cal-day-pill active" data-day="all">
            <div class="cal-day-pill-top">🌟 全部</div>
            <div class="cal-day-pill-date">10 天日程</div>
            <div class="cal-day-pill-tag">完整全覽</div>
          </div>
          <!-- Generated by JS -->
        </div>
      </div>

      <!-- Calendar Days Container -->
      <div id="calDaysContainer">
        <!-- Rendered by JS -->
      </div>

    </div>
    """

    calendar_js = f"""
    // ========================================================
    // CALENDAR VIEW MODULE & DATA
    // ========================================================
    const calendarData = {calendar_json_str};

    let calActiveDay = "all";
    let calSearchKeyword = "";
    let calDayStatus = {{}};

    // Load saved day checked status
    try {{
      const savedCalStatus = localStorage.getItem("dcl_calendar_checked_v1");
      if (savedCalStatus) {{
        calDayStatus = JSON.parse(savedCalStatus);
      }}
    }} catch (e) {{
      console.error("Failed to load calendar status", e);
    }}

    function saveCalStatus() {{
      try {{
        localStorage.setItem("dcl_calendar_checked_v1", JSON.stringify(calDayStatus));
      }} catch (e) {{
        console.error("Failed to save calendar status", e);
      }}
    }}

    // Render Day Pills
    function renderCalDayPills() {{
      const pillsContainer = document.getElementById("calDayPills");
      if (!pillsContainer) return;

      let html = `
        <div class="cal-day-pill ${{calActiveDay === 'all' ? 'active' : ''}}" data-day="all">
          <div class="cal-day-pill-top">🌟 全部</div>
          <div class="cal-day-pill-date">10 天日程</div>
          <div class="cal-day-pill-tag">完整全覽</div>
        </div>
      `;

      calendarData.forEach(d => {{
        const isAct = String(calActiveDay) === String(d.day);
        html += `
          <div class="cal-day-pill ${{isAct ? 'active' : ''}}" data-day="${{d.day}}">
            <div class="cal-day-pill-top">Day ${{d.day}} (${{d.weekday.replace('週', '')}})</div>
            <div class="cal-day-pill-date">${{d.date}}</div>
            <div class="cal-day-pill-tag">${{d.tag}}</div>
          </div>
        `;
      }});

      pillsContainer.innerHTML = html;

      pillsContainer.querySelectorAll(".cal-day-pill").forEach(pill => {{
        pill.addEventListener("click", () => {{
          calActiveDay = pill.dataset.day;
          renderCalDayPills();
          renderCalDays();
          if (calActiveDay !== "all") {{
            const targetCard = document.getElementById(`cal-day-card-${{calActiveDay}}`);
            if (targetCard) {{
              targetCard.scrollIntoView({{ behavior: "smooth", block: "start" }});
            }}
          }}
        }});
      }});
    }}

    // Render Calendar Days & Events
    function renderCalDays() {{
      const container = document.getElementById("calDaysContainer");
      if (!container) return;

      const q = calSearchKeyword.trim().toLowerCase();

      let filteredDays = calendarData;
      if (calActiveDay !== "all") {{
        filteredDays = calendarData.filter(d => String(d.day) === String(calActiveDay));
      }}

      let matchedDayCount = 0;
      let html = "";

      filteredDays.forEach(d => {{
        // Filter events by keyword
        const matchingEvents = d.events.filter(ev => {{
          if (!q) return true;
          const fullText = (ev.time + " " + ev.title + " " + ev.description + " " + 
                            ev.photo_tips.join(" ") + " " + ev.transit_tips.join(" ") + " " + 
                            ev.dining_tips.join(" ") + " " + ev.alerts.join(" ")).toLowerCase();
          return fullText.includes(q);
        }});

        if (q && matchingEvents.length === 0) {{
          return;
        }}

        matchedDayCount++;
        const isChecked = !!calDayStatus[`day_${{d.day}}`];
        const isCruise = d.day >= 2 && d.day <= 5;

        html += `
          <div class="cal-day-card" id="cal-day-card-${{d.day}}">
            <div class="cal-day-card-header">
              <div class="cal-day-header-left">
                <span class="cal-day-number-badge ${{isCruise ? 'cruise' : ''}}">Day ${{d.day}} • ${{d.date}} (${{d.weekday}})</span>
                <div>
                  <h3 class="cal-day-title-main">${{highlightText(d.subtitle || d.title, q)}}</h3>
                  <div class="cal-day-title-sub">${{d.tag}} • 共 ${{matchingEvents.length}} 項精選行程動線</div>
                </div>
              </div>
              <div class="cal-day-header-right">
                <button type="button" class="cal-day-check-btn ${{isChecked ? 'checked' : ''}}" data-day="${{d.day}}">
                  ${{isChecked ? '✅ 今日已完成' : '⭕ 標記今日完成'}}
                </button>
                <button type="button" class="cal-day-toggle-btn" data-day="${{d.day}}" title="收合/展開此日行程">▼</button>
              </div>
            </div>

            <div class="cal-route-bar">
              <span>📍 當日路線：</span>
              <span>${{highlightText(d.title.replace(/^Day\\s*\\d+[：:]?\\s*/, ''), q)}}</span>
            </div>

            <div class="cal-timeline-body" id="cal-timeline-body-${{d.day}}">
              <div class="cal-timeline-container">
        `;

        matchingEvents.forEach(ev => {{
          html += `
            <div class="cal-timeline-item">
              <div class="cal-timeline-dot"></div>
              <div class="cal-time-badge">🕒 ${{highlightText(ev.time, q)}}</div>
              <h4 class="cal-event-title-h4">${{highlightText(ev.title, q)}}</h4>
              <div class="cal-event-content-p">${{highlightText(ev.description, q)}}</div>
          `;

          // Video / Photo box
          if (ev.photo_tips && ev.photo_tips.length > 0) {{
            html += `
              <div class="cal-feature-card cal-video-card">
                <div class="cal-video-header">🎬 📸 蜜月招牌影音轉場 ＆ 神級機位</div>
                <ul class="cal-tip-list">
                  ${{ev.photo_tips.map(tip => `<li>${{highlightText(tip, q)}}</li>`).join('')}}
                </ul>
              </div>
            `;
          }}

          // Transit box
          if (ev.transit_tips && ev.transit_tips.length > 0) {{
            html += `
              <div class="cal-feature-card cal-transit-card">
                <div class="cal-transit-header">🚇 🚗 交通接駁與動線指引</div>
                <ul class="cal-tip-list">
                  ${{ev.transit_tips.map(tip => `<li>${{highlightText(tip, q)}}</li>`).join('')}}
                </ul>
              </div>
            `;
          }}

          // Dining box
          if (ev.dining_tips && ev.dining_tips.length > 0) {{
            html += `
              <div class="cal-feature-card cal-dining-card">
                <div class="cal-dining-header">🍴 ☕️ 美食必吃與特色指南</div>
                <ul class="cal-tip-list">
                  ${{ev.dining_tips.map(tip => `<li>${{highlightText(tip, q)}}</li>`).join('')}}
                </ul>
              </div>
            `;
          }}

          // Alert box
          if (ev.alerts && ev.alerts.length > 0) {{
            html += `
              <div class="cal-feature-card cal-alert-card">
                <div class="cal-alert-header">🚨 💡 管家重要提醒與避坑秘笈</div>
                <ul class="cal-tip-list">
                  ${{ev.alerts.map(tip => `<li>${{highlightText(tip, q)}}</li>`).join('')}}
                </ul>
              </div>
            `;
          }}

          html += `
            </div>
          `;
        }});

        html += `
              </div>
            </div>
          </div>
        `;
      }});

      if (matchedDayCount === 0) {{
        html = `
          <div style="text-align: center; padding: 60px 20px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border);">
            <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--disney-navy); margin-bottom: 6px;">找不到與「${{escapeHtml(calSearchKeyword)}}」相符的行程</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem;">請嘗試輸入其他關鍵字，如：卡丁車、斜坡滑車、亞坤、烤鴨、肉骨茶、水族館、轉場...</p>
          </div>
        `;
      }}

      container.innerHTML = html;

      // Bind Day Check Buttons
      container.querySelectorAll(".cal-day-check-btn").forEach(btn => {{
        btn.addEventListener("click", (e) => {{
          e.stopPropagation();
          const dayId = btn.dataset.day;
          calDayStatus[`day_${{dayId}}`] = !calDayStatus[`day_${{dayId}}`];
          saveCalStatus();
          renderCalDays();
          showToast(calDayStatus[`day_${{dayId}}`] ? `✅ Day ${{dayId}} 行程已標記為完成！` : `⭕ Day ${{dayId}} 已重置為未完成`);
        }});
      }});

      // Bind Toggle Collapse Buttons
      container.querySelectorAll(".cal-day-toggle-btn").forEach(btn => {{
        btn.addEventListener("click", () => {{
          const dayId = btn.dataset.day;
          const body = document.getElementById(`cal-timeline-body-${{dayId}}`);
          if (body) {{
            const isHidden = body.style.display === "none";
            body.style.display = isHidden ? "block" : "none";
            btn.textContent = isHidden ? "▼" : "▲";
          }}
        }});
      }});
    }}

    function highlightText(text, keyword) {{
      if (!keyword || !text) return escapeHtml(text || "");
      const escapedText = escapeHtml(text);
      const escapedKwd = escapeHtml(keyword).replace(/[.*+?^${{}}()|[\\]\\\\]/g, '\\\\$&');
      const reg = new RegExp(`(${{escapedKwd}})`, 'gi');
      return escapedText.replace(reg, '<mark style="background: #fef08a; color: #854d0e; padding: 1px 4px; border-radius: 4px;">$1</mark>');
    }}

    function escapeHtml(str) {{
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }}

    // Main Tabs Switch Logic
    function initMainTabs() {{
      const tabBtnChecklist = document.getElementById("tabBtnChecklist");
      const tabBtnCalendar = document.getElementById("tabBtnCalendar");
      const viewChecklist = document.getElementById("viewChecklist");
      const viewCalendar = document.getElementById("viewCalendar");

      function switchTab(tabName) {{
        if (tabName === "calendar") {{
          tabBtnCalendar.classList.add("active");
          tabBtnChecklist.classList.remove("active");
          viewCalendar.classList.add("active");
          viewCalendar.style.display = "block";
          viewChecklist.classList.remove("active");
          viewChecklist.style.display = "none";
          renderCalDayPills();
          renderCalDays();
          window.scrollTo({{ top: 0, behavior: 'smooth' }});
        }} else {{
          tabBtnChecklist.classList.add("active");
          tabBtnCalendar.classList.remove("active");
          viewChecklist.classList.add("active");
          viewChecklist.style.display = "block";
          viewCalendar.classList.remove("active");
          viewCalendar.style.display = "none";
          window.scrollTo({{ top: 0, behavior: 'smooth' }});
        }}
      }}

      if (tabBtnChecklist && tabBtnCalendar) {{
        tabBtnChecklist.addEventListener("click", () => switchTab("checklist"));
        tabBtnCalendar.addEventListener("click", () => switchTab("calendar"));
      }}

      // Calendar Search
      const calSearchInput = document.getElementById("calSearchInput");
      if (calSearchInput) {{
        calSearchInput.addEventListener("input", (e) => {{
          calSearchKeyword = e.target.value;
          renderCalDays();
        }});
      }}

      // Calendar Expand / Collapse All
      const calExpandAllBtn = document.getElementById("calExpandAllBtn");
      const calCollapseAllBtn = document.getElementById("calCollapseAllBtn");
      if (calExpandAllBtn) {{
        calExpandAllBtn.addEventListener("click", () => {{
          calendarData.forEach(d => {{
            const body = document.getElementById(`cal-timeline-body-${{d.day}}`);
            if (body) body.style.display = "block";
            const btn = document.querySelector(`.cal-day-toggle-btn[data-day="${{d.day}}"]`);
            if (btn) btn.textContent = "▼";
          }});
        }});
      }}
      if (calCollapseAllBtn) {{
        calCollapseAllBtn.addEventListener("click", () => {{
          calendarData.forEach(d => {{
            const body = document.getElementById(`cal-timeline-body-${{d.day}}`);
            if (body) body.style.display = "none";
            const btn = document.querySelector(`.cal-day-toggle-btn[data-day="${{d.day}}"]`);
            if (btn) btn.textContent = "▲";
          }});
        }});
      }}

      // Print Calendar
      const calPrintBtn = document.getElementById("calPrintBtn");
      if (calPrintBtn) {{
        calPrintBtn.addEventListener("click", () => {{
          window.print();
        }});
      }}
    }}

    // Auto-init Calendar on page load
    window.addEventListener("DOMContentLoaded", () => {{
      initMainTabs();
      renderCalDayPills();
      renderCalDays();
    }});
    setTimeout(() => {{
      initMainTabs();
    }}, 50);
    """

    return calendar_css, calendar_html, calendar_view_html, calendar_js

print("Integration builder module ready")
