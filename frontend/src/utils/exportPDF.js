import jsPDF from "jspdf";

export function exportIncidentPDF(
  result
) {

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text(
    "AI Incident Report",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Severity: ${result.severity}`,
    20,
    40
  );

  doc.text(
    `Tags: ${result.tags}`,
    20,
    55
  );

  doc.text(
    `Root Cause: ${result.rootCause}`,
    20,
    70
  );

  doc.text(
    `Impact: ${result.impact}`,
    20,
    90
  );

  doc.text(
    "Recommended Actions:",
    20,
    110
  );

  doc.text(
    result.actions,
    20,
    125
  );

  doc.save("incident-report.pdf");
}