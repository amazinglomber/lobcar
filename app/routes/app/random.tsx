import { redirect, useLoaderData } from 'remix';
import { getRandomQuestion, Question } from '../../data';
import type { LoaderFunction, MetaFunction } from 'remix';
import QuestionCard from '~/components/QuestionCard';

export const loader: LoaderFunction = async (): Promise<Question> => {
  const question = getRandomQuestion();
  if (!question) throw redirect('/app/questions');

  return question;
};

export const meta: MetaFunction = () => {
  return {
    title: `lobcar - Losowe pytanie`,
  };
};

export default function Question() {
  const question = useLoaderData<Question>();

  return (
    <div>
      <QuestionCard question={question} />
    </div>
  );
}
