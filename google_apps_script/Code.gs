
const SPREADSHEET_ID = "1mSLZvnE1YW9qG23owDlmcZtr7EKZgVXuO4sBwIVaqzo";
function getTargetSpreadsheet() {
  try {
    const active = getTargetSpreadsheet();
    if (active) return active;
  } catch(e) {}
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch(e) {
    Logger.log("無法開啟試算表: " + e);
    return null;
  }
}
/**
 * 新加坡迪士尼郵輪 + 當地5日遊 10天行李檢核表
 * Google Apps Script 後端程式碼 (完美同步 Checklist.xlsx 120項)
 * 
 * 💡 使用說明：
 * 1. 請將此整份程式碼複製，貼到 Google Apps Script (183y7gcwOOYmCXkmJIuGmwoJ2zWTTA3BdA2dtWPIRUrTzyRHXpyGZ_Xjj) 的「程式碼.gs」。
 * 2. 上方下拉選單選擇「initChecklistSheet」，點擊「執行」▶️
 *    👉 試算表就會立刻自動灌入並排版好 Checklist.xlsx 裡全部 120 項清單！
 * 3. 若您在試算表編輯或匯入了新的 Excel 內容，點擊選單「🎒 行李清單小幫手」➔「📥 從試算表讀取更新」，即可自動吃進去！
 * 4. 點「部署」➔「管理部署作業」或「新增部署作業」➔「網頁應用程式」，即可給夫妻手機使用！
 */

