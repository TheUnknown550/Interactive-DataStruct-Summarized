type Question = {
  topic: string; // slug
  text: string;
  options: string[];
  answer: number;
};

const questions: Question[] = [
  {
    topic: 'stack',
    text: 'Which operation removes the most recently added element in a stack?',
    options: ['Enqueue', 'Dequeue', 'Pop', 'Peek'],
    answer: 2,
  },
  {
    topic: 'queue',
    text: 'What is the time complexity to enqueue on an array-based queue (amortized)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answer: 0,
  },
  {
    topic: 'bst',
    text: 'What is the average time complexity to search in a balanced BST?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answer: 1,
  },
  {
    topic: 'hash',
    text: 'What primarily determines the bucket where a key is stored?',
    options: ['Key length', 'Hash function', 'Load factor', 'Collision strategy'],
    answer: 1,
  },
];

export default questions;
