import React, { useCallback, useState } from 'react';
import {
  LoaderFunction, MetaFunction, redirect, useLoaderData,
} from 'remix';
import { getCategoryCookie } from '~/utils/cookieHelpers';
import ExamResult from '~/components/Exam/ExamResult';
import Exam from '~/components/Exam/Exam';
import { getExam } from '~/data/data';

interface LoaderData {
  questions: Question[];
  category: Category;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const categoryCookie = await getCategoryCookie(request);

  if (categoryCookie.category === null) {
    throw redirect('/app');
  }

  const questions = getExam(categoryCookie.category);

  return {
    questions,
    category: categoryCookie.category,
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
    setScore((prevScore) => prevScore + newScore);
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
