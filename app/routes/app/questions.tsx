import type { LoaderFunction, MetaFunction } from 'remix';
import { Link, useLoaderData } from 'remix';
import Card from '~/components/Card';
import { getAllQuestions, QuestionWithTranslation } from '~/data';
import PageOffset from '~/components/PageOffset';

export const loader: LoaderFunction = async (): Promise<QuestionWithTranslation[]> => getAllQuestions('pl');

export const meta: MetaFunction = () => ({
  title: 'lobcar - Lista wszystkich pytań',
  description: 'Lista wszystkich pytań znajdujących się na egzaminie.',
});

export default function Questions() {
  const questions = useLoaderData<QuestionWithTranslation[]>();

  return (
    <PageOffset>
      <div className="flex flex-col-reverse lg:flex-row lg:items-start gap-4">

        <Card className="flex-1 grow-[4]">
          <h1 className="text-2xl mb-2">Lista pytań</h1>
          {questions.map((question) => (
            <div key={`question-${question.slug}`} style={{ padding: 4 }}>
              <Link prefetch="intent" to={question.slug}>{question.question}</Link>
            </div>
          ))}
        </Card>

        {/* <AdCard className="flex-1 grow-[1]" /> */}

      </div>
    </PageOffset>
  );
}
