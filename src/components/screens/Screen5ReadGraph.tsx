import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { ItemVote } from '../../types';
import { InteractiveBarGraph } from '../InteractiveBarGraph';
import { TeacherMrSaif } from '../TeacherMrSaif';
import { soundFx } from '../../utils/audio';

interface Screen5ReadGraphProps {
  items: ItemVote[];
  onNext: () => void;
  onPrev: () => void;
  showAnswers?: boolean;
}

export const Screen5ReadGraph: React.FC<Screen5ReadGraphProps> = ({
  items,
  onNext,
  onPrev,
  showAnswers = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedBarId, setSelectedBarId] = useState<string | null>(null);
  const [selectedMultipleIds, setSelectedMultipleIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong' | 'idle';
    message: string;
  }>({ status: 'idle', message: '' });

  // Dynamic calculations from current votes!
  const sortedByVotes = [...items].sort((a, b) => b.votes - a.votes);
  const maxVote = sortedByVotes[0]?.votes ?? 0;
  const minVote = sortedByVotes[sortedByVotes.length - 1]?.votes ?? 0;

  const mostPopularItems = items.filter((i) => i.votes === maxVote);
  const leastPopularItems = items.filter((i) => i.votes === minVote);

  // Check for ties / same numbers
  const voteCounts = items.map((i) => i.votes);
  const countsFrequency: Record<number, ItemVote[]> = {};
  items.forEach((i) => {
    if (!countsFrequency[i.votes]) countsFrequency[i.votes] = [];
    countsFrequency[i.votes].push(i);
  });
  const tieGroups = Object.values(countsFrequency).filter((group) => group.length > 1);
  const hasTie = tieGroups.length > 0;
  const targetTieItems = hasTie ? tieGroups[0] : [items[0], items[1]];

  // For Q4: Target fruit
  const targetFruitQ4 = items[0] ?? { name: 'Apple', emoji: '🍎', votes: 4 };

  // For Q5 (Altogether): Fruit 1 and Fruit 2
  const fruitA = items[0] ?? { name: 'Apple', emoji: '🍎', votes: 4 };
  const fruitB = items[1] ?? { name: 'Banana', emoji: '🍌', votes: 3 };
  const altogetherSum = fruitA.votes + fruitB.votes;

  // For Q6 (Difference): Compare top fruit with lowest fruit or A and B
  const diffFruit1 = sortedByVotes[0] ?? fruitA;
  const diffFruit2 = sortedByVotes[1] ?? fruitB;
  const differenceVal = Math.abs(diffFruit1.votes - diffFruit2.votes);

  const resetFeedback = () => {
    setFeedback({ status: 'idle', message: '' });
    setSelectedBarId(null);
    setSelectedMultipleIds([]);
  };

  const handleNextStep = () => {
    resetFeedback();
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const triggerSuccess = (msg: string) => {
    soundFx.playSuccess();
    setFeedback({ status: 'correct', message: msg });
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore
    }
  };

  const triggerWrong = (hint: string) => {
    soundFx.playTryAgain();
    setFeedback({ status: 'wrong', message: hint });
  };

  // Evaluate Question 1: Most Popular
  const handleAnswerQ1 = (item: ItemVote) => {
    setSelectedBarId(item.id);
    if (item.votes === maxVote) {
      triggerSuccess(`🎉 Great job! ${item.name} has the most votes (${item.votes})! Look at that tall bar!`);
    } else {
      triggerWrong('Try again! Look at the TALLEST bar. 👀');
    }
  };

  // Evaluate Question 2: Least Popular
  const handleAnswerQ2 = (item: ItemVote) => {
    setSelectedBarId(item.id);
    if (item.votes === minVote) {
      triggerSuccess(`🎉 Super! ${item.name} has the least votes (${item.votes}). The shortest bar shows the least!`);
    } else {
      triggerWrong('Try again! Look for the SHORTEST bar. 🔍');
    }
  };

  // Evaluate Question 3: Same number
  const toggleMultiSelect = (item: ItemVote) => {
    soundFx.playClick();
    const isAlready = selectedMultipleIds.includes(item.id);
    const updated = isAlready
      ? selectedMultipleIds.filter((id) => id !== item.id)
      : [...selectedMultipleIds, item.id];

    setSelectedMultipleIds(updated);

    if (hasTie) {
      const selectedVotes = updated.map((id) => items.find((i) => i.id === id)?.votes);
      if (updated.length >= 2) {
        const allSame = selectedVotes.every((v) => v === selectedVotes[0]);
        if (allSame) {
          triggerSuccess(`🎉 Excellent! These fruits both have ${selectedVotes[0]} votes! "Same" means EQUAL!`);
        } else {
          triggerWrong('Those two bars have different heights. Find two bars with the exact SAME height!');
        }
      }
    } else {
      triggerSuccess('Every fruit here has a different number! None are the same right now. "Same" means equal height!');
    }
  };

  // Options generator for multiple choice
  const makeOptions = (correctVal: number) => {
    const opts = new Set<number>([correctVal]);
    while (opts.size < 4) {
      const offset = Math.floor(Math.random() * 5) - 2;
      const val = Math.max(0, correctVal + (offset === 0 ? 1 : offset));
      opts.add(val);
    }
    return Array.from(opts).sort((a, b) => a - b);
  };

  return (
    <div
      id="screen-5-read-graph"
      className="max-w-5xl mx-auto flex flex-col items-center py-4 px-4"
    >
      {/* Teacher Mr. Saif guidance */}
      <div className="w-full mb-3">
        <TeacherMrSaif
          message={`Question ${currentStep} of 6: Let's read our graph together!`}
          subtext="Look closely at the bars, numbers, and colors to find the answer!"
          mood="thinking"
        />
      </div>

      {/* Graph always visible on top */}
      <div className="w-full mb-4">
        <InteractiveBarGraph
          title="Our Favorite Fruits"
          items={items}
          onBarClick={
            currentStep === 1
              ? handleAnswerQ1
              : currentStep === 2
              ? handleAnswerQ2
              : currentStep === 3
              ? toggleMultiSelect
              : undefined
          }
          selectedItemId={selectedBarId}
          highlightItemIds={
            showAnswers
              ? currentStep === 1
                ? mostPopularItems.map((i) => i.id)
                : currentStep === 2
                ? leastPopularItems.map((i) => i.id)
                : currentStep === 3 && hasTie
                ? targetTieItems.map((i) => i.id)
                : []
              : selectedMultipleIds
          }
          showToggle={false}
        />
      </div>

      {/* Interactive Question Card */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border-4 border-amber-300 shadow-md text-center">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5, 6].map((st) => (
            <div
              key={st}
              className={`h-2.5 rounded-full transition-all ${
                st === currentStep
                  ? 'w-8 bg-amber-500'
                  : st < currentStep
                  ? 'w-3 bg-emerald-500'
                  : 'w-3 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Question 1: MOST popular */}
        {currentStep === 1 && (
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Question 1: The Most
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-1">
              Which fruit is the <span className="text-emerald-600 underline decoration-wavy">MOST</span> popular?
            </h3>
            <p className="text-slate-500 font-bold text-sm mb-4">
              Tap the fruit button or its bar on the graph:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl mx-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAnswerQ1(item)}
                  className="px-4 py-2.5 rounded-2xl border-2 border-slate-300 bg-slate-50 hover:bg-amber-100 hover:border-amber-400 font-black text-base sm:text-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2: LEAST popular */}
        {currentStep === 2 && (
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Question 2: The Least
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-1">
              Which fruit is the <span className="text-orange-600 underline decoration-wavy">LEAST</span> popular?
            </h3>
            <p className="text-slate-500 font-bold text-sm mb-4">
              Tip: The shortest bar shows the least! Tap the fruit:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl mx-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAnswerQ2(item)}
                  className="px-4 py-2.5 rounded-2xl border-2 border-slate-300 bg-slate-50 hover:bg-orange-100 hover:border-orange-400 font-black text-base sm:text-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3: SAME number */}
        {currentStep === 3 && (
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              Question 3: Equal
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-1">
              Which fruits have the <span className="text-purple-600 underline decoration-wavy">SAME</span> number of votes?
            </h3>
            <p className="text-slate-500 font-bold text-sm mb-4">
              Tap fruits that have equal bars ("Same means equal"):
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl mx-auto">
              {items.map((item) => {
                const isPicked = selectedMultipleIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleMultiSelect(item)}
                    className={`px-4 py-2.5 rounded-2xl border-2 font-black text-base sm:text-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                      isPicked
                        ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105'
                        : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-purple-50'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span>
                      {item.name} ({item.votes})
                    </span>
                  </button>
                );
              })}
            </div>

            {!hasTie && (
              <p className="text-xs text-slate-400 mt-2 italic">
                (Note: Every fruit has a different number of votes right now! Tap any fruit to confirm.)
              </p>
            )}
          </div>
        )}

        {/* Question 4: How many chose Apple */}
        {currentStep === 4 && (
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Question 4: Read the Number
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-1">
              How many students chose <span className="text-red-500">{targetFruitQ4.emoji} {targetFruitQ4.name}</span>?
            </h3>
            <p className="text-slate-500 font-bold text-sm mb-4">
              Look at the number at the top of the {targetFruitQ4.name} bar:
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
              {makeOptions(targetFruitQ4.votes).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (opt === targetFruitQ4.votes) {
                      triggerSuccess(`🎉 Correct! ${opt} students chose ${targetFruitQ4.name}!`);
                    } else {
                      triggerWrong(`Look at the top of the ${targetFruitQ4.name} bar to see its number!`);
                    }
                  }}
                  className="w-20 sm:w-24 py-3 rounded-2xl border-3 border-sky-300 bg-sky-50 hover:bg-sky-500 hover:text-white font-black text-2xl text-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 5: ALTOGETHER (ADD) */}
        {currentStep === 5 && (
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Question 5: Altogether
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-1">
              How many students chose {fruitA.emoji} {fruitA.name} and {fruitB.emoji} {fruitB.name} <span className="text-emerald-600 underline">ALTOGETHER</span>?
            </h3>

            {/* Visual teaching helper */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 my-3 max-w-md mx-auto">
              <p className="text-emerald-900 font-black text-lg">
                💡 "Altogether" means <span className="text-emerald-700 underline font-black">ADD</span>!
              </p>
              <p className="text-2xl font-black text-slate-800 mt-1">
                {fruitA.emoji} {fruitA.votes} + {fruitB.emoji} {fruitB.votes} = ?
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
              {makeOptions(altogetherSum).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (opt === altogetherSum) {
                      triggerSuccess(`🎉 That's right! ${fruitA.votes} + ${fruitB.votes} = ${altogetherSum} students altogether!`);
                    } else {
                      triggerWrong(`Remember to ADD: ${fruitA.votes} + ${fruitB.votes} = ?`);
                    }
                  }}
                  className="w-20 sm:w-24 py-3 rounded-2xl border-3 border-emerald-300 bg-emerald-50 hover:bg-emerald-500 hover:text-white font-black text-2xl text-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 6: DIFFERENCE (SUBTRACTION) */}
        {currentStep === 6 && (
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
              Question 6: How Many More
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2 mb-1">
              How many <span className="text-pink-600 underline">MORE</span> students chose {diffFruit1.emoji} {diffFruit1.name} than {diffFruit2.emoji} {diffFruit2.name}?
            </h3>

            {/* Visual teaching helper */}
            <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-3 my-3 max-w-md mx-auto">
              <p className="text-pink-900 font-black text-lg">
                💡 "How many more" or difference means <span className="text-pink-700 underline font-black">SUBTRACT</span>!
              </p>
              <p className="text-2xl font-black text-slate-800 mt-1">
                {diffFruit1.emoji} {diffFruit1.votes} − {diffFruit2.emoji} {diffFruit2.votes} = ?
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
              {makeOptions(differenceVal).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (opt === differenceVal) {
                      triggerSuccess(`🎉 Fantastic! ${diffFruit1.votes} − ${diffFruit2.votes} = ${differenceVal} more students!`);
                    } else {
                      triggerWrong(`Remember to SUBTRACT: ${diffFruit1.votes} − ${diffFruit2.votes} = ?`);
                    }
                  }}
                  className="w-20 sm:w-24 py-3 rounded-2xl border-3 border-pink-300 bg-pink-50 hover:bg-pink-500 hover:text-white font-black text-2xl text-slate-800 transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Message */}
        {feedback.message && (
          <div
            className={`mt-4 p-3 rounded-2xl font-black text-base sm:text-lg animate-in fade-in duration-200 ${
              feedback.status === 'correct'
                ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400'
                : 'bg-amber-100 text-amber-900 border-2 border-amber-400'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Next Question / Continue Button */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              soundFx.playClick();
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
                resetFeedback();
              } else {
                onPrev();
              }
            }}
            className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNextStep}
            className={`px-6 py-3 rounded-2xl font-black text-lg flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 ${
              feedback.status === 'correct'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white animate-bounce'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            <span>{currentStep < 6 ? 'Next Question ➡️' : 'Go to Comparison Game 🚀'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
