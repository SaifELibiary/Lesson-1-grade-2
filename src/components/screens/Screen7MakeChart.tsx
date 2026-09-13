import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { ItemVote } from '../../types';
import { soundFx } from '../../utils/audio';
import { TeacherMrSaif } from '../TeacherMrSaif';

interface Screen7MakeChartProps {
  items: ItemVote[];
  onNext: () => void;
  onPrev: () => void;
  showAnswers?: boolean;
}

export const Screen7MakeChart: React.FC<Screen7MakeChartProps> = ({
  items,
  onNext,
  onPrev,
  showAnswers = false,
}) => {
  // Store user-entered numbers for each fruit
  const [enteredValues, setEnteredValues] = useState<Record<string, number | ''>>(() => {
    if (showAnswers) {
      const initial: Record<string, number> = {};
      items.forEach((i) => {
        initial[i.id] = i.votes;
      });
      return initial;
    }
    return {};
  });

  const [isCompleted, setIsCompleted] = useState(false);

  // Check if each item is correct
  const isItemCorrect = (item: ItemVote) => {
    return enteredValues[item.id] === item.votes;
  };

  const allCorrect = items.every((i) => enteredValues[i.id] === i.votes);

  const handleUpdate = (itemId: string, val: number) => {
    soundFx.playPop();
    const updated = { ...enteredValues, [itemId]: Math.max(0, val) };
    setEnteredValues(updated);

    const nowAllCorrect = items.every((i) => updated[i.id] === i.votes);
    if (nowAllCorrect && !isCompleted) {
      setIsCompleted(true);
      soundFx.playCheer();
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
    }
  };

  const handleAutoFill = () => {
    soundFx.playSuccess();
    const filled: Record<string, number> = {};
    items.forEach((i) => {
      filled[i.id] = i.votes;
    });
    setEnteredValues(filled);
    setIsCompleted(true);
  };

  return (
    <div
      id="screen-7-make-chart"
      className="max-w-5xl mx-auto flex flex-col items-center py-4 px-4"
    >
      {/* Teacher Mr. Saif guidance */}
      <div className="w-full mb-4">
        <TeacherMrSaif
          message="Let's Make a Chart! Look at the graph and fill in the numbers!"
          subtext="A chart organizes data so we can read it easily!"
          mood={allCorrect ? 'proud' : 'thinking'}
        />
      </div>

      <div className="w-full bg-white rounded-3xl p-5 sm:p-7 border-4 border-amber-300 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
            Let's Make a Chart! 📋
          </h2>
          <p className="text-slate-500 font-bold text-sm sm:text-base mt-1">
            Look at the bar graph on the left, then fill in the number of students for each fruit!
          </p>
        </div>

        {/* 2-Column Layout: Mini Graph Guide on Left, Interactive Table on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Mini Graph Reference */}
          <div className="lg:col-span-5 bg-sky-50 border-2 border-sky-200 rounded-3xl p-4">
            <h4 className="text-center font-black text-sky-900 text-base mb-2">
              📊 Our Graph Reference
            </h4>
            <div className="flex items-end justify-around h-48 border-b-2 border-slate-700 px-2">
              {items.map((fruit) => (
                <div key={fruit.id} className="flex flex-col items-center justify-end h-full w-12">
                  <span className="font-black text-xs text-slate-800 bg-white px-1.5 py-0.5 rounded-md mb-1 border border-slate-300">
                    {fruit.votes}
                  </span>
                  <div
                    style={{
                      height: `${Math.max((fruit.votes / 8) * 100, 8)}%`,
                      backgroundColor: fruit.color,
                    }}
                    className="w-8 rounded-t-lg shadow-xs"
                  />
                  <span className="text-xl mt-1">{fruit.emoji}</span>
                  <span className="text-[10px] font-extrabold text-slate-600 truncate max-w-[48px]">
                    {fruit.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fill-in Table on Right */}
          <div className="lg:col-span-7">
            <div className="border-3 border-amber-300 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-amber-100 text-slate-800 text-base sm:text-lg font-black border-b-2 border-amber-300">
                    <th className="p-3 sm:p-4">Favorite Fruit</th>
                    <th className="p-3 sm:p-4 text-center">Number of Students</th>
                    <th className="p-3 sm:p-4 text-center">Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 font-extrabold text-base sm:text-lg">
                  {items.map((fruit) => {
                    const currentVal = enteredValues[fruit.id] ?? '';
                    const correct = isItemCorrect(fruit);

                    return (
                      <tr key={fruit.id} className="hover:bg-amber-50/40">
                        <td className="p-3 sm:p-4 flex items-center gap-3">
                          <span className="text-3xl">{fruit.emoji}</span>
                          <span className="text-slate-800">{fruit.name}</span>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdate(
                                  fruit.id,
                                  typeof currentVal === 'number'
                                    ? Math.max(0, currentVal - 1)
                                    : 0
                                )
                              }
                              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 font-black text-slate-700 cursor-pointer flex items-center justify-center text-lg shadow-xs active:scale-95"
                            >
                              -
                            </button>

                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={currentVal}
                              onChange={(e) => {
                                const v = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                                if (typeof v === 'number') {
                                  handleUpdate(fruit.id, v);
                                } else {
                                  setEnteredValues({ ...enteredValues, [fruit.id]: '' });
                                }
                              }}
                              placeholder="__"
                              className={`w-14 sm:w-16 text-center font-black text-2xl py-1 rounded-xl border-2 outline-hidden transition-all ${
                                correct
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300'
                                  : currentVal !== ''
                                  ? 'bg-amber-50 border-amber-400 text-slate-800'
                                  : 'bg-white border-slate-300 text-slate-800'
                              }`}
                            />

                            <button
                              onClick={() =>
                                handleUpdate(
                                  fruit.id,
                                  typeof currentVal === 'number' ? currentVal + 1 : 1
                                )
                              }
                              className="w-8 h-8 rounded-xl bg-amber-200 hover:bg-amber-300 font-black text-amber-900 cursor-pointer flex items-center justify-center text-lg shadow-xs active:scale-95"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          {correct ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-black text-sm bg-emerald-100 px-2 py-1 rounded-lg">
                              <CheckCircle2 className="w-4 h-4" /> Correct!
                            </span>
                          ) : currentVal !== '' ? (
                            <span className="text-xs text-amber-700 font-bold bg-amber-100 px-2 py-1 rounded-lg">
                              Try again
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">Fill in</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick helper for classroom presentations */}
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAutoFill}
                className="text-xs text-slate-500 hover:text-purple-600 font-bold underline cursor-pointer"
              >
                Teacher: Auto-fill chart
              </button>
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        {allCorrect && (
          <div className="mt-6 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 border-3 border-emerald-400 rounded-3xl p-6 text-center animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-900 mb-2">
              🎉 You made a chart!
            </h3>
            <p className="text-emerald-800 font-extrabold text-lg max-w-xl mx-auto">
              "A chart organizes data so we can read it easily."
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center mt-6 pt-4 border-t border-slate-100">
          <button
            id="next-to-toy-survey-btn"
            onClick={() => {
              soundFx.playSuccess();
              onNext();
            }}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xl sm:text-2xl px-8 sm:px-10 py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer flex items-center gap-3 border-b-6 border-emerald-800"
          >
            <span>Next Survey: Toys Game! 🧸</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
