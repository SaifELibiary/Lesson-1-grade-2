import { TopicData } from '../types';

export const INITIAL_TOPICS: Record<string, TopicData> = {
  fruits: {
    id: 'fruits',
    title: 'Our Favorite Fruits',
    question: 'What is your favorite fruit?',
    items: [
      { id: 'apple', name: 'Apple', emoji: '🍎', color: '#ef4444', votes: 4 },
      { id: 'banana', name: 'Banana', emoji: '🍌', color: '#eab308', votes: 3 },
      { id: 'strawberry', name: 'Strawberry', emoji: '🍓', color: '#f43f5e', votes: 5 },
      { id: 'orange', name: 'Orange', emoji: '🍊', color: '#f97316', votes: 2 },
      { id: 'grape', name: 'Grape', emoji: '🍇', color: '#8b5cf6', votes: 4 },
    ],
  },
  toys: {
    id: 'toys',
    title: 'Our Favorite Toys',
    question: 'What is your favorite toy? 🧸',
    items: [
      { id: 'kite', name: 'Kite', emoji: '🪁', color: '#06b6d4', votes: 3 },
      { id: 'bicycle', name: 'Bicycle', emoji: '🚲', color: '#10b981', votes: 6 },
      { id: 'doll', name: 'Doll', emoji: '🪀', color: '#ec4899', votes: 2 },
      { id: 'ball', name: 'Ball', emoji: '⚽', color: '#3b82f6', votes: 5 },
      { id: 'car', name: 'Car', emoji: '🚗', color: '#f59e0b', votes: 4 },
    ],
  },
  animals: {
    id: 'animals',
    title: 'Our Favorite Animals',
    question: 'What is your favorite animal? 🐾',
    items: [
      { id: 'turtle', name: 'Turtle', emoji: '🐢', color: '#10b981', votes: 3 },
      { id: 'cat', name: 'Cat', emoji: '🐱', color: '#f59e0b', votes: 5 },
      { id: 'rabbit', name: 'Rabbit', emoji: '🐰', color: '#ec4899', votes: 4 },
      { id: 'bird', name: 'Bird', emoji: '🐦', color: '#06b6d4', votes: 2 },
      { id: 'fish', name: 'Fish', emoji: '🐟', color: '#3b82f6', votes: 4 },
    ],
  },
};

export const AVATAR_EMOJIS = ['👦', '👧', '🧒', '👶', '🧑', '👧🏻', '👦🏽', '🧒🏼', '👧🏾', '👦🏿'];
