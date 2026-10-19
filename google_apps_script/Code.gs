/**
 * 新加坡迪士尼郵輪 + 當地5日遊 10天行李檢核表
 * Google Apps Script 雲端主控後端 (100% Google 試算表 SSOT 雲端原生 CRUD 版)
 *
 * 📌 核心架構原則：
 * 1. 一切以 Google 試算表 (SPREADSHEET_ID, gid=1069250031「檢核表總覽」) 為唯一真實資料來源 (SSOT)。
 * 2. 嚴格禁止任何本地端快取整批覆蓋試算表 (徹底廢除全表清空覆寫)。
 * 3. 所有網頁端操作（新增、修改、刪除、打勾、清空勾選）皆為針對試算表單列之原子化操作 (Atomic CRUD)，
 *    直接寫入 Google 試算表對應列並回傳試算表最新狀態。
 */

const SPREADSHEET_ID = "1mSLZvnE1YW9qG23owDlmcZtr7EKZgVXuO4sBwIVaqzo";
const TARGET_GID = 1069250031;
const TARGET_SHEET_NAME = "檢核表總覽";

// 8 大標準箱包分類定義
const CAT_CONFIGS = [
  {
    id: "bag_pouch",
    icon: "👛",
    title: "1. Bag 隨身小包包（貼身常掛・出門即用）",
    shortTitle: "Bag 隨身小包包（貼身常掛・出門即用）",
    subtitle: "出門貼身斜背，放隨時要拿的手機、行動電源、交通卡與貼身防護",
    match: ["1. Bag", "Bag 隨身小包", "隨身小包包", "隨身小包"]
  },
  {
    id: "messenger",
    icon: "👝",
    title: "2. Messenger Bag 側身隨身袋（輕便小袋）",
    shortTitle: "Messenger Bag 側身隨身袋（輕便小袋）",
    subtitle: "輕便小袋斜背好拿，放隨身零嘴與隨身護髮用品",
    match: ["2. Messenger", "Messenger", "側身隨身袋", "輕便小袋"]
  },
  {
    id: "backpack",
    icon: "🎒",
    title: "3. Backpack 雙肩隨身中包（登機手提・首日玩水＋隨身救急＋首日神器）",
    shortTitle: "Backpack 雙肩隨身中包（登機手提・首日玩水＋隨身救急＋首日神器）",
    subtitle: "先生背負登機手提（星宇限重7kg）。【已徹底移除內衣褲，全部改放託運大箱】！只放機上保暖、救護包、貴重3C與登船首日手提神器",
    match: ["3. Backpack", "Backpack", "雙肩", "隨身中包"]
  },
  {
    id: "documents",
    icon: "📑",
    title: "4. 重要證件包（通關登船隨身・★嚴禁託運）",
    shortTitle: "重要證件包（通關登船隨身・★嚴禁託運）",
    subtitle: "星宇航空櫃檯、新加坡樟宜海關、濱海灣郵輪中心報到必備，全程手提！",
    match: ["4. 重要證件", "證件包", "重要證件"]
  },
  {
    id: "luggage_A",
    icon: "🧳",
    title: "5. 28吋行李箱 A【10天夫妻服飾與衣物箱】（託運・星宇限重23kg）",
    shortTitle: "28吋行李箱 A【10天夫妻服飾與衣物箱】（託運・星宇限重23kg）",
    subtitle: "夫妻衣物交叉打包（各佔半箱，用壓縮袋分裝，防單箱延誤！）【所有夫妻內衣褲與襪子全部集中在此箱】！熱帶夏裝輕薄，28吋空間充裕！",
    match: ["5. 28吋行李箱 A", "行李箱 A", "服飾與衣物箱", "行李箱A", "衣物箱"]
  },
  {
    id: "luggage_B",
    icon: "🧳",
    title: "6. 28吋行李箱 B【鞋履、客房神器、盥洗備品與戰利品預留箱】（託運・星宇限重23kg）",
    shortTitle: "28吋行李箱 B【鞋履、客房神器、盥洗備品與戰利品預留箱】（託運・星宇限重23kg）",
    subtitle: "【所有進房才用的神器全部直接歸入此箱】！包含磁吸掛鉤、門上布置、鞋款、大瓶液體與化妝大鏡！預留 40% 空間裝戰利品！",
    match: ["6. 28吋行李箱 B", "行李箱 B", "客房神器", "行李箱B", "戰利品預留箱"]
  },
  {
    id: "forbidden",
    icon: "🚫",
    title: "7. 避坑法規禁帶（嚴禁放進任何包包或行李箱！）",
    shortTitle: "避坑法規禁帶（嚴禁放進任何包包或行李箱！）",
    subtitle: "★ 新加坡重罰法規與郵輪嚴格安檢禁帶品，千萬不要帶！",
    match: ["7. 避坑", "避坑", "禁帶", "嚴禁"]
  },
  {
    id: "timeline",
    icon: "⏰",
    title: "8. 行前時序備忘",
    shortTitle: "行前時序備忘",
    subtitle: "倒數關鍵時刻提醒，不慌不忙輕鬆出發",
    match: ["8. 行前", "時序", "備忘", "倒數"]
  }
];

