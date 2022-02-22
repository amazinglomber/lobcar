import { redirect, useLoaderData, useNavigate } from 'remix';
import type { LoaderFunction, MetaFunction } from 'remix';
import QuestionCard from '~/components/QuestionCard';
import Card from '~/components/Card';
import Button from '~/components/Button';
import { useEffect, useState } from 'react';
import AdCard from '~/components/AdCard';

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
  const navigate = useNavigate();

  const [checkedAnswer, setCheckedAnswer] = useState(false);

  useEffect(() => {
    setCheckedAnswer(false);
  }, [question]);

  function handleCheckAnswer() {
    setCheckedAnswer(true);
  }

  function handleNextRandom() {
    navigate('/app/random');
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-start m-4 gap-4">

      <QuestionCard
        className="flex-1 grow-[3]"
        question={question}
        checkedAnswer={checkedAnswer}
      />

      <div className="flex flex-col flex-1 grow-[1] gap-4">

        <Card className="flex flex-col ">
          <Button onClick={handleNextRandom} variant="outlined">Losuj następne</Button>
          <Button onClick={handleCheckAnswer}>Sprawdź odpowiedź</Button>
        </Card>

        <AdCard className="flex-1 grow-[1]" />

      </div>

    </div>
  );
}
