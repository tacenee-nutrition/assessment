"use client";

import { useState } from "react";

import HealthIntakeForm from "./health-intake-form";
import IntakeForm from "./intake-form";

type EntryMode = "athlete" | "health" | null;

export default function NutritionEntry() {
  const [mode, setMode] = useState<EntryMode>(null);
  const [visited, setVisited] = useState({ athlete: false, health: false });

  const chooseMode = (nextMode: Exclude<EntryMode, null>) => {
    setVisited((current) => ({ ...current, [nextMode]: true }));
    setMode(nextMode);
  };

  return (
    <>
      <main className="entry-shell" hidden={mode !== null}>
        <div className="entry-canvas">
          <header className="entry-brand">
            <span className="entry-brand-mark" aria-hidden="true">N</span>
            <div>
              <p>咨询前信息采集</p>
              <strong>个人营养档案</strong>
            </div>
          </header>

          <section className="entry-intro">
            <p className="section-kicker">选择咨询方向</p>
            <h1>从更适合你的入口开始</h1>
            <p>不同目标，需要关注的信息不同。选择更符合你当前情况的方向。</p>
          </section>

          <div className="entry-choices">
            <button
              type="button"
              className="entry-choice entry-choice-performance"
              onClick={() => chooseMode("athlete")}
            >
              <span className="entry-choice-index">01</span>
              <span className="entry-choice-tag">训练 · 恢复 · 竞技表现</span>
              <strong>运动表现提升</strong>
              <span className="entry-choice-description">适合规律训练、备赛或希望提升专项表现的人群</span>
              <span className="entry-choice-footer">
                <b>建立运动营养档案</b>
                <i aria-hidden="true">→</i>
              </span>
            </button>

            <button
              type="button"
              className="entry-choice entry-choice-health"
              onClick={() => chooseMode("health")}
            >
              <span className="entry-choice-index">02</span>
              <span className="entry-choice-tag">体重 · 饮食 · 健康状态</span>
              <strong>日常健康管理</strong>
              <span className="entry-choice-description">适合减脂增肌、改善饮食、体检指标和生活状态的人群</span>
              <span className="entry-choice-footer">
                <b>建立健康营养档案</b>
                <i aria-hidden="true">→</i>
              </span>
            </button>
          </div>

          <aside className="entry-guide">
            <span aria-hidden="true">?</span>
            <p>
              <strong>不知道怎么选？</strong>
              有系统训练或比赛计划，选择运动表现提升；主要关注体重和健康，选择日常健康管理。
            </p>
          </aside>
        </div>
      </main>

      {visited.athlete && (
        <div hidden={mode !== "athlete"}>
          <IntakeForm onExit={() => setMode(null)} />
        </div>
      )}
      {visited.health && (
        <div hidden={mode !== "health"}>
          <HealthIntakeForm onExit={() => setMode(null)} />
        </div>
      )}
    </>
  );
}
