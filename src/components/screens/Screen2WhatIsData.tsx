import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, HelpCircle } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { TeacherMrSaif } from '../TeacherMrSaif';

interface Screen2WhatIsDataProps {
  onNext: () => void;
}

export const Screen2WhatIsData: React.FC<Screen2WhatIsDataProps> = ({ onNext }) => {
  const [activeFruit, setActiveFruit] = useState<string | null>(null);

  const fruitSamples = [
    { name: 'Apple', emoji: '🍎', sound: 'Crisp & Sweet!' },
    { name: 'Banana', emoji: '🍌', sound: 'Yummy & Soft!' },
    { name: 'Strawberry', emoji: '🍓', sound: 'Berry Delicious!' },
    { name: 'Orange', emoji: '🍊', sound: 'Juicy & Citrus!' },
  ];

  return (
    <div
      id="screen-2-what-is-data"
      className="max-w-4xl mx-auto flex flex-col items-center py-6 px-4"
    >
      {/* Teacher Mr. Saif speaks */}
      <div className="w-full mb-6">
        <TeacherMrSaif
          message="What is Data? Data is just information we collect by asking questions!"
          subtext="Listen carefully to see how we collect information from our friends!"
          mood="thinking"
          size="lg"
        />
      </div>

      {/* Main Educational Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg w-full text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-900 px-4 py-1.5 rounded-full font-black text-sm mb-4 border border-sky-300">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Big Math Word of the Day: DATA</span>
        </div>

        {/* Big Simple Definition */}
        <div className="bg-amber-50 rounded-2xl p-6 border-2 border-dashed border-amber-300 my-2 max-w-xl mx-auto">
          <p className="text-2xl sm:text-3xl font-black text-slate-800 leading-snug">
            "Data is <span className="text-amber-600 underline decoration-wavy decoration-amber-400">information</span> we collect."
          </p>
        </div>

        {/* Real-life example */}
        <div className="mt-6">
          <p className="text-xl sm:text-2xl font-black text-slate-700 mb-3">
            For example: <br className="sm:hidden" />
            <span className="text-purple-600">"What is your favorite fruit?"</span>
          </p>
          <p className="text-sm sm:text-base text-slate-500 font-bold mb-4">
            Tap a fruit below to see how we collect answers:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {fruitSamples.map((fruit) => (
              <button
                key={fruit.name}
                onClick={() => {
                  soundFx.playPop();
                  setActiveFruit(fruit.name);
                }}
                className={`p-4 rounded-2xl border-3 flex flex-col items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                  activeFruit === fruit.name
                    ? 'bg-amber-100 border-amber-500 shadow-md scale-105'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                }`}
              >
                <span className="text-4xl filter drop-shadow-xs">{fruit.emoji}</span>
                <span className="font-extrabold text-slate-800 text-base">{fruit.name}</span>
              </button>
            ))}
          </div>

          {activeFruit && (
            <div className="mt-4 inline-block bg-emerald-100 border border-emerald-300 text-emerald-900 font-black px-4 py-2 rounded-xl text-base animate-bounce-slow">
              ✨ Great choice! Someone in our class loves {activeFruit}!
            </div>
          )}
        </div>

        {/* Classroom prompt */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100">
          <p className="text-2xl sm:text-3xl font-black text-slate-800 mb-5">
            Let's ask our class! 🏫
          </p>

          <button
            id="start-voting-button"
            onClick={() => {
              soundFx.playSuccess();
              onNext();
            }}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-2xl sm:text-3xl px-8 sm:px-12 py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer inline-flex items-center gap-3 border-b-6 border-orange-700"
          >
            <span>Let's Vote! 🗳️</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
