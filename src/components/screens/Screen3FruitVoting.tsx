import React, { useState } from 'react';
import { RotateCcw, Undo2, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { ItemVote } from '../../types';
import { soundFx } from '../../utils/audio';
import { TeacherMrSaif } from '../TeacherMrSaif';
import { AVATAR_EMOJIS } from '../../data/topics';

interface Screen3FruitVotingProps {
  items: ItemVote[];
  onVote: (itemId: string) => void;
  onUndo: () => void;
  onReset: () => void;
  onFinish: () => void;
  historyLength: number;
}

export const Screen3FruitVoting: React.FC<Screen3FruitVotingProps> = ({
  items,
  onVote,
  onUndo,
  onReset,
  onFinish,
  historyLength,
}) => {
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  const totalVotes = items.reduce((sum, item) => sum + item.votes, 0);

  const handleFruitClick = (itemId: string) => {
    soundFx.playPop();
    setJustVotedId(itemId);
    onVote(itemId);
    setTimeout(() => {
      setJustVotedId(null);
    }, 600);
  };

  return (
    <div
      id="screen-3-fruit-voting"
      className="max-w-5xl mx-auto flex flex-col items-center py-4 px-4"
    >
      {/* Teacher Mr. Saif guidance */}
      <div className="w-full mb-4">
        <TeacherMrSaif
          message="Let's take a class vote! Tap any fruit to add a student's vote!"
          subtext={`Total students who voted so far: ${totalVotes}. Try clicking each fruit multiple times!`}
          mood="excited"
        />
      </div>

      {/* Main Question Card */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-lg text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full font-black text-sm mb-2 border border-amber-300">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Classroom Survey</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
          What is your favorite fruit?
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-bold mb-6">
          Tap each fruit card to record a vote from each classmate!
        </p>

        {/* 5 Large Clickable Fruit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {items.map((fruit) => {
            const isJustVoted = justVotedId === fruit.id;

            return (
              <div
                key={fruit.id}
                onClick={() => handleFruitClick(fruit.id)}
                className={`flex flex-col items-center justify-between p-4 rounded-3xl border-3 transition-all transform hover:scale-103 active:scale-95 cursor-pointer select-none relative shadow-sm ${
                  isJustVoted
                    ? 'ring-4 ring-amber-400 bg-amber-50 border-amber-500 scale-105'
                    : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                {/* Plus button indicator */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs group-hover:bg-amber-400">
                  <Plus className="w-4 h-4" />
                </div>

                {/* Fruit Emoji */}
                <div className="text-5xl sm:text-6xl my-1 filter drop-shadow-sm transform transition-transform hover:scale-110">
                  {fruit.emoji}
                </div>

                {/* Fruit Name */}
                <span className="text-lg sm:text-xl font-black text-slate-800 mb-1">
                  {fruit.name}
                </span>

                {/* Cute Student Avatar Icons Stack */}
                <div className="w-full min-h-[44px] bg-slate-100/80 rounded-2xl p-2 my-2 flex flex-wrap items-center justify-center gap-1 border border-slate-200">
                  {fruit.votes === 0 ? (
                    <span className="text-slate-400 text-xs font-bold italic">
                      Tap to vote
                    </span>
                  ) : (
                    Array.from({ length: fruit.votes }).map((_, index) => {
                      const avatar = AVATAR_EMOJIS[index % AVATAR_EMOJIS.length];
                      const isNewest = isJustVoted && index === fruit.votes - 1;
                      return (
                        <span
                          key={index}
                          className={`text-xl transform transition-transform ${
                            isNewest ? 'scale-130 animate-bounce' : 'scale-100'
                          }`}
                          title="Student vote"
                        >
                          {avatar}
                        </span>
                      );
                    })
                  )}
                </div>

                {/* Counter Number */}
                <div
                  style={{ borderColor: fruit.color }}
                  className="bg-white border-2 px-4 py-1 rounded-full font-black text-xl text-slate-800 shadow-2xs"
                >
                  {fruit.votes} {fruit.votes === 1 ? 'vote' : 'votes'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls: Undo, Reset, Finish */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t-2 border-slate-100">
          <button
            id="voting-undo-button"
            onClick={() => {
              soundFx.playClick();
              onUndo();
            }}
            disabled={historyLength === 0}
            className={`px-5 py-3 rounded-2xl font-black text-base flex items-center gap-2 border-2 transition-all cursor-pointer ${
              historyLength === 0
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 active:scale-95'
            }`}
          >
            <Undo2 className="w-5 h-5" />
            <span>↩ Undo Last Vote</span>
          </button>

          <button
            id="voting-reset-button"
            onClick={() => {
              soundFx.playClick();
              onReset();
            }}
            className="px-5 py-3 rounded-2xl font-black text-base flex items-center gap-2 border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>🔄 Reset Votes</span>
          </button>

          <button
            id="voting-finish-button"
            onClick={() => {
              soundFx.playSuccess();
              onFinish();
            }}
            className="px-8 py-3.5 rounded-2xl font-black text-xl flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg active:scale-95 cursor-pointer border-b-4 border-emerald-800"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>✅ Finish Voting</span>
          </button>
        </div>
      </div>
    </div>
  );
};
