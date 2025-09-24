interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleChapter {
  book_id: string;
  book_name: string;
  chapter: number;
  verses: BibleVerse[];
}

interface BibleBook {
  id: string;
  name: string;
  testament: 'Old' | 'New';
  chapters: number;
}

interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  description: string;
}

// Available Bible translations
export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  {
    id: 'kjv',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'English',
    description: 'The classic 1611 translation'
  },
  {
    id: 'esv',
    name: 'English Standard Version',
    abbreviation: 'ESV',
    language: 'English',
    description: 'Modern literal translation'
  },
  {
    id: 'niv',
    name: 'New International Version',
    abbreviation: 'NIV',
    language: 'English',
    description: 'Popular modern translation'
  },
  {
    id: 'nasb',
    name: 'New American Standard Bible',
    abbreviation: 'NASB',
    language: 'English',
    description: 'Literal and accurate translation'
  },
  {
    id: 'nlt',
    name: 'New Living Translation',
    abbreviation: 'NLT',
    language: 'English',
    description: 'Clear and contemporary'
  }
];

// Bible books data with complete structure
export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', testament: 'Old', chapters: 50 },
  { id: 'exodus', name: 'Exodus', testament: 'Old', chapters: 40 },
  { id: 'leviticus', name: 'Leviticus', testament: 'Old', chapters: 27 },
  { id: 'numbers', name: 'Numbers', testament: 'Old', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'Old', chapters: 34 },
  { id: 'joshua', name: 'Joshua', testament: 'Old', chapters: 24 },
  { id: 'judges', name: 'Judges', testament: 'Old', chapters: 21 },
  { id: 'ruth', name: 'Ruth', testament: 'Old', chapters: 4 },
  { id: '1samuel', name: '1 Samuel', testament: 'Old', chapters: 31 },
  { id: '2samuel', name: '2 Samuel', testament: 'Old', chapters: 24 },
  { id: '1kings', name: '1 Kings', testament: 'Old', chapters: 22 },
  { id: '2kings', name: '2 Kings', testament: 'Old', chapters: 25 },
  { id: '1chronicles', name: '1 Chronicles', testament: 'Old', chapters: 29 },
  { id: '2chronicles', name: '2 Chronicles', testament: 'Old', chapters: 36 },
  { id: 'ezra', name: 'Ezra', testament: 'Old', chapters: 10 },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'Old', chapters: 13 },
  { id: 'esther', name: 'Esther', testament: 'Old', chapters: 10 },
  { id: 'job', name: 'Job', testament: 'Old', chapters: 42 },
  { id: 'psalms', name: 'Psalms', testament: 'Old', chapters: 150 },
  { id: 'proverbs', name: 'Proverbs', testament: 'Old', chapters: 31 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'Old', chapters: 12 },
  { id: 'song', name: 'Song of Songs', testament: 'Old', chapters: 8 },
  { id: 'isaiah', name: 'Isaiah', testament: 'Old', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'Old', chapters: 52 },
  { id: 'lamentations', name: 'Lamentations', testament: 'Old', chapters: 5 },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'Old', chapters: 48 },
  { id: 'daniel', name: 'Daniel', testament: 'Old', chapters: 12 },
  { id: 'hosea', name: 'Hosea', testament: 'Old', chapters: 14 },
  { id: 'joel', name: 'Joel', testament: 'Old', chapters: 3 },
  { id: 'amos', name: 'Amos', testament: 'Old', chapters: 9 },
  { id: 'obadiah', name: 'Obadiah', testament: 'Old', chapters: 1 },
  { id: 'jonah', name: 'Jonah', testament: 'Old', chapters: 4 },
  { id: 'micah', name: 'Micah', testament: 'Old', chapters: 7 },
  { id: 'nahum', name: 'Nahum', testament: 'Old', chapters: 3 },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'Old', chapters: 3 },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'Old', chapters: 3 },
  { id: 'haggai', name: 'Haggai', testament: 'Old', chapters: 2 },
  { id: 'zechariah', name: 'Zechariah', testament: 'Old', chapters: 14 },
  { id: 'malachi', name: 'Malachi', testament: 'Old', chapters: 4 },
  
  // New Testament
  { id: 'matthew', name: 'Matthew', testament: 'New', chapters: 28 },
  { id: 'mark', name: 'Mark', testament: 'New', chapters: 16 },
  { id: 'luke', name: 'Luke', testament: 'New', chapters: 24 },
  { id: 'john', name: 'John', testament: 'New', chapters: 21 },
  { id: 'acts', name: 'Acts', testament: 'New', chapters: 28 },
  { id: 'romans', name: 'Romans', testament: 'New', chapters: 16 },
  { id: '1corinthians', name: '1 Corinthians', testament: 'New', chapters: 16 },
  { id: '2corinthians', name: '2 Corinthians', testament: 'New', chapters: 13 },
  { id: 'galatians', name: 'Galatians', testament: 'New', chapters: 6 },
  { id: 'ephesians', name: 'Ephesians', testament: 'New', chapters: 6 },
  { id: 'philippians', name: 'Philippians', testament: 'New', chapters: 4 },
  { id: 'colossians', name: 'Colossians', testament: 'New', chapters: 4 },
  { id: '1thessalonians', name: '1 Thessalonians', testament: 'New', chapters: 5 },
  { id: '2thessalonians', name: '2 Thessalonians', testament: 'New', chapters: 3 },
  { id: '1timothy', name: '1 Timothy', testament: 'New', chapters: 6 },
  { id: '2timothy', name: '2 Timothy', testament: 'New', chapters: 4 },
  { id: 'titus', name: 'Titus', testament: 'New', chapters: 3 },
  { id: 'philemon', name: 'Philemon', testament: 'New', chapters: 1 },
  { id: 'hebrews', name: 'Hebrews', testament: 'New', chapters: 13 },
  { id: 'james', name: 'James', testament: 'New', chapters: 5 },
  { id: '1peter', name: '1 Peter', testament: 'New', chapters: 5 },
  { id: '2peter', name: '2 Peter', testament: 'New', chapters: 3 },
  { id: '1john', name: '1 John', testament: 'New', chapters: 5 },
  { id: '2john', name: '2 John', testament: 'New', chapters: 1 },
  { id: '3john', name: '3 John', testament: 'New', chapters: 1 },
  { id: 'jude', name: 'Jude', testament: 'New', chapters: 1 },
  { id: 'revelation', name: 'Revelation', testament: 'New', chapters: 22 }
];

