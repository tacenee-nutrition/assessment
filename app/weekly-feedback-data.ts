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
  kicker: string;
  title: string;
  description: string;
  fields: FeedbackQuestion[];
};

export type WeeklyFeedbackAnswers = Record<string, string>;

export const WEEKLY_FEEDBACK_STEPS: FeedbackStep[] = [
  {
    kicker: "基本信息",
    title: "先确认反馈周期",
    description:
      "建议每周固定同一时间填写，约需 5–8 分钟。尽量依据记录填写；不知道可写“不确定”，不用猜测。",
    fields: [
      {
        key: "athleteName",
        label: "姓名",
        kind: "text",
        placeholder: "请输入姓名",
        required: true,
      },
      {
        key: "clientId",
        label: "客户编号",
        kind: "text",
        placeholder: "如有，请填写",
      },
      {
        key: "weekStart",
        label: "反馈周期开始日期（周一）",
        kind: "date",
        required: true,
      },
      {
        key: "weekEnd",
        label: "反馈周期结束日期（周日）",
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
    kicker: "身体数据",
    title: "回顾本周身体数据",
    description:
      "关注一周趋势，不要只根据单日体重变化判断。所有数据均可留空。",
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
        label: "本周平均体重（如已计算）",
        kind: "number",
        unit: "kg",
        placeholder: "如未计算可留空",
        step: 0.1,
      },
      {
        key: "previousAverageWeight",
        label: "上周平均体重（如已计算）",
        kind: "number",
        unit: "kg",
        placeholder: "用于比较趋势",
        step: 0.1,
      },
      {
        key: "waist",
        label: "腰围（如本阶段需要，每周一次）",
        kind: "number",
        unit: "cm",
        placeholder: "可留空",
        step: 0.1,
        hint: "固定测量位置和条件；不要求每位运动员每周测量。",
      },
    ],
  },
  {
    kicker: "训练负荷与表现",
    title: "训练计划完成得如何",
    description:
      "请尽量记录实际训练内容和关键表现变化。整体训练 RPE 的评分方向为 1 很轻松、10 极限。",
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
          "重复冲刺",
          "力量课",
          "不适用",
        ],
        hint: "可多选；没有表现下降或不适用时请选择“不适用”。",
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
    kicker: "营养执行",
    title: "还原本周的饮食情况",
    description:
      "如有饮食记录可参考 App 周平均；没有记录也可以描述实际情况。执行度低时，先记录遇到的障碍。",
    fields: [
      {
        key: "nutritionAdherence",
        label: "本周饮食计划执行度",
        kind: "range",
        min: 0,
        max: 100,
        step: 5,
        unit: "%",
        lowLabel: "几乎没有按计划",
        highLabel: "基本都按计划",
        hint: "按整体执行情况估算，无需追求完美。",
      },
      {
        key: "averageCalories",
        label: "本周平均热量（如有记录）",
        kind: "number",
        unit: "kcal/天",
        min: 0,
        step: 1,
      },
      {
        key: "averageProtein",
        label: "本周平均蛋白质（如有记录）",
        kind: "number",
        unit: "g/天",
        min: 0,
        step: 1,
      },
      {
        key: "averageCarbohydrate",
        label: "本周平均碳水（如有记录）",
        kind: "number",
        unit: "g/天",
        min: 0,
        step: 1,
      },
      {
        key: "averageFat",
        label: "本周平均脂肪（如有记录）",
        kind: "number",
        unit: "g/天",
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
        key: "proteinTarget",
        label: "蛋白质目标是否完成？",
        kind: "choice",
        options: ["完成", "部分完成", "未完成", "不确定"],
      },
      {
        key: "hardestProteinMeal",
        label: "最难完成蛋白质目标的是哪一餐？原因是什么？",
        kind: "textarea",
        placeholder: "如未达标，请说明原因",
      },
      {
        key: "preTrainingMeal",
        label: "关键训练前 1–4 小时吃了什么、何时吃？",
        kind: "textarea",
        placeholder: "请尽量写出食物和大致时间",
        hint: "重点记录关键训练日；若训练时间有变化也请说明。",
      },
      {
        key: "duringTrainingFuel",
        label: "训练中碳水、饮水和电解质：使用量与耐受如何？",
        kind: "textarea",
        placeholder: "例如碳水克数、饮水毫升数、钠含量；没有使用也请填写“无”",
      },
      {
        key: "postTrainingMeal",
        label: "训练后多久进食？吃了什么？",
        kind: "textarea",
        placeholder: "尤其是当天还有第二次训练时，请注明进食间隔",
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
    kicker: "水分与胃肠道",
    title: "检查补水和肠胃耐受",
    description:
      "普通日与长时间或高温训练日分开描述，会更容易看出变化。",
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
    kicker: "睡眠与恢复",
    title: "看看身体如何恢复",
    description:
      "尽量填写一周平均，并与自己的日常基线比较。设备数据不需要追求绝对准确。",
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
    kicker: "健康与风险",
    title: "记录健康状态和需要关注的情况",
    description:
      "如有严重或急性的警讯，请及时寻求医疗帮助，不要等待营养师查看每周反馈。",
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
        key: "redFlagDetails",
        label: "如有或不确定，请简要说明",
        kind: "textarea",
        placeholder: "请注明发生时间和当前情况；急性严重症状请优先就医",
      },
      {
        key: "hormonalMoodChanges",
        label: "可选：月经周期变化、性欲、情绪或持续疲劳等变化",
        kind: "textarea",
        placeholder: "仅在适用且愿意分享时填写",
        hint: "持续异常建议寻求临床评估。",
      },
    ],
  },
  {
    kicker: "生活与执行障碍",
    title: "找出本周最难执行的部分",
    description:
      "工作、学习、压力和生活安排都会影响计划执行。描述障碍有助于找到现实可行的调整。",
    fields: [
      {
        key: "stress",
        label: "本周压力评分",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "很低",
        highLabel: "极高",
      },
      {
        key: "lifeImpact",
        label: "工作、学习或旅行对饮食和训练的影响",
        kind: "textarea",
        placeholder: "可描述时间、环境或日程变化",
      },
      {
        key: "hardestTask",
        label: "本周最难执行的一件事是什么？",
        kind: "textarea",
        placeholder: "例如备餐、预算、外食、食欲或训练时间",
      },
      {
        key: "sustainability",
        label: "本周饮食方案的可持续性评分",
        kind: "range",
        min: 1,
        max: 10,
        lowLabel: "很难持续",
        highLabel: "很容易持续",
      },
      {
        key: "sustainabilityChanges",
        label: "你希望饮食方案改变什么？",
        kind: "textarea",
        placeholder: "可以是餐次、食物选择、备餐方式或外食安排",
      },
    ],
  },
  {
    kicker: "下周计划",
    title: "为下周做好准备",
    description:
      "说明训练与生活安排的变化，也可以告诉营养师你最希望先解决的问题。",
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
