import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ItemVote } from '../../types';
import { InteractiveBarGraph } from '../InteractiveBarGraph';
import { TeacherMrSaif } from '../TeacherMrSaif';
import { soundFx } from '../../utils/audio';

interface Screen4GraphViewProps {
  items: ItemVote[];
  onNext: () => void;
  onBackToVote: () => void;
}

export const Screen4GraphView: React.FC<Screen4GraphViewProps> = ({
  items,
  onNext,
  onBackToVote,
}) => {
  return (
    <div
      id="screen-4-graph-view"
      className="max-w-5xl mx-auto flex flex-col items-center py-4 px-4"
    >
      {/* Teacher Mr. Saif congratulates and explains */}
      <div className="w-full mb-4">
        <TeacherMrSaif
          message="Great! We collected our data! 🎉"
          subtext="A graph helps us see data quickly and easily! Look at how tall each bar grew!"
          mood="excited"
          size="lg"
        />
      </div>

      {/* Bar Graph Component */}
      <div className="w-full mb-6">
        <InteractiveBarGraph
          title="Our Favorite Fruits"
          items={items}
          showToggle={true}
        />
      </div>

      {/* Educational Note */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center max-w-2xl mx-auto mb-6">
        <p className="text-slate-800 font-extrabold text-base sm:text-lg">
          💡 Notice: The taller the bar, the <span className="text-emerald-700 font-black">MORE</span> votes it has. The shorter the bar, the <span className="text-orange-700 font-black">LESS</span> votes it has!
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          id="back-to-vote-btn"
          onClick={() => {
            soundFx.playClick();
            onBackToVote();
          }}
          className="px-6 py-3 rounded-2xl font-black text-slate-700 border-2 border-slate-300 bg-white hover:bg-slate-50 cursor-pointer"
        >
          🗳️ Change Votes
        </button>

        <button
          id="next-to-read-graph-btn"
          onClick={() => {
            soundFx.playSuccess();
            onNext();
          }}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xl sm:text-2xl px-8 sm:px-10 py-4 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-1 transition-all cursor-pointer flex items-center gap-3 border-b-6 border-indigo-900"
        >
          <span>Let's Read the Graph! 🔍</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
