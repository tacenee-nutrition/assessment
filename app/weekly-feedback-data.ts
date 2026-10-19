export type FeedbackQuestionKind =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "range"
  | "choice"
  | "multi";

export type FeedbackQuestion = {
  key: string;
  label: string;
  kind: FeedbackQuestionKind;
  hint?: string;
  placeholder?: string;
  unit?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  lowLabel?: string;
  highLabel?: string;
  options?: string[];
};

export type FeedbackStep = {
  title: string;
  fields: FeedbackQuestion[];
};

export type WeeklyFeedbackAnswers = Record<string, string>;

export const WEEKLY_FEEDBACK_STEPS: FeedbackStep[] = [
  {
    title: "基本信息",
    fields: [
      {
        key: "athleteName",
        label: "姓名",
        kind: "text",
        placeholder: "请输入姓名",
        required: true,
      },
      {
        key: "weekStart",
        label: "开始日期",
        kind: "date",
        required: true,
      },
      {
        key: "weekEnd",
        label: "结束日期",
        kind: "date",
        required: true,
      },
      {
        key: "specialCircumstances",
        label: "本周是否有比赛、测试、旅行、生病或其他特殊情况？",
        kind: "textarea",
        placeholder: "没有请填写“无”",
        hint: "请注明日期及可能影响训练、饮食或恢复的情况。",
      },
    ],
  },
  {
    title: "身体数据",
    fields: [
      {
        key: "dailyWeights",
        label: "晨起体重：本周每日数据",
        kind: "textarea",
        placeholder: "例如：周一 70.2 kg；周二 70.0 kg；……",
        hint: "尽量在起床排尿后、进食前，以相似条件测量。可直接粘贴 App 记录。",
      },
      {
        key: "currentAverageWeight",
        label: "本周平均体重",
        kind: "number",
        unit: "kg",
        placeholder: "可留空",
        step: 0.1,
      },
      {
        key: "waist",
        label: "腰围",
        kind: "number",
        unit: "cm",
        placeholder: "可留空",
        step: 0.1,
      },
      {
        key: "armCircumference",
        label: "臂围",
        kind: "number",
        unit: "cm",
        placeholder: "可留空",
        step: 0.1,
      },
      {
        key: "hipCircumference",
        label: "臀围",
        kind: "number",
        unit: "cm",
        placeholder: "可留空",
        step: 0.1,
      },
      {
        key: "chestCircumference",
        label: "胸围",
        kind: "number",
        unit: "cm",
        placeholder: "可留空",
        step: 0.1,
      },
    ],
  },
  {
    title: "训练情况",
    fields: [
      {
        key: "plannedSessions",
        label: "本周计划训练次数",
        kind: "number",
        unit: "次",
        min: 0,
        step: 1,
      },
      {
        key: "completedSessions",
        label: "本周实际完成次数",
        kind: "number",
        unit: "次",
        min: 0,
        step: 1,
      },
      {
        key: "trainingChanges",
        label: "本周每次训练时长与训练内容是否有变化？",
        kind: "textarea",
        placeholder: "标出举重、体操、WOD、有氧或额外训练的变化",
      },
      {
        key: "weeklyRpe",
        label: "本周整体训练负荷 RPE",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "很轻松",
        highLabel: "极限",
        hint: "按整周整体感受评分，不与单次 WOD 的 RPE 混用。",
      },
      {
        key: "keyPerformance",
        label: "关键训练表现：哪些变好、稳定或下降？",
        kind: "textarea",
        placeholder: "可填写 WOD、配速、重量、回合数，或训练日志中的变化",
      },
      {
        key: "performanceDeclineStage",
        label: "表现下降主要发生在什么阶段？",
        kind: "multi",
        options: [
          "热身",
          "开始阶段",
          "中后段",
          "后段",
          "重复冲刺",
          "力量课",
        ],
      },
      {
        key: "missedTraining",
        label: "是否缺课、额外训练、疼痛或无法完成计划？原因是什么？",
        kind: "textarea",
        placeholder: "可写无，或说明时间安排、疲劳、疼痛、疾病等原因",
      },
    ],
  },
  {
    title: "营养摄入",
    fields: [
      {
        key: "nutritionAdherence",
        label: "本周饮食计划执行难度",
        kind: "choice",
        options: ["轻松", "适中", "有挑战", "困难", "接近极限"],
      },
      {
        key: "totalCalories",
        label: "本周总热量",
        kind: "number",
        unit: "kcal",
        min: 0,
        step: 1,
      },
      {
        key: "totalProtein",
        label: "本周蛋白质总量",
        kind: "number",
        unit: "g",
        min: 0,
        step: 1,
      },
      {
        key: "totalCarbohydrate",
        label: "本周碳水总量",
        kind: "number",
        unit: "g",
        min: 0,
        step: 1,
      },
      {
        key: "totalFat",
        label: "本周脂肪总量",
        kind: "number",
        unit: "g",
        min: 0,
        step: 1,
      },
      {
        key: "unrecordedIntake",
        label: "是否有未记录的外食、零食、饮料、酒精或烹调油？",
        kind: "textarea",
        placeholder: "描述大致频率和情况，不必精确估算",
        hint: "若没有，请填写“无”。",
      },
      {
        key: "appetiteChanges",
        label: "本周是否有明显饥饿、暴食冲动、过饱或食欲下降？",
        kind: "multi",
        options: ["明显饥饿", "暴食冲动", "过饱", "食欲下降", "无明显变化"],
        hint: "可多选，并在下方说明 0–10 分、发生时段或主要诱因。",
      },
      {
        key: "appetiteDetails",
        label: "食欲变化的程度、发生时段或诱因",
        kind: "textarea",
        placeholder: "如没有明显变化可留空",
      },
    ],
  },
  {
    title: "水分与肠胃",
    fields: [
      {
        key: "dailyWater",
        label: "普通日大致饮水量",
        kind: "number",
        unit: "L/天",
        min: 0,
        step: 0.1,
      },
      {
        key: "trainingWater",
        label: "训练中大致饮水量",
        kind: "text",
        placeholder: "可写毫升数，并注明训练时长或天气",
      },
      {
        key: "giSymptoms",
        label: "本周是否出现胃肠道不适？",
        kind: "multi",
        options: ["腹胀", "恶心", "反酸", "腹泻", "便秘", "训练中不适", "无"],
        hint: "可多选；若无不适请选择“无”。",
      },
      {
        key: "giDetails",
        label: "胃肠道不适发生时间、相关食物或补剂、严重程度与持续时间",
        kind: "textarea",
        placeholder: "如没有不适可留空",
      },
      {
        key: "sweatChanges",
        label: "出汗、训练前后体重或盐渍衣物是否有明显变化？",
        kind: "textarea",
        placeholder: "如做过汗率测试，可记录结果；没有可填写“无”",
        hint: "不要只凭汗渍直接推断钠需求。",
      },
    ],
  },
  {
    title: "睡眠与恢复",
    fields: [
      {
        key: "averageSleep",
        label: "平均睡眠时长",
        kind: "number",
        unit: "小时/晚",
        min: 0,
        max: 24,
        step: 0.1,
      },
      {
        key: "sleepLatency",
        label: "入睡大约需要多久？",
        kind: "number",
        unit: "分钟",
        min: 0,
        step: 1,
      },
      {
        key: "sleepQuality",
        label: "睡眠质量评分",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "极差",
        highLabel: "很好",
      },
      {
        key: "nightWakeups",
        label: "夜间醒来情况",
        kind: "text",
        placeholder: "例如每晚约 1 次，或通常不醒",
      },
      {
        key: "morningEnergy",
        label: "晨起精神评分",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "很困倦",
        highLabel: "精神很好",
      },
      {
        key: "daytimeSleepiness",
        label: "日间困倦程度",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "不困",
        highLabel: "非常困",
      },
      {
        key: "muscleSoreness",
        label: "肌肉酸痛程度",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "无或极轻",
        highLabel: "极重",
      },
      {
        key: "overallFatigue",
        label: "整体疲劳程度",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "无或极轻",
        highLabel: "极重",
      },
      {
        key: "recoveryFeeling",
        label: "恢复感",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "恢复很差",
        highLabel: "恢复很好",
      },
      {
        key: "hrvRhr",
        label: "静息心率 / HRV（如有）及相对个人基线的变化",
        kind: "textarea",
        placeholder: "注明设备、测量条件和相对平时的变化",
        hint: "尽量使用同一设备和测量条件，不单凭单次数据下结论。",
      },
    ],
  },
  {
    title: "健康状况",
    fields: [
      {
        key: "healthChanges",
        label: "本周是否生病、受伤、出现异常疼痛或影响训练的症状？",
        kind: "textarea",
        placeholder: "说明开始时间、严重程度，以及是否影响日常活动；没有请填写“无”",
      },
      {
        key: "redFlagSymptoms",
        label: "是否出现头晕、晕厥、胸痛、异常心悸或明显呼吸困难等警讯？",
        kind: "choice",
        options: ["没有", "有", "不确定"],
        hint: "严重或急性症状应及时就医，不要等候每周反馈回复。",
      },
      {
        key: "hormonalMoodChanges",
        label: "月经周期变化、性欲、情绪或持续疲劳等变化",
        kind: "textarea",
        placeholder: "仅在适用且愿意分享时填写",
        hint: "持续异常建议寻求临床评估。",
      },
      {
        key: "redFlagDetails",
        label: "如有或不确定，请简要说明",
        kind: "textarea",
        placeholder: "请注明发生时间和当前情况；急性严重症状请优先就医",
      },
    ],
  },
  {
    title: "下周安排",
    fields: [
      {
        key: "nextWeekTraining",
        label: "下周训练计划是否变化？",
        kind: "textarea",
        placeholder: "写明重点训练日、双练、长课、休息日或恢复日",
      },
      {
        key: "nextWeekEvents",
        label: "下周比赛、测试、旅行、聚餐或作息变化？",
        kind: "textarea",
        placeholder: "请注明日期和可能影响",
      },
      {
        key: "coachQuestion",
        label: "你最希望营养师帮助解决的一个问题是什么？",
        kind: "textarea",
        placeholder: "请写下当前最重要的问题",
      },
      {
        key: "otherImportantInfo",
        label: "还有什么重要但前面没问到的情况？",
        kind: "textarea",
        placeholder: "选填",
      },
    ],
  },
];
