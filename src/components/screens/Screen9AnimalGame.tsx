import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { ItemVote } from '../../types';
import { soundFx } from '../../utils/audio';
import { TeacherMrSaif } from '../TeacherMrSaif';
import { InteractiveBarGraph } from '../InteractiveBarGraph';
import { AVATAR_EMOJIS } from '../../data/topics';

interface Screen9AnimalGameProps {
  animalItems: ItemVote[];
  onUpdateAnimalVote: (itemId: string, newVotes: number) => void;
  onNext: () => void;
  onPrev: () => void;
  showAnswers?: boolean;
}

export const Screen9AnimalGame: React.FC<Screen9AnimalGameProps> = ({
  animalItems,
  onUpdateAnimalVote,
  onNext,
  onPrev,
  showAnswers = false,
}) => {
  const [view, setView] = useState<'survey' | 'quiz'>('survey');
  const [activeConcept, setActiveConcept] = useState<'MOST' | 'LEAST' | 'SAME' | 'TOTAL' | 'DIFFERENCE'>('MOST');
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong' | 'idle'; text: string }>({
    status: 'idle',
    text: '',
  });

  const handleVoteAnimal = (itemId: string) => {
    soundFx.playPop();
    const item = animalItems.find((a) => a.id === itemId);
    if (item) {
      onUpdateAnimalVote(itemId, item.votes + 1);
    }
  };

  const sorted = [...animalItems].sort((a, b) => b.votes - a.votes);
  const maxAnimal = sorted[0] ?? animalItems[0];
  const minAnimal = sorted[sorted.length - 1] ?? animalItems[1];

  const catItem = animalItems.find((a) => a.id === 'cat') ?? animalItems[1];
  const rabbitItem = animalItems.find((a) => a.id === 'rabbit') ?? animalItems[2];

  const totalAllAnimals = animalItems.reduce((acc, a) => acc + a.votes, 0);
  const catVsRabbitDiff = Math.abs(catItem.votes - rabbitItem.votes);

  const triggerSuccess = (text: string) => {
    soundFx.playSuccess();
    setFeedback({ status: 'correct', text });
    try {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    } catch {
      // Ignore
    }
  };

  const triggerWrong = (text: string) => {
    soundFx.playTryAgain();
    setFeedback({ status: 'wrong', text });
  };

  return (
    <div
      id="screen-9-animals-game"
      className="max-w-5xl mx-auto flex flex-col items-center py-4 px-4"
    >
      {/* Teacher Mr. Saif guidance */}
      <div className="w-full mb-3">
        <TeacherMrSaif
          message="Animals Survey! What is your favorite animal? 🐾"
          subtext={
            view === 'survey'
              ? 'Click to vote for your favorite animals!'
              : 'Test your graph detective skills on MOST, LEAST, SAME, TOTAL, and DIFFERENCE!'
          }
          mood="excited"
        />
      </div>

      {view === 'survey' ? (
        /* Animal Voting survey */
        <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-lg text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
            What is your favorite animal? 🐾
          </h2>
          <p className="text-slate-500 font-bold mb-6">
            Tap an animal to cast votes:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {animalItems.map((animal) => (
              <div
                key={animal.id}
                onClick={() => handleVoteAnimal(animal.id)}
                className="p-4 rounded-3xl border-3 border-slate-200 hover:border-emerald-400 bg-gradient-to-b from-white to-emerald-50/40 flex flex-col items-center cursor-pointer transform hover:scale-105 active:scale-95 transition-all shadow-xs"
              >
                <span className="text-5xl my-1 filter drop-shadow-xs">{animal.emoji}</span>
                <span className="font-black text-lg text-slate-800 mb-1">{animal.name}</span>

                <div className="w-full min-h-[38px] bg-slate-100 rounded-xl p-1.5 my-2 flex flex-wrap items-center justify-center gap-1">
                  {Array.from({ length: animal.votes }).map((_, i) => (
                    <span key={i} className="text-lg">
                      {AVATAR_EMOJIS[i % AVATAR_EMOJIS.length]}
                    </span>
                  ))}
                  {animal.votes === 0 && <span className="text-xs text-slate-400">0 votes</span>}
                </div>

                <span className="bg-white border-2 border-emerald-400 px-3 py-0.5 rounded-full font-black text-lg text-emerald-900 shadow-2xs">
                  {animal.votes}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                animalItems.forEach((a) => onUpdateAnimalVote(a.id, 0));
              }}
              className="px-5 py-3 rounded-2xl border-2 border-slate-300 bg-white font-bold text-slate-700 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Animals</span>
            </button>

            <button
              id="show-animal-graph-btn"
              onClick={() => {
                soundFx.playSuccess();
                setView('quiz');
              }}
              className="px-8 py-3.5 rounded-3xl font-black text-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl active:scale-95 cursor-pointer flex items-center gap-2 border-b-4 border-emerald-800"
            >
              <span>Build Graph & Test Concepts! 📊</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        /* Animal Graph & Concept Questions */
        <div className="w-full space-y-4">
          <InteractiveBarGraph
            title="Our Favorite Animals 🐾"
            items={animalItems}
            showToggle={true}
          />

          {/* Concepts navigation */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border-4 border-emerald-300 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
              {(['MOST', 'LEAST', 'SAME', 'TOTAL', 'DIFFERENCE'] as const).map((concept) => (
                <button
                  key={concept}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveConcept(concept);
                    setFeedback({ status: 'idle', text: '' });
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
                    activeConcept === concept
                      ? 'bg-emerald-600 text-white shadow-md scale-105'
                      : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {concept}
                </button>
              ))}
            </div>

            {/* Concept Q1: MOST */}
            {activeConcept === 'MOST' && (
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4">
                  Which animal is the <span className="text-emerald-600 underline">MOST</span> popular?
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {animalItems.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        if (a.votes === maxAnimal.votes) {
                          triggerSuccess(`🎉 That's right! ${a.name} has the tallest bar with ${a.votes} votes!`);
                        } else {
                          triggerWrong('Look for the tallest bar!');
                        }
                      }}
                      className="px-5 py-3 rounded-2xl border-2 border-slate-300 bg-slate-50 font-black text-lg flex items-center gap-2 cursor-pointer shadow-2xs hover:bg-emerald-100"
                    >
                      <span className="text-3xl">{a.emoji}</span>
                      <span>{a.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Concept Q2: LEAST */}
            {activeConcept === 'LEAST' && (
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4">
                  Which animal is the <span className="text-orange-600 underline">LEAST</span> popular?
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {animalItems.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        if (a.votes === minAnimal.votes) {
                          triggerSuccess(`🎉 Correct! ${a.name} has the shortest bar with only ${a.votes} votes!`);
                        } else {
                          triggerWrong('Look for the shortest bar!');
                        }
                      }}
                      className="px-5 py-3 rounded-2xl border-2 border-slate-300 bg-slate-50 font-black text-lg flex items-center gap-2 cursor-pointer shadow-2xs hover:bg-orange-100"
                    >
                      <span className="text-3xl">{a.emoji}</span>
                      <span>{a.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Concept Q3: SAME */}
            {activeConcept === 'SAME' && (
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                  What does <span className="text-purple-600 underline">SAME</span> mean on a graph?
                </h3>
                <p className="text-slate-500 font-bold mb-4">Choose the right answer:</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto">
                  <button
                    onClick={() =>
                      triggerSuccess('🎉 Yes! "Same" means two or more bars have the EQUAL height and votes!')
                    }
                    className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-500 hover:text-white border-2 border-purple-300 font-black text-lg cursor-pointer transition-all"
                  >
                    Bars with EQUAL height / votes ⚖️
                  </button>
                  <button
                    onClick={() =>
                      triggerWrong('Same does NOT mean taller! Taller means MORE. Try again!')
                    }
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-200 border-2 border-slate-300 font-black text-lg cursor-pointer transition-all"
                  >
                    The tallest bar only ⬆️
                  </button>
                </div>
              </div>
            )}

            {/* Concept Q4: TOTAL */}
            {activeConcept === 'TOTAL' && (
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                  What was the <span className="text-blue-600 underline">TOTAL</span> number of student votes?
                </h3>
                <p className="text-slate-600 font-bold mb-4">
                  "Total" means we add ALL votes together! (Total = {totalAllAnimals})
                </p>
                <div className="flex justify-center gap-3">
                  {[totalAllAnimals - 2, totalAllAnimals, totalAllAnimals + 3]
                    .filter((v) => v >= 0)
                    .map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === totalAllAnimals) {
                            triggerSuccess(`🎉 Great addition! All bars added up = ${totalAllAnimals} votes in total!`);
                          } else {
                            triggerWrong('Count all the numbers on top of the bars and add them together!');
                          }
                        }}
                        className="w-24 py-3 rounded-2xl border-3 border-blue-300 bg-blue-50 hover:bg-blue-600 hover:text-white font-black text-2xl cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Concept Q5: DIFFERENCE */}
            {activeConcept === 'DIFFERENCE' && (
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
                  What is the <span className="text-pink-600 underline">DIFFERENCE</span> between {catItem.emoji} Cat ({catItem.votes}) and {rabbitItem.emoji} Rabbit ({rabbitItem.votes})?
                </h3>
                <p className="text-slate-600 font-bold mb-4">
                  Subtract: {Math.max(catItem.votes, rabbitItem.votes)} − {Math.min(catItem.votes, rabbitItem.votes)} = ?
                </p>
                <div className="flex justify-center gap-3">
                  {[catVsRabbitDiff - 1, catVsRabbitDiff, catVsRabbitDiff + 1]
                    .filter((v) => v >= 0)
                    .map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === catVsRabbitDiff) {
                            triggerSuccess(`🎉 Perfect! The difference is ${catVsRabbitDiff}! Difference = SUBTRACTION!`);
                          } else {
                            triggerWrong('Remember to subtract the smaller number from the bigger number!');
                          }
                        }}
                        className="w-24 py-3 rounded-2xl border-3 border-pink-300 bg-pink-50 hover:bg-pink-600 hover:text-white font-black text-2xl cursor-pointer"
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

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setView('survey')}
                className="text-slate-600 font-bold hover:underline text-sm cursor-pointer"
              >
                ← Back to Animal Voting
              </button>

              <button
                id="next-to-final-quiz-btn"
                onClick={() => {
                  soundFx.playSuccess();
                  onNext();
                }}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xl px-8 py-3.5 rounded-3xl shadow-xl active:scale-95 cursor-pointer flex items-center gap-2 border-b-4 border-orange-800"
              >
                <span>Final Mini Quiz! 🏆</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
