import type { CellObject, SheetData } from "write-excel-file/browser";

import type { FormState } from "./nutrition-data";

type FieldDefinition = {
  section: string;
  key: string;
  label: string;
  value: string;
  unit?: string;
  type?: "数值" | "文本" | "日期" | "时间" | "选项" | "列表" | "文件名";
};

const HEADER_STYLE = {
  backgroundColor: "#123047",
  textColor: "#FFFFFF",
  fontWeight: "bold" as const,
  align: "center" as const,
  alignVertical: "center" as const,
  height: 32,
};

const BODY_STYLE = {
  borderColor: "#DCE5E8",
  borderStyle: "thin" as const,
  alignVertical: "top" as const,
  wrap: true,
};

const headerCell = (value: string): CellObject => ({ value, ...HEADER_STYLE });

const bodyCell = (
  value: string | number | Date,
  options: Partial<CellObject> = {},
): CellObject => ({ value, ...BODY_STYLE, ...options });

function numberOrText(value: string) {
  const normalized = value.trim().replaceAll(",", "");
  if (normalized && /^-?\d+(?:\.\d+)?$/.test(normalized)) {
    return Number(normalized);
  }
  return value.trim();
}

function dateOrText(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return value.trim();

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function profileFields(form: FormState): FieldDefinition[] {
  const { basic, training, nutrition, labs, sleep, files } = form;

  return [
    { section: "基础档案", key: "basic.name", label: "姓名", value: basic.name },
    { section: "基础档案", key: "basic.height", label: "身高", value: basic.height, unit: "cm", type: "数值" },
    { section: "基础档案", key: "basic.weight", label: "当前体重", value: basic.weight, unit: "kg", type: "数值" },
    { section: "基础档案", key: "basic.bodyFat", label: "预估体脂率", value: basic.bodyFat, unit: "%", type: "数值" },

    { section: "训练计划", key: "training.years", label: "训练年限", value: training.years, unit: "年", type: "数值" },
    { section: "训练计划", key: "training.background", label: "训练经历与背景", value: training.background },
    { section: "训练计划", key: "training.weeklyFrequency", label: "每周训练次数", value: training.weeklyFrequency, unit: "次/周", type: "数值" },
    { section: "训练计划", key: "training.sessionDuration", label: "单次训练时长", value: training.sessionDuration, unit: "分钟", type: "数值" },
    { section: "训练计划", key: "training.zone2Duration", label: "Zone 2 时长", value: training.zone2Duration, unit: "分钟", type: "数值" },
    { section: "训练计划", key: "training.rpe", label: "平均训练自觉强度 RPE", value: training.rpe, unit: "/10", type: "数值" },
    { section: "训练计划", key: "training.plan", label: "近期训练计划描述", value: training.plan },
    { section: "训练计划", key: "training.snatch", label: "抓举 1RM", value: training.snatch, unit: "kg", type: "数值" },
    { section: "训练计划", key: "training.cleanJerk", label: "挺举 1RM", value: training.cleanJerk, unit: "kg", type: "数值" },
    { section: "训练计划", key: "training.squat", label: "深蹲 1RM", value: training.squat, unit: "kg", type: "数值" },
    { section: "训练计划", key: "training.deadlift", label: "硬拉 1RM", value: training.deadlift, unit: "kg", type: "数值" },
    { section: "训练计划", key: "files.trainingPlan", label: "训练计划附件", value: files.trainingPlan, type: "文件名" },

    { section: "营养摄入", key: "nutrition.dietStyle", label: "目前的饮食风格", value: nutrition.dietStyle },
    { section: "营养摄入", key: "nutrition.carbs", label: "每日碳水摄入", value: nutrition.carbs, unit: "g/天", type: "数值" },
    { section: "营养摄入", key: "nutrition.protein", label: "每日蛋白质摄入", value: nutrition.protein, unit: "g/天", type: "数值" },
    { section: "营养摄入", key: "nutrition.fat", label: "每日脂肪摄入", value: nutrition.fat, unit: "g/天", type: "数值" },
    { section: "营养摄入", key: "nutrition.breakfast", label: "典型早餐", value: nutrition.breakfast },
    { section: "营养摄入", key: "nutrition.lunch", label: "典型午餐", value: nutrition.lunch },
    { section: "营养摄入", key: "nutrition.dinner", label: "典型晚餐", value: nutrition.dinner },
    { section: "营养摄入", key: "nutrition.snack", label: "典型加餐", value: nutrition.snack },
    { section: "营养摄入", key: "nutrition.specialDiet", label: "特殊饮食需求", value: nutrition.specialDiet },
    { section: "营养摄入", key: "nutrition.water", label: "每日饮水量", value: nutrition.water, unit: "升/天", type: "数值" },
    { section: "营养摄入", key: "nutrition.salt", label: "三餐平均盐分", value: nutrition.salt, type: "选项" },
    { section: "营养摄入", key: "nutrition.dairy", label: "奶制品摄入频率", value: nutrition.dairy, unit: "次/周", type: "数值" },
    { section: "营养摄入", key: "nutrition.nuts", label: "坚果摄入频率", value: nutrition.nuts, unit: "次/周", type: "数值" },
    { section: "营养摄入", key: "nutrition.greens", label: "绿叶菜摄入频率", value: nutrition.greens, unit: "次/周", type: "数值" },
    { section: "营养摄入", key: "nutrition.potatoes", label: "土豆摄入频率", value: nutrition.potatoes, unit: "次/周", type: "数值" },
    { section: "营养摄入", key: "nutrition.mushrooms", label: "菌类摄入频率", value: nutrition.mushrooms, unit: "次/周", type: "数值" },
    { section: "营养摄入", key: "nutrition.coconutWater", label: "椰子水摄入频率", value: nutrition.coconutWater, unit: "次/周", type: "数值" },
    { section: "营养摄入", key: "nutrition.fruit", label: "水果摄入频率", value: nutrition.fruit, unit: "次/周", type: "数值" },
    { section: "营养摄入", key: "nutrition.caffeine", label: "每日咖啡因摄入", value: nutrition.caffeine },
    { section: "营养摄入", key: "nutrition.alcohol", label: "饮酒频率", value: nutrition.alcohol },

    { section: "补剂与检测", key: "labs.reportDate", label: "报告或体检日期", value: labs.reportDate, type: "日期" },
    { section: "补剂与检测", key: "files.labReport", label: "体检或检测报告附件", value: files.labReport, type: "文件名" },
    { section: "补剂与检测", key: "labs.testosterone", label: "睾酮", value: labs.testosterone },
    { section: "补剂与检测", key: "labs.cortisol", label: "皮质醇", value: labs.cortisol },
    { section: "补剂与检测", key: "labs.ferritin", label: "血清铁蛋白", value: labs.ferritin },
    { section: "补剂与检测", key: "labs.vitaminD", label: "维生素 D", value: labs.vitaminD },
    { section: "补剂与检测", key: "labs.hsCrp", label: "hs-CRP", value: labs.hsCrp },
    { section: "补剂与检测", key: "labs.lipids", label: "血脂", value: labs.lipids },

    { section: "睡眠恢复", key: "sleep.regularity", label: "作息规律性", value: sleep.regularity, type: "选项" },
    { section: "睡眠恢复", key: "sleep.bedTime", label: "通常上床时间", value: sleep.bedTime, type: "时间" },
    { section: "睡眠恢复", key: "sleep.wakeTime", label: "通常晨起时间", value: sleep.wakeTime, type: "时间" },
    { section: "睡眠恢复", key: "sleep.sleepLatency", label: "入睡所需时长", value: sleep.sleepLatency, unit: "分钟", type: "数值" },
    { section: "睡眠恢复", key: "sleep.nightWakeups", label: "每晚醒来次数", value: sleep.nightWakeups, unit: "次", type: "数值" },
    { section: "睡眠恢复", key: "sleep.fatigue", label: "醒后困倦程度", value: sleep.fatigue, unit: "/10", type: "数值" },
    { section: "睡眠恢复", key: "sleep.rhr", label: "平均静息心率 RHR", value: sleep.rhr, unit: "bpm", type: "数值" },
    { section: "睡眠恢复", key: "sleep.rhrPeriod", label: "RHR 统计周期", value: sleep.rhrPeriod },
    { section: "睡眠恢复", key: "sleep.hrv", label: "平均 HRV", value: sleep.hrv, unit: "ms", type: "数值" },
    { section: "睡眠恢复", key: "sleep.hrvPeriod", label: "HRV 统计周期", value: sleep.hrvPeriod },
    { section: "睡眠恢复", key: "files.hrvImage", label: "HRV 截图附件", value: files.hrvImage, type: "文件名" },
    { section: "睡眠恢复", key: "sleep.notes", label: "睡眠或恢复情况补充", value: sleep.notes },

    { section: "改进目标", key: "goals", label: "核心改进方向", value: form.goals.join("；"), type: "列表" },
    { section: "改进目标", key: "otherGoal", label: "其他目标、身体问题或近期比赛安排", value: form.otherGoal },
  ];
}

export function buildNutritionWorkbook(form: FormState) {
  const fields = profileFields(form);
  const profileData: SheetData = [
    ["序号", "模块", "字段标识", "项目", "填写值", "单位", "数据类型", "填写状态"].map(headerCell),
    ...fields.map((field, index) => {
      const value =
        field.type === "数值"
          ? numberOrText(field.value)
          : field.type === "日期"
            ? dateOrText(field.value)
            : field.value.trim();
      const isFilled = field.value.trim().length > 0;

      return [
        bodyCell(index + 1, { align: "center" }),
        bodyCell(field.section),
        bodyCell(field.key, { fontFamily: "Arial" }),
        bodyCell(field.label),
        bodyCell(value, field.type === "日期" && value instanceof Date ? { format: "yyyy-mm-dd" } : {}),
        bodyCell(field.unit ?? ""),
        bodyCell(field.type ?? "文本", { align: "center" }),
        bodyCell(isFilled ? "已填写" : "未填写", {
          align: "center",
          textColor: isFilled ? "#0F766E" : "#7B8C96",
          backgroundColor: isFilled ? "#E7F5F3" : "#F4F7F8",
        }),
      ];
    }),
  ];

  const supplements = form.supplements.filter((supplement) =>
    [
      supplement.name,
      supplement.brand,
      supplement.dose,
      supplement.frequency,
      supplement.timing,
      supplement.labelFile,
    ].some((value) => value.trim()),
  );

  const supplementData: SheetData = [
    ["序号", "记录标识", "补剂名称", "品牌", "单次剂量", "服用频率", "服用时间", "配料表文件名"].map(headerCell),
    ...supplements.map((supplement, index) => [
      bodyCell(index + 1, { align: "center" }),
      bodyCell(`supplements.${supplement.id}`, { fontFamily: "Arial" }),
      bodyCell(supplement.name.trim()),
      bodyCell(supplement.brand.trim()),
      bodyCell(supplement.dose.trim()),
      bodyCell(supplement.frequency.trim()),
      bodyCell(supplement.timing.trim()),
      bodyCell(supplement.labelFile.trim()),
    ]),
  ];

  return [
    {
      data: profileData,
      sheet: "档案数据",
      columns: [
        { width: 7 },
        { width: 16 },
        { width: 27 },
        { width: 26 },
        { width: 46 },
        { width: 12 },
        { width: 12 },
        { width: 14 },
      ],
      stickyRowsCount: 1,
      showGridLines: false,
      zoomScale: 0.9,
    },
    {
      data: supplementData,
      sheet: "补剂清单",
      columns: [
        { width: 7 },
        { width: 22 },
        { width: 22 },
        { width: 20 },
        { width: 18 },
        { width: 18 },
        { width: 28 },
        { width: 34 },
      ],
      stickyRowsCount: 1,
      showGridLines: false,
      zoomScale: 0.9,
    },
  ];
}

function localDateStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function safeFileNamePart(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "_");
}

export async function downloadNutritionWorkbook(form: FormState) {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const personName = safeFileNamePart(form.basic.name) || "未命名用户";
  const fileName = `运动营养档案_${personName}_${localDateStamp()}.xlsx`;

  await writeXlsxFile(buildNutritionWorkbook(form), {
    fontFamily: "Microsoft YaHei",
    fontSize: 11,
  }).toFile(fileName);

  return fileName;
}
