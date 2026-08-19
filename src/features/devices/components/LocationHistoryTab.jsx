import { MapPin, ExternalLink } from "lucide-react";

export default function LocationHistoryTab({ history = [] }) {
  if (history.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        No location updates logged yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <th className="py-2.5 px-3">Timestamp</th>
            <th className="py-2.5 px-3">Location / Address</th>
            <th className="py-2.5 px-3 text-right">Map Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {history.map((entry) => {
            const hasAddress = Boolean(entry.address || entry.locationName);

            return (
              <tr key={entry._id || entry.timestamp} className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'medium'
                  })}
                </td>
                
                <td className="py-3 px-3 text-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-600 shrink-0" />
                    {hasAddress ? (
                      <span className="font-semibold text-slate-800">
                        {entry.address || entry.locationName}
                      </span>
                    ) : (
                      <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                        {entry.lat}, {entry.lng}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3 px-3 text-right">
                  <a
                    href={`https://maps.google.com/?q=${entry.lat},${entry.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    View Map <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}