// 使用者於試算表確認之 110 項基準清單 (僅供空白表救援，絕不自動覆寫現有試算表)
const DEFAULT_CHECKLIST_DATA = [
  {
    "id": "bag_pouch",
    "icon": "👛",
    "title": "1. Bag 隨身小包包（貼身常掛・出門即用）",
    "subtitle": "出門貼身斜背，放隨時要拿的手機、行動電源、交通卡與貼身防護",
    "items": [
      {
        "id": "item_1",
        "text": "手機",
        "detail": "已下載 Disney Cruise App 及 Grab 叫車",
        "tagText": "隨身",
        "checked": false
      },
      {
        "id": "item_2",
        "text": "行動電源 (行充)",
        "detail": "★ 民航局規定嚴禁託運，必須隨身攜帶，嚴禁放行李箱",
        "tagText": "隨身登機",
        "checked": false
      },
      {
        "id": "item_3",
        "text": "耳機",
        "detail": "飛機與搭車交通途中使用",
        "tagText": "隨身",
        "checked": false
      },
      {
        "id": "item_4",
        "text": "交通支付錢包 (悠遊卡/感應信用卡/現金)",
        "detail": "Visa/Mastercard 可直接感應搭乘新加坡地鐵 MRT 及公車",
        "tagText": "交通支付",
        "checked": false
      },
      {
        "id": "item_5",
        "text": "家中鑰匙",
        "detail": "返台進門用，妥善收納在隨身包內袋",
        "tagText": "隨身",
        "checked": false
      },
      {
        "id": "item_6",
        "text": "口罩 (黃色 x 2)",
        "detail": "隨身防護備用",
        "tagText": "防護",
        "checked": false
      },
      {
        "id": "item_7",
        "text": "衛生棉 x 4 (夜用)",
        "detail": "隨身貼身防護備用",
        "tagText": "衛生",
        "checked": false
      },
      {
        "id": "item_8",
        "text": "貓咪項鍊",
        "detail": "隨身飾品佩戴",
        "tagText": "飾品",
        "checked": false
      },
      {
        "id": "item_9",
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
    "subtitle": "輕便小袋斜背好拿，放隨身零嘴與隨身護髮用品",
    "items": [
      {
        "id": "item_1",
        "text": "拜拜餅乾",
        "detail": "隨身小袋零嘴保平安，航程點心",
        "tagText": "點心",
        "checked": false
      },
      {
        "id": "item_2",
        "text": "髮帽 x 2 (隨身輕便)",
        "detail": "隨身洗沐護髮與臨時防水使用",
        "tagText": "配件",
        "checked": false
      }
    ]
  },
  {
    "id": "backpack",
    "icon": "🎒",
    "title": "3. Backpack 雙肩隨身中包（登機手提・首日玩水＋隨身救急＋首日神器）",
    "subtitle": "先生背負登機手提（星宇限重7kg）。【已徹底移除內衣褲，全部改放託運大箱】！只放機上保暖、救護包、貴重3C與登船首日手提神器",
    "items": [
      {
        "id": "item_1",
        "text": "厚外套 x 1 (穿著/隨身帶)",
        "detail": "防星宇機艙、新加坡地鐵與郵輪室內強烈冷氣（約20°C）",
        "tagText": "保暖",
        "checked": false
      },
      {
        "id": "item_2",
        "text": "薄長袖外衣長褲 x 1套",
        "detail": "飛機冷氣備用換穿，不含內衣褲",
        "tagText": "備用衣",
        "checked": false
      },
      {
        "id": "item_3",
        "text": "臨時救護包：優碘棉片",
        "detail": "傷口消毒必備，獨立單包裝",
        "tagText": "急救",
        "checked": false
      },
      {
        "id": "item_4",
        "text": "臨時救護包：生理食鹽水棉片",
        "detail": "傷口清潔沖洗，獨立單包裝",
        "tagText": "急救",
        "checked": false
      },
      {
        "id": "item_5",
        "text": "臨時救護包：酒精棉片",
        "detail": "器具與手部消毒清潔",
        "tagText": "急救",
        "checked": false
      },
      {
        "id": "item_6",
        "text": "臨時救護包：OK蹦 (多尺寸)",
        "detail": "防磨腳與小傷口包紮，走路必備",
        "tagText": "急救",
        "checked": false
      },
      {
        "id": "item_7",
        "text": "隱形眼鏡 x 2副",
        "detail": "備用隱眼，隨身攜帶防止行李箱延誤",
        "tagText": "眼部護理",
        "checked": false
      },
      {
        "id": "item_8",
        "text": "生理食鹽水 x 2瓶 (小容量)",
        "detail": "隱形眼鏡沖洗用，每瓶小於100ml裝透明夾鏈袋",
        "tagText": "眼部護理",
        "checked": false
      },
      {
        "id": "item_9",
        "text": "人工淚液 x 1盒 (★ 需避光)",
        "detail": "眼睛乾澀舒緩，請放在包包避光暗袋中",
        "tagText": "眼部護理",
        "checked": false
      },
      {
        "id": "item_10",
        "text": "洗面乳 (旅行小條裝)",
        "detail": "隨身洗臉清爽，小於 100ml",
        "tagText": "洗沐",
        "checked": false
      },
      {
        "id": "item_11",
        "text": "美容紙巾",
        "detail": "洗臉後一次性擦拭，乾淨衛生",
        "tagText": "洗沐",
        "checked": false
      },
      {
        "id": "item_12",
        "text": "保養品旅行組",
        "detail": "化妝水與乳液小樣，小於 100ml",
        "tagText": "保養",
        "checked": false
      },
      {
        "id": "item_13",
        "text": "護髮油 (隨身小瓶)",
        "detail": "吹頭髮護理，小於 100ml",
        "tagText": "護髮",
        "checked": false
      },
      {
        "id": "item_14",
        "text": "3C 充電線組 (手機/手錶/耳機)",
        "detail": "飛機座位與隨時充電用",
        "tagText": "3C",
        "checked": false
      },
      {
        "id": "item_15",
        "text": "衛生棉 x 4 (夜用備份)",
        "detail": "中包包備份",
        "tagText": "衛生",
        "checked": false
      },
      {
        "id": "item_16",
        "text": "衛生棉褲 x 1",
        "detail": "夜間超強防漏備用",
        "tagText": "衛生",
        "checked": false
      },
      {
        "id": "item_17",
        "text": "晴雨折疊兩用傘",
        "detail": "防新加坡午後雷陣雨與熱帶遮陽",
        "tagText": "隨身必備",
        "checked": false
      },
      {
        "id": "item_18",
        "text": "口罩 (黃色 x 2 備用)",
        "detail": "中包包備用",
        "tagText": "防護",
        "checked": false
      },
      {
        "id": "item_19",
        "text": "隨身手拿鏡",
        "detail": "【新增加・隨身手提】車上機上隨時補妝整理儀容",
        "tagText": "隨身鏡",
        "checked": false
      },
      {
        "id": "item_20",
        "text": "筆電 / 平板 iPad (隨身攜帶)",
        "detail": "★ 3C設備嚴禁託運，請放中包隨身帶上飛機",
        "tagText": "貴重3C",
        "checked": false
      },
      {
        "id": "item_21",
        "text": "相機與鏡頭 (隨身攜帶)",
        "detail": "★ 防託運震動損壞，全程手提攜帶",
        "tagText": "貴重3C",
        "checked": false
      },
      {
        "id": "item_22",
        "text": "貴重珠寶與首飾 (隨身攜帶)",
        "detail": "★ 嚴禁放託運箱，全程隨身手提",
        "tagText": "貴重首飾",
        "checked": false
      },
      {
        "id": "item_23",
        "text": "【首日手提神器】掛頸房卡吊牌套 x 2條",
        "detail": "【直接放在手提中包】登船手續領取 Key to the World 房卡後立刻掛在脖子上，全船消費通行必備",
        "tagText": "首日手提神器",
        "checked": false
      },
      {
        "id": "item_24",
        "text": "【首日手提神器】手機防水透明掛袋 x 2個",
        "detail": "【直接放在手提中包】中午一登船房間未開放但頂層泳池已開，隨身掛脖子玩水拍照防浸水",
        "tagText": "首日手提神器",
        "checked": false
      },
      {
        "id": "item_25",
        "text": "【首日手提神器】暈船藥 (搭船前半小時服用)",
        "detail": "【直接放在手提中包】登船前 30~60 分鐘必須先吃第一顆！放行李箱託運會來不及吃",
        "tagText": "首日手提神器",
        "checked": false
      },
      {
        "id": "item_26",
        "text": "【首日手提神器】首日玩水泳裝與泳鏡 (夫妻各1套)",
        "detail": "【直接放在手提中包】放中包可一上船就直奔甲板泳池，免等行李送進房",
        "tagText": "首日手提神器",
        "checked": false
      },
      {
        "id": "item_27",
        "text": "【首日手提神器】穴位防暈船手環 (Sea-Bands)",
        "detail": "【直接放在手提中包】物理穴位防暈，上船前即可佩戴",
        "tagText": "首日手提神器",
        "checked": false
      },
      {
        "id": "item_28",
        "text": "食品級大夾鏈袋 (Ziploc) x 3~5個",
        "detail": "裝首日濕泳衣或過安檢液體透明袋使用",
        "tagText": "收納",
        "checked": false
      }
    ]
  },
  {
    "id": "documents",
    "icon": "📑",
    "title": "4. 重要證件包（通關登船隨身・★嚴禁託運）",
    "subtitle": "星宇航空櫃檯、新加坡樟宜海關、濱海灣郵輪中心報到必備，全程手提！",
    "items": [
      {
        "id": "item_1",
        "text": "護照正本 x 2本 (先生+太太)",
        "detail": "★ 效期自返台日起算需滿 6 個月以上，嚴禁託運",
        "tagText": "絕對必備",
        "checked": false
      },
      {
        "id": "item_2",
        "text": "身分證正本 x 2張",
        "detail": "台灣機場查驗備用",
        "tagText": "備份證件",
        "checked": false
      },
      {
        "id": "item_3",
        "text": "護照影本與手機拍照檔 x 2份",
        "detail": "與正本分開存放，遺失時補辦必備",
        "tagText": "備份",
        "checked": false
      },
      {
        "id": "item_4",
        "text": "機票行程單證明 x 2份 (星宇航空截圖/紙本)",
        "detail": "新加坡海關入境隨時抽查回程機票",
        "tagText": "機票證明",
        "checked": false
      },
      {
        "id": "item_5",
        "text": "迪士尼郵輪登船憑證 (PAT 二維碼截圖/紙本)",
        "detail": "新加坡港口登船報到出示 QR Code 刷碼",
        "tagText": "郵輪憑證",
        "checked": false
      },
      {
        "id": "item_6",
        "text": "新加坡電子入境卡 (SG Arrival Card) x 2人截圖",
        "detail": "抵達前 3 天內上 MyICA 填妥，存下 QR Code",
        "tagText": "入境卡",
        "checked": false
      },
      {
        "id": "item_7",
        "text": "海外旅遊不便險與醫療保單截圖 x 2人",
        "detail": "含郵輪緊急醫療與延誤理賠專線資訊",
        "tagText": "保險證明",
        "checked": false
      },
      {
        "id": "item_8",
        "text": "新幣 (SGD) 現金與美金現金",
        "detail": "新加坡熟食中心 (小販中心) 現金專用，船上小費備用",
        "tagText": "外幣現鈔",
        "checked": false
      },
      {
        "id": "item_9",
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
    "title": "5. 28吋行李箱 A【10天夫妻服飾與衣物箱】（託運・星宇限重23kg）",
    "subtitle": "夫妻衣物交叉打包（各佔半箱，用壓縮袋分裝，防單箱延誤！）【所有夫妻內衣褲與襪子全部集中在此箱】！熱帶夏裝輕薄，28吋空間充裕！",
    "items": [
      {
        "id": "item_1",
        "text": "太太：正式晚宴禮服 / 優雅長洋裝 x 2套",
        "detail": "郵輪皇家晚宴與高檔成人餐廳 (Palo) 著裝規範",
        "tagText": "晚宴正裝",
        "checked": false
      },
      {
        "id": "item_2",
        "text": "太太：渡假休閒洋裝 x 4~5套 (擴充10天)",
        "detail": "新加坡濱海灣、環球影城與郵輪甲板拍照美照穿搭",
        "tagText": "渡假穿搭",
        "checked": false
      },
      {
        "id": "item_3",
        "text": "太太：休閒短袖 / 排汗上衣 x 6件",
        "detail": "新加坡炎熱透氣更換",
        "tagText": "日常衣物",
        "checked": false
      },
      {
        "id": "item_4",
        "text": "太太：短褲 / 涼爽長裙 x 4~5件",
        "detail": "10 天下身搭配",
        "tagText": "日常衣物",
        "checked": false
      },
      {
        "id": "item_5",
        "text": "太太：渡假泳衣 x 2套",
        "detail": "獨立打勾項目，船上多處泳池與滑水道替換",
        "tagText": "泳裝",
        "checked": false
      },
      {
        "id": "item_6",
        "text": "太太：泳帽 x 1頂",
        "detail": "獨立打勾項目，衛生泳池備用",
        "tagText": "泳具",
        "checked": false
      },
      {
        "id": "item_7",
        "text": "太太：泳鏡 x 1副",
        "detail": "獨立打勾項目，防池水與海水刺激",
        "tagText": "泳具",
        "checked": false
      },
      {
        "id": "item_8",
        "text": "太太：比基尼罩衫 / 沙灘防曬披肩 x 1件",
        "detail": "甲板走動與出水防曬",
        "tagText": "防曬",
        "checked": false
      },
      {
        "id": "item_9",
        "text": "太太：免洗內褲 x 10~12件",
        "detail": "【全部放託運行李箱A】穿完即丟免手洗，10天份量充裕省空間",
        "tagText": "貼身衣物",
        "checked": false
      },
      {
        "id": "item_10",
        "text": "太太：日常純棉內褲 x 3~4件",
        "detail": "【全部放託運行李箱A】舒適備用替換",
        "tagText": "貼身衣物",
        "checked": false
      },
      {
        "id": "item_11",
        "text": "太太：貼身無痕內衣 x 5~6件",
        "detail": "【全部放託運行李箱A】搭配各式洋裝與外衣",
        "tagText": "貼身衣物",
        "checked": false
      },
      {
        "id": "item_12",
        "text": "太太：日常襪子 x 8~10雙",
        "detail": "【全部放託運行李箱A】透氣防臭短襪",
        "tagText": "貼身襪子",
        "checked": false
      },
      {
        "id": "item_13",
        "text": "太太：船上冷氣披肩 / 薄罩衫 x 1件",
        "detail": "劇院看百老匯秀防冷氣吹風",
        "tagText": "保暖披肩",
        "checked": false
      },
      {
        "id": "item_14",
        "text": "太太：遮陽草帽 / 遮陽帽 x 1頂",
        "detail": "熱帶烈日防曬",
        "tagText": "遮陽",
        "checked": false
      },
      {
        "id": "item_15",
        "text": "先生：正式長袖襯衫 x 2件",
        "detail": "正裝晚宴穿搭，建議防皺材質",
        "tagText": "先生正裝",
        "checked": false
      },
      {
        "id": "item_16",
        "text": "先生：西裝長褲 x 1~2條",
        "detail": "進入成人高級餐廳禁止短褲牛仔褲",
        "tagText": "先生正裝",
        "checked": false
      },
      {
        "id": "item_17",
        "text": "先生：休閒短袖 / 排汗衫 x 8~10件 (擴充10天)",
        "detail": "新加坡熱帶多汗，每天更換清爽舒適",
        "tagText": "先生衣物",
        "checked": false
      },
      {
        "id": "item_18",
        "text": "先生：休閒短褲 / 運動褲 x 4~5件",
        "detail": "日間活動穿搭",
        "tagText": "先生衣物",
        "checked": false
      },
      {
        "id": "item_19",
        "text": "先生：休閒休閒薄長褲 x 1條",
        "detail": "冷氣房或正式場合備用",
        "tagText": "先生衣物",
        "checked": false
      },
      {
        "id": "item_20",
        "text": "先生：泳褲 x 2條",
        "detail": "獨立打勾項目，更換替換",
        "tagText": "先生泳具",
        "checked": false
      },
      {
        "id": "item_21",
        "text": "先生：泳鏡 x 1副",
        "detail": "獨立打勾項目，先生專用泳鏡",
        "tagText": "先生泳具",
        "checked": false
      },
      {
        "id": "item_22",
        "text": "先生：免洗內褲 x 10~12件",
        "detail": "【全部放託運行李箱A】10 天充足份量穿完即丟",
        "tagText": "先生貼身",
        "checked": false
      },
      {
        "id": "item_23",
        "text": "先生：日常短襪 x 8~10雙",
        "detail": "【全部放託運行李箱A】防臭排汗襪",
        "tagText": "先生襪子",
        "checked": false
      },
      {
        "id": "item_24",
        "text": "先生：正式深色西裝襪 x 2雙",
        "detail": "【全部放託運行李箱A】搭配皮鞋與西褲專用",
        "tagText": "先生正裝",
        "checked": false
      },
      {
        "id": "item_25",
        "text": "先生：抗UV防曬薄外套 x 1件",
        "detail": "新加坡戶外走動防烈日曬傷",
        "tagText": "先生防曬",
        "checked": false
      },
      {
        "id": "item_26",
        "text": "先生：遮陽棒球帽 x 1頂",
        "detail": "戶外遮陽活動",
        "tagText": "先生配件",
        "checked": false
      },
      {
        "id": "item_27",
        "text": "電風扇",
        "detail": "",
        "tagText": "自訂",
        "checked": false
      }
    ]
  },
  {
    "id": "luggage_B",
    "icon": "🧳",
    "title": "6. 28吋行李箱 B【鞋履、客房神器、盥洗備品與戰利品預留箱】（託運・星宇限重23kg）",
    "subtitle": "【所有進房才用的神器全部直接歸入此箱】！包含磁吸掛鉤、門上布置、鞋款、大瓶液體與化妝大鏡！預留 40% 空間裝戰利品！",
    "items": [
      {
        "id": "item_1",
        "text": "強力磁吸掛鉤 x 6~8個",
        "detail": "【直接放在託運箱B】★ 鋼壁神器！沉重金屬物放託運箱，進房後吸在鐵壁上掛包掛外套，釋放地面空間！",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_2",
        "text": "迪士尼郵輪門上的布置 (Stateroom Door Magnets 磁吸門貼)",
        "detail": "【新增加・直接放在託運箱B】★ 迪士尼傳統！全世界客人都會佈置房門，進房後吸在鐵門上，拍照超吸睛又防走錯房間",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_3",
        "text": "甲板躺椅防風大毛巾夾 x 4個",
        "detail": "【直接放在託運箱B】夾浴巾防海風吹跑，遠遠一眼認出躺椅位子",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_4",
        "text": "艙房感應小夜燈 x 1~2個",
        "detail": "【直接放在託運箱B】客艙夜晚全黑，放置洗手間門口起夜不刺眼不跌倒",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_5",
        "text": "郵輪專用延長線 (★ 務必無防突波功能)",
        "detail": "【直接放在託運箱B】★ 郵輪法規嚴禁防突波(Surge Protection)，普通分接延長線安全充多支手機",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_6",
        "text": "折疊大容量水壺 / 保溫杯 x 2個",
        "detail": "【直接放在託運箱B】★ 郵輪 24 小時免費飲料吧裝茶水進房喝超省錢省力",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_7",
        "text": "衣物防皺噴霧 / 免燙除皺噴霧 x 1瓶",
        "detail": "【直接放在託運箱B】★ 郵輪禁帶熨斗！衣服壓皺噴一噴拉平即直，大瓶液體務必託運",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_8",
        "text": "彈力折疊髒衣籃 / 髒衣收納袋",
        "detail": "【直接放在託運箱B】放衣櫃角落收集 10 天髒衣服，房內乾淨不凌亂",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_9",
        "text": "便攜折疊衣架 x 4~6個",
        "detail": "【直接放在託運箱B】艙房衣架數量有限，自備折疊架晾曬泳裝毛巾",
        "tagText": "客房託運神器",
        "checked": false
      },
      {
        "id": "item_10",
        "text": "備用護髮/洗沐髮帽 x 2頂",
        "detail": "【新增加・直接放在託運箱B】客房洗澡梳化更換備用",
        "tagText": "美髮配件",
        "checked": false
      },
      {
        "id": "item_11",
        "text": "化妝檯立式/手拿大鏡 x 1個",
        "detail": "【新增加・直接放在託運箱B】雙人同時梳妝不用搶浴室鏡子，化妝極度方便",
        "tagText": "梳妝鏡",
        "checked": false
      },
      {
        "id": "item_12",
        "text": "太太：正式晚宴跟鞋 / 氣質包鞋 x 1雙",
        "detail": "搭配晚宴禮服專用，用防塵袋包好放箱底",
        "tagText": "鞋履",
        "checked": false
      },
      {
        "id": "item_13",
        "text": "太太：渡假休閒涼鞋 / 好走球鞋 x 1雙",
        "detail": "新加坡走跳與環球影城暴走必備好穿布鞋",
        "tagText": "鞋履",
        "checked": false
      },
      {
        "id": "item_14",
        "text": "太太：室內拖鞋 / 防水沙灘拖鞋 x 1雙",
        "detail": "郵輪房間與甲板泳池防滑穿著",
        "tagText": "鞋履",
        "checked": false
      },
      {
        "id": "item_15",
        "text": "先生：正式皮鞋 x 1雙",
        "detail": "搭配正裝長褲進高檔餐廳，用鞋袋包妥",
        "tagText": "先生鞋履",
        "checked": false
      },
      {
        "id": "item_16",
        "text": "先生：耐走運動鞋 x 1雙 (穿著/裝箱)",
        "detail": "日常陸地觀光暴走必備",
        "tagText": "先生鞋履",
        "checked": false
      },
      {
        "id": "item_17",
        "text": "先生：防滑沙灘拖鞋 x 1雙",
        "detail": "甲板泳池與房內防滑拖鞋",
        "tagText": "先生鞋履",
        "checked": false
      },
      {
        "id": "item_18",
        "text": "先生：電動刮鬍刀 (放託運箱/附保護蓋)",
        "detail": "10 天男士儀容整理",
        "tagText": "個人護理",
        "checked": false
      },
      {
        "id": "item_19",
        "text": "大罐裝臉部與身體高係數防曬乳 (SPF50+)",
        "detail": "赤道紫外線極強烈，大容量超過100ml必須放託運箱",
        "tagText": "防曬大瓶",
        "checked": false
      },
      {
        "id": "item_20",
        "text": "曬後蘆薈舒緩凝膠 x 1罐",
        "detail": "甲板玩水曬傷急救舒緩",
        "tagText": "曬後護理",
        "checked": false
      },
      {
        "id": "item_21",
        "text": "防蚊液 (含派卡瑞丁成分)",
        "detail": "新加坡熱帶防伊蚊叮咬（預防登革熱）",
        "tagText": "防蚊大瓶",
        "checked": false
      },
      {
        "id": "item_22",
        "text": "常備成藥大盒：綜合感冒藥 / 止痛普拿疼",
        "detail": "水土不服發燒止痛急用",
        "tagText": "常備醫藥",
        "checked": false
      },
      {
        "id": "item_23",
        "text": "常備成藥大盒：胃腸止瀉藥 / 胃散",
        "detail": "新加坡美食與郵輪吃到飽腸胃不適急用",
        "tagText": "常備醫藥",
        "checked": false
      },
      {
        "id": "item_24",
        "text": "英規三腳轉接插頭 (Type G) x 2個",
        "detail": "新加坡市區飯店充電必備",
        "tagText": "插座轉換",
        "checked": false
      },
      {
        "id": "item_25",
        "text": "輕量可折疊大旅行袋 / 登機包 x 1個",
        "detail": "回程若戰利品塞不下，展開直接當手提行李登機！",
        "tagText": "戰利品預備",
        "checked": false
      },
      {
        "id": "item_26",
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
    "subtitle": "★ 新加坡重罰法規與郵輪嚴格安檢禁帶品，千萬不要帶！",
    "items": [
      {
        "id": "item_1",
        "text": "【嚴禁攜帶】電子煙與加熱菸 (含煙油/煙彈)",
        "detail": "★ 新加坡全境嚴禁！違者海關查獲罰款高達 10,000 新幣或監禁",
        "tagText": "重罰禁帶",
        "checked": false
      },
      {
        "id": "item_2",
        "text": "【嚴禁攜帶】口香糖",
        "detail": "新加坡禁止進口與販售口香糖，通關嚴禁攜帶",
        "tagText": "海關禁止",
        "checked": false
      },
      {
        "id": "item_3",
        "text": "【嚴禁攜帶】具備「防突波功能」之延長線",
        "detail": "郵輪發電系統與陸地不同，防突波會導致船隻配電箱跳火引發火警，上船安檢必遭沒收！",
        "tagText": "郵輪沒收",
        "checked": false
      },
      {
        "id": "item_4",
        "text": "【嚴禁攜帶】自備吹風機、整髮器、電湯匙、熨斗",
        "detail": "大功率加熱電器嚴禁自備登船！艙房抽屜已有專用吹風機",
        "tagText": "安全扣留",
        "checked": false
      },
      {
        "id": "item_5",
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
    "subtitle": "倒數關鍵時刻提醒，不慌不忙輕鬆出發",
    "items": [
      {
        "id": "item_1",
        "text": "出發前 30 天：搶最早 PAT 登船時段",
        "detail": "線上值機上傳雙人資料與信用卡綁定，搶首批登船時間玩整天",
        "tagText": "T-30 天",
        "checked": false
      },
      {
        "id": "item_2",
        "text": "出發前 3 天：填妥新加坡電子入境卡 x 2人",
        "detail": "登入 MyICA 免費申報並存下 QR Code 截圖",
        "tagText": "T-3 天",
        "checked": false
      },
      {
        "id": "item_3",
        "text": "出發前 1 天：確認憑證截圖，行李箱綁上行李飄帶/吊牌",
        "detail": "28 吋兩咖箱子綁好顯眼標籤，防提領錯拿",
        "tagText": "T-1 天",
        "checked": false
      },
      {
        "id": "item_4",
        "text": "郵輪開船那一刻：手機立即開啟【飛航模式】！",
        "detail": "★ 公海衛星漫遊每分鐘百元天價！開船瞬間立刻開飛航，僅連船上內網 App",
        "tagText": "重大提醒",
        "checked": false
      }
    ]
  }
];

function getTargetSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active && active.getId() === SPREADSHEET_ID) return active;
  } catch (e) {}
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    Logger.log("無法開啟試算表: " + e);
    return null;
  }
}

function getTargetSheet() {
  const ss = getTargetSpreadsheet();
  if (!ss) return null;
  // 1. 優先以 gid=1069250031 精準鎖定工作表
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === TARGET_GID) {
      return sheets[i];
    }
  }
  // 2. 次之以名稱「檢核表總覽」鎖定
  const byName = ss.getSheetByName(TARGET_SHEET_NAME);
  if (byName) return byName;
  return sheets[0] || null;
}

function matchCategoryByString(str) {
  const s = String(str || "").trim();
  if (!s) return null;
  for (let i = 0; i < CAT_CONFIGS.length; i++) {
    const c = CAT_CONFIGS[i];
    if (c.id === s) return c;
    for (let j = 0; j < c.match.length; j++) {
      if (s.indexOf(c.match[j]) !== -1) return c;
    }
  }
  return null;
}

function inferTagType(tagText, noteText, itemName) {
  const combined = (String(tagText || "") + " " + String(noteText || "") + " " + String(itemName || "")).toLowerCase();
  if (combined.indexOf("嚴禁") !== -1 || combined.indexOf("重罰") !== -1 || combined.indexOf("必備") !== -1 || combined.indexOf("重大提醒") !== -1) return "crucial";
  if (combined.indexOf("郵輪") !== -1 || combined.indexOf("登船") !== -1 || combined.indexOf("船上") !== -1) return "cruise";
  if (combined.indexOf("新加坡") !== -1 || combined.indexOf("入境") !== -1 || combined.indexOf("海關") !== -1) return "sg";
  if (combined.indexOf("神器") !== -1 || combined.indexOf("老手") !== -1) return "hack";
  return "pack";
}

// ==========================================
// 1. Google 試算表自訂選單
// ==========================================
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🎒 行李清單小幫手')
      .addItem('🔄 檢查雲端試算表連線狀態', 'syncFromSheetToApp')
      .addToUi();
  } catch (e) {}
}

