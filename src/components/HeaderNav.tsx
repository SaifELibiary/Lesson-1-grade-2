import React from 'react';
import { Volume2, VolumeX, Settings, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { ScreenId } from '../types';
import { soundFx } from '../utils/audio';

interface HeaderNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenTeacherMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onResetAll: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenTeacherMode,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
  onResetAll,
}) => {
  const screens = [
    { id: 1, title: 'Welcome', emoji: '👋' },
    { id: 2, title: 'Data', emoji: '💡' },
    { id: 3, title: 'Vote', emoji: '🗳️' },
    { id: 4, title: 'Graph', emoji: '📊' },
    { id: 5, title: 'Read', emoji: '🔍' },
    { id: 6, title: 'Compare', emoji: '⚖️' },
    { id: 7, title: 'Chart', emoji: '📋' },
    { id: 8, title: 'Toys', emoji: '🧸' },
    { id: 9, title: 'Animals', emoji: '🐾' },
    { id: 10, title: 'Quiz', emoji: '🏆' },
  ];

  return (
    <header
      id="app-header"
      className="bg-white/95 backdrop-blur-sm border-b-3 border-amber-200 shadow-xs sticky top-0 z-30 px-3 sm:px-6 py-2.5"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Logo & Teacher attribution */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div
            onClick={() => {
              soundFx.playClick();
              onNavigate(1);
            }}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <span className="text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform">
              📊
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5 leading-none">
                <span>Grade 2 Math</span>
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">
                  Mr. Saif 👨‍🏫
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                Chapter 1: Graphs & Charts
              </p>
            </div>
          </div>

          {/* Quick controls on mobile */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-xl border ${
                soundEnabled
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-slate-100 text-slate-400 border-slate-300'
              }`}
              title={soundEnabled ? 'Mute Sounds' : 'Turn On Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenTeacherMode}
              className="bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Teacher</span>
            </button>
          </div>
        </div>

        {/* Step Progression Pills (1 to 10) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 max-w-full px-1">
          {screens.map((s) => {
            const isCurrent = s.id === currentScreen;
            const isCompleted = s.id < currentScreen;

            return (
              <button
                key={s.id}
                onClick={() => {
                  soundFx.playClick();
                  onNavigate(s.id as ScreenId);
                }}
                title={`Screen ${s.id}: ${s.title}`}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-900 shadow-sm scale-105 ring-2 ring-amber-500'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <span>{s.emoji}</span>
                <span className="hidden md:inline">{s.title}</span>
                <span className="md:hidden">{s.id}</span>
              </button>
            );
          })}
        </div>

        {/* Right side utility buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-400 border-slate-300'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Sound</span>
          </button>

          <button
            onClick={onOpenTeacherMode}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-extrabold text-xs px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102"
          >
            <Settings className="w-4 h-4" />
            <span>Teacher Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
};