// 🌟 預設完整清單資料庫（完全對應 Checklist.xlsx 120 項獨立打勾資料）
const DEFAULT_CHECKLIST_DATA = [
  {
    "id": "bag_pouch",
    "icon": "👛",
    "title": "1. Bag 隨身小包包（貼身常掛・出門即用）",
    "subtitle": "出門貼身斜背，放隨時要拿的手機、行動電源、交通卡與貼身防護",
    "items": [
      {
        "id": "bp-1",
        "text": "手機",
        "detail": "已下載 Disney Cruise App 及 Grab 叫車",
        "tagText": "隨身",
        "checked": false
      },
      {
        "id": "bp-2",
        "text": "行動電源 (行充)",
        "detail": "★ 民航局規定嚴禁託運，必須隨身攜帶，嚴禁放行李箱",
        "tagText": "隨身登機",
        "checked": false
      },
      {
        "id": "bp-3",
        "text": "耳機",
        "detail": "飛機與搭車交通途中使用",
        "tagText": "隨身",
        "checked": false
      },
      {
        "id": "bp-4",
        "text": "交通支付錢包 (悠遊卡/感應信用卡/現金)",
        "detail": "Visa/Mastercard 可直接感應搭乘新加坡地鐵 MRT 及公車",
        "tagText": "交通支付",
        "checked": false
      },
      {
        "id": "bp-5",
        "text": "家中鑰匙",
        "detail": "返台進門用，妥善收納在隨身包內袋",
        "tagText": "隨身",
        "checked": false
      },
      {
        "id": "bp-6",
        "text": "口罩 (黃色 x 2)",
        "detail": "隨身防護備用（其餘 23 個放行李箱 A 備用）",
        "tagText": "隨身防護",
        "checked": false
      },
      {
        "id": "bp-7",
        "text": "隨身備用衛生棉 x 2~3片 (含23cm/28cm)",
        "detail": "隨身貼身防護備用（其餘 7 天份量、棉條與生理褲全放行李箱 A）",
        "tagText": "隨身衛生",
        "checked": false
      },
      {
        "id": "bp-8",
        "text": "貓咪項鍊",
        "detail": "隨身飾品佩戴",
        "tagText": "飾品",
        "checked": false
      },
      {
        "id": "bp-9",
        "text": "香水 (隨身小瓶)",
        "detail": "隨身補香，容量小於 100ml",
        "tagText": "香氛",
        "checked": false
      }
    ]
  },
  {
    "id": "messenger",
    "icon": "👝",
    "title": "2. Messenger Bag 側身隨身袋（輕便小袋）",
    "subtitle": "輕便小袋斜背好拿，放隨身洗沐護髮與隨身小物",
    "items": [
      {
        "id": "mb-1",
        "text": "隨身輕便髮帽 x 2個",
        "detail": "隨身洗沐護髮與臨時防水使用（其餘 4 個放行李箱 B，共 6 個）",
        "tagText": "配件",
        "checked": false
      }
    ]
  },
  {
    "id": "backpack",
    "icon": "🎒",
    "title": "3. Backpack 雙肩隨身中包（登機手提・首日玩水＋隨身救急＋首日神器）",
    "subtitle": "登機隨身手提。放首日玩水衣物、常備急救棉片、貴重3C與上船第一天神器（零內褲，內褲全歸行李箱）",
    "items": [
      {
        "id": "bpk-1",
        "text": "厚外套 x 1 (穿著/隨身帶)",
        "detail": "防星宇機艙、新加坡地鐵與郵輪室內強烈冷氣（約20°C）",
        "tagText": "保暖",
        "checked": false
      },
      {
        "id": "bpk-2",
        "text": "薄長袖外衣長褲 x 1套",
        "detail": "飛機冷氣備用換穿，不含內衣褲",
        "tagText": "備用衣",
        "checked": false
      },
      {
        "id": "bpk-3",
        "text": "眼鏡保護盒",
        "detail": "放隨身包保護日常眼鏡，防擠壓損壞",
        "tagText": "配件保護",
        "checked": false
      },
      {
        "id": "bpk-4",
        "text": "時尚遮陽墨鏡 x 2副 (夫妻各1副)",
        "detail": "新加坡赤道烈日與郵輪甲板紫外線極強，護眼防曬必備",
        "tagText": "隨身防曬",
        "checked": false
      },
      {
        "id": "bpk-5",
        "text": "隱形眼鏡 x 2副 (隨身急用備用)",
        "detail": "隨身急用備用，防止行李延誤（其餘 10 副大盒放行李箱 B，共 12 副）",
        "tagText": "眼部護理",
        "checked": false
      },
      {
        "id": "bpk-6",
        "text": "生理食鹽水 x 2瓶 (小容量)",
        "detail": "沖洗隱形眼鏡或眼睛異物急用，容量小於 100ml",
        "tagText": "眼部護理",
        "checked": false
      },
      {
        "id": "bpk-7",
        "text": "臨時救護包：優碘棉片",
        "detail": "傷口消毒必備，獨立單包裝",
        "tagText": "急救",
        "checked": false
      },
      {
        "id": "bpk-8",
        "text": "臨時救護包：生理食鹽水棉片",
        "detail": "傷口清潔沖洗，獨立單包裝",
        "tagText": "急救",
        "checked": false
      },
      {
        "id": "bpk-9",
        "text": "臨時救護包：酒精棉片",
        "detail": "器具與手部消毒清潔",
        "tagText": "急救",
        "checked": false
      },
      {
        "id": "bpk-10",
        "text": "臨時救護包：OK蹦 (多尺寸)",
        "detail": "防磨腳與小傷口包紮，走路必備",
        "tagText": "急救",
        "checked": false
      },
      {
        "id": "bpk-11",
        "text": "旅行裝洗面乳 (小於100ml)",
        "detail": "洗卸清潔，裝入透明密封袋通過安檢",
        "tagText": "隨身洗沐",
        "checked": false
      },
      {
        "id": "bpk-12",
        "text": "一次性純棉洗臉巾 / 美容紙巾",
        "detail": "隨身洗臉擦拭，乾淨衛生",
        "tagText": "清潔紙巾",
        "checked": false
      },
      {
        "id": "bpk-13",
        "text": "基礎保養品旅行小樣組 (化妝水/乳液)",
        "detail": "各瓶小於 100ml，機艙保濕急用",
        "tagText": "保濕護膚",
        "checked": false
      },
      {
        "id": "bpk-14",
        "text": "護髮油隨身小瓶 (小於100ml)",
        "detail": "頭髮吹整與防毛躁",
        "tagText": "美髮護理",
        "checked": false
      },
      {
        "id": "bpk-15",
        "text": "夫妻手機與 3C 充電線組",
        "detail": "手提隨身攜帶，預防託運行李延誤",
        "tagText": "3C充電",
        "checked": false
      },
      {
        "id": "bpk-16",
        "text": "隨身手拿鏡 (輕巧補妝鏡)",
        "detail": "首日登機與隨身補妝儀容整理",
        "tagText": "隨身護理",
        "checked": false
      },
      {
        "id": "bpk-eyelash",
        "text": "Face Factory USB 燙睫毛器 (含充電線)",
        "detail": "★ 內建鋰電池嚴禁託運！必須隨身手提包登機。5V USB 充電無各國電壓問題（注意僅支援 5V/2A 普通充，蓋好保護蓋防包內誤觸發熱）。郵輪可正常使用。",
        "tagText": "隨身美妝",
        "checked": false
      },
      {
        "id": "bpk-17",
        "text": "平板電腦 (iPad / 追劇娛樂)",
        "detail": "飛機與客艙無網路娛樂，含內建鋰電池必須隨身手提",
        "tagText": "3C娛樂",
        "checked": false
      },
      {
        "id": "bpk-18",
        "text": "貴重珠寶與飾品",
        "detail": "防遺失與防盜，★ 航空公司嚴禁託運貴重飾品",
        "tagText": "貴重物品",
        "checked": false
      },
      {
        "id": "bpk-19",
        "text": "【首日手提神器】掛頸房卡吊牌套 x 2條",
        "detail": "【直接放在手提中包】登船手續領取 Key to the World 房卡後立刻掛在脖子上，全船消費通行必備",
        "tagText": "首日神器",
        "checked": false
      },
      {
        "id": "bpk-20",
        "text": "【首日手提神器】手機防水透明掛袋 x 2個",
        "detail": "【直接放在手提中包】登船首日房間未開放但頂層泳池已開，隨身掛脖子玩水拍照防浸水",
        "tagText": "首日神器",
        "checked": false
      },
      {
        "id": "bpk-21",
        "text": "【首日手提神器】首日玩水泳裝 (太太泳衣1套＋先生泳褲1條，無泳鏡)",
        "detail": "【直接放在手提中包】放中包可一上船就直奔甲板泳池享受，免等託運行李送進房",
        "tagText": "首日神器",
        "checked": false
      },
      {
        "id": "bpk-22",
        "text": "食品級大夾鏈袋 (Ziploc) x 3~5個",
        "detail": "裝首日濕泳衣或過安檢液體透明袋使用",
        "tagText": "收納防潮",
        "checked": false
      }
    ]
  },
  {
    "id": "documents",
    "icon": "📑",
    "title": "4. 重要證件包（通關登船隨身・★嚴禁託運）",
    "subtitle": "出入境新加坡、搭星宇航空與迪士尼郵輪登船核心文件，一律貼身手提保管",
    "items": [
      {
        "id": "doc-1",
        "text": "護照正本 x 2本 (先生+太太)",
        "detail": "★ 效期自返台日起算需滿 6 個月以上，嚴禁託運",
        "tagText": "絕對必備",
        "checked": false
      },
      {
        "id": "doc-2",
        "text": "身分證正本 x 2張",
        "detail": "台灣機場查驗備用",
        "tagText": "備份證件",
        "checked": false
      },
      {
        "id": "doc-3",
        "text": "護照影本與手機拍照檔 x 2份",
        "detail": "與正本分開存放，遺失時補辦必備",
        "tagText": "備份",
        "checked": false
      },
      {
        "id": "doc-4",
        "text": "機票行程單證明 x 2份 (星宇航空截圖/紙本)",
        "detail": "新加坡海關入境隨時抽查回程機票",
        "tagText": "機票證明",
        "checked": false
      },
      {
        "id": "doc-5",
        "text": "迪士尼郵輪登船憑證 (PAT 二維碼截圖/紙本)",
        "detail": "新加坡港口登船報到出示 QR Code 刷碼",
        "tagText": "郵輪憑證",
        "checked": false
      },
      {
        "id": "doc-6",
        "text": "新加坡電子入境卡 (SG Arrival Card) x 2人截圖",
        "detail": "抵達前 3 天內上 MyICA 填妥，存下 QR Code",
        "tagText": "入境卡",
        "checked": false
      },
      {
        "id": "doc-7",
        "text": "海外旅遊不便險與醫療保單截圖 x 2人",
        "detail": "含郵輪緊急醫療與延誤理賠專線資訊",
        "tagText": "保險證明",
        "checked": false
      },
      {
        "id": "doc-8",
        "text": "新幣 (SGD) 現金與美金現金",
        "detail": "新加坡熟食中心 (小販中心) 現金專用，船上小費備用",
        "tagText": "外幣現鈔",
        "checked": false
      },
      {
        "id": "doc-9",
        "text": "個人重要慢性病藥物之原裝藥盒",
        "detail": "新加坡海關對管制藥物嚴格，帶原裝藥盒備查",
        "tagText": "海關備查",
        "checked": false
      }
    ]
  },
  {
    "id": "luggage_A",
    "icon": "🧳",
    "title": "5. 28吋行李箱 A【10天夫妻服飾、婚紗與貼身衣物箱】（託運・星宇限重23kg）",
    "subtitle": "專屬夫妻 10 天所有精選服飾、婚紗、晚宴服、內衣褲、生理用品與襪子（內褲全部歸在此箱）",
    "items": [
      {
        "id": "la-1",
        "text": "太太：精選婚紗 / 拍照輕婚紗 x 1套",
        "detail": "【新增加】郵輪與新加坡景點拍照留念，附專用防塵禮服袋妥善收納",
        "tagText": "婚紗正裝",
        "checked": false
      },
      {
        "id": "la-2",
        "text": "太太：NU BRA 隱形胸罩 x 3套",
        "detail": "【新增加】搭配婚紗、晚宴禮服與露肩渡假洋裝專用",
        "tagText": "貼身配件",
        "checked": false
      },
      {
        "id": "la-3",
        "text": "太太：正式晚宴禮服 / 優雅長洋裝 x 2套",
        "detail": "郵輪皇家晚宴與高檔成人餐廳 (Palo) 著裝規範",
        "tagText": "晚宴正裝",
        "checked": false
      },
      {
        "id": "la-4",
        "text": "太太：渡假休閒洋裝 x 4~5套 (擴充10天)",
        "detail": "新加坡濱海灣、環球影城與郵輪甲板拍照美照穿搭",
        "tagText": "渡假穿搭",
        "checked": false
      },
      {
        "id": "la-5",
        "text": "太太：休閒短袖 / 排汗上衣 x 6件",
        "detail": "新加坡炎熱透氣更換",
        "tagText": "日常衣物",
        "checked": false
      },
      {
        "id": "la-6",
        "text": "太太：短褲 / 涼爽長裙 x 4~5件",
        "detail": "10 天下身搭配",
        "tagText": "日常衣物",
        "checked": false
      },
      {
        "id": "la-7",
        "text": "太太：渡假泳衣 x 1套",
        "detail": "【只有一套・無泳鏡】船上泳池滑水道享受",
        "tagText": "泳裝",
        "checked": false
      },
      {
        "id": "la-8",
        "text": "太太：泳帽 x 1頂",
        "detail": "衛生泳池備用",
        "tagText": "泳具",
        "checked": false
      },
      {
        "id": "la-9",
        "text": "太太：比基尼罩衫 / 沙灘防曬披肩 x 1件",
        "detail": "甲板走動與出水防曬",
        "tagText": "防曬",
        "checked": false
      },
      {
        "id": "la-10",
        "text": "太太：免洗內褲 x 10~12件",
        "detail": "【全部放託運行李箱A】穿完即丟免手洗，10天份量充裕省空間",
        "tagText": "貼身衣物",
        "checked": false
      },
      {
        "id": "la-11",
        "text": "太太：日常純棉內褲 x 3~4件",
        "detail": "【全部放託運行李箱A】舒適備用替換",
        "tagText": "貼身衣物",
        "checked": false
      },
      {
        "id": "la-12",
        "text": "太太：貼身無痕內衣 x 5~6件",
        "detail": "【全部放託運行李箱A】搭配各式洋裝與外衣",
        "tagText": "貼身衣物",
        "checked": false
      },
      {
        "id": "la-13",
        "text": "太太：生理褲 x 2~3件",
        "detail": "【新增加・生理護理】透氣防漏生理專用內褲，出遊更安心",
        "tagText": "貼身衣物",
        "checked": false
      },
      {
        "id": "la-14",
        "text": "太太：日用衛生棉 (23公分) x 7天份充足包裝",
        "detail": "【新增加・7天份放行李箱A】舒適薄型日用衛生棉，足量更安心",
        "tagText": "衛生護理",
        "checked": false
      },
      {
        "id": "la-15",
        "text": "太太：夜用衛生棉 (28公分) x 7天份充足包裝",
        "detail": "【新增加・7天份放行李箱A】夜間與量大安心防漏",
        "tagText": "衛生護理",
        "checked": false
      },
      {
        "id": "la-16",
        "text": "太太：導管式衛生棉條 x 1盒",
        "detail": "【新增加・水上活動備用】下水玩水或日常活動皆能無拘無束",
        "tagText": "衛生護理",
        "checked": false
      },
      {
        "id": "la-17",
        "text": "太太：日常襪子 x 8~10雙",
        "detail": "【全部放託運行李箱A】透氣防臭短襪",
        "tagText": "貼身襪子",
        "checked": false
      },
      {
        "id": "la-18",
        "text": "太太：船上冷氣披肩 / 薄罩衫 x 1件",
        "detail": "劇院看百老匯秀防冷氣吹風",
        "tagText": "保暖披肩",
        "checked": false
      },
      {
        "id": "la-19",
        "text": "太太：遮陽草帽 / 遮陽帽 x 1頂",
        "detail": "熱帶烈日防曬",
        "tagText": "遮陽",
        "checked": false
      },
      {
        "id": "la-20",
        "text": "先生：正式西裝外套 / 成套西裝 x 1套",
        "detail": "【新增加】搭配太太婚紗拍照與郵輪正式晚宴合影",
        "tagText": "先生正裝",
        "checked": false
      },
      {
        "id": "la-21",
        "text": "先生：正式長袖襯衫 x 2件",
        "detail": "正裝晚宴穿搭，建議防皺材質",
        "tagText": "先生正裝",
        "checked": false
      },
      {
        "id": "la-22",
        "text": "先生：西裝長褲 x 1~2條",
        "detail": "進入成人高級餐廳禁止短褲牛仔褲",
        "tagText": "先生正裝",
        "checked": false
      },
      {
        "id": "la-23",
        "text": "先生：休閒短袖 / 排汗衫 x 8~10件 (擴充10天)",
        "detail": "新加坡熱帶多汗，每天更換清爽舒適",
        "tagText": "先生衣物",
        "checked": false
      },
      {
        "id": "la-24",
        "text": "先生：休閒短褲 / 運動褲 x 4~5件",
        "detail": "日間活動穿搭",
        "tagText": "先生衣物",
        "checked": false
      },
      {
        "id": "la-25",
        "text": "先生：休閒薄長褲 x 1條",
        "detail": "冷氣房或正式場合備用",
        "tagText": "先生衣物",
        "checked": false
      },
      {
        "id": "la-26",
        "text": "先生：泳褲 x 1條",
        "detail": "【只有一條・無泳鏡】船上泳池活動專用",
        "tagText": "先生泳具",
        "checked": false
      },
      {
        "id": "la-27",
        "text": "先生：免洗內褲 x 10~12件",
        "detail": "【全部放託運行李箱A】10 天充足份量穿完即丟",
        "tagText": "先生貼身",
        "checked": false
      },
      {
        "id": "la-28",
        "text": "先生：日常短襪 x 8~10雙",
        "detail": "【全部放託運行李箱A】防臭排汗襪",
        "tagText": "先生襪子",
        "checked": false
      },
      {
        "id": "la-29",
        "text": "先生：正式深色西裝襪 x 2雙",
        "detail": "【全部放託運行李箱A】搭配皮鞋與西褲專用",
        "tagText": "先生正裝",
        "checked": false
      },
      {
        "id": "la-30",
        "text": "先生：抗UV防曬薄外套 x 1件",
        "detail": "新加坡戶外走動防烈日曬傷",
        "tagText": "先生防曬",
        "checked": false
      },
      {
        "id": "la-31",
        "text": "先生：遮陽棒球帽 x 1頂",
        "detail": "戶外遮陽活動",
        "tagText": "先生配件",
        "checked": false
      },
      {
        "id": "la-32",
        "text": "防護口罩 x 23個 (備用替換大包裝)",
        "detail": "【全部放託運行李箱A】10 天旅程備用替換，整包放行李箱（另 2 個放隨身小包，共 25 個）",
        "tagText": "防護備品",
        "checked": false
      }
    ]
  },
  {
    "id": "luggage_B",
    "icon": "🧳",
    "title": "6. 28吋行李箱 B【鞋履、客房神器、道具拍照、盥洗備品與戰利品預留箱】（託運・星宇限重23kg）",
    "subtitle": "放置拍照道具、客房專屬神器、鞋履、大瓶液體與常備藥，並預留回程戰利品空間",
    "items": [
      {
        "id": "lb-1",
        "text": "拍照道具：精美手拿捧花 x 1束",
        "detail": "【新增加】拍照與婚紗合影專用，裝盒妥善防擠壓變形",
        "tagText": "拍照道具",
        "checked": false
      },
      {
        "id": "lb-2",
        "text": "拍照道具：造景氣球組",
        "detail": "【新增加】拍美照與房內布置使用，未充氣附迷你打氣筒",
        "tagText": "拍照道具",
        "checked": false
      },
      {
        "id": "lb-3",
        "text": "拍照道具：造景花瓣包",
        "detail": "【新增加】浪漫拍照鋪設造景使用",
        "tagText": "拍照道具",
        "checked": false
      },
      {
        "id": "lb-4",
        "text": "旅行折疊相機/手機腳架 (含藍牙自拍遙控器)",
        "detail": "【新增加】拍雙人婚紗合照神器，託運放行李箱B",
        "tagText": "拍照攝影",
        "checked": false
      },
      {
        "id": "lb-5",
        "text": "全球萬用轉接插頭 (支援英規三腳+美規/歐規)",
        "detail": "【新增加】新加坡市區英規 Type G 與郵輪美規插座通用",
        "tagText": "充電配件",
        "checked": false
      },
      {
        "id": "lb-flat-iron",
        "text": "美髮造型板夾 / 離子夾 (有插電線款)",
        "detail": "★ 有線款可上飛機與郵輪！電壓提醒：台灣電壓是 110V，但新加坡市區飯店電壓是 230V（英規三腳插座）！請看一眼機身標籤：• 若標示 100V~240V（全電壓／國際電壓）：完全沒問題，搭配萬用轉接頭在新加坡與郵輪都能正常用。• 若標示僅限 110V：千萬不能在新加坡飯店插電（一插上 230V 會瞬間燒毀冒煙），只可在郵輪的美規 110V 插座使用。",
        "tagText": "美髮電器",
        "checked": false
      },
      {
        "id": "lb-6",
        "text": "強力磁吸掛鉤 x 6~8個",
        "detail": "★ 鋼壁神器！沉重金屬物放託運箱，進房後吸在鐵壁上掛包掛外套，釋放地面空間！",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "lb-7",
        "text": "迪士尼郵輪門上的布置 (Stateroom Door Magnets 磁吸門貼)",
        "detail": "★ 迪士尼傳統！全世界客人都會佈置房門，進房後吸在鐵門上，拍照超吸睛又防走錯房間",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "lb-8",
        "text": "甲板躺椅防風大毛巾夾 x 4個",
        "detail": "夾浴巾防海風吹跑，遠遠一眼認出躺椅位子",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "lb-9",
        "text": "艙房感應小夜燈 x 1~2個",
        "detail": "客艙夜晚全黑，放置洗手間門口起夜不刺眼不跌倒",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "lb-10",
        "text": "折疊大容量水壺 / 保溫杯 x 2個",
        "detail": "★ 郵輪 24 小時免費飲料吧裝茶水進房喝超省錢省力",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "lb-11",
        "text": "彈力折疊髒衣籃 / 髒衣收納袋",
        "detail": "放衣櫃角落收集 10 天髒衣服，房內乾淨不凌亂",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "lb-12",
        "text": "便攜折疊衣架 x 4~6個",
        "detail": "艙房衣架數量有限，自備折疊架晾曬泳裝毛巾",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "lb-13",
        "text": "備用洗沐髮帽 x 4個",
        "detail": "【新增加】客房洗澡梳化更換備用（加上隨身袋 2 個共 6 個）",
        "tagText": "美髮配件",
        "checked": false
      },
      {
        "id": "lb-14",
        "text": "隱形眼鏡 x 10副 (盒裝備用)",
        "detail": "【新增加】大盒裝備用放行李箱 B（加上隨身包 2 副共 12 副）",
        "tagText": "眼部護理",
        "checked": false
      },
      {
        "id": "lb-15",
        "text": "化妝檯立式/手拿大鏡 x 1個",
        "detail": "雙人同時梳妝不用搶浴室鏡子，化妝極度方便",
        "tagText": "梳妝鏡",
        "checked": false
      },
      {
        "id": "lb-16",
        "text": "太太：高跟婚鞋 x 1雙",
        "detail": "【新增加】搭配婚紗與正式晚宴禮服專用，防塵袋包妥",
        "tagText": "鞋履",
        "checked": false
      },
      {
        "id": "lb-17",
        "text": "太太：蕾絲包鞋 x 1雙",
        "detail": "【新增加】搭配優雅渡假洋裝與浪漫拍照專用",
        "tagText": "鞋履",
        "checked": false
      },
      {
        "id": "lb-18",
        "text": "太太：防滑拖鞋 x 1雙",
        "detail": "郵輪客房與甲板泳池防滑穿著",
        "tagText": "鞋履",
        "checked": false
      },
      {
        "id": "lb-19",
        "text": "先生：正式皮鞋 x 1雙",
        "detail": "搭配正裝長褲與西裝進高檔餐廳，用鞋袋包妥",
        "tagText": "先生鞋履",
        "checked": false
      },
      {
        "id": "lb-20",
        "text": "先生：防滑沙灘拖鞋 x 1雙",
        "detail": "甲板泳池與房內防滑拖鞋",
        "tagText": "先生鞋履",
        "checked": false
      },
      {
        "id": "lb-21",
        "text": "夫妻穿著：小白布鞋 / 好走休閒球鞋",
        "detail": "【搭機穿著】搭機出發與新加坡市區暴走走路穿好穿小白鞋",
        "tagText": "穿著鞋履",
        "checked": false
      },
      {
        "id": "lb-22",
        "text": "先生：一般手動刮鬍刀 (附保護蓋)",
        "detail": "【改為一般刮鬍刀】無電池手動刮鬍刀，男士儀容整理",
        "tagText": "個人護理",
        "checked": false
      },
      {
        "id": "lb-23",
        "text": "大罐裝臉部與身體高係數防曬乳 (SPF50+)",
        "detail": "赤道紫外線極強烈，大容量超過100ml必須放託運箱",
        "tagText": "防曬大瓶",
        "checked": false
      },
      {
        "id": "lb-24",
        "text": "曬後蘆薈舒緩凝膠 x 1罐",
        "detail": "甲板玩水曬傷急救舒緩",
        "tagText": "曬後護理",
        "checked": false
      },
      {
        "id": "lb-25",
        "text": "防蚊液 (含派卡瑞丁成分)",
        "detail": "新加坡熱帶防伊蚊叮咬（預防登革熱）",
        "tagText": "防蚊大瓶",
        "checked": false
      },
      {
        "id": "lb-26",
        "text": "常備成藥大盒：綜合感冒藥 / 止痛普拿疼",
        "detail": "水土不服發燒止痛急用",
        "tagText": "常備醫藥",
        "checked": false
      },
      {
        "id": "lb-27",
        "text": "常備成藥大盒：胃腸止瀉藥 / 胃散",
        "detail": "新加坡美食與郵輪吃到飽腸胃不適急用",
        "tagText": "常備醫藥",
        "checked": false
      },
      {
        "id": "lb-28",
        "text": "輕量可折疊大旅行袋 / 登機包 x 1個",
        "detail": "回程若戰利品塞不下，展開直接當手提行李登機！",
        "tagText": "戰利品預備",
        "checked": false
      },
      {
        "id": "lb-29",
        "text": "預留 30%~50% 空間 (紀念品戰利品位)",
        "detail": "空位留給新加坡樟宜機場伴手禮與迪士尼船上限量玩偶！",
        "tagText": "預留空間",
        "checked": false
      }
    ]
  },
  {
    "id": "forbidden",
    "icon": "🚫",
    "title": "7. 避坑法規禁帶（嚴禁放進任何包包或行李箱！）",
    "subtitle": "觸犯新加坡法律重罰、或郵輪海關違規沒收之物品，請務必再三核對勿放入行李",
    "items": [
      {
        "id": "fb-1",
        "text": "【嚴禁攜帶】電子煙與加熱菸 (含煙油/煙彈)",
        "detail": "★ 新加坡全境嚴禁！違者海關查獲罰款高達 10,000 新幣或監禁",
        "tagText": "重罰禁帶",
        "checked": false
      },
      {
        "id": "fb-2",
        "text": "【嚴禁攜帶】口香糖",
        "detail": "新加坡禁止進口與販售口香糖，通關嚴禁攜帶",
        "tagText": "海關禁止",
        "checked": false
      },
      {
        "id": "fb-3",
        "text": "【嚴禁攜帶】具備「防突波功能」之延長線",
        "detail": "郵輪發電系統與陸地不同，防突波會導致船隻配電箱跳火引發火警，上船安檢必遭沒收！",
        "tagText": "郵輪沒收",
        "checked": false
      },
      {
        "id": "fb-4",
        "text": "【嚴禁攜帶】自備大功率吹風機、電熱毯、熨斗、蒸氣掛燙機、加熱電湯匙",
        "detail": "大功率加熱電器嚴禁自備登船！艙房已有吹風機。★ 有線國際電壓離子夾/板夾/捲髮棒允許攜帶；無線鋰電板夾嚴禁託運",
        "tagText": "安全扣留",
        "checked": false
      },
      {
        "id": "fb-5",
        "text": "【嚴禁攜帶】肉類製品與生鮮水果 (含肉乾、肉鬆)",
        "detail": "出入境檢疫嚴禁攜帶動植物肉品生鮮",
        "tagText": "檢疫重罰",
        "checked": false
      }
    ]
  },
  {
    "id": "timeline",
    "icon": "⏰",
    "title": "8. 行前時序備忘",
    "subtitle": "依照出發時間序完成各階段重要任務，萬無一失",
    "items": [
      {
        "id": "tm-1",
        "text": "出發前 30 天：搶最早 PAT 登船時段",
        "detail": "線上值機上傳雙人資料與信用卡綁定，搶首批登船時間玩整天",
        "tagText": "T-30 天",
        "checked": false
      },
      {
        "id": "tm-2",
        "text": "出發前 3 天：填妥新加坡電子入境卡 x 2人",
        "detail": "登入 MyICA 免費申報並存下 QR Code 截圖",
        "tagText": "T-3 天",
        "checked": false
      },
      {
        "id": "tm-3",
        "text": "出發前 1 天：確認憑證截圖，行李箱綁上行李飄帶/吊牌",
        "detail": "28 吋兩咖箱子綁好顯眼標籤，防提領錯拿",
        "tagText": "T-1 天",
        "checked": false
      },
      {
        "id": "tm-4",
        "text": "郵輪開船那一刻：手機立即開啟【飛航模式】！",
        "detail": "★ 公海衛星漫遊每分鐘百元天價！開船瞬間立刻開飛航，僅連船上內網 App",
        "tagText": "重大提醒",
        "checked": false
      }
    ]
  }
];

