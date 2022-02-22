import type { LoaderFunction, MetaFunction } from 'remix';
import { Link, useLoaderData } from 'remix';
import AdCard from '~/components/AdCard';
import Card from '~/components/Card';

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
    <div className="flex flex-col-reverse lg:flex-row lg:items-start m-4 gap-4">

      <Card className="flex-1 grow-[4]">
        <h1 className="text-2xl mb-2">Lista pytań</h1>
        {questions.map((question) => (
          <div key={`question-${question.slug}`} style={{ padding: 4 }}>
            <Link prefetch="intent" to={question.slug}>{question.question.pl}</Link>
          </div>
        ))}
      </Card>

      <AdCard className="flex-1 grow-[1]" />

    </div>
  );
}

