"use client";

import {
  type InputHTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from "react";

import { initialForm, type FormState, type Supplement } from "./nutrition-data";
import { downloadNutritionWorkbook } from "./nutrition-xlsx";

const STEPS = [
  {
    kicker: "基础档案",
    title: "先认识一下你",
    description: "建立身体基础档案，帮助后续判断营养与训练需求。",
  },
  {
    kicker: "训练计划",
    title: "了解你的训练节奏",
    description: "训练量、强度和能力基准，会影响能量与恢复策略。",
  },
  {
    kicker: "营养摄入",
    title: "还原真实的饮食",
    description: "不需要刻意写得完美，日常真实情况最有参考价值。",
  },
  {
    kicker: "补剂与检测",
    title: "补充恢复依据",
    description: "已有补剂和近期检测均可选填，没有也可以直接继续。",
  },
  {
    kicker: "睡眠恢复",
    title: "看看身体如何充电",
    description: "睡眠与自主神经状态，是运动恢复的重要组成部分。",
  },
  {
    kicker: "改进目标",
    title: "你最想先改变什么",
    description: "选择最重要的方向，让本次咨询更聚焦、更有行动性。",
  },
  {
    kicker: "资料预览",
    title: "咨询档案已整理",
    description: "提交前可以快速确认信息，并返回任意模块修改。",
  },
];

const GOAL_OPTIONS = [
  { value: "绝对力量突破", code: "1rm", detail: "提高最大力量表现" },
  { value: "代谢功率优化", code: "WOD", detail: "提升高强度运动表现" },
  { value: "身体成分管理", code: "%", detail: "增肌、减脂或维持体重" },
  { value: "训练间恢复", code: "↻", detail: "更快回到准备状态" },
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
  accept = "image/*,.pdf",
  onSelect,
}: {
  label: string;
  hint: string;
  fileName: string;
  accept?: string;
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
        accept={accept}
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
        <button type="button" onClick={onEdit}>
          修改
        </button>
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

export default function Home() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "exporting" | "success" | "error"
  >("idle");

  const updateSection = (
    section: "basic" | "training" | "nutrition" | "labs" | "sleep",
    field: string,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));
  };

  const updateFile = (field: string, value: string) => {
    setForm((current) => ({
      ...current,
      files: { ...current.files, [field]: value },
    }));
  };

  const updateSupplement = (
    id: number,
    field: keyof Omit<Supplement, "id">,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      supplements: current.supplements.map((supplement) =>
        supplement.id === id ? { ...supplement, [field]: value } : supplement,
      ),
    }));
  };

  const addSupplement = () => {
    setForm((current) => ({
      ...current,
      supplements: [
        ...current.supplements,
        {
          id: Math.max(0, ...current.supplements.map((item) => item.id)) + 1,
          name: "",
          brand: "",
          dose: "",
          frequency: "",
          timing: "",
          labelFile: "",
        },
      ],
    }));
  };

  const removeSupplement = (id: number) => {
    setForm((current) => ({
      ...current,
      supplements: current.supplements.filter((item) => item.id !== id),
    }));
  };

  const toggleGoal = (goal: string) => {
    setForm((current) => ({
      ...current,
      goals: current.goals.includes(goal)
        ? current.goals.filter((item) => item !== goal)
        : [...current.goals, goal],
    }));
  };

  const stepIsValid = (() => {
    if (step === 0) {
      return Boolean(form.basic.name && form.basic.height && form.basic.weight);
    }
    if (step === 1) {
      return Boolean(
        form.training.weeklyFrequency && form.training.sessionDuration,
      );
    }
    if (step === 2) {
      return Boolean(
        form.nutrition.breakfast &&
          form.nutrition.lunch &&
          form.nutrition.dinner &&
          form.nutrition.water,
      );
    }
    if (step === 4) {
      return Boolean(
        form.sleep.regularity && form.sleep.bedTime && form.sleep.wakeTime,
      );
    }
    if (step === 5) {
      return Boolean(form.goals.length || form.otherGoal.trim());
    }
    return true;
  })();

  const moveTo = (nextStep: number) => {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (stepIsValid && step < STEPS.length - 1) moveTo(step + 1);
  };

  const exportXlsx = async () => {
    if (exportStatus === "exporting") return;

    setExportStatus("exporting");
    try {
      await downloadNutritionWorkbook(form);
      setExportStatus("success");
    } catch (error) {
      console.error("XLSX export failed", error);
      setExportStatus("error");
    }
  };

  const filledSupplements = form.supplements.filter((item) => item.name.trim());

  const renderStep = () => {
    if (step === 0) {
      return (
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
              label="身高"
              value={form.basic.height}
              onChange={(value) => updateSection("basic", "height", value)}
              placeholder="175"
              unit="cm"
              inputMode="decimal"
            />
            <TextField
              label="当前体重"
              value={form.basic.weight}
              onChange={(value) => updateSection("basic", "weight", value)}
              placeholder="70.0"
              unit="kg"
              inputMode="decimal"
            />
          </div>
          <TextField
            label="预估体脂率"
            value={form.basic.bodyFat}
            onChange={(value) => updateSection("basic", "bodyFat", value)}
            placeholder="例如 15"
            unit="%"
            inputMode="decimal"
            optional
          />
          <aside className="privacy-note">
            <span aria-hidden="true">✓</span>
            <p>信息仅用于本次营养咨询与档案整理。</p>
          </aside>
        </FormCard>
      );
    }

    if (step === 1) {
      return (
        <div className="card-stack">
          <FormCard number="02" title="训练概况" subtitle="填写近期最常见的训练状态">
            <div className="field-grid">
              <TextField
                label="训练年限"
                value={form.training.years}
                onChange={(value) => updateSection("training", "years", value)}
                placeholder="例如 2"
                unit="年"
                inputMode="decimal"
                optional
              />
              <TextField
                label="每周训练次数"
                value={form.training.weeklyFrequency}
                onChange={(value) =>
                  updateSection("training", "weeklyFrequency", value)
                }
                placeholder="例如 5"
                unit="次"
                inputMode="numeric"
              />
            </div>
            <TextAreaField
              label="训练经历与背景"
              value={form.training.background}
              onChange={(value) =>
                updateSection("training", "background", value)
              }
              placeholder="例如：有目标训练 15 个月，此前以自主训练为主……"
              optional
            />
            <div className="field-grid">
              <TextField
                label="单次训练时长"
                value={form.training.sessionDuration}
                onChange={(value) =>
                  updateSection("training", "sessionDuration", value)
                }
                placeholder="例如 90"
                unit="分钟"
                inputMode="numeric"
              />
              <TextField
                label="Zone 2 时长"
                value={form.training.zone2Duration}
                onChange={(value) =>
                  updateSection("training", "zone2Duration", value)
                }
                placeholder="例如 30"
                unit="分钟"
                inputMode="numeric"
                optional
              />
            </div>
            <RangeField
              label="平均训练自觉强度 RPE"
              value={form.training.rpe}
              lowLabel="极轻松"
              highLabel="精疲力竭"
              onChange={(value) => updateSection("training", "rpe", value)}
            />
          </FormCard>

          <FormCard number="03" title="训练计划" subtitle="选填，可填写或添加已有文件">
            <TextAreaField
              label="近期训练计划描述"
              value={form.training.plan}
              onChange={(value) => updateSection("training", "plan", value)}
              placeholder="训练周期、主要内容、近期比赛安排等……"
              optional
            />
            <FilePicker
              label="添加训练计划"
              hint="支持图片或 PDF"
              fileName={form.files.trainingPlan}
              onSelect={(value) => updateFile("trainingPlan", value)}
            />
          </FormCard>

          <FormCard number="04" title="最近一次 1RM" subtitle="没有测试过的项目可以留空">
            <div className="strength-grid">
              <TextField
                label="抓举 Snatch"
                value={form.training.snatch}
                onChange={(value) => updateSection("training", "snatch", value)}
                placeholder="—"
                unit="kg"
                inputMode="decimal"
                optional
              />
              <TextField
                label="挺举 C&J"
                value={form.training.cleanJerk}
                onChange={(value) =>
                  updateSection("training", "cleanJerk", value)
                }
                placeholder="—"
                unit="kg"
                inputMode="decimal"
                optional
              />
              <TextField
                label="深蹲 Squat"
                value={form.training.squat}
                onChange={(value) => updateSection("training", "squat", value)}
                placeholder="—"
                unit="kg"
                inputMode="decimal"
                optional
              />
              <TextField
                label="硬拉 Deadlift"
                value={form.training.deadlift}
                onChange={(value) => updateSection("training", "deadlift", value)}
                placeholder="—"
                unit="kg"
                inputMode="decimal"
                optional
              />
            </div>
          </FormCard>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="card-stack">
          <FormCard number="05" title="整体饮食结构" subtitle="估算值即可，不要求精确">
            <TextAreaField
              label="目前的饮食风格"
              value={form.nutrition.dietStyle}
              onChange={(value) =>
                updateSection("nutrition", "dietStyle", value)
              }
              placeholder="例如：中式饮食、高蛋白、外食较多，没有特别偏好……"
              optional
            />
            <div className="macro-grid">
              <TextField
                label="碳水"
                value={form.nutrition.carbs}
                onChange={(value) => updateSection("nutrition", "carbs", value)}
                placeholder="—"
                unit="g/天"
                inputMode="decimal"
                optional
              />
              <TextField
                label="蛋白质"
                value={form.nutrition.protein}
                onChange={(value) =>
                  updateSection("nutrition", "protein", value)
                }
                placeholder="—"
                unit="g/天"
                inputMode="decimal"
                optional
              />
              <TextField
                label="脂肪"
                value={form.nutrition.fat}
                onChange={(value) => updateSection("nutrition", "fat", value)}
                placeholder="—"
                unit="g/天"
                inputMode="decimal"
                optional
              />
            </div>
          </FormCard>

          <FormCard number="06" title="典型的一天" subtitle="请尽量包含食物名称和大致份量">
            <TextAreaField
              label="早餐"
              value={form.nutrition.breakfast}
              onChange={(value) =>
                updateSection("nutrition", "breakfast", value)
              }
              placeholder="例如：3 个鸡蛋、1 杯无糖酸奶、1 把蓝莓……"
            />
            <TextAreaField
              label="午餐"
              value={form.nutrition.lunch}
              onChange={(value) => updateSection("nutrition", "lunch", value)}
              placeholder="例如：一荤一素、一份米饭、一罐零糖饮料……"
            />
            <TextAreaField
              label="晚餐"
              value={form.nutrition.dinner}
              onChange={(value) => updateSection("nutrition", "dinner", value)}
              placeholder="请描述最常见的晚餐组合……"
            />
            <TextAreaField
              label="加餐"
              value={form.nutrition.snack}
              onChange={(value) => updateSection("nutrition", "snack", value)}
              placeholder="例如：蛋白粉、香蕉、运动饮料或夜宵……"
              optional
            />
            <TextAreaField
              label="特殊饮食需求"
              value={form.nutrition.specialDiet}
              onChange={(value) =>
                updateSection("nutrition", "specialDiet", value)
              }
              placeholder="饮食禁忌、素食、辣度接受情况或其他需求……"
              optional
            />
          </FormCard>

          <FormCard number="07" title="水分与电解质" subtitle="填写一周内的平均情况">
            <TextField
              label="每日饮水量"
              value={form.nutrition.water}
              onChange={(value) => updateSection("nutrition", "water", value)}
              placeholder="例如 2.5"
              unit="升"
              inputMode="decimal"
            />
            <ChoicePills
              label="三餐平均盐分"
              value={form.nutrition.salt}
              options={["偏清淡", "正常", "重口"]}
              onChange={(value) => updateSection("nutrition", "salt", value)}
            />
            <p className="subsection-label">每周摄入频率</p>
            <div className="frequency-grid">
              {[
                ["dairy", "奶制品"],
                ["nuts", "坚果"],
                ["greens", "绿叶菜"],
                ["potatoes", "土豆"],
                ["mushrooms", "菌类"],
                ["coconutWater", "椰子水"],
                ["fruit", "水果"],
              ].map(([field, label]) => (
                <TextField
                  key={field}
                  label={label}
                  value={form.nutrition[field]}
                  onChange={(value) => updateSection("nutrition", field, value)}
                  placeholder="0"
                  unit="次"
                  inputMode="numeric"
                  optional
                />
              ))}
            </div>
          </FormCard>

          <FormCard number="08" title="咖啡因与酒精" subtitle="按目前最常见的习惯填写">
            <TextField
              label="每日咖啡因摄入"
              value={form.nutrition.caffeine}
              onChange={(value) =>
                updateSection("nutrition", "caffeine", value)
              }
              placeholder="例如：2 杯美式"
              optional
            />
            <TextField
              label="饮酒频率"
              value={form.nutrition.alcohol}
              onChange={(value) =>
                updateSection("nutrition", "alcohol", value)
              }
              placeholder="例如：每月 1 次"
              optional
            />
          </FormCard>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="card-stack">
          <FormCard number="09" title="现有补剂清单" subtitle="可以添加多种补剂，也可以留空">
            <div className="repeater-list">
              {form.supplements.map((supplement, index) => (
                <section className="repeater-card" key={supplement.id}>
                  <div className="repeater-heading">
                    <strong>补剂 {String(index + 1).padStart(2, "0")}</strong>
                    {form.supplements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSupplement(supplement.id)}
                      >
                        删除
                      </button>
                    )}
                  </div>
                  <div className="field-grid">
                    <TextField
                      label="补剂名称"
                      value={supplement.name}
                      onChange={(value) =>
                        updateSupplement(supplement.id, "name", value)
                      }
                      placeholder="例如 肌酸"
                      optional
                    />
                    <TextField
                      label="品牌"
                      value={supplement.brand}
                      onChange={(value) =>
                        updateSupplement(supplement.id, "brand", value)
                      }
                      placeholder="品牌名称"
                      optional
                    />
                  </div>
                  <div className="field-grid">
                    <TextField
                      label="单次剂量"
                      value={supplement.dose}
                      onChange={(value) =>
                        updateSupplement(supplement.id, "dose", value)
                      }
                      placeholder="例如 5g"
                      optional
                    />
                    <TextField
                      label="服用频率"
                      value={supplement.frequency}
                      onChange={(value) =>
                        updateSupplement(supplement.id, "frequency", value)
                      }
                      placeholder="例如 每天"
                      optional
                    />
                  </div>
                  <TextField
                    label="服用时间"
                    value={supplement.timing}
                    onChange={(value) =>
                      updateSupplement(supplement.id, "timing", value)
                    }
                    placeholder="例如 训练前 90 分钟或随晚餐"
                    optional
                  />
                  <FilePicker
                    label="添加配料表或营养成分表"
                    hint="支持拍照或选择图片"
                    fileName={supplement.labelFile}
                    accept="image/*"
                    onSelect={(value) =>
                      updateSupplement(supplement.id, "labelFile", value)
                    }
                  />
                </section>
              ))}
            </div>
            <button className="add-button" type="button" onClick={addSupplement}>
              <span aria-hidden="true">＋</span> 添加一种补剂
            </button>
          </FormCard>

          <FormCard number="10" title="近期生理生化指标" subtitle="如有 6 个月内的报告，可填写或上传">
            <TextField
              label="报告或体检日期"
              value={form.labs.reportDate}
              onChange={(value) => updateSection("labs", "reportDate", value)}
              type="date"
              optional
            />
            <FilePicker
              label="添加体检或检测报告"
              hint="支持图片或 PDF"
              fileName={form.files.labReport}
              onSelect={(value) => updateFile("labReport", value)}
            />
            <p className="subsection-label subsection-spaced">重点指标</p>
            <div className="lab-grid">
              {[
                ["testosterone", "睾酮"],
                ["cortisol", "皮质醇"],
                ["ferritin", "血清铁蛋白"],
                ["vitaminD", "维生素 D"],
                ["hsCrp", "hs-CRP"],
                ["lipids", "血脂"],
              ].map(([field, label]) => (
                <TextField
                  key={field}
                  label={label}
                  value={form.labs[field]}
                  onChange={(value) => updateSection("labs", field, value)}
                  placeholder="填写数值与单位"
                  optional
                />
              ))}
            </div>
          </FormCard>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="card-stack">
          <FormCard number="11" title="睡眠时间轴" subtitle="填写近期最常见的作息">
            <ChoicePills
              label="作息规律性"
              value={form.sleep.regularity}
              options={["非常规律", "偶尔波动", "经常波动"]}
              onChange={(value) =>
                updateSection("sleep", "regularity", value)
              }
            />
            <div className="field-grid">
              <TextField
                label="通常上床时间"
                value={form.sleep.bedTime}
                onChange={(value) => updateSection("sleep", "bedTime", value)}
                type="time"
              />
              <TextField
                label="通常晨起时间"
                value={form.sleep.wakeTime}
                onChange={(value) => updateSection("sleep", "wakeTime", value)}
                type="time"
              />
            </div>
            <div className="field-grid">
              <TextField
                label="入睡所需时长"
                value={form.sleep.sleepLatency}
                onChange={(value) =>
                  updateSection("sleep", "sleepLatency", value)
                }
                placeholder="例如 20"
                unit="分钟"
                inputMode="numeric"
                optional
              />
              <TextField
                label="每晚醒来次数"
                value={form.sleep.nightWakeups}
                onChange={(value) =>
                  updateSection("sleep", "nightWakeups", value)
                }
                placeholder="例如 1"
                unit="次"
                inputMode="numeric"
                optional
              />
            </div>
            <RangeField
              label="醒后困倦程度"
              value={form.sleep.fatigue}
              lowLabel="神清气爽"
              highLabel="极度疲劳"
              onChange={(value) => updateSection("sleep", "fatigue", value)}
            />
          </FormCard>

          <FormCard number="12" title="恢复监测" subtitle="如有可穿戴设备数据，可填写平均值">
            <div className="field-grid">
              <TextField
                label="平均静息心率 RHR"
                value={form.sleep.rhr}
                onChange={(value) => updateSection("sleep", "rhr", value)}
                placeholder="例如 54"
                unit="bpm"
                inputMode="numeric"
                optional
              />
              <TextField
                label="RHR 统计周期"
                value={form.sleep.rhrPeriod}
                onChange={(value) =>
                  updateSection("sleep", "rhrPeriod", value)
                }
                placeholder="例如 6 个月"
                optional
              />
              <TextField
                label="平均 HRV"
                value={form.sleep.hrv}
                onChange={(value) => updateSection("sleep", "hrv", value)}
                placeholder="例如 57"
                unit="ms"
                inputMode="numeric"
                optional
              />
              <TextField
                label="HRV 统计周期"
                value={form.sleep.hrvPeriod}
                onChange={(value) =>
                  updateSection("sleep", "hrvPeriod", value)
                }
                placeholder="例如 6 个月"
                optional
              />
            </div>
            <FilePicker
              label="添加 HRV 截图"
              hint="支持手机截图或图片"
              fileName={form.files.hrvImage}
              accept="image/*"
              onSelect={(value) => updateFile("hrvImage", value)}
            />
            <TextAreaField
              label="睡眠或恢复情况补充"
              value={form.sleep.notes}
              onChange={(value) => updateSection("sleep", "notes", value)}
              placeholder="例如：近期鼻炎发作、压力增大、HRV 明显下降……"
              optional
            />
          </FormCard>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div className="card-stack">
          <FormCard number="13" title="核心改进方向" subtitle="可以同时选择多个目标">
            <div className="goal-grid">
              {GOAL_OPTIONS.map((goal) => {
                const selected = form.goals.includes(goal.value);
                return (
                  <button
                    key={goal.value}
                    type="button"
                    aria-pressed={selected}
                    className={selected ? "goal-card is-selected" : "goal-card"}
                    onClick={() => toggleGoal(goal.value)}
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

          <FormCard number="14" title="还有什么想解决" subtitle="可以不限于营养问题">
            <TextAreaField
              label="其他目标、身体问题或近期比赛安排"
              value={form.otherGoal}
              onChange={(value) =>
                setForm((current) => ({ ...current, otherGoal: value }))
              }
              placeholder="例如：希望改善比赛季鼻炎影响；准备参加连续多日的线上比赛；希望逐步增重并维持体脂率……"
              optional
            />
            <aside className="coach-note">
              <span>TIP</span>
              <p>写清楚时间节点和你希望达到的状态，会让咨询建议更具体。</p>
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
            <strong>{form.basic.name || "本次咨询用户"}的运动营养档案</strong>
          </div>
        </section>

        <SummaryCard
          number="01"
          title="基础档案"
          onEdit={() => moveTo(0)}
          rows={[
            { label: "姓名", value: form.basic.name },
            {
              label: "身体数据",
              value: `${form.basic.height || "—"} cm · ${form.basic.weight || "—"} kg · 体脂 ${form.basic.bodyFat || "—"}%`,
            },
          ]}
        />
        <SummaryCard
          number="02"
          title="训练计划"
          onEdit={() => moveTo(1)}
          rows={[
            {
              label: "训练频率",
              value: form.training.weeklyFrequency
                ? `每周 ${form.training.weeklyFrequency} 次`
                : "",
            },
            {
              label: "单次时长 / RPE",
              value: `${form.training.sessionDuration || "—"} 分钟 · RPE ${form.training.rpe}`,
            },
            {
              label: "力量基准",
              value: `抓举 ${form.training.snatch || "—"} / 挺举 ${form.training.cleanJerk || "—"} / 深蹲 ${form.training.squat || "—"} / 硬拉 ${form.training.deadlift || "—"} kg`,
            },
          ]}
        />
        <SummaryCard
          number="03"
          title="营养摄入"
          onEdit={() => moveTo(2)}
          rows={[
            { label: "饮食风格", value: form.nutrition.dietStyle },
            {
              label: "宏量营养",
              value: `碳水 ${form.nutrition.carbs || "—"}g · 蛋白质 ${form.nutrition.protein || "—"}g · 脂肪 ${form.nutrition.fat || "—"}g`,
            },
            {
              label: "饮水与盐分",
              value: `${form.nutrition.water || "—"} 升/天 · ${form.nutrition.salt || "未选择"}`,
            },
          ]}
        />
        <SummaryCard
          number="04"
          title="补剂与检测"
          onEdit={() => moveTo(3)}
          rows={[
            {
              label: "已记录补剂",
              value: filledSupplements.length
                ? filledSupplements.map((item) => item.name).join("、")
                : "暂无",
            },
            {
              label: "近期检测报告",
              value: form.files.labReport || "未添加",
            },
          ]}
        />
        <SummaryCard
          number="05"
          title="睡眠恢复"
          onEdit={() => moveTo(4)}
          rows={[
            {
              label: "作息",
              value: `${form.sleep.bedTime || "—"} 入睡 · ${form.sleep.wakeTime || "—"} 起床`,
            },
            {
              label: "恢复状态",
              value: `${form.sleep.regularity || "未选择"} · 醒后困倦 ${form.sleep.fatigue}/10`,
            },
          ]}
        />
        <SummaryCard
          number="06"
          title="改进目标"
          onEdit={() => moveTo(5)}
          rows={[
            { label: "优先方向", value: form.goals.join("、") },
            { label: "补充说明", value: form.otherGoal },
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
          <p>将当前填写的全部资料整理为 Excel 文件，包含档案数据与补剂清单，可继续编辑和归档。</p>
          <div className="export-options export-options-single">
            <button
              type="button"
              className="export-primary"
              disabled={exportStatus === "exporting"}
              onClick={exportXlsx}
            >
              <span>XLSX</span>
              <div>
                <strong>
                  {exportStatus === "exporting" ? "正在生成数据表…" : "下载 XLSX 数据表"}
                </strong>
                <small>档案数据 · 补剂清单</small>
              </div>
              <i aria-hidden="true">↓</i>
            </button>
          </div>
          {exportStatus === "success" && (
            <p className="export-feedback" role="status">文件已生成并开始下载。</p>
          )}
          {exportStatus === "error" && (
            <p className="export-feedback is-error" role="alert">生成失败，请稍后重试。</p>
          )}
        </section>
      </div>
    );
  };

  return (
    <main className="app-shell">
      <div className="mobile-canvas">
        <header className="topbar">
          <div className="topbar-copy">
            {step > 0 && (
              <button
                className="back-button"
                type="button"
                aria-label="返回上一步"
                onClick={() => moveTo(step - 1)}
              >
                ←
              </button>
            )}
            <div>
              <p className="eyebrow">咨询前信息采集</p>
              <p className="brand-title">运动营养档案</p>
            </div>
          </div>
          <div
            className="step-count"
            aria-label={`当前第 ${step + 1} 步，共 ${STEPS.length} 步`}
          >
            <strong>{String(step + 1).padStart(2, "0")}</strong>
            <span>/ {String(STEPS.length).padStart(2, "0")}</span>
          </div>
        </header>

        <div className="progress" aria-hidden="true">
          {STEPS.map((item, index) => (
            <span
              key={item.kicker}
              className={index <= step ? "is-active" : ""}
            />
          ))}
        </div>

        <section className="intro-block" aria-live="polite">
          <p className="section-kicker">{STEPS[step].kicker}</p>
          <h1>{STEPS[step].title}</h1>
          <p>{STEPS[step].description}</p>
        </section>

        <div className="step-stage" key={step}>
          {renderStep()}
        </div>

        {step < STEPS.length - 1 && (
          <div className="bottom-action">
            <p>
              {step === 3
                ? "本页内容均可选填"
                : stepIsValid
                  ? "信息已就绪，可以继续"
                  : "完成必填信息后即可继续"}
            </p>
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