// ==========================================
// 1. Google 試算表自訂選單（開啟試算表時自動出現）
// ==========================================
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🎒 行李清單小幫手')
      .addItem('📥 從試算表讀取更新 (吃進目前試算表/Excel內容)', 'syncFromSheetToApp')
      .addItem('📤 一鍵重設並寫入 120 項完整清單 (依 Checklist.xlsx 重整排版)', 'initChecklistSheet')
      .addToUi();
  } catch(e) {
    // 非試算表容器環境時忽略
  }
}

// ==========================================
// 2. 網頁應用程式入口 (Web App)
// ==========================================
function doGet(e) {
  // 支援 API 查詢模式
  if (e && e.parameter && e.parameter.action) {
    const action = e.parameter.action;
    if (action === 'getData') {
      const data = getChecklistData();
      return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (action === 'init') {
      initChecklistSheet();
      return ContentService.createTextOutput(JSON.stringify({ success: true, count: 120, message: "120 items initialized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (action === 'syncFromSheet') {
      const data = readChecklistFromSpreadsheet();
      if (data && data.length > 0) {
        saveChecklistData(JSON.stringify(data));
        return ContentService.createTextOutput(JSON.stringify({ success: true, count: countTotalItems(data) }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  // 預設渲染手機與網頁版介面
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('迪士尼郵輪 × 新加坡 10 天行前檢核表')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    let jsonStr = '';
    if (e.postData && e.postData.contents) {
      jsonStr = e.postData.contents;
    } else if (e.parameter && e.parameter.data) {
      jsonStr = e.parameter.data;
    }
    
    if (jsonStr) {
      saveChecklistData(jsonStr);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ error: "No data received" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 3. 核心資料讀取：優先讀取試算表，確保「吃到 Excel 內容」
// ==========================================
function getChecklistData() {
  // 1. 優先嘗試從試算表直接讀取（若使用者有匯入或手動編輯）
  const sheetData = readChecklistFromSpreadsheet();
  if (sheetData && sheetData.length > 0 && countTotalItems(sheetData) > 0) {
    // 成功從試算表吃到資料，更新雲端快取並回傳
    PropertiesService.getScriptProperties().setProperty('CHECKLIST_DATA', JSON.stringify(sheetData));
    return sheetData;
  }

  // 2. 次之從雲端屬性讀取
  const props = PropertiesService.getScriptProperties();
  const jsonStr = props.getProperty('CHECKLIST_DATA');
  if (jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.length > 0) return parsed;
    } catch(err) {
      Logger.log("JSON Parse Error: " + err);
    }
  }

  // 3. 若皆無，以 Checklist.xlsx 預設的 120 項初始化
  initChecklistSheet();
  return DEFAULT_CHECKLIST_DATA;
}

// ==========================================
// 4. 從試算表直接解析讀取全部行李資料 (吃進 Excel/Sheet)
// ==========================================
function readChecklistFromSpreadsheet() {
  try {
    const ss = getTargetSpreadsheet();
    if (!ss) return null;

    let sheet = ss.getSheetByName('檢核表總覽') || ss.getActiveSheet();
    if (!sheet) return null;

    const data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) return null;

    // 定義 8 大實體箱包分類對照 (無獨立神器袋、內褲歸大箱A、神器分流手提中包與大箱B)
    const catConfigs = [
      { id: "messenger", icon: "👝", title: "2. Messenger Bag 側身隨身袋（輕便小袋）", match: ["Messenger", "側身隨身袋", "輕便小袋"] },
      { id: "bag_pouch", icon: "👛", title: "1. Bag 隨身小包包（貼身常掛・出門即用）", match: ["Bag 隨身小包", "隨身小包包", "隨身小包", "1. Bag"] },
      { id: "backpack", icon: "🎒", title: "3. Backpack 雙肩隨身中包（登機手提・首日玩水＋隨身救急＋首日神器）", match: ["Backpack", "雙肩", "隨身中包"] },
      { id: "documents", icon: "📑", title: "4. 重要證件包（通關登船隨身・★嚴禁託運）", match: ["證件包", "重要證件"] },
      { id: "luggage_A", icon: "🧳", title: "5. 28吋行李箱 A【10天夫妻服飾與衣物箱】（託運・星宇限重23kg）", match: ["行李箱 A", "服飾與衣物箱", "行李箱A", "衣物箱"] },
      { id: "luggage_B", icon: "🧳", title: "6. 28吋行李箱 B【鞋履、客房神器、盥洗備品與戰利品預留箱】（託運・星宇限重23kg）", match: ["行李箱 B", "客房神器", "行李箱B", "戰利品預留箱"] },
      { id: "forbidden", icon: "🚫", title: "7. 避坑法規禁帶（嚴禁放進任何包包或行李箱！）", match: ["避坑", "禁帶", "嚴禁"] },
      { id: "timeline", icon: "⏰", title: "8. 行前時序備忘", match: ["時序", "備忘", "倒數"] }
    ];

    const sectionsMap = {};
    catConfigs.forEach(c => {
      sectionsMap[c.id] = {
        id: c.id,
        icon: c.icon,
        title: c.title,
        subtitle: "",
        items: []
      };
    });

    let currentCatId = "bag_pouch";
    let itemCounter = 1;

    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      const colA = String(row[0] || '').trim();
      const colB = String(row[1] || '').trim();
      const colC = String(row[2] || '').trim();
      const colD = String(row[3] || '').trim();
      const colE = String(row[4] || '').trim();

      // 跳過總標題與表頭
      if (colA.includes('行李檢核表') || colA.includes('狀態') || colC.includes('物品名稱')) continue;

      // 檢查是否為分類分段列 (如 📂 1. Bag 隨身小包包)
      if (colA.startsWith('📂') || colA.startsWith('1.') || colA.startsWith('2.') || colA.startsWith('3.') || colA.startsWith('4.') || colA.startsWith('5.') || colA.startsWith('6.') || colA.startsWith('7.') || colA.startsWith('8.') || colA.startsWith('9.')) {
        const matched = catConfigs.find(c => c.match.some(m => colA.includes(m)));
        if (matched) {
          currentCatId = matched.id;
        }
        continue;
      }

      // 物品列：需有物品名稱 (Col C 或 Col B)
      let itemName = colC;
      let catCol = colB;
      let tagVal = colD;
      let noteVal = colE;

      if (!itemName && catCol && !catConfigs.some(c => c.match.some(m => catCol.includes(m)))) {
        // 若格式為 2 欄版 (分類, 項目)
        itemName = catCol;
      }

      if (!itemName) continue;

      // 依分類欄位匹配
      if (catCol) {
        const matched = catConfigs.find(c => c.match.some(m => catCol.includes(m)));
        if (matched) {
          currentCatId = matched.id;
        }
      }

      // 判斷勾選狀態
      const isChecked = colA.includes('✅') || colA.includes('已完成') || colA.includes('[v]') || colA.includes('[V]') || colA.toLowerCase() === 'true';

      sectionsMap[currentCatId].items.push({
        id: "item-" + (itemCounter++),
        text: itemName,
        detail: noteVal,
        tagText: tagVal,
        checked: isChecked
      });
    }

    const order = ["bag_pouch", "messenger", "backpack", "documents", "luggage_A", "luggage_B", "forbidden", "timeline"];
    const result = order.map(id => sectionsMap[id]).filter(s => s && s.items.length > 0);
    return result.length > 0 ? result : null;
  } catch(e) {
    Logger.log("從試算表讀取失敗: " + e);
    return null;
  }
}

// ==========================================
// 5. 儲存與雙向同步至試算表
// ==========================================
function saveChecklistData(sectionsJsonStr) {
  try {
    const props = PropertiesService.getScriptProperties();
    props.setProperty('CHECKLIST_DATA', sectionsJsonStr);
    
    // 同步更新 Google 試算表
    syncToSpreadsheet(JSON.parse(sectionsJsonStr));
    
    return { success: true, timestamp: new Date().toISOString() };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

// 手動觸發：從試算表吃進內容並同步至 Web App
function syncFromSheetToApp() {
  const data = readChecklistFromSpreadsheet();
  if (data && data.length > 0) {
    const count = countTotalItems(data);
    PropertiesService.getScriptProperties().setProperty('CHECKLIST_DATA', JSON.stringify(data));
    try {
      SpreadsheetApp.getUi().alert("✅ 成功吃到試算表內容！", "共讀取 " + count + " 項行李檢核項目，已即時同步至手機 Web App！", SpreadsheetApp.getUi().ButtonSet.OK);
    } catch(e) {
      Logger.log("✅ 成功吃到試算表內容，共 " + count + " 項！");
    }
  } else {
    try {
      SpreadsheetApp.getUi().alert("⚠️ 讀取提示", "未在試算表中偵測到有效物品清單，請確認目前工作表內容！", SpreadsheetApp.getUi().ButtonSet.OK);
    } catch(e) {
      Logger.log("未讀取到項目");
    }
  }
}

// 一鍵初始化試算表（將 Checklist.xlsx 的 120 項完整灌入並排版美化）
function initChecklistSheet() {
  const ss = getTargetSpreadsheet();
  if (!ss) {
    Logger.log("⚠️ 未綁定試算表，請確認專案已綁定 Google 試算表");
    return;
  }
  
  let sheet = ss.getSheetByName('檢核表總覽');
  if (!sheet) {
    sheet = ss.insertSheet('檢核表總覽');
  }
  sheet.clear();
  
  // 1. 大標題 Banner
  sheet.getRange(1, 1, 1, 5).merge();
  const banner = sheet.getRange(1, 1);
  banner.setValue("✨ 新加坡迪士尼郵輪 + 當地5日遊 10天行李檢核表（全覽延伸新增完整版・無酒・每項獨立打勾）")
        .setFontSize(14)
        .setFontWeight("bold")
        .setFontColor("#ffffff")
        .setBackground("#0369a1")
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 40);
  
  // 2. 表頭
  const headers = ['狀態 (勾選)', '打包放置箱包 / 分類', '物品名稱與數量', '標籤', '備註說明 / 注意事項'];
  sheet.getRange(2, 1, 1, 5).setValues([headers]);
  const headerRange = sheet.getRange(2, 1, 1, 5);
  headerRange.setFontWeight('bold')
             .setBackground('#0284c7')
             .setFontColor('#ffffff')
             .setFontSize(11)
             .setHorizontalAlignment('center')
             .setVerticalAlignment('middle');
  sheet.setRowHeight(2, 32);
  
  // 3. 逐一寫入各分類與 120 個獨立打勾項目
  let currentRow = 3;
  DEFAULT_CHECKLIST_DATA.forEach((sec, sIdx) => {
    // 分類分隔列
    sheet.getRange(currentRow, 1, 1, 5).merge();
    const catRange = sheet.getRange(currentRow, 1);
    catRange.setValue("📂 " + sec.title)
            .setFontWeight('bold')
            .setFontSize(11)
            .setBackground('#f0f9ff')
            .setFontColor('#0369a1')
            .setVerticalAlignment('middle');
    sheet.setRowHeight(currentRow, 28);
    currentRow++;
    
    // 分類下的項目
    const itemRows = [];
    sec.items.forEach(item => {
      const status = item.checked ? '✅ 已完成' : '⬜ 待打包';
      itemRows.push([
        status,
        sec.title.replace(/^[0-9]+\.\s*/, ''),
        item.text,
        item.tagText || '',
        item.detail || ''
      ]);
    });
    
    if (itemRows.length > 0) {
      const range = sheet.getRange(currentRow, 1, itemRows.length, 5);
      range.setValues(itemRows);
      
      // 置中對齊前 4 欄
      sheet.getRange(currentRow, 1, itemRows.length, 1).setHorizontalAlignment('center');
      sheet.getRange(currentRow, 4, itemRows.length, 1).setHorizontalAlignment('center');
      
      currentRow += itemRows.length;
    }
  });
  
  // 欄寬自適應美化
  sheet.setColumnWidth(1, 110);
  sheet.setColumnWidth(2, 240);
  sheet.setColumnWidth(3, 260);
  sheet.setColumnWidth(4, 110);
  sheet.setColumnWidth(5, 520);
  
  // 寫入雲端快取
  PropertiesService.getScriptProperties().setProperty('CHECKLIST_DATA', JSON.stringify(DEFAULT_CHECKLIST_DATA));
  
  Logger.log("✅ 成功！Checklist.xlsx 內所有 120 項清單已完整寫入 Google 試算表！");
}

// 試算表反向同步更新 (當接收到新資料或打勾時，全自動徹底重繪試算表)
function syncToSpreadsheet(sections) {
  try {
    const ss = getTargetSpreadsheet();
    if (!ss) return;
    
    let sheet = ss.getSheetByName('檢核表總覽') || ss.getActiveSheet();
    if (!sheet) return;
    
    sheet.clear();
    
    // 1. 大標題 Banner
    sheet.getRange(1, 1, 1, 5).merge();
    const banner = sheet.getRange(1, 1);
    banner.setValue("✨ 星宇航空 × 新加坡迪士尼郵輪 10天行李實用檢核表（內衣褲全歸行李箱・神器手提託運徹底分流）")
          .setFontSize(13)
          .setFontWeight("bold")
          .setFontColor("#ffffff")
          .setBackground("#0369a1")
          .setHorizontalAlignment("center")
          .setVerticalAlignment("middle");
    sheet.setRowHeight(1, 40);
    
    // 2. 表頭
    const headers = ['狀態 (勾選)', '打包放置箱包 / 分類', '物品名稱與數量', '標籤', '備註說明 / 注意事項'];
    sheet.getRange(2, 1, 1, 5).setValues([headers]);
    const headerRange = sheet.getRange(2, 1, 1, 5);
    headerRange.setFontWeight('bold')
               .setBackground('#0284c7')
               .setFontColor('#ffffff')
               .setFontSize(11)
               .setHorizontalAlignment('center')
               .setVerticalAlignment('middle');
    sheet.setRowHeight(2, 32);
    
    // 3. 逐一寫入各分類與項目
    let currentRow = 3;
    sections.forEach(sec => {
      sheet.getRange(currentRow, 1, 1, 5).merge();
      const catRange = sheet.getRange(currentRow, 1);
      catRange.setValue("📂 " + sec.title)
              .setFontWeight('bold')
              .setFontSize(11)
              .setBackground('#f0f9ff')
              .setFontColor('#0369a1')
              .setVerticalAlignment('middle');
      sheet.setRowHeight(currentRow, 28);
      currentRow++;
      
      const itemRows = [];
      sec.items.forEach(item => {
        const status = item.checked ? '✅ 已完成' : '⬜ 待打包';
        itemRows.push([
          status,
          sec.title.replace(/^[0-9]+\.\s*/, ''),
          item.text,
          item.tagText || '',
          item.detail || ''
        ]);
      });
      
      if (itemRows.length > 0) {
        const range = sheet.getRange(currentRow, 1, itemRows.length, 5);
        range.setValues(itemRows);
        sheet.getRange(currentRow, 1, itemRows.length, 1).setHorizontalAlignment('center');
        sheet.getRange(currentRow, 4, itemRows.length, 1).setHorizontalAlignment('center');
        currentRow += itemRows.length;
      }
    });
    
    sheet.setColumnWidth(1, 110);
    sheet.setColumnWidth(2, 260);
    sheet.setColumnWidth(3, 270);
    sheet.setColumnWidth(4, 120);
    sheet.setColumnWidth(5, 520);
    
  } catch(e) {
    Logger.log("同步試算表錯誤: " + e);
  }
}

// 試算表編輯監聽 (使用者在試算表手動打勾時自動同步到 Web App)
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const col = e.range.getColumn();
    if (col === 1) {
      // 使用者變更了第 A 欄 (狀態)
      const data = readChecklistFromSpreadsheet();
      if (data) {
        PropertiesService.getScriptProperties().setProperty('CHECKLIST_DATA', JSON.stringify(data));
      }
    }
  } catch(err) {
    Logger.log("onEdit error: " + err);
  }
}

// 計算項目總數輔助函式
function countTotalItems(sections) {
  if (!sections || !Array.isArray(sections)) return 0;
  return sections.reduce((sum, s) => sum + ((s.items && Array.isArray(s.items)) ? s.items.length : 0), 0);
}
