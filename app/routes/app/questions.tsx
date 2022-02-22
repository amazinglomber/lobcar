import { Link, useLoaderData } from 'remix';
import { getQuestions, Question } from '../../data';
import type { MetaFunction, LoaderFunction } from 'remix';

export const loader: LoaderFunction = async (): Promise<Question[]> => {
  return getQuestions().splice(0, 10);
};

export const meta: MetaFunction = () => {
  return {
    title: 'lobcar - Lista wszystkich pytań',
    description: 'Lista wszystkich pytań znajdujących się na egzaminie.',
  };
};

export default function Questions() {
  const questions = useLoaderData<Question[]>();

  return (
    <div>
      <h1>questions</h1>

      {questions.map((question) => (
        <div key={`question-${question.slug}`} style={{ padding: 4 }}>
          <Link prefetch="intent" to={question.slug}>{question.question.pl}</Link>
        </div>
      ))}
    </div>
  );
}