export class BibleApiService {
  private static readonly BASE_URL = 'https://bible-api.com';
  private static cache = new Map<string, any>();
  private static currentTranslation = 'kjv';

  // Set translation
  static setTranslation(translationId: string): void {
    this.currentTranslation = translationId;
    // Clear cache when translation changes
    this.cache.clear();
  }

  static getCurrentTranslation(): string {
    return this.currentTranslation;
  }

  static getTranslationInfo(translationId: string): BibleTranslation | null {
    return BIBLE_TRANSLATIONS.find(t => t.id === translationId) || null;
  }

  // Get a specific verse
  static async getVerse(book: string, chapter: number, verse: number, translation?: string): Promise<BibleVerse | null> {
    const trans = translation || this.currentTranslation;
    try {
      const cacheKey = `${trans}-${book}-${chapter}-${verse}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const url = trans === 'kjv' 
        ? `${this.BASE_URL}/${book}${chapter}:${verse}`
        : `${this.BASE_URL}/${book}${chapter}:${verse}?translation=${trans}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const verseData: BibleVerse = {
        book_id: data.reference.split(' ')[0].toLowerCase(),
        book_name: data.reference.split(' ')[0],
        chapter: chapter,
        verse: verse,
        text: data.text.trim()
      };

      this.cache.set(cacheKey, verseData);
      return verseData;
    } catch (error) {
      console.error('Error fetching verse:', error);
      return null;
    }
  }

  // Get a full chapter
  static async getChapter(book: string, chapter: number, translation?: string): Promise<BibleChapter | null> {
    const trans = translation || this.currentTranslation;
    try {
      const cacheKey = `${trans}-${book}-${chapter}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const url = trans === 'kjv' 
        ? `${this.BASE_URL}/${book}${chapter}`
        : `${this.BASE_URL}/${book}${chapter}?translation=${trans}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const verses: BibleVerse[] = data.verses.map((verse: any) => ({
        book_id: verse.book_id,
        book_name: verse.book_name,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text.trim()
      }));

      const chapterData: BibleChapter = {
        book_id: data.verses[0]?.book_id || book.toLowerCase(),
        book_name: data.verses[0]?.book_name || book,
        chapter: chapter,
        verses: verses
      };

      this.cache.set(cacheKey, chapterData);
      return chapterData;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return null;
    }
  }

  // Search verses
  static async searchVerses(query: string, translation?: string): Promise<BibleVerse[]> {
    const trans = translation || this.currentTranslation;
    try {
      const cacheKey = `search-${trans}-${query}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const url = trans === 'kjv' 
        ? `${this.BASE_URL}/${encodeURIComponent(query)}`
        : `${this.BASE_URL}/${encodeURIComponent(query)}?translation=${trans}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let verses: BibleVerse[] = [];
      if (data.verses) {
        verses = data.verses.map((verse: any) => ({
          book_id: verse.book_id,
          book_name: verse.book_name,
          chapter: verse.chapter,
          verse: verse.verse,
          text: verse.text.trim()
        }));
      }

      this.cache.set(cacheKey, verses);
      return verses;
    } catch (error) {
      console.error('Error searching verses:', error);
      return [];
    }
  }

  // Get random verse for daily verse
  static async getRandomVerse(translation?: string): Promise<BibleVerse | null> {
    const trans = translation || this.currentTranslation;
    try {
      // Use a selection of meaningful verses for daily inspiration
      const inspirationalVerses = [
        'john3:16', 'psalms23:1', 'philippians4:13', 'romans8:28',
        'jeremiah29:11', 'proverbs3:5-6', 'isaiah40:31', 'matthew5:16',
        'psalms46:10', '2corinthians5:17', 'ephesians2:8-9', 'romans5:8',
        'joshua1:9', 'psalms139:14', 'matthew11:28', 'john14:6'
      ];

      // Get a different verse each day
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
      const verseIndex = dayOfYear % inspirationalVerses.length;
      const selectedVerse = inspirationalVerses[verseIndex];

      const url = trans === 'kjv' 
        ? `${this.BASE_URL}/${selectedVerse}`
        : `${this.BASE_URL}/${selectedVerse}?translation=${trans}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        book_id: data.verses[0].book_id,
        book_name: data.verses[0].book_name,
        chapter: data.verses[0].chapter,
        verse: data.verses[0].verse,
        text: data.text.trim()
      };
    } catch (error) {
      console.error('Error fetching random verse:', error);
      return null;
    }
  }

  // Clear cache
  static clearCache(): void {
    this.cache.clear();
  }

  // Get cache size for debugging
  static getCacheSize(): number {
    return this.cache.size;
  }
}