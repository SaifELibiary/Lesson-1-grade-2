import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { ItemVote } from '../../types';
import { soundFx } from '../../utils/audio';
import { TeacherMrSaif } from '../TeacherMrSaif';
import { InteractiveBarGraph } from '../InteractiveBarGraph';
import { AVATAR_EMOJIS } from '../../data/topics';

interface Screen8ToyGameProps {
  toyItems: ItemVote[];
  onUpdateToyVote: (itemId: string, newVotes: number) => void;
  onNext: () => void;
  onPrev: () => void;
  showAnswers?: boolean;
}

export const Screen8ToyGame: React.FC<Screen8ToyGameProps> = ({
  toyItems,
  onUpdateToyVote,
  onNext,
  onPrev,
  showAnswers = false,
}) => {
  // Mode: 'voting' or 'exploring' (answering questions)
  const [stage, setStage] = useState<'voting' | 'questions'>('voting');
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong' | 'idle'; text: string }>({
    status: 'idle',
    text: '',
  });

  const handleVoteToy = (itemId: string) => {
    soundFx.playPop();
    const item = toyItems.find((i) => i.id === itemId);
    if (item) {
      onUpdateToyVote(itemId, item.votes + 1);
    }
  };

  // Dynamic calculations based on live toy votes!
  const sorted = [...toyItems].sort((a, b) => b.votes - a.votes);
  const maxVotes = sorted[0]?.votes ?? 0;
  const minVotes = sorted[sorted.length - 1]?.votes ?? 0;

  const mostPopular = toyItems.filter((t) => t.votes === maxVotes);
  const leastPopular = toyItems.filter((t) => t.votes === minVotes);

  // Toys with same number
  const countsMap: Record<number, ItemVote[]> = {};
  toyItems.forEach((t) => {
    if (!countsMap[t.votes]) countsMap[t.votes] = [];
    countsMap[t.votes].push(t);
  });
  const tieGroups = Object.values(countsMap).filter((g) => g.length > 1);

  // Target questions items
  const ballItem = toyItems.find((t) => t.id === 'ball') ?? toyItems[3];
  const kiteItem = toyItems.find((t) => t.id === 'kite') ?? toyItems[0];
  const bicycleItem = toyItems.find((t) => t.id === 'bicycle') ?? toyItems[1];
  const dollItem = toyItems.find((t) => t.id === 'doll') ?? toyItems[2];

  const kiteAndBicycleSum = kiteItem.votes + bicycleItem.votes;
  const bicycleMinusDoll = Math.max(0, bicycleItem.votes - dollItem.votes);

  const triggerSuccess = (msg: string) => {
    soundFx.playSuccess();
    setFeedback({ status: 'correct', text: msg });
    try {
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
    } catch {
      // Ignore
    }
  };

  const triggerWrong = (msg: string) => {
    soundFx.playTryAgain();
    setFeedback({ status: 'wrong', text: msg });
  };

  return (
    <div
      id="screen-8-toy-game"
      className="max-w-5xl mx-auto flex flex-col items-center py-4 px-4"
    >
      {/* Teacher Mr. Saif guidance */}
      <div className="w-full mb-3">
        <TeacherMrSaif
          message="Let's try another survey! What is your favorite toy? 🧸"
          subtext={
            stage === 'voting'
              ? 'Tap each toy to collect votes, then click "Make Toy Graph"!'
              : 'Now let\'s use the graph to answer 6 toy questions!'
          }
          mood="excited"
        />
      </div>

      {stage === 'voting' ? (
        /* Toy Voting Stage */
        <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-lg text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
            What is your favorite toy? 🧸
          </h2>
          <p className="text-slate-500 font-bold mb-6">
            Tap the cards to collect votes from students!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {toyItems.map((toy) => (
              <div
                key={toy.id}
                onClick={() => handleVoteToy(toy.id)}
                className="p-4 rounded-3xl border-3 border-slate-200 hover:border-cyan-400 bg-gradient-to-b from-white to-cyan-50/30 flex flex-col items-center cursor-pointer transform hover:scale-105 active:scale-95 transition-all shadow-xs"
              >
                <span className="text-5xl my-1 filter drop-shadow-xs">{toy.emoji}</span>
                <span className="font-black text-lg text-slate-800 mb-1">{toy.name}</span>

                {/* Avatar icons */}
                <div className="w-full min-h-[38px] bg-slate-100 rounded-xl p-1.5 my-2 flex flex-wrap items-center justify-center gap-1">
                  {Array.from({ length: toy.votes }).map((_, i) => (
                    <span key={i} className="text-lg">
                      {AVATAR_EMOJIS[i % AVATAR_EMOJIS.length]}
                    </span>
                  ))}
                  {toy.votes === 0 && <span className="text-xs text-slate-400">0 votes</span>}
                </div>

                <span className="bg-white border-2 border-cyan-400 px-3 py-0.5 rounded-full font-black text-lg text-cyan-900 shadow-2xs">
                  {toy.votes}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                toyItems.forEach((t) => onUpdateToyVote(t.id, 0));
              }}
              className="px-5 py-3 rounded-2xl border-2 border-slate-300 bg-white font-bold text-slate-700 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Toys</span>
            </button>

            <button
              id="finish-toy-votes-btn"
              onClick={() => {
                soundFx.playSuccess();
                setStage('questions');
              }}
              className="px-8 py-3.5 rounded-3xl font-black text-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-xl active:scale-95 cursor-pointer flex items-center gap-2 border-b-4 border-blue-800"
            >
              <span>Make Toy Graph & Answer Questions! 📊</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        /* Toy Questions & Graph Stage */
        <div className="w-full space-y-4">
          {/* Automatic Graph */}
          <InteractiveBarGraph
            title="Our Favorite Toys 🧸"
            items={toyItems}
            showToggle={true}
          />

          {/* Interactive Toy Questions */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border-4 border-cyan-300 shadow-md text-center">
            {/* Question Selector Tabs */}
            <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto py-1">
              {[1, 2, 3, 4, 5, 6].map((qNum) => (
                <button
                  key={qNum}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveQuestion(qNum);
                    setFeedback({ status: 'idle', text: '' });
                  }}
                  className={`w-9 h-9 rounded-xl font-black text-sm transition-all cursor-pointer ${
                    activeQuestion === qNum
                      ? 'bg-cyan-500 text-white shadow-md scale-110'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Q{qNum}
                </button>
              ))}
            </div>

            {/* Q1: Most Popular Toy */}
            {activeQuestion === 1 && (
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">
                  Question 1: Most Popular
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-4">
                  Which toy is the <span className="text-emerald-600 underline">MOST</span> popular?
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {toyItems.map((toy) => (
                    <button
                      key={toy.id}
                      onClick={() => {
                        if (toy.votes === maxVotes) {
                          triggerSuccess(`🎉 Hooray! ${toy.name} has the tallest bar with ${toy.votes} votes!`);
                        } else {
                          triggerWrong('Look for the tallest bar on the graph! 👀');
                        }
                      }}
                      className="px-4 py-3 rounded-2xl border-2 border-slate-300 bg-slate-50 hover:bg-cyan-100 font-black text-base flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <span className="text-2xl">{toy.emoji}</span>
                      <span>{toy.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q2: Least Popular Toy */}
            {activeQuestion === 2 && (
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                  Question 2: Least Popular
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-4">
                  Which toy is the <span className="text-orange-600 underline">LEAST</span> popular?
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {toyItems.map((toy) => (
                    <button
                      key={toy.id}
                      onClick={() => {
                        if (toy.votes === minVotes) {
                          triggerSuccess(`🎉 Great eye! ${toy.name} has the shortest bar with ${toy.votes} votes!`);
                        } else {
                          triggerWrong('Look for the shortest bar on the graph! 🔍');
                        }
                      }}
                      className="px-4 py-3 rounded-2xl border-2 border-slate-300 bg-slate-50 hover:bg-orange-100 font-black text-base flex items-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <span className="text-2xl">{toy.emoji}</span>
                      <span>{toy.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q3: Same Number */}
            {activeQuestion === 3 && (
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                  Question 3: Same Number
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-2">
                  Which toys have the <span className="text-purple-600 underline">SAME</span> number of votes?
                </h3>
                {tieGroups.length > 0 ? (
                  <p className="text-slate-600 font-bold mb-4">
                    Look for bars with the exact same height:
                  </p>
                ) : (
                  <p className="text-slate-500 font-bold mb-4">
                    Right now, all toys have different vote counts! Tap below:
                  </p>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                  {tieGroups.length > 0 ? (
                    tieGroups[0].map((toy) => (
                      <button
                        key={toy.id}
                        onClick={() =>
                          triggerSuccess(
                            `🎉 That's right! ${toy.name} has ${toy.votes} votes, matching another toy!`
                          )
                        }
                        className="px-5 py-3 rounded-2xl bg-purple-100 border-2 border-purple-400 text-purple-900 font-black text-lg flex items-center gap-2 cursor-pointer"
                      >
                        <span className="text-2xl">{toy.emoji}</span>
                        <span>
                          {toy.name} ({toy.votes})
                        </span>
                      </button>
                    ))
                  ) : (
                    <button
                      onClick={() =>
                        triggerSuccess('Correct! None of the toys have the same number of votes right now.')
                      }
                      className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-black text-lg cursor-pointer shadow-md"
                    >
                      All toys have different numbers!
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Q4: Ball count */}
            {activeQuestion === 4 && (
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  Question 4: Reading Values
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-4">
                  How many students chose the <span className="text-blue-600">⚽ Ball</span>?
                </h3>
                <div className="flex justify-center gap-3">
                  {[ballItem.votes - 1, ballItem.votes, ballItem.votes + 1, ballItem.votes + 2]
                    .filter((v) => v >= 0)
                    .map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === ballItem.votes) {
                            triggerSuccess(`🎉 Bingo! ${ballItem.votes} students chose the ball!`);
                          } else {
                            triggerWrong(`Check the top of the ⚽ Ball bar!`);
                          }
                        }}
                        className="w-20 py-3 rounded-2xl border-3 border-blue-300 bg-blue-50 hover:bg-blue-600 hover:text-white font-black text-2xl cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Q5: Kite + Bicycle altogether */}
            {activeQuestion === 5 && (
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Question 5: Altogether (ADD)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-2">
                  How many students chose the {kiteItem.emoji} Kite and {bicycleItem.emoji} Bicycle <span className="text-emerald-600 underline">ALTOGETHER</span>?
                </h3>
                <p className="text-slate-600 font-bold mb-4">
                  {kiteItem.emoji} {kiteItem.votes} + {bicycleItem.emoji} {bicycleItem.votes} = ?
                </p>
                <div className="flex justify-center gap-3">
                  {[kiteAndBicycleSum - 1, kiteAndBicycleSum, kiteAndBicycleSum + 2]
                    .filter((v) => v >= 0)
                    .map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === kiteAndBicycleSum) {
                            triggerSuccess(
                              `🎉 Awesome! ${kiteItem.votes} + ${bicycleItem.votes} = ${kiteAndBicycleSum} altogether!`
                            );
                          } else {
                            triggerWrong(`Add the two numbers: ${kiteItem.votes} + ${bicycleItem.votes}!`);
                          }
                        }}
                        className="w-20 py-3 rounded-2xl border-3 border-emerald-300 bg-emerald-50 hover:bg-emerald-600 hover:text-white font-black text-2xl cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Q6: Bicycle - Doll difference */}
            {activeQuestion === 6 && (
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
                  Question 6: Difference (SUBTRACT)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-2">
                  How many <span className="text-pink-600 underline">MORE</span> students chose the {bicycleItem.emoji} Bicycle than the {dollItem.emoji} Doll?
                </h3>
                <p className="text-slate-600 font-bold mb-4">
                  {bicycleItem.emoji} {bicycleItem.votes} − {dollItem.emoji} {dollItem.votes} = ?
                </p>
                <div className="flex justify-center gap-3">
                  {[bicycleMinusDoll - 1, bicycleMinusDoll, bicycleMinusDoll + 1]
                    .filter((v) => v >= 0)
                    .map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === bicycleMinusDoll) {
                            triggerSuccess(
                              `🎉 You nailed it! ${bicycleItem.votes} − ${dollItem.votes} = ${bicycleMinusDoll} more students!`
                            );
                          } else {
                            triggerWrong(`Subtract the doll votes from the bicycle votes!`);
                          }
                        }}
                        className="w-20 py-3 rounded-2xl border-3 border-pink-300 bg-pink-50 hover:bg-pink-600 hover:text-white font-black text-2xl cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback.text && (
              <div
                className={`mt-4 p-3 rounded-2xl font-black text-lg ${
                  feedback.status === 'correct'
                    ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400'
                    : 'bg-amber-100 text-amber-900 border-2 border-amber-400'
                }`}
              >
                {feedback.text}
              </div>
            )}

            {/* Navigation inside Questions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setStage('voting')}
                className="text-slate-600 font-bold hover:underline text-sm cursor-pointer"
              >
                ← Back to Toy Voting
              </button>

              <button
                id="next-to-animals-btn"
                onClick={() => {
                  soundFx.playSuccess();
                  onNext();
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg px-7 py-3 rounded-2xl shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Go to Animals Activity! 🐾</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
