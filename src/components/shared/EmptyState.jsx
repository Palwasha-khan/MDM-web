export default function EmptyState({ title, description, icon = "📭" }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 py-16 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-slate-700 font-medium">{title}</p>
      {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
    </div>
  );
}