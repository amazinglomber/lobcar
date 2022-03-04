import React, { useCallback, useState } from 'react';
import {
  LoaderFunction, MetaFunction, redirect, useLoaderData,
} from 'remix';
import { Category } from '@prisma/client';
import { getCategoryById, getExam, QuestionWithTranslation } from '~/data';
import { getCategoryCookie } from '~/utils/cookieHelpers';
import ExamResult from '~/components/Exam/ExamResult';
import Exam from '~/components/Exam/Exam';

interface LoaderData {
  questions: QuestionWithTranslation[];
  category: Category;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const categoryCookie = await getCategoryCookie(request);

  if (categoryCookie.categoryId === null) {
    throw redirect('/app');
  }

  const category = await getCategoryById(categoryCookie.categoryId);

  // TODO: Add error here?
  if (category === null) {
    throw redirect('/app');
  }

  const questions = await getExam(category.id, 'pl');

  return {
    questions,
    category,
  };
};

export const meta: MetaFunction = () => ({
  title: 'lobcar - Egzamin',
  description: 'Sprawdź swoją wiedzę rozwiązując egzamin',
});

function StartExam() {
  const { questions, category } = useLoaderData<LoaderData>();

  const [examRunning, setExamRunning] = useState(true);
  const [score, setScore] = useState(0);

  const endExam = useCallback(() => setExamRunning(false), []);

  const onScoreChange = useCallback((newScore: number) => {
    setScore((currentScore) => currentScore + newScore);
  }, []);

  return examRunning
    ? (
      <Exam
        questions={questions}
        category={category}
        onScoreChange={onScoreChange}
        onExamEnd={endExam}
      />
    )
    : (
      <ExamResult
        score={score}
      />
    );
}

export default StartExam;
