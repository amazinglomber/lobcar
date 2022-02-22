import { useState, useEffect } from 'react';
import { redirect, useLoaderData, useNavigate } from 'remix';
import type { LoaderFunction, MetaFunction } from 'remix';
import QuestionCard from '~/components/QuestionCard';
import Card from '~/components/Card';
import Button from '~/components/Button';
import AdCard from '~/components/AdCard';

type QuestionResultLoader = QuestionResult & { question: Question };
export const loader: LoaderFunction = async ({ params }): Promise<QuestionResultLoader> => {
  if (!params.slug) throw new Error('expected params.slug');

  const questionResult = getQuestionBySlug(params.slug);
  if (!questionResult.question) throw redirect('/app/questions');

  return questionResult as QuestionResultLoader;
};

export const meta: MetaFunction = ({ data: questionResult }: { data: QuestionResultLoader }) => {
  return {
    title: `lobcar - ${questionResult.question.question.pl}`,
    description: `${questionResult.question.question.pl} Zobacz odpowiedź lub rozwiąż to pytanie samodzielnie, za darmo.`
  };
};

export default function Question() {
  const navigate = useNavigate();
  const questionResult = useLoaderData<QuestionResultLoader>();

  const [checkedAnswer, setCheckedAnswer] = useState(false);

  useEffect(() => {
    setCheckedAnswer(false);
  }, [questionResult]);

  function handleCheckAnswer() {
    setCheckedAnswer(true);
  }

  function handlePrevious() {
    navigate(`/app/questions/${questionResult.prev}`);
  }

  function handleNext() {
    navigate(`/app/questions/${questionResult.next}`);
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-start m-4 gap-4">
      <QuestionCard
        className="flex-1 grow-[3]"
        question={questionResult.question}
        checkedAnswer={checkedAnswer}
      />

      <div className="flex flex-col flex-1 grow-[1] gap-4">

        <Card className="flex flex-col ">
          <Button
            variant="outlined"
            disabled={!questionResult.prev}
            onClick={handlePrevious}
          >
            Poprzednie pytanie
          </Button>
          <Button
            variant="outlined"
            disabled={!questionResult.next}
            onClick={handleNext}
          >
            Następne pytanie
          </Button>
          <Button onClick={handleCheckAnswer}>Sprawdź odpowiedź</Button>
        </Card>

        <AdCard className="flex-1 grow-[1]" />

      </div>

    </div>
  );
}
