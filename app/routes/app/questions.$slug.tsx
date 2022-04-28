import { useCallback, useEffect, useState } from 'react';
import type { LoaderFunction, MetaFunction } from 'remix';
import { redirect, useLoaderData } from 'remix';
import QuestionCard from '~/components/Question/QuestionCard';
import Card from '~/components/Card';
import Button from '~/components/Button';
import PageOffset from '~/components/PageOffset';
import QuestionInfo from '~/components/Question/QuestionInfo';
import { getQuestionBySlug } from '~/data/data';

export const loader: LoaderFunction = async ({ params }): Promise<Question> => {
  if (!params.slug) {
    throw redirect('/app/questions');
  }

  const question = await getQuestionBySlug(params.slug);

  if (!question) {
    throw redirect('/app/questions');
  }

  return question;
};

export const meta: MetaFunction = ({ data: question }: { data: Question }) => ({
  title: `lobcar - ${question.translations.pl.question}`,
  description: `${question.translations.pl.question} Zobacz odpowiedź lub rozwiąż to pytanie samodzielnie, za darmo.`,
});

export default function Question() {
  const question = useLoaderData<Question>();

  const [checkedAnswer, setCheckedAnswer] = useState(false);

  useEffect(() => {
    setCheckedAnswer(false);
  }, [question]);

  const handleCheckAnswer = useCallback(() => setCheckedAnswer(true), []);

  return (
    <PageOffset>
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <QuestionCard
          className="flex-1 grow-[3]"
          question={question}
          checkedAnswer={checkedAnswer}
        />

        <div className="flex flex-col flex-1 grow-[1] gap-4">

          <Card className="flex flex-col ">
            <Button onClick={handleCheckAnswer}>Sprawdź odpowiedź</Button>
          </Card>

          <QuestionInfo question={question} />

          {/* <AdCard className="flex-1 grow-[1]" /> */}

        </div>

      </div>
    </PageOffset>
  );
}
