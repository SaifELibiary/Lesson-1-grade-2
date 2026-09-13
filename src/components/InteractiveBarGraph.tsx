import React, { useState } from 'react';
import { ItemVote } from '../types';
import { soundFx } from '../utils/audio';

interface InteractiveBarGraphProps {
  title: string;
  items: ItemVote[];
  onBarClick?: (item: ItemVote) => void;
  selectedItemId?: string | null;
  highlightItemIds?: string[];
  maxScale?: number;
  showToggle?: boolean;
}

export const InteractiveBarGraph: React.FC<InteractiveBarGraphProps> = ({
  title,
  items,
  onBarClick,
  selectedItemId,
  highlightItemIds = [],
  maxScale = 8,
  showToggle = true,
}) => {
  const [viewMode, setViewMode] = useState<'graph' | 'chart'>('graph');

  // Compute maximum scale height (at least 8, or highest vote + 2)
  const highestVote = Math.max(...items.map((i) => i.votes), 0);
  const chartMax = Math.max(maxScale, highestVote + 1, 8);

  const yTicks = Array.from({ length: chartMax + 1 }, (_, i) => chartMax - i);

  return (
    <div
      id="interactive-graph-card"
      className="bg-white rounded-3xl p-4 sm:p-6 border-3 border-sky-200 shadow-md flex flex-col w-full max-w-4xl mx-auto"
    >
      {/* Header with Title and Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide flex items-center gap-2">
          <span>{title}</span>
        </h3>

        {showToggle && (
          <div className="flex items-center bg-sky-50 p-1.5 rounded-2xl border border-sky-200">
            <button
              id="graph-toggle-bar"
              onClick={() => {
                soundFx.playClick();
                setViewMode('graph');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                viewMode === 'graph'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              📊 Bar Graph
            </button>
            <button
              id="graph-toggle-chart"
              onClick={() => {
                soundFx.playClick();
                setViewMode('chart');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                viewMode === 'chart'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              📋 Chart
            </button>
          </div>
        )}
      </div>

      {viewMode === 'graph' ? (
        /* Vertical Bar Graph */
        <div className="relative pt-6 pb-2 select-none">
          {/* Main Graph Grid */}
          <div className="flex h-64 sm:h-72 w-full">
            {/* Y-Axis numbers */}
            <div className="flex flex-col justify-between items-end pr-3 select-none text-slate-500 font-extrabold text-sm sm:text-base w-7 sm:w-9">
              {yTicks.map((val) => (
                <div key={val} className="h-0 flex items-center justify-end">
                  {val}
                </div>
              ))}
            </div>

            {/* Bars Area with horizontal reference lines */}
            <div className="relative flex-1 border-l-3 border-b-3 border-slate-700 flex items-end justify-around px-2 sm:px-6">
              {/* Grid guide lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {yTicks.map((tick) => (
                  <div
                    key={tick}
                    className="w-full border-b border-dashed border-slate-200/90"
                  />
                ))}
              </div>

              {/* Individual Vertical Bars */}
              {items.map((item) => {
                const heightPercent =
                  chartMax > 0 ? (item.votes / chartMax) * 100 : 0;
                const isSelected = selectedItemId === item.id;
                const isHighlighted = highlightItemIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onBarClick) {
                        soundFx.playClick();
                        onBarClick(item);
                      }
                    }}
                    className={`flex flex-col items-center justify-end h-full w-12 sm:w-16 z-10 ${
                      onBarClick ? 'cursor-pointer group' : ''
                    }`}
                  >
                    {/* Number on top of bar */}
                    <div
                      className={`mb-1 transition-all duration-300 font-black text-sm sm:text-base rounded-full px-2 py-0.5 shadow-xs ${
                        isHighlighted || isSelected
                          ? 'bg-amber-400 text-slate-900 scale-110 ring-2 ring-amber-500'
                          : 'bg-white text-slate-800 border border-slate-300'
                      }`}
                    >
                      {item.votes}
                    </div>

                    {/* The Bar */}
                    <div className="w-full flex items-end justify-center h-full max-h-[85%]">
                      <div
                        style={{
                          height: `${Math.max(heightPercent, 2)}%`,
                          backgroundColor: item.color,
                        }}
                        className={`w-9 sm:w-12 rounded-t-xl transition-all duration-700 ease-out shadow-sm relative group-hover:brightness-110 ${
                          isSelected ? 'ring-4 ring-yellow-400 brightness-110' : ''
                        } ${
                          isHighlighted ? 'ring-4 ring-emerald-400 animate-pulse' : ''
                        }`}
                      >
                        {/* Shimmer light effect on bar */}
                        <div className="absolute inset-x-0 top-0 h-2 bg-white/40 rounded-t-xl" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-Axis Labels (Names & Emojis) */}
          <div className="flex ml-7 sm:ml-9 justify-around items-start pt-3 border-t border-transparent">
            {items.map((item) => {
              const isSelected = selectedItemId === item.id;
              const isHighlighted = highlightItemIds.includes(item.id);

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    if (onBarClick) {
                      soundFx.playClick();
                      onBarClick(item);
                    }
                  }}
                  className={`w-14 sm:w-20 flex flex-col items-center text-center p-1 rounded-2xl transition-all ${
                    onBarClick
                      ? 'cursor-pointer hover:bg-sky-50 active:scale-95'
                      : ''
                  } ${
                    isSelected
                      ? 'bg-amber-100 ring-2 ring-amber-400 font-black'
                      : isHighlighted
                      ? 'bg-emerald-100 ring-2 ring-emerald-400'
                      : ''
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow-xs transform transition-transform group-hover:scale-110">
                    {item.emoji}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-700 mt-0.5 truncate w-full">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table / Chart Mode */
        <div className="py-2 overflow-x-auto">
          <table className="w-full text-left border-collapse border-2 border-sky-300 rounded-2xl overflow-hidden shadow-xs">
            <thead>
              <tr className="bg-sky-100 text-slate-800 text-base sm:text-lg font-black border-b-2 border-sky-300">
                <th className="p-3 sm:p-4">{items[0]?.id === 'apple' ? 'Favorite Fruit 🍎' : 'Item'}</th>
                <th className="p-3 sm:p-4 text-center">Tally / Students</th>
                <th className="p-3 sm:p-4 text-center">Number of Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 text-slate-700 text-base sm:text-lg font-bold">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="p-3 sm:p-4 flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-extrabold">{item.name}</span>
                  </td>
                  <td className="p-3 sm:p-4 text-center text-xl">
                    {Array.from({ length: item.votes }).map((_, idx) => (
                      <span key={idx} className="inline-block mx-0.5">
                        👤
                      </span>
                    ))}
                    {item.votes === 0 && <span className="text-slate-400 font-normal text-sm">None yet</span>}
                  </td>
                  <td className="p-3 sm:p-4 text-center">
                    <span className="inline-block bg-sky-200/70 text-sky-900 px-4 py-1 rounded-full font-black text-xl">
                      {item.votes}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
