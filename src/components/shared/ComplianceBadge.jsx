export default function ComplianceBadge({ isCompliant }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isCompliant ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isCompliant ? "Compliant" : "Non-Compliant"}
    </span>
  );
}