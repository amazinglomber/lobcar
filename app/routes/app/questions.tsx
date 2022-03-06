import type { LoaderFunction, MetaFunction } from 'remix';
import { Link, redirect, useFetcher } from 'remix';
import { useCallback, useEffect, useState } from 'react';
import Card from '~/components/Card';
import { getAllQuestions, QuestionsResponse, QuestionWithTranslation } from '~/data';
import PageOffset from '~/components/PageOffset';
import Button from '~/components/Button';
import { getCategoryCookie } from '~/utils/cookieHelpers';

export const loader: LoaderFunction = async ({ request }): Promise<QuestionsResponse> => {
  const categoryCookie = await getCategoryCookie(request);

  if (!categoryCookie.categoryId) {
    throw redirect('/app/category');
  }

  const url = new URL(request.url);
  const page = +(url.searchParams.get('page') ?? 1);

  return getAllQuestions(categoryCookie.categoryId, page, 'pl');
};

export const meta: MetaFunction = () => ({
  title: 'lobcar - Lista wszystkich pytań',
  description: 'Lista wszystkich pytań znajdujących się na egzaminie.',
});

export default function Questions() {
  const fetcher = useFetcher<QuestionsResponse>();
  const [questions, setQuestions] = useState<QuestionWithTranslation[]>([]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetcher.load(`/app/questions?page=${page}`);
  }, [page]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.questions.length > 0) {
      setQuestions((prevQuestions) => [...prevQuestions, ...fetcher.data.questions]);
    }
  }, [fetcher.data]);

  const nextPage = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  return (
    <PageOffset>
      <div className="flex flex-col-reverse lg:flex-row lg:items-start gap-4">

        <Card className="flex-1 grow-[4] overflow-auto">
          <h1 className="text-2xl mb-2">Lista pytań</h1>

          {questions.map((question) => (
            <div key={`question-${question.slug}`} style={{ padding: 4 }}>
              <Link prefetch="intent" to={question.slug}>{question.question}</Link>
            </div>
          ))}

          <div className="flex flex-row justify-center mt-4">
            <Button onClick={nextPage}>
              {fetcher.state === 'idle'
                ? 'Pokaż więcej'
                : 'Ładowanie...'}
            </Button>
          </div>
        </Card>

      </div>
    </PageOffset>
  );
}
