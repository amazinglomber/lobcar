import { Category, Question, QuestionTranslation } from '@prisma/client';
import { db } from '~/utils/db.server';

export interface QuestionWithTranslation extends Question {
  question: string;
  answers: {
    a: string;
    b: string;
    c: string;
  }
}

export async function getQuestionBySlug(slug: string, languageCode: string): Promise<QuestionWithTranslation | null> {
  const q = await db.question.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { languageCode },
      },
    },
  });

  if (!q) return null;

  return mapToQuestionWithTranslation(q);
}

export async function getAllQuestions(languageCode: string): Promise<QuestionWithTranslation[]> {
  const questions = await db.question.findMany({
    include: {
      translations: {
        where: { languageCode },
      },
    },
  });

  return questions.map((q) => mapToQuestionWithTranslation(q));
}

export async function getAllQuestionsWithoutTranslations(): Promise<Question[]> {
  return db.question.findMany();
}

export async function getRandomQuestion(categoryId: number, languageCode: string): Promise<QuestionWithTranslation> {
  const result: any[] = await db.$queryRaw`
    SELECT * FROM Question Q
    JOIN _CategoryToQuestion CTQ ON Q.id = CTQ.B
    JOIN QuestionTranslation QT ON Q.id = QT.questionId
    WHERE QT.languageCode = ${languageCode} AND CTQ.A = ${categoryId}
    ORDER BY random()
    LIMIT 1;
  `;

  console.log(result[0]);

  const {
    questionContent, media, answerA, answerB, answerC, ...question
  } = result[0];

  return {
    ...question,
    media: `https://d2v1k3xewbu9zy.cloudfront.net/${media}`,
    question: questionContent,
    answers: {
      a: answerA,
      b: answerB,
      c: answerC,
    },
  };
}

export function getCategories(): Promise<Category[]> {
  return db.category.findMany();
}

function mapToQuestionWithTranslation(q: (Question & { translations: QuestionTranslation[] })) {
  const { translations, media, ...qWithoutTranslation } = q;

  return {
    ...qWithoutTranslation,
    question: translations[0].questionContent,
    media: `https://d2v1k3xewbu9zy.cloudfront.net/${media}`,
    answers: {
      a: translations[0].answerA,
      b: translations[0].answerB,
      c: translations[0].answerC,
    },
  };
}
