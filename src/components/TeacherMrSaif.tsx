import React from 'react';
import { Volume2, Sparkles, Smile } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TeacherMrSaifProps {
  message: string;
  subtext?: string;
  mood?: 'happy' | 'excited' | 'thinking' | 'proud';
  size?: 'sm' | 'md' | 'lg';
  canSpeak?: boolean;
}

export const TeacherMrSaif: React.FC<TeacherMrSaifProps> = ({
  message,
  subtext,
  mood = 'happy',
  size = 'md',
  canSpeak = true,
}) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    soundFx.speak(message + (subtext ? '. ' + subtext : ''));
  };

  const getMoodEmoji = () => {
    switch (mood) {
      case 'excited':
        return '🌟';
      case 'thinking':
        return '💡';
      case 'proud':
        return '🏆';
      default:
        return '✨';
    }
  };

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div
      id="mr-saif-teacher-container"
      className={`flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-sm relative transition-all ${
        isLarge ? 'max-w-2xl mx-auto' : 'w-full'
      }`}
    >
      {/* Mr. Saif Avatar */}
      <div className="flex-shrink-0 relative group">
        <div
          className={`relative rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-1 shadow-md transform transition-transform group-hover:scale-105 ${
            isSmall ? 'w-14 h-14' : isLarge ? 'w-20 h-20' : 'w-16 h-16'
          } flex items-center justify-center`}
        >
          {/* Cartoon Character representation */}
          <div className="w-full h-full bg-amber-100 rounded-xl flex flex-col items-center justify-center overflow-hidden relative border border-amber-300">
            {/* Hair */}
            <div className="absolute top-0 w-full h-3 sm:h-4 bg-slate-800 rounded-b-lg"></div>
            {/* Face with friendly smile and glasses */}
            <div className="relative mt-2 flex flex-col items-center">
              {/* Eyes & Glasses */}
              <div className="flex items-center gap-1.5 z-10">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 bg-blue-100/70 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse"></div>
                </div>
                <div className="w-1 h-0.5 bg-slate-700"></div>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 bg-blue-100/70 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-pulse"></div>
                </div>
              </div>
              {/* Cheeks & Smile */}
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1 bg-red-300 rounded-full opacity-60"></div>
                <div className="w-2.5 h-1 border-b-2 border-slate-800 rounded-full"></div>
                <div className="w-1.5 h-1 bg-red-300 rounded-full opacity-60"></div>
              </div>
              {/* Tie / Shirt */}
              <div className="w-4 h-3 bg-blue-600 rounded-t-sm mt-0.5 flex justify-center">
                <div className="w-1 h-2 bg-yellow-400"></div>
              </div>
            </div>
          </div>

          {/* Mood badge */}
          <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-0.5 shadow-sm border border-amber-200">
            {getMoodEmoji()}
          </span>
        </div>

        {/* Teacher Label */}
        <div className="text-center mt-1">
          <span className="inline-block bg-amber-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-full tracking-wide shadow-xs">
            Mr. Saif 👨‍🏫
          </span>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 bg-white/95 rounded-2xl p-3 sm:p-3.5 border border-amber-200/90 shadow-xs relative">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-slate-800 font-bold text-base sm:text-lg leading-snug">
              {message}
            </div>
            {subtext && (
              <div className="text-slate-600 font-medium text-xs sm:text-sm mt-1 leading-relaxed">
                {subtext}
              </div>
            )}
          </div>

          {canSpeak && (
            <button
              id="mr-saif-speak-btn"
              onClick={handleSpeak}
              title="Click to hear Mr. Saif speak!"
              className="flex-shrink-0 p-2 text-amber-600 hover:text-amber-700 bg-amber-100/70 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Hear Mr. Saif read this aloud"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
