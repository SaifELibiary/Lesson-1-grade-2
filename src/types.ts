export type ScreenId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ItemVote {
  id: string;
  name: string;
  emoji: string;
  color: string;
  votes: number;
}

export type TopicType = 'fruits' | 'toys' | 'animals';

export interface TopicData {
  id: TopicType;
  title: string;
  question: string;
  items: ItemVote[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  type: 'concept' | 'math' | 'graph';
  graphData?: { name: string; emoji: string; count: number; color: string }[];
}

export interface TeacherSettings {
  showAnswers: boolean;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  isTeacherModeOpen: boolean;
}
