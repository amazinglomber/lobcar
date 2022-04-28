interface XLSXQuestionRow {
  id: string;
  name: string;
  'question PL': string;
  'answer A PL': string;
  'answer B PL': string;
  'answer C PL': string;
  'question ENG': string;
  'answer A ENG': string;
  'answer B ENG': string;
  'answer C ENG': string;
  'question DE': string;
  'answer A DE': string;
  'answer B DE': string;
  'answer C DE': string;
  'correct answer': string;
  media: string;
  scope: string;
  points: number;
  categories: string;
  'block name': string;
  'question source': string;
  'asking for': string;
  safety: string;
  status: string;
  subject: string;
  'question SIGN PJM': string;
  'answer A SIGN PJM': string;
  'answer B SIGN PJM': string;
  'question SIGN SJM': string;
  'answer A SIGN SJM': string;
  'answer B SIGN SJM': string;
  'answer C SIGN SJM': string;
}

type Category = string;
type Scope = 'basic' | 'advanced';

interface Question {
  id: string;
  name: string;
  slug: string;
  correctAnswer: string;
  media: string;
  scope: Scope;
  points: number;
  categories: Category[];
  block: string;
  source: string;
  askingFor: string;
  safety: string;
  status: string;
  subject: string;
  translations: {
    [key: string]: {
      question: string;
      answers: {
        a: string;
        b: string;
        c: string;
      }
    };
  };
}

interface Dataset {
  byId: { [key: Question['id']]: Question };
  byCategory: { [key: string]: Question['id'][] };
  ids: string[];
  categories: string[];
}
