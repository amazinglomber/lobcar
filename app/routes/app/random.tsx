import type { LoaderFunction, MetaFunction } from 'remix';
import { redirect, useLoaderData, useNavigate } from 'remix';
import { useCallback, useEffect, useState } from 'react';
import QuestionCard from '~/components/Question/QuestionCard';
import Card from '~/components/Card';
import Button from '~/components/Button';
import { getCategoryCookie } from '~/utils/cookieHelpers';
import QuestionInfo from '~/components/Question/QuestionInfo';
import { getRandomQuestion } from '~/data/data';

export const loader: LoaderFunction = async ({ request }): Promise<Question> => {
  const categoryCookie = await getCategoryCookie(request);

  if (!categoryCookie.category) {
    throw redirect('/app/category');
  }

  return getRandomQuestion(categoryCookie.category);
};

export const meta: MetaFunction = () => ({
  title: 'lobcar - Losowe pytanie',
});

export default function Question() {
  const question = useLoaderData<Question>();
  const navigate = useNavigate();

  const [checkedAnswer, setCheckedAnswer] = useState(false);

  useEffect(() => {
    setCheckedAnswer(false);
  }, [question]);

  const handleCheckAnswer = useCallback(() => setCheckedAnswer(true), []);

  const handleNextRandom = useCallback(() => navigate('/app/random'), [navigate]);

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

        <QuestionInfo question={question} />

      </div>

    </div>
  );
}
