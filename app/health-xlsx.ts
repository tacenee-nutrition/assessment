import type { CellObject, SheetData } from "write-excel-file/browser";

import type { HealthFormState } from "./health-data";

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
  return normalized && /^-?\d+(?:\.\d+)?$/.test(normalized)
    ? Number(normalized)
    : value.trim();
}

function dateOrText(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : value.trim();
}

function profileFields(form: HealthFormState): FieldDefinition[] {
  const { basic, activity, nutrition, health, sleep, goal, files } = form;

  return [
    { section: "基础档案", key: "basic.name", label: "姓名", value: basic.name },
    { section: "基础档案", key: "basic.age", label: "年龄", value: basic.age, unit: "岁", type: "数值" },
    { section: "基础档案", key: "basic.sex", label: "生理性别", value: basic.sex, type: "选项" },
    { section: "基础档案", key: "basic.height", label: "身高", value: basic.height, unit: "cm", type: "数值" },
    { section: "基础档案", key: "basic.weight", label: "当前体重", value: basic.weight, unit: "kg", type: "数值" },
    { section: "基础档案", key: "basic.waist", label: "腰围", value: basic.waist, unit: "cm", type: "数值" },
    { section: "基础档案", key: "basic.bodyFat", label: "预估体脂率", value: basic.bodyFat, unit: "%", type: "数值" },
    { section: "基础档案", key: "basic.weightTrend", label: "近三个月体重趋势", value: basic.weightTrend, type: "选项" },
    { section: "基础档案", key: "basic.weightChange", label: "近三个月体重变化量", value: basic.weightChange, unit: "kg", type: "数值" },
    { section: "基础档案", key: "basic.targetWeight", label: "目标体重", value: basic.targetWeight, unit: "kg", type: "数值" },

    { section: "日常活动", key: "activity.workPattern", label: "日常工作状态", value: activity.workPattern, type: "选项" },
    { section: "日常活动", key: "activity.sittingHours", label: "每日久坐时长", value: activity.sittingHours, unit: "小时", type: "数值" },
    { section: "日常活动", key: "activity.weeklyFrequency", label: "每周运动频率", value: activity.weeklyFrequency, type: "选项" },
    { section: "日常活动", key: "activity.types", label: "运动类型", value: activity.types.join("；"), type: "列表" },
    { section: "日常活动", key: "activity.duration", label: "单次运动时长", value: activity.duration, unit: "分钟", type: "数值" },
    { section: "日常活动", key: "activity.intensity", label: "运动强度", value: activity.intensity, type: "选项" },
    { section: "日常活动", key: "activity.steps", label: "日均步数", value: activity.steps, unit: "步", type: "数值" },

    { section: "饮食习惯", key: "nutrition.mealRegularity", label: "三餐规律性", value: nutrition.mealRegularity, type: "选项" },
    { section: "饮食习惯", key: "nutrition.breakfast", label: "典型早餐", value: nutrition.breakfast },
    { section: "饮食习惯", key: "nutrition.lunch", label: "典型午餐", value: nutrition.lunch },
    { section: "饮食习惯", key: "nutrition.dinner", label: "典型晚餐", value: nutrition.dinner },
    { section: "饮食习惯", key: "nutrition.snack", label: "加餐或夜宵", value: nutrition.snack },
    { section: "饮食习惯", key: "nutrition.water", label: "每日饮水量", value: nutrition.water, unit: "升", type: "数值" },
    { section: "饮食习惯", key: "nutrition.eatingOut", label: "每周外食或外卖频率", value: nutrition.eatingOut, type: "选项" },
    { section: "饮食习惯", key: "nutrition.sugaryDrinks", label: "含糖饮料频率", value: nutrition.sugaryDrinks, type: "选项" },
    { section: "饮食习惯", key: "nutrition.sweets", label: "零食甜食频率", value: nutrition.sweets, type: "选项" },
    { section: "饮食习惯", key: "nutrition.lateNight", label: "夜宵频率", value: nutrition.lateNight, type: "选项" },
    { section: "饮食习惯", key: "nutrition.cooking", label: "主要用餐来源", value: nutrition.cooking, type: "选项" },
    { section: "饮食习惯", key: "nutrition.preferences", label: "饮食偏好与忌口", value: nutrition.preferences },

    { section: "健康状况", key: "health.conditions", label: "已知健康问题", value: health.conditions.join("；"), type: "列表" },
    { section: "健康状况", key: "health.medicationStatus", label: "是否长期服药", value: health.medicationStatus, type: "选项" },
    { section: "健康状况", key: "health.medications", label: "药物名称与频率", value: health.medications },
    { section: "健康状况", key: "health.supplementStatus", label: "是否使用营养补剂", value: health.supplementStatus, type: "选项" },
    { section: "健康状况", key: "health.supplements", label: "补剂名称、剂量与频率", value: health.supplements },
    { section: "健康状况", key: "health.allergies", label: "食物过敏或不耐受", value: health.allergies },
    { section: "健康状况", key: "health.digestion", label: "近期消化情况", value: health.digestion.join("；"), type: "列表" },
    { section: "健康状况", key: "health.smoking", label: "吸烟情况", value: health.smoking, type: "选项" },
    { section: "健康状况", key: "health.alcohol", label: "饮酒频率", value: health.alcohol },
    { section: "健康状况", key: "health.lifeStage", label: "特殊生理阶段", value: health.lifeStage, type: "选项" },
    { section: "健康状况", key: "health.menstrualRegularity", label: "月经规律性", value: health.menstrualRegularity, type: "选项" },
    { section: "健康状况", key: "health.reportDate", label: "最近体检日期", value: health.reportDate, type: "日期" },
    { section: "健康状况", key: "files.labReport", label: "体检报告附件", value: files.labReport, type: "文件名" },

    { section: "睡眠与压力", key: "sleep.bedTime", label: "通常上床时间", value: sleep.bedTime, type: "时间" },
    { section: "睡眠与压力", key: "sleep.wakeTime", label: "通常起床时间", value: sleep.wakeTime, type: "时间" },
    { section: "睡眠与压力", key: "sleep.quality", label: "睡眠质量", value: sleep.quality, type: "选项" },
    { section: "睡眠与压力", key: "sleep.stress", label: "当前压力程度", value: sleep.stress, unit: "/10", type: "数值" },
    { section: "睡眠与压力", key: "sleep.fatigue", label: "白天疲劳程度", value: sleep.fatigue, unit: "/10", type: "数值" },
    { section: "睡眠与压力", key: "sleep.latency", label: "入睡所需时长", value: sleep.latency, unit: "分钟", type: "数值" },
    { section: "睡眠与压力", key: "sleep.wakeups", label: "夜间醒来次数", value: sleep.wakeups, unit: "次", type: "数值" },
    { section: "睡眠与压力", key: "sleep.shiftWork", label: "倒班或经常熬夜", value: sleep.shiftWork, type: "选项" },
    { section: "睡眠与压力", key: "sleep.notes", label: "睡眠情况补充", value: sleep.notes },

    { section: "改进目标", key: "goal.primary", label: "最优先目标", value: goal.primary, type: "选项" },
    { section: "改进目标", key: "goal.timeline", label: "期望时间", value: goal.timeline, type: "选项" },
    { section: "改进目标", key: "goal.pastAttempts", label: "过去尝试", value: goal.pastAttempts },
    { section: "改进目标", key: "goal.barriers", label: "当前主要困难", value: goal.barriers.join("；"), type: "列表" },
    { section: "改进目标", key: "goal.support", label: "希望重点获得的帮助", value: goal.support },
  ];
}

export function buildHealthWorkbook(form: HealthFormState) {
  const fields = profileFields(form);
  const data: SheetData = [
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

  return [{
    data,
    sheet: "健康档案",
    columns: [
      { width: 7 },
      { width: 16 },
      { width: 28 },
      { width: 26 },
      { width: 48 },
      { width: 12 },
      { width: 12 },
      { width: 14 },
    ],
    stickyRowsCount: 1,
    showGridLines: false,
    zoomScale: 0.9,
  }];
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

export async function downloadHealthWorkbook(form: HealthFormState) {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const personName = safeFileNamePart(form.basic.name) || "未命名用户";
  const fileName = `健康营养档案_${personName}_${localDateStamp()}.xlsx`;

  await writeXlsxFile(buildHealthWorkbook(form), {
    fontFamily: "Microsoft YaHei",
    fontSize: 11,
  }).toFile(fileName);

  return fileName;
}
