import { BibleApiService, BIBLE_BOOKS } from '@/services/BibleApiService';

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

// Use the complete Bible books from the API service
export const bibleBooks: Book[] = BIBLE_BOOKS.map(book => ({
  name: book.name,
  chapters: book.chapters,
  testament: book.testament
}));

// Fallback verses in case API is unavailable
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

export const getDailyVerse = async (): Promise<Verse> => {
  try {
    const apiVerse = await BibleApiService.getRandomVerse();
    if (apiVerse) {
      return {
        book: apiVerse.book_name,
        chapter: apiVerse.chapter,
        verse: apiVerse.verse,
        text: apiVerse.text
      };
    }
  } catch (error) {
    console.error('Error getting daily verse from API:', error);
  }
  
  // Fallback to sample verses
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const verseIndex = dayOfYear % sampleVerses.length;
  return sampleVerses[verseIndex];
};

export const searchVerses = async (query: string): Promise<Verse[]> => {
  if (!query.trim()) return [];
  
  try {
    const apiResults = await BibleApiService.searchVerses(query);
    if (apiResults.length > 0) {
      return apiResults.map(verse => ({
        book: verse.book_name,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text
      }));
    }
  } catch (error) {
    console.error('Error searching verses via API:', error);
  }
  
  // Fallback to local search
  const searchTerm = query.toLowerCase();
  return sampleVerses.filter(verse => 
    verse.text.toLowerCase().includes(searchTerm) ||
    verse.book.toLowerCase().includes(searchTerm)
  );
};

export const getChapter = async (book: string, chapter: number): Promise<Verse[]> => {
  try {
    const bookId = book.toLowerCase().replace(/\s+/g, '');
    console.log('Fetching chapter from API:', bookId, chapter);
    const apiChapter = await BibleApiService.getChapter(bookId, chapter);
    
    if (apiChapter && apiChapter.verses.length > 0) {
      console.log('API returned verses:', apiChapter.verses.length);
      return apiChapter.verses.map(verse => ({
        book: verse.book_name,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text
      }));
    }
    console.log('API returned no verses');
  } catch (error) {
    console.error('Error getting chapter from API:', error);
  }
  
  // Return sample verses that match the book and chapter
  const fallbackVerses = sampleVerses.filter(verse => 
    verse.book.toLowerCase() === book.toLowerCase() && 
    verse.chapter === chapter
  );
  console.log('Returning fallback verses:', fallbackVerses.length);
  return fallbackVerses;
};