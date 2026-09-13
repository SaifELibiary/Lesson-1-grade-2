import React from 'react';
import { X, RotateCcw, Eye, EyeOff, Sparkles, Wand2, BookOpen, Check } from 'lucide-react';
import { ScreenId, TopicType, ItemVote } from '../types';
import { soundFx } from '../utils/audio';

interface TeacherControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenId;
  onJumpToScreen: (screen: ScreenId) => void;
  currentTopic: TopicType;
  onSelectTopic: (topic: TopicType) => void;
  items: ItemVote[];
  onUpdateVote: (itemId: string, newCount: number) => void;
  showAnswers: boolean;
  onToggleShowAnswers: () => void;
  onResetVotes: () => void;
  onRestartLesson: () => void;
  onApplyPreset: (type: 'balanced' | 'winner' | 'tie') => void;
}

export const TeacherControlsModal: React.FC<TeacherControlsModalProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onJumpToScreen,
  currentTopic,
  onSelectTopic,
  items,
  onUpdateVote,
  showAnswers,
  onToggleShowAnswers,
  onResetVotes,
  onRestartLesson,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="teacher-mode-modal"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 border-4 border-purple-400 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">👨‍🏫</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                Teacher Dashboard & Controls
              </h2>
              <p className="text-xs sm:text-sm text-purple-700 font-bold">
                Instructor tools for Mr. Saif & Classroom Teachers
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 pt-4">
          {/* Quick Jump to Any Screen */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              📍 Jump to Lesson Screen
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { s: 1, label: '1. Welcome' },
                { s: 2, label: '2. What is Data' },
                { s: 3, label: '3. Voting' },
                { s: 4, label: '4. Graph View' },
                { s: 5, label: '5. Read Graph' },
                { s: 6, label: '6. More/Less' },
                { s: 7, label: '7. Make Chart' },
                { s: 8, label: '8. Toys Survey' },
                { s: 9, label: '9. Animals' },
                { s: 10, label: '10. Quiz' },
              ].map(({ s, label }) => (
                <button
                  key={s}
                  onClick={() => {
                    soundFx.playClick();
                    onJumpToScreen(s as ScreenId);
                    onClose();
                  }}
                  className={`px-2.5 py-2 rounded-xl text-xs font-black border text-left transition-all cursor-pointer ${
                    currentScreen === s
                      ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                      : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Survey Topic Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              📂 Active Survey Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fruits', label: '🍎 Fruits (Classroom)' },
                { id: 'toys', label: '🧸 Toys (Survey 2)' },
                { id: 'animals', label: '🐾 Animals (Survey 3)' },
              ].map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectTopic(topic.id as TopicType);
                  }}
                  className={`p-3 rounded-2xl border-2 font-black text-sm text-center transition-all cursor-pointer ${
                    currentTopic === topic.id
                      ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Vote Presets & Manual Adjustments */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                🔢 Current Votes Simulation
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500">Presets:</span>
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    onApplyPreset('winner');
                  }}
                  className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded-lg border border-slate-300 font-bold cursor-pointer"
                >
                  ⭐ Big Winner
                </button>
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    onApplyPreset('tie');
                  }}
                  className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded-lg border border-slate-300 font-bold cursor-pointer"
                >
                  🤝 Tie (Equal)
                </button>
                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    onApplyPreset('balanced');
                  }}
                  className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded-lg border border-slate-300 font-bold cursor-pointer"
                >
                  🎲 Balanced
                </button>
              </div>
            </div>

            {/* Item Steppers */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col items-center shadow-2xs"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-full">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onUpdateVote(item.id, Math.max(0, item.votes - 1));
                      }}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="font-black text-slate-800 text-base w-5 text-center">
                      {item.votes}
                    </span>
                    <button
                      onClick={() => {
                        soundFx.playPop();
                        onUpdateVote(item.id, item.votes + 1);
                      }}
                      className="w-7 h-7 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-black flex items-center justify-center cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Presentation Toggles & Master Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onToggleShowAnswers();
              }}
              className={`p-3 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                showAnswers
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {showAnswers ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
              <span>{showAnswers ? 'Answers: Visible 🟢' : 'Answers: Hidden ⚪'}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playPop();
                onResetVotes();
              }}
              className="p-3 rounded-2xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Current Votes</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onRestartLesson();
                onClose();
              }}
              className="p-3 rounded-2xl border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Restart Full Lesson</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
