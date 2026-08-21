import React from "react";
import { Camera, Mic, Image as ImageIcon, Volume2, Calendar } from "lucide-react";

export default function MediaLogsTab({ mediaLogs = [], filterType = "photo" }) {
  if (!mediaLogs || mediaLogs.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 text-xs">
        No {filterType === "photo" ? "captured photos" : "audio recordings"} logged yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {mediaLogs.map((item, index) => {
        // Explicitly check item properties or fall back to filterType prop
        const isPhoto =
          filterType === "photo" ||
          item.type === "photo" ||
          item.mediaType === "photo" ||
          item.commandType === "capture_photo";

        const mediaUrl = item.payloadUrl || item.url || item.fileUri;
        const dateStr = item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "Recently";

        return (
          <div
            key={item._id || index}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                {isPhoto ? (
                  <>
                    <Camera size={14} className="text-blue-600" /> Photo Capture
                  </>
                ) : (
                  <>
                    <Mic size={14} className="text-emerald-600" /> Audio Recording
                  </>
                )}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar size={12} /> {dateStr}
              </span>
            </div>

            {/* Media Display Container */}
            <div className="rounded-lg overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center min-h-35">
              {isPhoto ? (
                mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt="Captured Media"
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                    <ImageIcon size={20} /> Photo unavailable
                  </div>
                )
              ) : mediaUrl ? (
                <div className="w-full p-3 space-y-2 text-center">
                  <Volume2 size={24} className="text-emerald-400 mx-auto" />
                  <audio controls key={mediaUrl} className="w-full h-8">
                    <source src={mediaUrl} />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              ) : (
                <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                  <Mic size={20} /> Audio file unavailable
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}