import { MapPin, ExternalLink, CheckCircle2, XCircle, Loader2 } from "lucide-react";

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
            <th className="py-2.5 px-3">Location Service</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {history.map((entry) => {
            const isLocationActive = typeof entry.locationServiceActive === "boolean"
                ? entry.locationServiceActive
                : (entry.isLocationActive ?? true);

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
                    <span className="font-semibold text-slate-800">
                      {entry.address || entry.locationName }
                    </span>
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

                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                      isLocationActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {isLocationActive ? (
                      <>
                        <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle size={12} className="text-rose-600 shrink-0" />
                        Disabled
                      </>
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}