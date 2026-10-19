import type { CellObject, SheetData } from "write-excel-file/browser";

import {
  WEEKLY_FEEDBACK_STEPS,
  type WeeklyFeedbackAnswers,
} from "./weekly-feedback-data";

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
  value: string,
  options: Partial<CellObject> = {},
): CellObject => ({ value, ...BODY_STYLE, ...options });

function localDateStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function safeFileNamePart(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "_");
}

function buildWeeklyFeedbackWorkbook(answers: WeeklyFeedbackAnswers) {
  const rows: SheetData = [
    [bodyCell("CrossFit 运动员每周营养反馈问卷", { fontWeight: "bold", fontSize: 16 })],
    [
      bodyCell(
        "建议每周固定同一时间填写。问卷不是急诊渠道；严重或急性症状请及时寻求医疗帮助。",
      ),
    ],
    [
      headerCell("序号"),
      headerCell("模块"),
      headerCell("问题 / 指标"),
      headerCell("本周填写"),
      headerCell("填写提示"),
    ],
  ];

  let index = 0;
  for (const step of WEEKLY_FEEDBACK_STEPS) {
    for (const question of step.fields) {
      index += 1;
      rows.push([
        bodyCell(String(index), { align: "center" }),
        bodyCell(step.title),
        bodyCell(question.label),
        bodyCell((answers[question.key] ?? "").trim()),
        bodyCell(question.hint ?? ""),
      ]);
    }
  }

  return [
    {
      data: rows,
      sheet: "每周反馈",
      columns: [
        { width: 8 },
        { width: 22 },
        { width: 48 },
        { width: 52 },
        { width: 46 },
      ],
      stickyRowsCount: 3,
      showGridLines: false,
      zoomScale: 0.9,
    },
  ];
}

export async function downloadWeeklyFeedbackWorkbook(
  answers: WeeklyFeedbackAnswers,
) {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const athleteName = safeFileNamePart(answers.athleteName ?? "") || "未命名运动员";
  const fileName =
    "CrossFit每周营养反馈_" + athleteName + "_" + localDateStamp() + ".xlsx";

  await writeXlsxFile(buildWeeklyFeedbackWorkbook(answers), {
    fontFamily: "Microsoft YaHei",
    fontSize: 11,
  }).toFile(fileName);

  return fileName;
}
