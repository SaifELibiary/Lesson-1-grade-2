import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, Scale, CheckCircle2, RotateCcw } from 'lucide-react';
import { ItemVote } from '../../types';
import { soundFx } from '../../utils/audio';
import { TeacherMrSaif } from '../TeacherMrSaif';

interface Screen6MoreLessSameProps {
  items: ItemVote[];
  onNext: () => void;
  onPrev: () => void;
}

export const Screen6MoreLessSame: React.FC<Screen6MoreLessSameProps> = ({
  items,
  onNext,
  onPrev,
}) => {
  // Pairs comparison index
  const [pairIndex, setPairIndex] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | 'idle';
    text: string;
  }>({ type: 'idle', text: '' });

  // Generate pair candidates from current items
  const pairs: [ItemVote, ItemVote][] = [
    [items[0] ?? { id: '1', name: 'Apple', emoji: '🍎', color: '#ef4444', votes: 5 }, items[1] ?? { id: '2', name: 'Banana', emoji: '🍌', color: '#eab308', votes: 7 }],
    [items[2] ?? { id: '3', name: 'Strawberry', emoji: '🍓', color: '#f43f5e', votes: 4 }, items[3] ?? { id: '4', name: 'Orange', emoji: '🍊', color: '#f97316', votes: 2 }],
    [items[4] ?? { id: '5', name: 'Grape', emoji: '🍇', color: '#8b5cf6', votes: 3 }, items[0] ?? { id: '1', name: 'Apple', emoji: '🍎', color: '#ef4444', votes: 3 }],
  ];

  const currentPair = pairs[pairIndex % pairs.length];
  const itemA = currentPair[0];
  const itemB = currentPair[1];

  // Compare item A relative to item B
  // E.g., Does Item A have MORE, LESS, or SAME as Item B?
  const actualRelation =
    itemA.votes > itemB.votes
      ? 'MORE'
      : itemA.votes < itemB.votes
      ? 'LESS'
      : 'SAME';

  const handleChoice = (choice: 'MORE' | 'LESS' | 'SAME') => {
    if (choice === actualRelation) {
      soundFx.playSuccess();
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      } catch {
        // Ignore
      }
      setFeedback({
        type: 'correct',
        text: `🎉 You got it! ${itemA.emoji} ${itemA.name} (${itemA.votes}) has ${actualRelation} votes than ${itemB.emoji} ${itemB.name} (${itemB.votes})!`,
      });
    } else {
      soundFx.playTryAgain();
      const hint =
        actualRelation === 'SAME'
          ? `Both have ${itemA.votes} votes! They are the SAME height!`
          : actualRelation === 'MORE'
          ? `${itemA.name} (${itemA.votes}) is taller than ${itemB.name} (${itemB.votes})! It has MORE!`
          : `${itemA.name} (${itemA.votes}) is shorter than ${itemB.name} (${itemB.votes})! It has LESS!`;
      setFeedback({
        type: 'wrong',
        text: `Not quite! ${hint}`,
      });
    }
  };

  const nextPair = () => {
    soundFx.playClick();
    setFeedback({ type: 'idle', text: '' });
    setPairIndex((prev) => (prev + 1) % pairs.length);
  };

  const maxVal = Math.max(itemA.votes, itemB.votes, 7);

  return (
    <div
      id="screen-6-more-less-same"
      className="max-w-4xl mx-auto flex flex-col items-center py-4 px-4"
    >
      {/* Teacher Mr. Saif guidance */}
      <div className="w-full mb-4">
        <TeacherMrSaif
          message="Time for the Comparison Game! Look at the two bars below!"
          subtext={`Round ${pairIndex + 1} of ${pairs.length}: Compare ${itemA.name} with ${itemB.name}!`}
          mood="excited"
        />
      </div>

      {/* Comparison Arena Card */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-lg text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 px-4 py-1.5 rounded-full font-black text-sm mb-4 border border-purple-300">
          <Scale className="w-4 h-4 text-purple-600" />
          <span>Compare: MORE, LESS, or SAME?</span>
        </div>

        {/* The Question */}
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6">
          Does <span className="text-red-600">{itemA.emoji} {itemA.name}</span> have MORE, LESS, or the SAME votes as <span className="text-amber-600">{itemB.emoji} {itemB.name}</span>?
        </h2>

        {/* Side-by-Side Visual Bars */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 mb-6 max-w-lg mx-auto flex items-end justify-center gap-8 sm:gap-14 h-64 relative">
          {/* Bar A */}
          <div className="flex flex-col items-center justify-end h-full w-24">
            <div className="mb-2 bg-white px-3 py-1 rounded-full font-black text-xl text-slate-800 border-2 border-slate-300 shadow-2xs">
              {itemA.votes}
            </div>
            <div className="w-16 flex items-end justify-center h-full max-h-[80%]">
              <div
                style={{
                  height: `${(itemA.votes / maxVal) * 100}%`,
                  backgroundColor: itemA.color,
                }}
                className="w-full rounded-t-2xl transition-all duration-500 shadow-md relative"
              >
                <div className="absolute inset-x-0 top-0 h-2 bg-white/30 rounded-t-2xl" />
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-3xl block">{itemA.emoji}</span>
              <span className="font-extrabold text-slate-800 text-sm">{itemA.name}</span>
            </div>
          </div>

          {/* Versus / Scale Icon */}
          <div className="h-full flex items-center justify-center text-2xl font-black text-slate-400">
            VS
          </div>

          {/* Bar B */}
          <div className="flex flex-col items-center justify-end h-full w-24">
            <div className="mb-2 bg-white px-3 py-1 rounded-full font-black text-xl text-slate-800 border-2 border-slate-300 shadow-2xs">
              {itemB.votes}
            </div>
            <div className="w-16 flex items-end justify-center h-full max-h-[80%]">
              <div
                style={{
                  height: `${(itemB.votes / maxVal) * 100}%`,
                  backgroundColor: itemB.color,
                }}
                className="w-full rounded-t-2xl transition-all duration-500 shadow-md relative"
              >
                <div className="absolute inset-x-0 top-0 h-2 bg-white/30 rounded-t-2xl" />
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-3xl block">{itemB.emoji}</span>
              <span className="font-extrabold text-slate-800 text-sm">{itemB.name}</span>
            </div>
          </div>
        </div>

        {/* 3 Large Buttons: MORE / LESS / SAME */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-6">
          <button
            id="compare-btn-more"
            onClick={() => handleChoice('MORE')}
            className="py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-2xl shadow-lg hover:shadow-xl active:scale-95 cursor-pointer border-b-4 border-emerald-700 transition-all flex flex-col items-center"
          >
            <span>⬆️ MORE</span>
            <span className="text-xs font-bold text-emerald-100 mt-1">Taller Bar</span>
          </button>

          <button
            id="compare-btn-less"
            onClick={() => handleChoice('LESS')}
            className="py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-2xl shadow-lg hover:shadow-xl active:scale-95 cursor-pointer border-b-4 border-orange-700 transition-all flex flex-col items-center"
          >
            <span>⬇️ LESS</span>
            <span className="text-xs font-bold text-orange-100 mt-1">Shorter Bar</span>
          </button>

          <button
            id="compare-btn-same"
            onClick={() => handleChoice('SAME')}
            className="py-4 px-6 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-black text-2xl shadow-lg hover:shadow-xl active:scale-95 cursor-pointer border-b-4 border-purple-700 transition-all flex flex-col items-center"
          >
            <span>⚖️ SAME</span>
            <span className="text-xs font-bold text-purple-100 mt-1">Equal Height</span>
          </button>
        </div>

        {/* Instant Visual Feedback */}
        {feedback.text && (
          <div
            className={`p-4 rounded-2xl font-black text-lg sm:text-xl max-w-xl mx-auto mb-4 animate-in fade-in ${
              feedback.type === 'correct'
                ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400'
                : 'bg-amber-100 text-amber-900 border-2 border-amber-400'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={nextPair}
            className="px-6 py-3 rounded-2xl font-black text-base bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Try Another Pair</span>
          </button>

          <button
            id="next-to-chart-button"
            onClick={() => {
              soundFx.playSuccess();
              onNext();
            }}
            className="px-8 py-3.5 rounded-2xl font-black text-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 border-b-4 border-orange-800"
          >
            <span>Let's Make a Chart! 📋</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
