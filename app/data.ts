import data from '../data/data.json';

export interface Question {
  name: string,
  id: string,
  slug: string,
  question: {
    pl: string,
    en: string,
    de: string,
  },
  answers: {
    pl: {
      a: string,
      b: string,
      c: string,
    },
    en: {
      a: string,
      b: string,
      c: string,
    },
    de: {
      a: string,
      b: string,
      c: string,
    },
  },
  correctAnswer: string,
  media: string,
  scope: string,
  points: string,
  categories: string[],
  block: string,
  source: string,
  askedFor: string,
  safety: string,
  status: string,
  subject: string,
}

export interface Database {
  version: Date;
  questions: Question[];
}

const mediaBaseURL = 'https://d2v1k3xewbu9zy.cloudfront.net/';

function loadDatabase(): Database {
  const _data = data as Database;

  return {
    version: new Date(_data.version),
    questions: _data.questions.map((question) => ({
      ...question,
      media: mediaBaseURL + question.media,
    })),
  };
}

const database = loadDatabase();

// const database: Database = loadDatabase();

export function getDatabase(): Database {
  return database;
}

export function getQuestions(): Question[] {
  return database.questions;
}

export function getQuestionBySlug(slug: string): Question | undefined {
  return database.questions.find((question) => question.slug === slug);
}

export function getRandomQuestion(): Question {
  return database.questions[Math.floor(Math.random() * database.questions.length)];
}

export function getMediaType(question: Question): 'video' | 'image' | 'none' {
  if (question.media.endsWith('.mp4')) {
    return 'video';
  } else if (question.media.endsWith('/')) {
    return 'none';
  }

  return 'image';
}
