import React from "react";
import { X, Trash2, ArrowUpRight, Clock, Image as ImageIcon } from "lucide-react";
import { HistoryItem } from "../types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onDeleteHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-400" />
            <h3 className="text-base font-bold text-white">Prompt History</h3>
            <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
              {history.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center text-neutral-500">
              <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm font-medium">No saved prompts yet</p>
              <p className="text-xs text-neutral-600 mt-1">
                Upload or select an image to generate and save prompts automatically
              </p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "numeric",
              });
              return (
                <div
                  key={item.id}
                  className="group relative flex gap-3 rounded-xl border border-neutral-850 bg-neutral-900/60 p-2.5 transition-all hover:border-neutral-750 hover:bg-neutral-900"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-16 w-16 rounded-lg object-cover bg-neutral-950 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="truncate text-xs font-semibold text-neutral-200 group-hover:text-white">
                        {item.title}
                      </h4>
                      <p className="line-clamp-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                        {item.data.midjourney.prompt || item.data.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-500">
                      <span>{dateStr}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectHistory(item);
                            onClose();
                          }}
                          className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-orange-400 hover:bg-orange-500/10"
                          title="Restore this prompt"
                        >
                          <span>Load</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteHistory(item.id);
                          }}
                          className="rounded p-1 text-neutral-500 hover:text-rose-400"
                          title="Delete from history"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
