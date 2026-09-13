import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Star, Heart } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface Screen1WelcomeProps {
  onStart: () => void;
}

export const Screen1Welcome: React.FC<Screen1WelcomeProps> = ({ onStart }) => {
  const handleStart = () => {
    soundFx.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore
    }
    setTimeout(() => {
      onStart();
    }, 400);
  };

  return (
    <div
      id="screen-1-welcome"
      className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-6 px-4"
    >
      {/* Chapter Badge */}
      <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border-2 border-amber-300 px-4 py-1.5 rounded-full font-black text-sm sm:text-base mb-4 shadow-xs">
        <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
        <span>Chapter 1: Lessons 1 & 2 • Grade 2 Math</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-black text-slate-800 tracking-tight leading-tight mb-3">
        📊 Let's Learn Graphs!
      </h1>

      {/* Subtitle */}
      <p className="text-xl sm:text-2xl text-amber-800 font-bold max-w-2xl mx-auto mb-6 leading-relaxed">
        Let's collect information and make our own graph!
      </p>

      {/* Friendly Cartoon Illustration of Mr. Saif & Students */}
      <div className="relative my-4 bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg max-w-xl w-full">
        {/* Floating fun decorations */}
        <div className="absolute -top-3 -left-3 text-3xl animate-bounce-slow">🍎</div>
        <div className="absolute -top-3 -right-3 text-3xl animate-bounce-slow" style={{ animationDelay: '1s' }}>🍌</div>
        <div className="absolute -bottom-3 -left-3 text-3xl animate-bounce-slow" style={{ animationDelay: '1.5s' }}>⚽</div>
        <div className="absolute -bottom-3 -right-3 text-3xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>🐱</div>

        <div className="flex flex-col items-center">
          {/* Mr. Saif Avatar Center */}
          <div className="relative mb-3">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 p-1.5 shadow-xl mx-auto flex items-center justify-center transform hover:rotate-2 transition-transform">
              <div className="w-full h-full bg-amber-100 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border-2 border-amber-300">
                <div className="absolute top-0 w-full h-6 bg-slate-800 rounded-b-xl" />
                <div className="mt-4 flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-700 bg-blue-100 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-slate-900 rounded-full animate-ping" />
                    </div>
                    <div className="w-2 h-0.5 bg-slate-700" />
                    <div className="w-6 h-6 rounded-full border-2 border-slate-700 bg-blue-100 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-slate-900 rounded-full animate-ping" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-1 bg-red-300 rounded-full" />
                    <div className="w-4 h-1.5 border-b-3 border-slate-800 rounded-full" />
                    <span className="w-2 h-1 bg-red-300 rounded-full" />
                  </div>
                  <div className="w-7 h-4 bg-blue-600 rounded-t-sm mt-1 flex justify-center">
                    <div className="w-1.5 h-3 bg-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
            <span className="absolute -bottom-2 inset-x-0 mx-auto w-max bg-amber-600 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-md">
              Teacher Mr. Saif 👨‍🏫
            </span>
          </div>

          {/* Mr. Saif speech balloon */}
          <div className="bg-white rounded-2xl px-5 py-3 border-2 border-amber-200 shadow-xs max-w-md mt-2">
            <p className="text-slate-800 font-extrabold text-base sm:text-lg">
              "Welcome to our classroom! Today, we are going to be math detectives and learn how to collect data and make awesome graphs!"
            </p>
          </div>

          {/* Little cartoon classroom students */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="text-3xl filter drop-shadow-xs transform hover:scale-125 transition-transform cursor-default" title="Student">👦</span>
            <span className="text-3xl filter drop-shadow-xs transform hover:scale-125 transition-transform cursor-default" title="Student">👧</span>
            <span className="text-3xl filter drop-shadow-xs transform hover:scale-125 transition-transform cursor-default" title="Student">🧒</span>
            <span className="text-3xl filter drop-shadow-xs transform hover:scale-125 transition-transform cursor-default" title="Student">👧🏻</span>
            <span className="text-3xl filter drop-shadow-xs transform hover:scale-125 transition-transform cursor-default" title="Student">👦🏽</span>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="mt-6">
        <button
          id="welcome-start-button"
          onClick={handleStart}
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-2xl sm:text-3xl px-8 sm:px-12 py-4 sm:py-5 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer flex items-center gap-3 border-b-6 border-emerald-700 animate-pulse-glow"
        >
          <span>🚀 Let's Start!</span>
          <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />
        </button>
      </div>

      <p className="text-slate-400 font-bold text-xs sm:text-sm mt-4">
        Interactive Lesson created with love for Grade 2 with Mr. Saif ✨
      </p>
    </div>
  );
};
