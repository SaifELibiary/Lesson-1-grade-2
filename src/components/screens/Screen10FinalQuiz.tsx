import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Star, RotateCcw, CheckCircle2, AlertCircle, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { soundFx } from '../../utils/audio';
import { TeacherMrSaif } from '../TeacherMrSaif';

interface Screen10FinalQuizProps {
  onRestartLesson: () => void;
  showAnswers?: boolean;
}

export const Screen10FinalQuiz: React.FC<Screen10FinalQuizProps> = ({
  onRestartLesson,
  showAnswers = false,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentQIndex];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    if (idx === question.correctIndex) {
      soundFx.playSuccess();
      setAnsweredState('correct');
      setStars((prev) => prev + 1);
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Ignore
      }
    } else {
      soundFx.playTryAgain();
      setAnsweredState('wrong');
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    setSelectedOption(null);
    setAnsweredState('idle');

    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
      soundFx.playCheer();
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
        });
      } catch {
        // Ignore
      }
    }
  };

  return (
    <div
      id="screen-10-final-quiz"
      className="max-w-4xl mx-auto flex flex-col items-center py-4 px-4"
    >
      {/* Teacher Mr. Saif guidance */}
      <div className="w-full mb-3">
        <TeacherMrSaif
          message={
            isQuizCompleted
              ? 'Congratulations! You are officially a certified Graph Explorer!'
              : `Question ${currentQIndex + 1} of ${QUIZ_QUESTIONS.length}: Show me what you learned today!`
          }
          subtext={
            isQuizCompleted
              ? 'You did such wonderful math work today with Mr. Saif!'
              : 'Take your time and read each question carefully!'
          }
          mood={isQuizCompleted ? 'proud' : 'excited'}
        />
      </div>

      {!isQuizCompleted ? (
        /* Quiz in progress */
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl relative">
          {/* Top Bar: Progress and Star Counter */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-black text-xs sm:text-sm">
              Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>

            <div className="flex items-center gap-1.5 bg-yellow-50 border-2 border-yellow-300 px-3.5 py-1 rounded-full shadow-2xs">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
              <span className="font-black text-slate-800 text-base">{stars} Stars</span>
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 text-center mb-6 leading-snug">
            {question.question}
          </h2>

          {/* Optional Visual Mini Graph if this question includes one */}
          {question.graphData && (
            <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 max-w-md mx-auto mb-6">
              <div className="flex items-end justify-around h-36 border-b-2 border-slate-700 px-2">
                {question.graphData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-end h-full w-14">
                    <span className="text-xs font-black bg-white px-2 py-0.5 rounded-full border border-slate-300 mb-1">
                      {item.count}
                    </span>
                    <div
                      style={{
                        height: `${(item.count / 8) * 100}%`,
                        backgroundColor: item.color,
                      }}
                      className="w-8 rounded-t-lg shadow-2xs"
                    />
                    <span className="text-2xl mt-1">{item.emoji}</span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[56px]">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto mb-6">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;
              const showResult = answeredState !== 'idle';

              let buttonStyle = 'bg-slate-50 hover:bg-amber-50 border-slate-300 text-slate-800';

              if (showResult) {
                if (isCorrect) {
                  buttonStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'bg-red-50 border-red-400 text-red-900';
                }
              }

              if (showAnswers && isCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-black';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border-3 font-extrabold text-lg sm:text-xl text-left transition-all flex items-center justify-between cursor-pointer active:scale-98 shadow-xs ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {showResult && isCorrect && (
                    <span className="text-2xl animate-bounce">⭐</span>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <span className="text-xl text-red-500">❌</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Teacher Note */}
          {answeredState === 'correct' && (
            <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 rounded-2xl p-4 text-center font-black text-lg max-w-xl mx-auto mb-4 animate-in zoom-in-95">
              🎉 ⭐ Fantastic! {question.explanation}
            </div>
          )}

          {answeredState === 'wrong' && (
            <div className="bg-amber-50 border-2 border-amber-400 text-amber-900 rounded-2xl p-4 text-center font-bold text-base max-w-xl mx-auto mb-4 animate-in fade-in">
              💡 Gentle Hint: Look closely! {question.explanation} Try picking another option!
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleNextQuestion}
              disabled={answeredState !== 'correct' && !showAnswers}
              className={`px-8 py-3.5 rounded-2xl font-black text-lg flex items-center gap-2 transition-all ${
                answeredState === 'correct' || showAnswers
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg cursor-pointer active:scale-95 animate-pulse'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{currentQIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See My Results!'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Grand Celebration / Explorer Certificate Screen */
        <div className="w-full bg-gradient-to-b from-white via-amber-50/50 to-orange-50 rounded-3xl p-6 sm:p-10 border-4 border-amber-400 shadow-2xl text-center relative overflow-hidden">
          {/* Certificate Badge */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-400 text-white shadow-xl mb-4 border-4 border-white animate-bounce-slow">
            <Trophy className="w-12 h-12" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-2">
            🏆 Amazing!
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mb-4">
            You are a Graph Explorer!
          </h3>

          <p className="text-lg sm:text-xl font-bold text-slate-600 max-w-md mx-auto mb-6">
            You learned how to collect data, build bar graphs, make charts, and find MOST, LEAST, SAME, and DIFFERENCE!
          </p>

          {/* Score Card */}
          <div className="bg-white rounded-3xl p-6 border-3 border-amber-300 shadow-md max-w-md mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
              ))}
            </div>
            <div className="text-3xl font-black text-slate-800 mt-2">
              Score: {stars} / {QUIZ_QUESTIONS.length} Stars! ⭐
            </div>
            <p className="text-sm font-bold text-emerald-600 mt-1">
              🌟 Outstanding Grade 2 Math Mastery!
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
              <span>Classroom Teacher: Mr. Saif 👨‍🏫</span>
              <span>•</span>
              <span>Chapter 1: Graphs & Charts</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                soundFx.playSuccess();
                setIsQuizCompleted(false);
                setCurrentQIndex(0);
                setStars(0);
                setSelectedOption(null);
                setAnsweredState('idle');
              }}
              className="px-6 py-3.5 rounded-2xl font-black text-lg bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake Quiz</span>
            </button>

            <button
              id="restart-full-lesson-btn"
              onClick={() => {
                soundFx.playSuccess();
                onRestartLesson();
              }}
              className="px-8 py-4 rounded-3xl font-black text-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl cursor-pointer flex items-center gap-2 border-b-4 border-emerald-800 active:scale-95"
            >
              <span>Restart Full Lesson 🚀</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
