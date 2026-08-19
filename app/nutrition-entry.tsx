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
          <section className="entry-intro">
            <p className="section-kicker">营养咨询</p>
            <h1>选择你的方向</h1>
            <p>根据当前目标，填写对应信息。</p>
          </section>

          <div className="entry-choices">
            <button
              type="button"
              className="entry-choice entry-choice-performance"
              onClick={() => chooseMode("athlete")}
            >
              <span className="entry-choice-index">01</span>
              <strong>运动表现提升</strong>
              <span className="entry-choice-description">规律训练 · 备赛 · 专项表现</span>
              <i className="entry-choice-arrow" aria-hidden="true">→</i>
            </button>

            <button
              type="button"
              className="entry-choice entry-choice-health"
              onClick={() => chooseMode("health")}
            >
              <span className="entry-choice-index">02</span>
              <strong>日常健康管理</strong>
              <span className="entry-choice-description">体重管理 · 饮食 · 健康状态</span>
              <i className="entry-choice-arrow" aria-hidden="true">→</i>
            </button>
          </div>
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
