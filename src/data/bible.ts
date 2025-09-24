export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Book {
  name: string;
  chapters: number;
  testament: 'Old' | 'New';
}

// Sample Bible data structure
export const bibleBooks: Book[] = [
  // Old Testament (sample)
  { name: 'Genesis', chapters: 50, testament: 'Old' },
  { name: 'Exodus', chapters: 40, testament: 'Old' },
  { name: 'Psalms', chapters: 150, testament: 'Old' },
  { name: 'Proverbs', chapters: 31, testament: 'Old' },
  
  // New Testament (sample)
  { name: 'Matthew', chapters: 28, testament: 'New' },
  { name: 'Mark', chapters: 16, testament: 'New' },
  { name: 'Luke', chapters: 24, testament: 'New' },
  { name: 'John', chapters: 21, testament: 'New' },
  { name: 'Acts', chapters: 28, testament: 'New' },
  { name: 'Romans', chapters: 16, testament: 'New' },
  { name: '1 Corinthians', chapters: 16, testament: 'New' },
  { name: 'Ephesians', chapters: 6, testament: 'New' },
  { name: 'Philippians', chapters: 4, testament: 'New' },
  { name: 'Revelation', chapters: 22, testament: 'New' },
];

// Sample verses for demonstration
export const sampleVerses: Verse[] = [
  {
    book: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'
  },
  {
    book: 'Psalms',
    chapter: 23,
    verse: 1,
    text: 'The Lord is my shepherd, I lack nothing.'
  },
  {
    book: 'Philippians',
    chapter: 4,
    verse: 13,
    text: 'I can do all this through him who gives me strength.'
  },
  {
    book: 'Proverbs',
    chapter: 3,
    verse: 5,
    text: 'Trust in the Lord with all your heart and lean not on your own understanding.'
  },
  {
    book: 'Romans',
    chapter: 8,
    verse: 28,
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.'
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 16,
    text: 'In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.'
  },
  {
    book: 'Isaiah',
    chapter: 40,
    verse: 31,
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.'
  }
];

export const getDailyVerse = (): Verse => {
  // Simple algorithm to get a different verse each day
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const verseIndex = dayOfYear % sampleVerses.length;
  return sampleVerses[verseIndex];
};

export const searchVerses = (query: string): Verse[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  return sampleVerses.filter(verse => 
    verse.text.toLowerCase().includes(searchTerm) ||
    verse.book.toLowerCase().includes(searchTerm)
  );
};