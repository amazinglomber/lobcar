import { redirect, useLoaderData } from 'remix';
import { getQuestionBySlug, Question } from '~/data';
import type { LoaderFunction, MetaFunction } from 'remix';
import QuestionCard from '~/components/QuestionCard';
import Card from '~/components/Card';
import Button from '~/components/Button';

export const loader: LoaderFunction = async ({ params }): Promise<Question> => {
  if (!params.slug) throw new Error('expected params.slug');

  const question = getQuestionBySlug(params.slug);
  if (!question) throw redirect('/app/questions');

  return question;
};

export const meta: MetaFunction = ({ data: question }: { data: Question }) => {
  return {
    title: `lobcar - ${question.question.pl}`,
    description: `${question.question.pl} Zobacz odpowiedź lub rozwiąż to pytanie samodzielnie, za darmo.`
  };
};

export default function Question() {
  const question = useLoaderData<Question>();

  return (
    <div className="flex flex-row items-start">

      <Card className="flex-1 grow-[1]">
        <span>tutaj reklama bedzie</span>
        {/*<Button>Sprawdź odpowiedź</Button>*/}
        {/*<Button>Losuj następne</Button>*/}
      </Card>

      <QuestionCard
        className="flex-1 grow-[3]"
        question={question}
      />

      <Card className="flex flex-1 flex-col grow-[1]">
        <Button>Sprawdź odpowiedź</Button>
        <Button variant="outlined">Poprzednie pytanie</Button>
        <Button variant="outlined">Nastpęne pytanie</Button>
      </Card>

    </div>
  );
}
