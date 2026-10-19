import type { Metadata } from "next";

import WeeklyFeedbackForm from "../weekly-feedback-form";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "CrossFit 运动员每周营养反馈",
  description: "按周整理 CrossFit 训练、营养、睡眠与恢复情况。",
};

export default function WeeklyFeedbackPage() {
  return <WeeklyFeedbackForm />;
}
