type CsvValue = string | number | boolean | null | undefined;

export type CsvColumn<T> = {
  header: string;
  value: (row: T) => CsvValue;
};

// Prevents spreadsheet apps from evaluating cell contents as formulas,
// while leaving plain numbers like "+64 21 123 4567" untouched.
const neutraliseFormula = (value: string) =>
  /^[=+\-@\t\r]/.test(value) && !/^[+-]?[\d\s().-]+$/.test(value)
    ? `'${value}`
    : value;

const escapeCell = (value: CsvValue) => {
  if (value === null || value === undefined) return "";

  const text = neutraliseFormula(String(value));
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCsv = <T>(rows: T[], columns: CsvColumn<T>[]) =>
  [
    columns.map((column) => escapeCell(column.header)).join(","),
    ...rows.map((row) =>
      columns.map((column) => escapeCell(column.value(row))).join(",")
    ),
  ].join("\r\n");

export const downloadCsv = (filename: string, csv: string) => {
  // The BOM lets Excel detect UTF-8 so names with macrons render correctly.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