// ==========================================
// 2. 網頁應用程式入口 (GET / POST API 與 HTML 渲染)
// ==========================================
function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    const action = e.parameter.action;
    if (action === 'getData' || action === 'syncFromSheet') {
      const data = getChecklistData();
      return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('迪士尼郵輪 × 新加坡 10 天行前檢核表')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    let raw = '';
    if (e && e.postData && e.postData.contents) {
      raw = e.postData.contents;
    } else if (e && e.parameter && e.parameter.data) {
      raw = e.parameter.data;
    }

    if (!raw) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "No payload received" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const parsed = JSON.parse(raw);

    // 支援原子化 Cloud Action: { action: 'addItem' | 'updateItem' | 'deleteItem' | 'toggleItem' | 'resetChecks' | 'getData', payload: {...} }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.action) {
      const result = handleCloudAction(parsed.action, parsed.payload || {});
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 若收到舊版整批陣列 (來自未重新整理的舊網頁分頁)，嚴格拒絕整表覆蓋，僅回傳目前雲端試算表最新資料！
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      protectedSSOT: true,
      message: "已攔截舊版整批覆蓋請求，系統以 Google 試算表為唯一主準則",
      data: getChecklistData()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 3. 從試算表即時讀取完整清單 (唯一資料來源 SSOT)
// ==========================================
function getChecklistData() {
  const sheetData = readChecklistFromSpreadsheet();
  if (sheetData && sheetData.length > 0) {
    return sheetData;
  }
  return DEFAULT_CHECKLIST_DATA;
}

function readChecklistFromSpreadsheet() {
  try {
    const sheet = getTargetSheet();
    if (!sheet) return null;

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return null;

    const data = sheet.getRange(1, 1, lastRow, 5).getValues();
    if (!data || data.length < 2) return null;

    const sectionsMap = {};
    const order = [];

    CAT_CONFIGS.forEach(c => {
      sectionsMap[c.id] = {
        id: c.id,
        icon: c.icon,
        title: c.title,
        subtitle: c.subtitle,
        items: []
      };
      order.push(c.id);
    });

    let currentCatId = "bag_pouch";

    for (let r = 0; r < data.length; r++) {
      const row = data[r];
      const colA = String(row[0] || '').trim();
      const colB = String(row[1] || '').trim();
      const colC = String(row[2] || '').trim();
      const colD = String(row[3] || '').trim();
      const colE = String(row[4] || '').trim();

      if (!colA && !colB && !colC && !colD && !colE) continue;

      // 跳過第 1 列總標題與第 2 列表頭
      if (colA.indexOf('行李檢核表') !== -1 || colA.indexOf('實用檢核表') !== -1 || colA.indexOf('狀態') !== -1 || colC.indexOf('物品名稱') !== -1) {
        continue;
      }

      // 檢查是否為分類標題列 (例如 📂 1. Bag 隨身小包包)
      if (colA.indexOf('📂') !== -1 || (/^[1-9]\.\s/.test(colA) && !colC)) {
        const matched = matchCategoryByString(colA);
        if (matched) {
          currentCatId = matched.id;
        } else {
          // 使用者在試算表自訂的新分類列
          const customTitle = colA.replace(/^📂\s*/, '').trim();
          const customId = "custom_" + r;
          if (!sectionsMap[customId]) {
            sectionsMap[customId] = {
              id: customId,
              icon: "📦",
              title: customTitle,
              subtitle: "試算表自訂分類",
              items: []
            };
            order.push(customId);
          }
          currentCatId = customId;
        }
        continue;
      }

      // 物品列
      let itemName = colC;
      let catCol = colB;
      let tagVal = colD;
      let noteVal = colE;

      if (!itemName && catCol && !matchCategoryByString(catCol)) {
        itemName = catCol;
      }
      if (!itemName) continue;

      if (catCol) {
        const matched = matchCategoryByString(catCol);
        if (matched) {
          currentCatId = matched.id;
        }
      }

      const isChecked = (
        colA.indexOf('✅') !== -1 ||
        colA.indexOf('已完成') !== -1 ||
        colA.toLowerCase().indexOf('[v]') !== -1 ||
        colA.toLowerCase() === 'true'
      );

      const sheetRowNumber = r + 1; // 1-indexed Google Sheet row

      if (!sectionsMap[currentCatId]) {
        currentCatId = "bag_pouch";
      }

      sectionsMap[currentCatId].items.push({
        id: "row-" + sheetRowNumber,
        sheetRow: sheetRowNumber,
        text: itemName,
        detail: noteVal,
        tag: inferTagType(tagVal, noteVal, itemName),
        tagText: tagVal,
        warning: (noteVal.indexOf('★') !== -1 || itemName.indexOf('嚴禁') !== -1 || tagVal.indexOf('重罰') !== -1 || tagVal.indexOf('重大提醒') !== -1),
        checked: isChecked
      });
    }

    return order.map(id => sectionsMap[id]).filter(Boolean);
  } catch (e) {
    Logger.log("從試算表讀取失敗: " + e);
    return null;
  }
}

// ==========================================
// 4. 雲端原子化 CRUD 操作 (直接操作 Google 試算表對應列，絕不覆蓋全表)
// ==========================================
function handleCloudAction(action, payloadInput) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (e) {
    return { success: false, error: "雲端同步忙碌中，請稍後再試" };
  }

  try {
    const payload = (typeof payloadInput === 'string') ? JSON.parse(payloadInput) : (payloadInput || {});
    const sheet = getTargetSheet();
    if (!sheet) {
      return { success: false, error: "找不到目標 Google 試算表工作表" };
    }

    if (action === 'getData') {
      return { success: true, data: readChecklistFromSpreadsheet() };
    }

    if (action === 'toggleItem') {
      const targetRow = findItemRowInSheet(sheet, payload.sheetRow, payload.categoryId, payload.text);
      if (targetRow > 0) {
        const statusStr = payload.checked ? '✅ 已完成' : '⬜ 待打包';
        sheet.getRange(targetRow, 1).setValue(statusStr).setHorizontalAlignment('center');
        SpreadsheetApp.flush();
      }
      return { success: true, data: readChecklistFromSpreadsheet() };
    }

    if (action === 'addItem') {
      const catId = payload.categoryId || 'bag_pouch';
      const itemObj = {
        text: String(payload.text || '').trim(),
        tagText: String(payload.tagText || '自訂').trim(),
        detail: String(payload.detail || '').trim(),
        checked: !!payload.checked
      };
      if (!itemObj.text) {
        return { success: false, error: "項目名稱不可為空" };
      }
      insertItemIntoCategoryOnSheet(sheet, catId, itemObj);
      SpreadsheetApp.flush();
      return { success: true, data: readChecklistFromSpreadsheet() };
    }

    if (action === 'updateItem') {
      const oldCatId = payload.oldCategoryId || payload.categoryId || 'bag_pouch';
      const newCatId = payload.newCategoryId || oldCatId;
      const oldText = String(payload.oldText || payload.text || '').trim();
      const newText = String(payload.text || '').trim();
      const tagText = String(payload.tagText || '').trim();
      const detail = String(payload.detail || '').trim();
      const checked = !!payload.checked;

      if (!newText) {
        return { success: false, error: "項目名稱不可為空" };
      }

      const targetRow = findItemRowInSheet(sheet, payload.sheetRow, oldCatId, oldText);
      const catObj = matchCategoryByString(newCatId) || CAT_CONFIGS[0];
      const statusStr = checked ? '✅ 已完成' : '⬜ 待打包';

      if (targetRow > 0) {
        if (oldCatId === newCatId) {
          // 同一分類：直接原地更新該列 5 個儲存格
          const range = sheet.getRange(targetRow, 1, 1, 5);
          range.setValues([[statusStr, catObj.shortTitle, newText, tagText, detail]]);
          sheet.getRange(targetRow, 1).setHorizontalAlignment('center');
          sheet.getRange(targetRow, 4).setHorizontalAlignment('center');
        } else {
          // 跨分類移動：先刪除舊列，再於新分類末尾插入
          sheet.deleteRow(targetRow);
          insertItemIntoCategoryOnSheet(sheet, newCatId, {
            text: newText,
            tagText: tagText,
            detail: detail,
            checked: checked
          });
        }
      } else {
        // 若在試算表未找到舊列，直接新增至目標分類
        insertItemIntoCategoryOnSheet(sheet, newCatId, {
          text: newText,
          tagText: tagText,
          detail: detail,
          checked: checked
        });
      }

      SpreadsheetApp.flush();
      return { success: true, data: readChecklistFromSpreadsheet() };
    }

    if (action === 'deleteItem') {
      const targetRow = findItemRowInSheet(sheet, payload.sheetRow, payload.categoryId, payload.text);
      if (targetRow > 0) {
        sheet.deleteRow(targetRow);
        SpreadsheetApp.flush();
      }
      return { success: true, data: readChecklistFromSpreadsheet() };
    }

    if (action === 'resetChecks') {
      const lastRow = sheet.getLastRow();
      if (lastRow >= 3) {
        const data = sheet.getRange(1, 1, lastRow, 5).getValues();
        for (let r = 2; r < data.length; r++) {
          const colA = String(data[r][0] || '').trim();
          const colC = String(data[r][2] || '').trim();
          if (colA.indexOf('📂') === -1 && colC && colA !== '⬜ 待打包') {
            sheet.getRange(r + 1, 1).setValue('⬜ 待打包');
          }
        }
        SpreadsheetApp.flush();
      }
      return { success: true, data: readChecklistFromSpreadsheet() };
    }

    return { success: false, error: "Unknown action: " + action };
  } catch (err) {
    Logger.log("handleCloudAction error: " + err);
    return { success: false, error: err.toString() };
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// 精準尋找試算表中的目標列號 (1-indexed)，找不到回傳 -1
function findItemRowInSheet(sheet, hintSheetRow, categoryId, itemText) {
  const targetText = String(itemText || '').trim();
  const lastRow = sheet.getLastRow();
  if (lastRow < 3 || !targetText) return -1;

  const data = sheet.getRange(1, 1, lastRow, 5).getValues();

  // 1. 若有提供 sheetRow 且該列物品名稱完全吻合，直接命中 (O(1))
  const rowIdx = Number(hintSheetRow);
  if (rowIdx >= 3 && rowIdx <= lastRow) {
    const row = data[rowIdx - 1];
    const colC = String(row[2] || '').trim();
    const colB = String(row[1] || '').trim();
    if (colC === targetText || (!colC && colB === targetText)) {
      return rowIdx;
    }
  }

  // 2. 掃描試算表：優先比對相同分類下的同名項目
  let currentCatId = "bag_pouch";
  let fallbackRow = -1;

  for (let r = 2; r < data.length; r++) {
    const colA = String(data[r][0] || '').trim();
    const colB = String(data[r][1] || '').trim();
    const colC = String(data[r][2] || '').trim();

    if (colA.indexOf('📂') !== -1) {
      const matched = matchCategoryByString(colA);
      if (matched) currentCatId = matched.id;
      continue;
    }

    if (colB) {
      const matchedB = matchCategoryByString(colB);
      if (matchedB) currentCatId = matchedB.id;
    }

    const name = colC || colB;
    if (name === targetText) {
      if (!categoryId || currentCatId === categoryId) {
        return r + 1;
      }
      if (fallbackRow === -1) {
        fallbackRow = r + 1;
      }
    }
  }

  return fallbackRow;
}

// 在指定分類區塊末尾插入新項目列並設定乾淨格式
function insertItemIntoCategoryOnSheet(sheet, categoryId, itemObj) {
  const catObj = matchCategoryByString(categoryId) || CAT_CONFIGS[0];
  let lastRow = sheet.getLastRow();
  const statusStr = itemObj.checked ? '✅ 已完成' : '⬜ 待打包';

  if (lastRow < 2) {
    lastRow = 2;
  }

  const data = sheet.getRange(1, 1, lastRow, 5).getValues();
  let catHeaderRow = -1;
  let lastItemRowInCat = -1;
  let inTargetCat = false;

  for (let r = 2; r < data.length; r++) {
    const colA = String(data[r][0] || '').trim();
    const colB = String(data[r][1] || '').trim();
    const colC = String(data[r][2] || '').trim();

    if (colA.indexOf('📂') !== -1) {
      const matched = matchCategoryByString(colA);
      if (matched && matched.id === catObj.id) {
        catHeaderRow = r + 1;
        lastItemRowInCat = r + 1;
        inTargetCat = true;
      } else if (inTargetCat) {
        // 遇到下一個分類標題，結束當前分類掃描
        break;
      }
      continue;
    }

    if (inTargetCat && (colC || colB)) {
      lastItemRowInCat = r + 1;
    }
  }

  let insertAfterRow = lastItemRowInCat;

  // 若試算表上還沒有該分類的 📂 標題列，先在適當位置建立分類標題列
  if (catHeaderRow === -1) {
    const appendHeaderRow = sheet.getLastRow() + 1;
    sheet.getRange(appendHeaderRow, 1, 1, 5).merge();
    sheet.getRange(appendHeaderRow, 1)
      .setValue("📂 " + catObj.title)
      .setFontWeight('bold')
      .setFontSize(11)
      .setBackground('#f0f9ff')
      .setFontColor('#0369a1')
      .setHorizontalAlignment('left')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(appendHeaderRow, 28);
    insertAfterRow = appendHeaderRow;
  }

  sheet.insertRowAfter(insertAfterRow);
  const newRowIdx = insertAfterRow + 1;
  const rowRange = sheet.getRange(newRowIdx, 1, 1, 5);

  // 確保若在合併分類列下方插入時解除合併並恢復標準白底樣式
  try { rowRange.breakApart(); } catch (e) {}
  rowRange
    .setValues([[
      statusStr,
      catObj.shortTitle,
      itemObj.text,
      itemObj.tagText || '自訂',
      itemObj.detail || ''
    ]])
    .setBackground('#ffffff')
    .setFontColor('#0f172a')
    .setFontWeight('normal')
    .setFontSize(10)
    .setVerticalAlignment('middle');

  sheet.getRange(newRowIdx, 1).setHorizontalAlignment('center');
  sheet.getRange(newRowIdx, 2).setHorizontalAlignment('left');
  sheet.getRange(newRowIdx, 3).setHorizontalAlignment('left');
  sheet.getRange(newRowIdx, 4).setHorizontalAlignment('center');
  sheet.getRange(newRowIdx, 5).setHorizontalAlignment('left');
  sheet.setRowHeight(newRowIdx, 28);
}

// 相容舊版呼叫介面 (攔截整批覆寫，保護試算表 SSOT)
function saveChecklistData(sectionsJsonStr) {
  return {
    success: true,
    protectedSSOT: true,
    timestamp: new Date().toISOString()
  };
}

function syncFromSheetToApp() {
  const data = readChecklistFromSpreadsheet();
  if (data && data.length > 0) {
    const count = countTotalItems(data);
    try {
      SpreadsheetApp.getUi().alert("✅ 雲端試算表連線正常！", "目前試算表共有 " + count + " 項行李檢核項目，所有網頁將直接讀取此試算表！", SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (e) {}
  }
}

function onEdit(e) {
  // 試算表即為唯一資料庫，使用者於試算表任何新增/修改/刪除/打勾皆即時生效，無需額外快取覆寫
}

function countTotalItems(sections) {
  if (!sections || !Array.isArray(sections)) return 0;
  return sections.reduce((sum, s) => sum + ((s.items && Array.isArray(s.items)) ? s.items.length : 0), 0);
}
