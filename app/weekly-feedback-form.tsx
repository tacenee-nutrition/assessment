"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  WEEKLY_FEEDBACK_STEPS,
  type FeedbackQuestion,
  type WeeklyFeedbackAnswers,
} from "./weekly-feedback-data";
import { downloadWeeklyFeedbackWorkbook } from "./weekly-feedback-xlsx";

const PREVIEW_STEP = WEEKLY_FEEDBACK_STEPS.length;
const TOTAL_STEPS = WEEKLY_FEEDBACK_STEPS.length + 1;

function localDateInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: FeedbackQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  if (question.kind === "range") {
    const min = question.min ?? 1;
    const max = question.max ?? 10;
    const midpoint = String(Math.round((min + max) / 2));

    return (
      <div className="range-field weekly-range-field">
        <div className="range-heading">
          <span>
            {question.label}
            {question.required ? null : <small>选填</small>}
          </span>
          <output>
            {value
              ? value + (question.unit ?? "") + " / " + max
              : "未选择"}
          </output>
        </div>
        <input
          aria-label={question.label}
          aria-valuetext={value ? value + " / " + max : "未选择"}
          type="range"
          min={min}
          max={max}
          step={question.step ?? 1}
          value={value || midpoint}
          onChange={(event) => onChange(event.target.value)}
        />
        <div className="range-labels">
          <span>{question.lowLabel ?? String(min)}</span>
          <span>{question.highLabel ?? String(max)}</span>
        </div>
        {question.hint && <p className="field-hint">{question.hint}</p>}
      </div>
    );
  }

  if (question.kind === "choice" || question.kind === "multi") {
    const selectedValues =
      question.kind === "multi" && value ? value.split("、") : [value];
    const isMulti = question.kind === "multi";

    const toggleOption = (option: string) => {
      if (!isMulti) {
        onChange(value === option ? "" : option);
        return;
      }

      const selected = new Set(selectedValues.filter(Boolean));
      if (selected.has(option)) selected.delete(option);
      else selected.add(option);
      onChange(Array.from(selected).join("、"));
    };

    return (
      <fieldset className="choice-field weekly-choice-field">
        <legend>
          {question.label}
          {question.required ? null : <small>选填</small>}
        </legend>
        <div className="choice-pills weekly-choice-pills">
          {(question.options ?? []).map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isSelected}
                className={isSelected ? "is-selected" : ""}
                onClick={() => toggleOption(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
        {question.hint && <p className="field-hint">{question.hint}</p>}
      </fieldset>
    );
  }

  if (question.kind === "textarea") {
    return (
      <label className="field weekly-field">
        <span>
          {question.label}
          {question.required ? null : <small>选填</small>}
        </span>
        <textarea
          aria-label={question.label}
          rows={3}
          placeholder={question.placeholder}
          value={value}
          required={question.required}
          onChange={(event) => onChange(event.target.value)}
        />
        {question.hint && <small className="weekly-field-hint">{question.hint}</small>}
      </label>
    );
  }

  const inputType =
    question.kind === "date"
      ? "date"
      : question.kind === "number"
        ? "number"
        : "text";

  return (
    <label className="field weekly-field">
      <span>
        {question.label}
        {question.required ? null : <small>选填</small>}
      </span>
      <div className={question.unit ? "unit-input" : "plain-input"}>
        <input
          aria-label={question.unit ? question.label + "，单位" + question.unit : question.label}
          type={inputType}
          inputMode={question.kind === "number" ? "decimal" : undefined}
          min={question.min}
          max={question.max}
          step={question.step}
          placeholder={question.placeholder}
          value={value}
          required={question.required}
          onChange={(event) => onChange(event.target.value)}
        />
        {question.unit && <em>{question.unit}</em>}
      </div>
      {question.hint && <small className="weekly-field-hint">{question.hint}</small>}
    </label>
  );
}

function FormCard({ children }: { children: ReactNode }) {
  return (
    <section className="form-card">
      <div className="weekly-question-list">{children}</div>
    </section>
  );
}

function SummaryCard({
  number,
  title,
  answers,
  questions,
  onEdit,
}: {
  number: string;
  title: string;
  answers: WeeklyFeedbackAnswers;
  questions: FeedbackQuestion[];
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
        {questions.map((question) => (
          <div key={question.key}>
            <dt>{question.label}</dt>
            <dd>{answers[question.key]?.trim() || "未填写"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function WeeklyFeedbackForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WeeklyFeedbackAnswers>({});
  const [exportStatus, setExportStatus] = useState<
    "idle" | "exporting" | "success" | "error"
  >("idle");

  useEffect(() => {
    setAnswers((current) =>
      current.weekEnd ? current : { ...current, weekEnd: localDateInputValue() },
    );
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  const updateAnswer = (key: string, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const currentStep = WEEKLY_FEEDBACK_STEPS[step];
  const dateRangeIsValid =
    !answers.weekStart ||
    !answers.weekEnd ||
    answers.weekEnd >= answers.weekStart;
  const firstStepIsValid = Boolean(
    answers.athleteName?.trim() &&
      answers.weekStart &&
      answers.weekEnd &&
      dateRangeIsValid,
  );
  const stepIsValid = step === 0 ? firstStepIsValid : true;

  const validationMessage =
    step === 0 && !answers.athleteName?.trim()
      ? "请填写姓名"
      : step === 0 && (!answers.weekStart || !answers.weekEnd)
        ? "请填写开始和结束日期"
        : step === 0 && !dateRangeIsValid
          ? "结束日期不能早于开始日期"
          : "基础信息已就绪，可以继续";

  const moveTo = (nextStep: number) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setStep(nextStep);
  };

  const next = () => {
    if (stepIsValid && step < PREVIEW_STEP) moveTo(step + 1);
  };

  const exportXlsx = async () => {
    if (exportStatus === "exporting") return;

    setExportStatus("exporting");
    try {
      await downloadWeeklyFeedbackWorkbook(answers);
      setExportStatus("success");
    } catch (error) {
      console.error("Weekly feedback XLSX export failed", error);
      setExportStatus("error");
    }
  };

  const renderPreview = () => (
    <div className="review-stack">
      {WEEKLY_FEEDBACK_STEPS.map((item, index) => (
        <SummaryCard
          key={item.title}
          number={String(index + 1).padStart(2, "0")}
          title={item.title}
          answers={answers}
          questions={item.fields}
          onEdit={() => moveTo(index)}
        />
      ))}
      <section className="export-card">
        <div className="export-heading">
          <div>
            <span>完成反馈</span>
            <h2>下载本周问卷</h2>
          </div>
          <small>XLSX</small>
        </div>
        <p>
          下载后可将表格发给营养师。问卷不会自动提交或上传，页面关闭后也不会保留本次填写内容。
        </p>
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
                {exportStatus === "exporting"
                  ? "正在生成问卷…"
                  : "下载每周反馈表"}
              </strong>
              <small>包括本周回答与填写提示</small>
            </div>
            <i aria-hidden="true">↓</i>
          </button>
        </div>
        {exportStatus === "success" && (
          <p className="export-feedback" role="status">
            文件已生成并开始下载。
          </p>
        )}
        {exportStatus === "error" && (
          <p className="export-feedback is-error" role="alert">
            生成失败，请稍后重试。
          </p>
        )}
      </section>
    </div>
  );

  return (
    <main className="app-shell">
      <div className="mobile-canvas weekly-canvas">
        <header className="topbar">
          <div className="topbar-copy">
            {step === 0 ? (
              <a
                className="back-button"
                href="../"
                aria-label="返回入口选择"
              >
                <span className="chevron-left-icon" aria-hidden="true" />
              </a>
            ) : (
              <button
                className="back-button"
                type="button"
                aria-label="返回上一步"
                onClick={() => moveTo(step - 1)}
              >
                <span className="chevron-left-icon" aria-hidden="true" />
              </button>
            )}
            {step === 0 && (
              <div>
                <p className="eyebrow">CrossFit 运动员</p>
                <p className="brand-title">每周营养反馈</p>
              </div>
            )}
          </div>
          <div
            className="step-count"
            aria-label={"当前第 " + String(step + 1) + " 步，共 " + String(TOTAL_STEPS) + " 步"}
          >
            <strong>{String(step + 1).padStart(2, "0")}</strong>
            <span>/ {String(TOTAL_STEPS).padStart(2, "0")}</span>
          </div>
        </header>

        <div
          className="progress"
          aria-hidden="true"
          style={{ gridTemplateColumns: "repeat(" + TOTAL_STEPS + ", minmax(0, 1fr))" }}
        >
          {Array.from({ length: TOTAL_STEPS }, (_, index) => (
            <span
              key={index}
              className={index <= step ? "is-active" : ""}
            />
          ))}
        </div>

        <section className="intro-block" aria-live="polite">
          <h1>
            {step === PREVIEW_STEP ? "反馈预览" : currentStep.title}
          </h1>
        </section>

        <div className="step-stage" key={step}>
        {step < PREVIEW_STEP ? (
            <FormCard>
              {currentStep.fields.map((question) => (
                <QuestionField
                  key={question.key}
                  question={question}
                  value={answers[question.key] ?? ""}
                  onChange={(value) => updateAnswer(question.key, value)}
                />
              ))}
              {step === 0 && (
                <aside className="privacy-note weekly-intro-note">
                  <span aria-hidden="true">✓</span>
                  <p>
                    建议每周固定同一时间填写。严重或急性症状请及时寻求医疗帮助，不要等待周报回复。
                  </p>
                </aside>
              )}
              {step === 6 && (
                <aside className="weekly-alert-note" role="note">
                  胸痛、晕厥、严重呼吸困难或明显异常心悸等严重或急性症状，请及时寻求医疗帮助。
                </aside>
              )}
            </FormCard>
          ) : (
            renderPreview()
          )}
        </div>

        {step < PREVIEW_STEP && (
          <div className="bottom-action">
            <p>{step === 0 ? validationMessage : "本页问题均可选填，可以继续填写"}</p>
            <button type="button" disabled={!stepIsValid} onClick={next}>
              {step === PREVIEW_STEP - 1 ? "查看反馈预览" : "继续填写"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
