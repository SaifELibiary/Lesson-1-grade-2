import React, { useState } from 'react';
import { ScreenId, TopicType } from './types';
import { INITIAL_TOPICS } from './data/topics';
import { soundFx } from './utils/audio';
import { HeaderNav } from './components/HeaderNav';
import { TeacherControlsModal } from './components/TeacherControlsModal';
import { Screen1Welcome } from './components/screens/Screen1Welcome';
import { Screen2WhatIsData } from './components/screens/Screen2WhatIsData';
import { Screen3FruitVoting } from './components/screens/Screen3FruitVoting';
import { Screen4GraphView } from './components/screens/Screen4GraphView';
import { Screen5ReadGraph } from './components/screens/Screen5ReadGraph';
import { Screen6MoreLessSame } from './components/screens/Screen6MoreLessSame';
import { Screen7MakeChart } from './components/screens/Screen7MakeChart';
import { Screen8ToyGame } from './components/screens/Screen8ToyGame';
import { Screen9AnimalGame } from './components/screens/Screen9AnimalGame';
import { Screen10FinalQuiz } from './components/screens/Screen10FinalQuiz';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(1);
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [activeTopicId, setActiveTopicId] = useState<TopicType>('fruits');
  const [voteHistory, setVoteHistory] = useState<string[]>([]);
  const [isTeacherModeOpen, setIsTeacherModeOpen] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Active topic items
  const currentTopic = topics[activeTopicId] || topics.fruits;

  // Sound toggles
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundFx.enabled = nextVal;
  };

  const handleToggleVoice = () => {
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    soundFx.voiceEnabled = nextVal;
  };

  // Voting in Screen 3 (Fruits)
  const handleVoteFruit = (itemId: string) => {
    setVoteHistory((prev) => [...prev, itemId]);
    setTopics((prev) => ({
      ...prev,
      fruits: {
        ...prev.fruits,
        items: prev.fruits.items.map((it) =>
          it.id === itemId ? { ...it, votes: it.votes + 1 } : it
        ),
      },
    }));
  };

  // Undo last vote in Screen 3
  const handleUndoVoteFruit = () => {
    if (voteHistory.length === 0) return;
    const lastVotedId = voteHistory[voteHistory.length - 1];
    setVoteHistory((prev) => prev.slice(0, -1));

    setTopics((prev) => ({
      ...prev,
      fruits: {
        ...prev.fruits,
        items: prev.fruits.items.map((it) =>
          it.id === lastVotedId ? { ...it, votes: Math.max(0, it.votes - 1) } : it
        ),
      },
    }));
  };

  // Reset votes for fruit topic
  const handleResetFruitVotes = () => {
    setVoteHistory([]);
    setTopics((prev) => ({
      ...prev,
      fruits: {
        ...prev.fruits,
        items: prev.fruits.items.map((it) => ({ ...it, votes: 0 })),
      },
    }));
  };

  // Update specific item votes (Teacher mode or mini-games)
  const handleUpdateItemVote = (
    topicId: TopicType,
    itemId: string,
    newCount: number
  ) => {
    setTopics((prev) => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        items: prev[topicId].items.map((it) =>
          it.id === itemId ? { ...it, votes: Math.max(0, newCount) } : it
        ),
      },
    }));
  };

  // Preset generator for teacher demos
  const handleApplyPreset = (type: 'balanced' | 'winner' | 'tie') => {
    setTopics((prev) => {
      const topic = prev[activeTopicId];
      let newItems = [...topic.items];

      if (type === 'winner') {
        newItems = newItems.map((item, idx) => ({
          ...item,
          votes: idx === 0 ? 8 : idx === 1 ? 2 : idx === 2 ? 3 : 1,
        }));
      } else if (type === 'tie') {
        newItems = newItems.map((item, idx) => ({
          ...item,
          votes: idx < 2 ? 5 : idx === 2 ? 3 : 2,
        }));
      } else {
        newItems = newItems.map((item, idx) => ({
          ...item,
          votes: idx + 2,
        }));
      }

      return {
        ...prev,
        [activeTopicId]: {
          ...topic,
          items: newItems,
        },
      };
    });
  };

  const handleRestartFullLesson = () => {
    setCurrentScreen(1);
    setVoteHistory([]);
    setTopics(INITIAL_TOPICS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-sky-50/30 to-amber-50/60 flex flex-col text-slate-800">
      {/* Top Header & Step Tracker */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenTeacherMode={() => setIsTeacherModeOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        onResetAll={handleRestartFullLesson}
      />

      {/* Main Classroom Screen Content */}
      <main className="flex-1 flex flex-col justify-center px-2 sm:px-4 py-3 sm:py-6">
        {currentScreen === 1 && (
          <Screen1Welcome onStart={() => setCurrentScreen(2)} />
        )}

        {currentScreen === 2 && (
          <Screen2WhatIsData onNext={() => setCurrentScreen(3)} />
        )}

        {currentScreen === 3 && (
          <Screen3FruitVoting
            items={topics.fruits.items}
            onVote={handleVoteFruit}
            onUndo={handleUndoVoteFruit}
            onReset={handleResetFruitVotes}
            onFinish={() => setCurrentScreen(4)}
            historyLength={voteHistory.length}
          />
        )}

        {currentScreen === 4 && (
          <Screen4GraphView
            items={topics.fruits.items}
            onNext={() => setCurrentScreen(5)}
            onBackToVote={() => setCurrentScreen(3)}
          />
        )}

        {currentScreen === 5 && (
          <Screen5ReadGraph
            items={topics.fruits.items}
            onNext={() => setCurrentScreen(6)}
            onPrev={() => setCurrentScreen(4)}
            showAnswers={showAnswers}
          />
        )}

        {currentScreen === 6 && (
          <Screen6MoreLessSame
            items={topics.fruits.items}
            onNext={() => setCurrentScreen(7)}
            onPrev={() => setCurrentScreen(5)}
          />
        )}

        {currentScreen === 7 && (
          <Screen7MakeChart
            items={topics.fruits.items}
            onNext={() => setCurrentScreen(8)}
            onPrev={() => setCurrentScreen(6)}
            showAnswers={showAnswers}
          />
        )}

        {currentScreen === 8 && (
          <Screen8ToyGame
            toyItems={topics.toys.items}
            onUpdateToyVote={(itemId, newVotes) =>
              handleUpdateItemVote('toys', itemId, newVotes)
            }
            onNext={() => setCurrentScreen(9)}
            onPrev={() => setCurrentScreen(7)}
            showAnswers={showAnswers}
          />
        )}

        {currentScreen === 9 && (
          <Screen9AnimalGame
            animalItems={topics.animals.items}
            onUpdateAnimalVote={(itemId, newVotes) =>
              handleUpdateItemVote('animals', itemId, newVotes)
            }
            onNext={() => setCurrentScreen(10)}
            onPrev={() => setCurrentScreen(8)}
            showAnswers={showAnswers}
          />
        )}

        {currentScreen === 10 && (
          <Screen10FinalQuiz
            onRestartLesson={handleRestartFullLesson}
            showAnswers={showAnswers}
          />
        )}
      </main>

      {/* Teacher Mode Drawer / Modal */}
      <TeacherControlsModal
        isOpen={isTeacherModeOpen}
        onClose={() => setIsTeacherModeOpen(false)}
        currentScreen={currentScreen}
        onJumpToScreen={(s) => setCurrentScreen(s)}
        currentTopic={activeTopicId}
        onSelectTopic={(t) => setActiveTopicId(t)}
        items={currentTopic.items}
        onUpdateVote={(itemId, newCount) =>
          handleUpdateItemVote(activeTopicId, itemId, newCount)
        }
        showAnswers={showAnswers}
        onToggleShowAnswers={() => setShowAnswers(!showAnswers)}
        onResetVotes={() => {
          setTopics((prev) => ({
            ...prev,
            [activeTopicId]: {
              ...prev[activeTopicId],
              items: prev[activeTopicId].items.map((it) => ({
                ...it,
                votes: 0,
              })),
            },
          }));
        }}
        onRestartLesson={handleRestartFullLesson}
        onApplyPreset={handleApplyPreset}
      />

      {/* Footer info */}
      <footer className="py-2.5 text-center text-xs font-extrabold text-slate-400 select-none border-t border-slate-100">
        Grade 2 Math • Chapter 1: Graphs and Charts • Interactive Classroom Lesson with Mr. Saif 👨‍🏫
      </footer>
    </div>
  );
}
