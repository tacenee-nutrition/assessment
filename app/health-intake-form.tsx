"use client";

import {
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";

import { initialHealthForm, type HealthFormState } from "./health-data";
import { downloadHealthWorkbook } from "./health-xlsx";

const STEPS = [
  {
    kicker: "基础档案",
    title: "先了解你的身体情况",
    description: "这些基础数据用于判断日常能量与营养需求，选填项可以稍后补充。",
  },
  {
    kicker: "日常活动",
    title: "你的一天通常怎么度过",
    description: "工作方式、久坐和运动习惯，共同决定每天真实的活动水平。",
  },
  {
    kicker: "饮食习惯",
    title: "还原真实的一日饮食",
    description: "不需要写得完美，日常最常见的吃法才最有参考价值。",
  },
  {
    kicker: "健康状况",
    title: "补充重要的健康背景",
    description: "疾病、用药和过敏信息有助于避开风险，没有的项目可以直接选择“没有”。",
  },
  {
    kicker: "睡眠与压力",
    title: "看看身体最近的状态",
    description: "睡眠、压力和白天精力，会影响食欲、恢复和改变习惯的难度。",
  },
  {
    kicker: "改进目标",
    title: "你最想先改变什么",
    description: "先确定一个最优先目标，让后续建议更聚焦、更容易执行。",
  },
  {
    kicker: "资料预览",
    title: "健康档案已整理",
    description: "提交前可以快速确认信息，并返回任意模块修改。",
  },
];

const GOAL_OPTIONS = [
  { value: "减脂或减重", code: "−KG", detail: "降低体重或体脂，建立可持续节奏" },
  { value: "增肌或塑形", code: "+M", detail: "改善身体成分与体型状态" },
  { value: "维持体重", code: "＝", detail: "稳定当前状态并优化饮食质量" },
  { value: "改善饮食习惯", code: "餐", detail: "让三餐搭配更规律、更均衡" },
  { value: "改善体检指标", code: "↗", detail: "重点关注血糖、血脂等健康指标" },
  { value: "提升精力和睡眠", code: "Zz", detail: "改善疲劳、作息与日间状态" },
  { value: "改善肠胃状态", code: "GI", detail: "关注腹胀、排便或进食舒适度" },
  { value: "其他目标", code: "+", detail: "记录更符合你当前情况的方向" },
];

const ACTIVITY_TYPES = [
  "力量训练",
  "跑步",
  "球类",
  "游泳",
  "骑行",
  "瑜伽",
  "团课",
  "其他",
];

const HEALTH_CONDITIONS = [
  "没有",
  "高血压",
  "血脂异常",
  "血糖异常",
  "高尿酸或痛风",
  "脂肪肝",
  "甲状腺问题",
  "胃肠道问题",
  "其他",
];

const DIGESTION_OPTIONS = ["没有明显不适", "腹胀", "便秘", "腹泻", "反酸", "其他"];

const BARRIER_OPTIONS = [
  "时间不足",
  "经常外食",
  "容易饥饿",
  "不会搭配",
  "难以坚持",
  "家庭饮食限制",
  "其他",
];

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  optional?: boolean;
  className?: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  min?: string;
  max?: string;
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  unit,
  optional = false,
  className = "",
  type = "text",
  inputMode,
  min,
  max,
}: TextFieldProps) {
  return (
    <label className={`field ${className}`}>
      <span>
        {label} {optional && <small>选填</small>}
      </span>
      <div className={unit ? "unit-input" : "plain-input"}>
        <input
          aria-label={unit ? `${label}，单位${unit}` : label}
          type={type}
          inputMode={inputMode}
          min={min}
          max={max}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {unit && <em>{unit}</em>}
      </div>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  optional = false,
}: Omit<TextFieldProps, "unit" | "type" | "inputMode">) {
  return (
    <label className="field">
      <span>
        {label} {optional && <small>选填</small>}
      </span>
      <textarea
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ChoicePills({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="choice-field">
      <legend>{label}</legend>
      <div className="choice-pills">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            className={value === option ? "is-selected" : ""}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function MultiChoicePills({
  label,
  values,
  options,
  onToggle,
  optional = false,
}: {
  label: string;
  values: string[];
  options: string[];
  onToggle: (value: string) => void;
  optional?: boolean;
}) {
  return (
    <fieldset className="choice-field">
      <legend>
        {label} {optional && <small>选填</small>}
      </legend>
      <div className="choice-pills choice-pills-multi">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              className={selected ? "is-selected" : ""}
              onClick={() => onToggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function RangeField({
  label,
  value,
  lowLabel,
  highLabel,
  onChange,
}: {
  label: string;
  value: string;
  lowLabel: string;
  highLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="range-field">
      <div className="range-heading">
        <span>{label}</span>
        <output>{value} / 10</output>
      </div>
      <input
        aria-label={label}
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="range-labels">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

function FilePicker({
  label,
  hint,
  fileName,
  onSelect,
}: {
  label: string;
  hint: string;
  fileName: string;
  onSelect: (fileName: string) => void;
}) {
  const id = useId();

  return (
    <div className="file-picker">
      <div>
        <strong>{fileName || label}</strong>
        <span>{fileName ? "已选择文件，可重新选择" : hint}</span>
      </div>
      <label htmlFor={id}>{fileName ? "更换" : "选择文件"}</label>
      <input
        id={id}
        type="file"
        accept="image/*,.pdf"
        onChange={(event) => onSelect(event.target.files?.[0]?.name ?? "")}
      />
    </div>
  );
}

function FormCard({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="form-card">
      <div className="card-heading">
        <span className="card-number">{number}</span>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function SummaryCard({
  number,
  title,
  rows,
  onEdit,
}: {
  number: string;
  title: string;
  rows: { label: string; value: string }[];
  onEdit: () => void;
}) {
  return (
    <section className="summary-card">
      <div className="summary-heading">
        <span>{number}</span>
        <h2>{title}</h2>
        <button type="button" onClick={onEdit}>修改</button>
      </div>
      <dl>
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value || "未填写"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function HealthIntakeForm({ onExit }: { onExit: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<HealthFormState>(initialHealthForm);
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "success" | "error">("idle");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  const updateSection = (
    section: "basic" | "activity" | "nutrition" | "health" | "sleep" | "goal",
    field: string,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));
  };

  const toggleActivityType = (value: string) => {
    setForm((current) => ({
      ...current,
      activity: {
        ...current.activity,
        types: current.activity.types.includes(value)
          ? current.activity.types.filter((item) => item !== value)
          : [...current.activity.types, value],
      },
    }));
  };

  const toggleHealthItem = (field: "conditions" | "digestion", value: string) => {
    setForm((current) => {
      const items = current.health[field];
      const noValue = field === "conditions" ? "没有" : "没有明显不适";
      let next: string[];

      if (value === noValue) {
        next = items.includes(value) ? [] : [value];
      } else {
        const withoutNone = items.filter((item) => item !== noValue);
        next = withoutNone.includes(value)
          ? withoutNone.filter((item) => item !== value)
          : [...withoutNone, value];
      }

      return { ...current, health: { ...current.health, [field]: next } };
    });
  };

  const toggleBarrier = (value: string) => {
    setForm((current) => ({
      ...current,
      goal: {
        ...current.goal,
        barriers: current.goal.barriers.includes(value)
          ? current.goal.barriers.filter((item) => item !== value)
          : [...current.goal.barriers, value],
      },
    }));
  };

  const typicalMeals = [
    form.nutrition.breakfast,
    form.nutrition.lunch,
    form.nutrition.dinner,
    form.nutrition.snack,
  ];
  const age = Number(form.basic.age);
  const ageIsValid = Number.isFinite(age) && age >= 18 && age <= 100;

  const stepIsValid = (() => {
    if (step === 0) {
      return Boolean(
        form.basic.name &&
          ageIsValid &&
          form.basic.sex &&
          form.basic.height &&
          form.basic.weight,
      );
    }
    if (step === 1) {
      return Boolean(
        form.activity.workPattern &&
          form.activity.sittingHours &&
          form.activity.weeklyFrequency,
      );
    }
    if (step === 2) {
      return Boolean(
        form.nutrition.mealRegularity &&
          form.nutrition.water &&
          typicalMeals.some((value) => value.trim()),
      );
    }
    if (step === 3) {
      return Boolean(
        form.health.conditions.length &&
          form.health.medicationStatus &&
          form.health.supplementStatus,
      );
    }
    if (step === 4) {
      return Boolean(form.sleep.bedTime && form.sleep.wakeTime && form.sleep.quality);
    }
    if (step === 5) {
      return Boolean(form.goal.primary && form.goal.timeline);
    }
    return true;
  })();

  const moveTo = (nextStep: number) => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setStep(nextStep);
  };

  const next = () => {
    if (stepIsValid && step < STEPS.length - 1) moveTo(step + 1);
  };

  const exportXlsx = async () => {
    if (exportStatus === "exporting") return;
    setExportStatus("exporting");
    try {
      await downloadHealthWorkbook(form);
      setExportStatus("success");
    } catch (error) {
      console.error("Health XLSX export failed", error);
      setExportStatus("error");
    }
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="card-stack">
          <FormCard number="01" title="身体基本信息" subtitle="预计用时 1 分钟">
            <TextField
              label="姓名"
              value={form.basic.name}
              onChange={(value) => updateSection("basic", "name", value)}
              placeholder="请输入你的姓名"
              className="field-full"
            />
            <div className="field-grid">
              <TextField
                label="年龄"
                value={form.basic.age}
                onChange={(value) => updateSection("basic", "age", value)}
                placeholder="例如 32"
                unit="岁"
                type="number"
                inputMode="numeric"
                min="18"
                max="100"
              />
              <TextField
                label="身高"
                value={form.basic.height}
                onChange={(value) => updateSection("basic", "height", value)}
                placeholder="例如 168"
                unit="cm"
                inputMode="decimal"
              />
            </div>
            <ChoicePills
              label="生理性别（用于营养需求估算）"
              value={form.basic.sex}
              options={["男", "女", "不愿透露"]}
              onChange={(value) => updateSection("basic", "sex", value)}
            />
            <div className="field-grid">
              <TextField
                label="当前体重"
                value={form.basic.weight}
                onChange={(value) => updateSection("basic", "weight", value)}
                placeholder="例如 65.0"
                unit="kg"
                inputMode="decimal"
              />
              <TextField
                label="腰围"
                value={form.basic.waist}
                onChange={(value) => updateSection("basic", "waist", value)}
                placeholder="例如 78"
                unit="cm"
                inputMode="decimal"
                optional
              />
            </div>
            {form.basic.age && !ageIsValid && (
              <aside className="validation-note" role="alert">
                当前版本面向 18～100 岁成年人，请确认年龄是否填写正确。
              </aside>
            )}
            <aside className="privacy-note">
              <span aria-hidden="true">✓</span>
              <p>信息仅用于本次营养咨询与档案整理。</p>
            </aside>
          </FormCard>

          <FormCard number="02" title="体重变化" subtitle="选填，帮助判断近期趋势">
            <ChoicePills
              label="最近三个月体重趋势"
              value={form.basic.weightTrend}
              options={["下降", "基本稳定", "上升"]}
              onChange={(value) => updateSection("basic", "weightTrend", value)}
            />
            <div className="field-grid">
              <TextField
                label="大约变化"
                value={form.basic.weightChange}
                onChange={(value) => updateSection("basic", "weightChange", value)}
                placeholder="例如 3"
                unit="kg"
                inputMode="decimal"
                optional
              />
              <TextField
                label="目标体重"
                value={form.basic.targetWeight}
                onChange={(value) => updateSection("basic", "targetWeight", value)}
                placeholder="例如 60"
                unit="kg"
                inputMode="decimal"
                optional
              />
            </div>
            <TextField
              label="预估体脂率"
              value={form.basic.bodyFat}
              onChange={(value) => updateSection("basic", "bodyFat", value)}
              placeholder="例如 25"
              unit="%"
              inputMode="decimal"
              optional
            />
          </FormCard>
        </div>
      );
    }

    if (step === 1) {
      const exercises = form.activity.weeklyFrequency && form.activity.weeklyFrequency !== "不运动";
      return (
        <div className="card-stack">
          <FormCard number="03" title="工作与日常活动" subtitle="选择近期最常见的状态">
            <ChoicePills
              label="日常工作状态"
              value={form.activity.workPattern}
              options={["久坐办公", "走动较多", "体力工作", "倒班或不固定"]}
              onChange={(value) => updateSection("activity", "workPattern", value)}
            />
            <TextField
              label="每天大约久坐多久"
              value={form.activity.sittingHours}
              onChange={(value) => updateSection("activity", "sittingHours", value)}
              placeholder="例如 8"
              unit="小时"
              inputMode="decimal"
            />
            <TextField
              label="日均步数"
              value={form.activity.steps}
              onChange={(value) => updateSection("activity", "steps", value)}
              placeholder="例如 6000"
              unit="步"
              inputMode="numeric"
              optional
            />
          </FormCard>

          <FormCard number="04" title="运动习惯" subtitle="没有固定运动也可以如实选择">
            <ChoicePills
              label="每周运动频率"
              value={form.activity.weeklyFrequency}
              options={["不运动", "1～2 次", "3～4 次", "5 次以上"]}
              onChange={(value) => updateSection("activity", "weeklyFrequency", value)}
            />
            {exercises && (
              <div className="conditional-panel">
                <MultiChoicePills
                  label="常做的运动"
                  values={form.activity.types}
                  options={ACTIVITY_TYPES}
                  onToggle={toggleActivityType}
                  optional
                />
                <div className="field-grid">
                  <TextField
                    label="单次运动时长"
                    value={form.activity.duration}
                    onChange={(value) => updateSection("activity", "duration", value)}
                    placeholder="例如 45"
                    unit="分钟"
                    inputMode="numeric"
                    optional
                  />
                  <div>
                    <ChoicePills
                      label="通常强度"
                      value={form.activity.intensity}
                      options={["轻松", "中等", "较累"]}
                      onChange={(value) => updateSection("activity", "intensity", value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </FormCard>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="card-stack">
          <FormCard number="05" title="三餐与饮水" subtitle="请填写一个最常见的工作日">
            <ChoicePills
              label="三餐规律性"
              value={form.nutrition.mealRegularity}
              options={["规律", "偶尔不规律", "经常不规律"]}
              onChange={(value) => updateSection("nutrition", "mealRegularity", value)}
            />
            <TextAreaField
              label="早餐"
              value={form.nutrition.breakfast}
              onChange={(value) => updateSection("nutrition", "breakfast", value)}
              placeholder="例如：不吃；或鸡蛋、牛奶和一片面包……"
              optional
            />
            <TextAreaField
              label="午餐"
              value={form.nutrition.lunch}
              onChange={(value) => updateSection("nutrition", "lunch", value)}
              placeholder="例如：一荤一素、一份米饭……"
              optional
            />
            <TextAreaField
              label="晚餐"
              value={form.nutrition.dinner}
              onChange={(value) => updateSection("nutrition", "dinner", value)}
              placeholder="请描述最常见的晚餐组合……"
              optional
            />
            <TextAreaField
              label="加餐或夜宵"
              value={form.nutrition.snack}
              onChange={(value) => updateSection("nutrition", "snack", value)}
              placeholder="例如：水果、酸奶、零食或夜宵……"
              optional
            />
            <TextField
              label="每日饮水量"
              value={form.nutrition.water}
              onChange={(value) => updateSection("nutrition", "water", value)}
              placeholder="例如 1.5"
              unit="升"
              inputMode="decimal"
            />
            {!typicalMeals.some((value) => value.trim()) && (
              <p className="field-hint">早餐、午餐、晚餐或加餐至少填写一项。</p>
            )}
          </FormCard>

          <FormCard number="06" title="饮食环境" subtitle="按一周内的平均情况选择">
            <ChoicePills
              label="每周外食或外卖"
              value={form.nutrition.eatingOut}
              options={["几乎没有", "1～2 次", "3～5 次", "6 次以上"]}
              onChange={(value) => updateSection("nutrition", "eatingOut", value)}
            />
            <ChoicePills
              label="含糖饮料"
              value={form.nutrition.sugaryDrinks}
              options={["几乎不喝", "每周 1～2 次", "每周 3 次以上"]}
              onChange={(value) => updateSection("nutrition", "sugaryDrinks", value)}
            />
            <ChoicePills
              label="零食和甜食"
              value={form.nutrition.sweets}
              options={["很少", "偶尔", "几乎每天"]}
              onChange={(value) => updateSection("nutrition", "sweets", value)}
            />
            <ChoicePills
              label="夜宵"
              value={form.nutrition.lateNight}
              options={["几乎不吃", "偶尔", "经常"]}
              onChange={(value) => updateSection("nutrition", "lateNight", value)}
            />
            <ChoicePills
              label="主要用餐来源"
              value={form.nutrition.cooking}
              options={["自己做", "家人做", "食堂", "外卖为主"]}
              onChange={(value) => updateSection("nutrition", "cooking", value)}
            />
            <TextAreaField
              label="饮食偏好与忌口"
              value={form.nutrition.preferences}
              onChange={(value) => updateSection("nutrition", "preferences", value)}
              placeholder="例如：偏爱面食、不吃香菜、素食等……"
              optional
            />
          </FormCard>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="card-stack">
          <FormCard number="07" title="已知健康问题" subtitle="没有也请明确选择“没有”">
            <MultiChoicePills
              label="目前是否有以下情况"
              values={form.health.conditions}
              options={HEALTH_CONDITIONS}
              onToggle={(value) => toggleHealthItem("conditions", value)}
            />
            <ChoicePills
              label="是否长期服药"
              value={form.health.medicationStatus}
              options={["没有", "有", "不确定"]}
              onChange={(value) => updateSection("health", "medicationStatus", value)}
            />
            {form.health.medicationStatus === "有" && (
              <div className="conditional-panel">
                <TextAreaField
                  label="药物名称及服用频率"
                  value={form.health.medications}
                  onChange={(value) => updateSection("health", "medications", value)}
                  placeholder="请按药品包装或医嘱填写……"
                  optional
                />
              </div>
            )}
            <ChoicePills
              label="是否使用营养补剂"
              value={form.health.supplementStatus}
              options={["没有", "有", "不确定"]}
              onChange={(value) => updateSection("health", "supplementStatus", value)}
            />
            {form.health.supplementStatus === "有" && (
              <div className="conditional-panel">
                <TextAreaField
                  label="补剂名称、剂量与频率"
                  value={form.health.supplements}
                  onChange={(value) => updateSection("health", "supplements", value)}
                  placeholder="例如：维生素 D，每天 1000 IU……"
                  optional
                />
              </div>
            )}
          </FormCard>

          <FormCard number="08" title="过敏与消化情况" subtitle="选填，帮助避开不适食物">
            <TextAreaField
              label="食物过敏或不耐受"
              value={form.health.allergies}
              onChange={(value) => updateSection("health", "allergies", value)}
              placeholder="例如：乳糖不耐受、花生过敏；没有可留空……"
              optional
            />
            <MultiChoicePills
              label="近期常见的消化情况"
              values={form.health.digestion}
              options={DIGESTION_OPTIONS}
              onToggle={(value) => toggleHealthItem("digestion", value)}
              optional
            />
            <ChoicePills
              label="吸烟情况"
              value={form.health.smoking}
              options={["不吸烟", "偶尔", "经常"]}
              onChange={(value) => updateSection("health", "smoking", value)}
            />
            <TextField
              label="饮酒频率"
              value={form.health.alcohol}
              onChange={(value) => updateSection("health", "alcohol", value)}
              placeholder="例如：每月 1～2 次"
              optional
            />
          </FormCard>

          {form.basic.sex === "女" && (
            <FormCard number="09" title="女性生理阶段" subtitle="选填，仅用于调整营养需求判断">
              <ChoicePills
                label="当前所处阶段"
                value={form.health.lifeStage}
                options={["无", "备孕", "孕期", "哺乳期", "绝经期"]}
                onChange={(value) => updateSection("health", "lifeStage", value)}
              />
              <ChoicePills
                label="月经规律性"
                value={form.health.menstrualRegularity}
                options={["规律", "偶尔波动", "经常不规律", "不适用"]}
                onChange={(value) => updateSection("health", "menstrualRegularity", value)}
              />
            </FormCard>
          )}

          <FormCard number={form.basic.sex === "女" ? "10" : "09"} title="近期体检资料" subtitle="选填，可稍后补充">
            <TextField
              label="最近一次体检日期"
              value={form.health.reportDate}
              onChange={(value) => updateSection("health", "reportDate", value)}
              type="date"
              optional
            />
            <FilePicker
              label="添加体检或检测报告"
              hint="支持图片或 PDF"
              fileName={form.files.labReport}
              onSelect={(value) => setForm((current) => ({
                ...current,
                files: { ...current.files, labReport: value },
              }))}
            />
            <aside className="coach-note">
              <span>提示</span>
              <p>本表用于信息整理，不替代医疗诊断或治疗；正在服药或存在疾病时，请以医生意见为准。</p>
            </aside>
          </FormCard>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="card-stack">
          <FormCard number="11" title="睡眠时间轴" subtitle="填写近期最常见的作息">
            <div className="field-grid time-grid">
              <TextField
                label="通常上床时间"
                value={form.sleep.bedTime}
                onChange={(value) => updateSection("sleep", "bedTime", value)}
                type="time"
              />
              <TextField
                label="通常起床时间"
                value={form.sleep.wakeTime}
                onChange={(value) => updateSection("sleep", "wakeTime", value)}
                type="time"
              />
            </div>
            <ChoicePills
              label="整体睡眠质量"
              value={form.sleep.quality}
              options={["很好", "一般", "较差"]}
              onChange={(value) => updateSection("sleep", "quality", value)}
            />
            <div className="field-grid">
              <TextField
                label="入睡所需时长"
                value={form.sleep.latency}
                onChange={(value) => updateSection("sleep", "latency", value)}
                placeholder="例如 20"
                unit="分钟"
                inputMode="numeric"
                optional
              />
              <TextField
                label="夜间醒来次数"
                value={form.sleep.wakeups}
                onChange={(value) => updateSection("sleep", "wakeups", value)}
                placeholder="例如 1"
                unit="次"
                inputMode="numeric"
                optional
              />
            </div>
            <ChoicePills
              label="是否倒班或经常熬夜"
              value={form.sleep.shiftWork}
              options={["没有", "偶尔", "经常"]}
              onChange={(value) => updateSection("sleep", "shiftWork", value)}
            />
          </FormCard>

          <FormCard number="12" title="压力与白天状态" subtitle="按照最近两周的平均感受">
            <RangeField
              label="当前压力程度"
              value={form.sleep.stress}
              lowLabel="非常放松"
              highLabel="压力极大"
              onChange={(value) => updateSection("sleep", "stress", value)}
            />
            <div className="range-spacer" />
            <RangeField
              label="白天疲劳程度"
              value={form.sleep.fatigue}
              lowLabel="精力充沛"
              highLabel="非常疲劳"
              onChange={(value) => updateSection("sleep", "fatigue", value)}
            />
            <TextAreaField
              label="睡眠或压力情况补充"
              value={form.sleep.notes}
              onChange={(value) => updateSection("sleep", "notes", value)}
              placeholder="例如：近期工作压力大、周末会补觉……"
              optional
            />
          </FormCard>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div className="card-stack">
          <FormCard number="13" title="最优先的目标" subtitle="先选择一个当前最重要的方向">
            <div className="goal-grid">
              {GOAL_OPTIONS.map((goal) => {
                const selected = form.goal.primary === goal.value;
                return (
                  <button
                    key={goal.value}
                    type="button"
                    aria-pressed={selected}
                    className={selected ? "goal-card is-selected" : "goal-card"}
                    onClick={() => updateSection("goal", "primary", goal.value)}
                  >
                    <span>{goal.code}</span>
                    <strong>{goal.value}</strong>
                    <small>{goal.detail}</small>
                    <i aria-hidden="true">{selected ? "✓" : "+"}</i>
                  </button>
                );
              })}
            </div>
          </FormCard>

          <FormCard number="14" title="时间与执行难点" subtitle="让建议更贴近日常生活">
            <ChoicePills
              label="希望多久看到明显变化"
              value={form.goal.timeline}
              options={["1～3 个月", "3～6 个月", "半年以上", "没有明确期限"]}
              onChange={(value) => updateSection("goal", "timeline", value)}
            />
            <TextAreaField
              label="过去尝试过的方法"
              value={form.goal.pastAttempts}
              onChange={(value) => updateSection("goal", "pastAttempts", value)}
              placeholder="例如：计算热量、戒晚餐、跟练课程等……"
              optional
            />
            <MultiChoicePills
              label="当前最大的困难"
              values={form.goal.barriers}
              options={BARRIER_OPTIONS}
              onToggle={toggleBarrier}
              optional
            />
            <TextAreaField
              label="希望营养师重点帮助什么"
              value={form.goal.support}
              onChange={(value) => updateSection("goal", "support", value)}
              placeholder="例如：给出适合外食场景的搭配方法……"
              optional
            />
            <aside className="coach-note">
              <span>TIP</span>
              <p>目标越具体，后续建议越容易转化为每天可以执行的行动。</p>
            </aside>
          </FormCard>
        </div>
      );
    }

    return (
      <div className="review-stack">
        <section className="completion-card">
          <span className="completion-mark" aria-hidden="true">✓</span>
          <div>
            <p>6 个模块已整理</p>
            <strong>{form.basic.name || "本次咨询用户"}的健康营养档案</strong>
          </div>
        </section>

        <SummaryCard
          number="01"
          title="基础档案"
          onEdit={() => moveTo(0)}
          rows={[
            { label: "基本信息", value: `${form.basic.age || "—"} 岁 · ${form.basic.sex || "—"}` },
            { label: "身体数据", value: `${form.basic.height || "—"} cm · ${form.basic.weight || "—"} kg · 腰围 ${form.basic.waist || "—"} cm` },
            { label: "体重趋势", value: form.basic.weightTrend },
          ]}
        />
        <SummaryCard
          number="02"
          title="日常活动"
          onEdit={() => moveTo(1)}
          rows={[
            { label: "工作状态", value: form.activity.workPattern },
            { label: "久坐与步数", value: `${form.activity.sittingHours || "—"} 小时/天 · ${form.activity.steps || "—"} 步/天` },
            { label: "运动习惯", value: `${form.activity.weeklyFrequency || "—"}${form.activity.types.length ? ` · ${form.activity.types.join("、")}` : ""}` },
          ]}
        />
        <SummaryCard
          number="03"
          title="饮食习惯"
          onEdit={() => moveTo(2)}
          rows={[
            { label: "三餐规律", value: form.nutrition.mealRegularity },
            { label: "典型饮食", value: [form.nutrition.breakfast, form.nutrition.lunch, form.nutrition.dinner, form.nutrition.snack].filter(Boolean).join("；") },
            { label: "饮水与外食", value: `${form.nutrition.water || "—"} 升/天 · ${form.nutrition.eatingOut || "外食未选择"}` },
          ]}
        />
        <SummaryCard
          number="04"
          title="健康状况"
          onEdit={() => moveTo(3)}
          rows={[
            { label: "已知情况", value: form.health.conditions.join("、") },
            { label: "用药与补剂", value: `用药：${form.health.medicationStatus || "—"} · 补剂：${form.health.supplementStatus || "—"}` },
            { label: "体检资料", value: form.files.labReport || "未添加" },
          ]}
        />
        <SummaryCard
          number="05"
          title="睡眠与压力"
          onEdit={() => moveTo(4)}
          rows={[
            { label: "作息", value: `${form.sleep.bedTime || "—"} 上床 · ${form.sleep.wakeTime || "—"} 起床` },
            { label: "整体状态", value: `${form.sleep.quality || "—"} · 压力 ${form.sleep.stress}/10 · 疲劳 ${form.sleep.fatigue}/10` },
          ]}
        />
        <SummaryCard
          number="06"
          title="改进目标"
          onEdit={() => moveTo(5)}
          rows={[
            { label: "最优先目标", value: form.goal.primary },
            { label: "期望时间", value: form.goal.timeline },
            { label: "主要困难", value: form.goal.barriers.join("、") },
          ]}
        />

        <section className="export-card">
          <div className="export-heading">
            <div>
              <span>资料已就绪</span>
              <h2>下载完整数据表</h2>
            </div>
            <small>XLSX</small>
          </div>
          <p>将当前填写的资料整理为可继续编辑和归档的健康营养档案。</p>
          <div className="export-options export-options-single">
            <button
              type="button"
              className="export-primary"
              disabled={exportStatus === "exporting"}
              onClick={exportXlsx}
            >
              <span>XLSX</span>
              <div>
                <strong>{exportStatus === "exporting" ? "正在生成数据表…" : "下载 XLSX 数据表"}</strong>
                <small>基础档案 · 生活与健康信息</small>
              </div>
              <i aria-hidden="true">↓</i>
            </button>
          </div>
          {exportStatus === "success" && <p className="export-feedback" role="status">文件已生成并开始下载。</p>}
          {exportStatus === "error" && <p className="export-feedback is-error" role="alert">生成失败，请稍后重试。</p>}
        </section>
      </div>
    );
  };

  return (
    <main className="app-shell health-app-shell">
      <div className="mobile-canvas">
        <header className="topbar">
          <div className="topbar-copy">
            <button
              className="back-button"
              type="button"
              aria-label={step === 0 ? "返回入口选择" : "返回上一步"}
              onClick={() => (step === 0 ? onExit() : moveTo(step - 1))}
            >
              <span className="chevron-left-icon" aria-hidden="true" />
            </button>
            {step === 0 && (
              <div>
                <p className="eyebrow">咨询前信息采集</p>
                <p className="brand-title">健康营养档案</p>
              </div>
            )}
          </div>
          <div className="step-count" aria-label={`当前第 ${step + 1} 步，共 ${STEPS.length} 步`}>
            <strong>{String(step + 1).padStart(2, "0")}</strong>
            <span>/ {String(STEPS.length).padStart(2, "0")}</span>
          </div>
        </header>

        <div className="progress" aria-hidden="true">
          {STEPS.map((item, index) => (
            <span key={item.kicker} className={index <= step ? "is-active" : ""} />
          ))}
        </div>

        <section className="intro-block" aria-live="polite">
          <p className="section-kicker">{STEPS[step].kicker}</p>
          <h1>{STEPS[step].title}</h1>
          <p>{STEPS[step].description}</p>
        </section>

        <div className="step-stage" key={step}>{renderStep()}</div>

        {step < STEPS.length - 1 && (
          <div className="bottom-action">
            <p>{stepIsValid ? "信息已就绪，可以继续" : "完成必填信息后即可继续"}</p>
            <button type="button" disabled={!stepIsValid} onClick={next}>
              {step === STEPS.length - 2 ? "查看资料预览" : "继续填写"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
