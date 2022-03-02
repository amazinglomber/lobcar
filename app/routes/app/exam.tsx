import type { LoaderFunction, MetaFunction } from 'remix';
import { redirect, useLoaderData } from 'remix';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import clsx from 'clsx';
import { Category } from '@prisma/client';
import Card from '~/components/Card';
import PageOffset from '~/components/PageOffset';
import Button from '~/components/Button';

import { getCategoryById, getExam, QuestionWithTranslation } from '~/data';
import QuestionCard from '~/components/QuestionCard';
import ProgressBar from '~/components/ProgressBar';
import { getMediaType } from '~/utils/dataHelpers';
import { getCategoryCookie } from '~/utils/cookieHelpers';

interface LoaderData {
  questions: QuestionWithTranslation[];
  category: Category;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const categoryCookie = await getCategoryCookie(request);

  if (categoryCookie.categoryId === null) {
    throw redirect('/app');
  }

  const category = await getCategoryById(categoryCookie.categoryId);

  // TODO: Add error here?
  if (category === null) {
    throw redirect('/app');
  }

  return {
    questions: await getExam(category.id, 'pl'),
    category,
  };
};

export const meta: MetaFunction = () => ({
  title: 'lobcar - Egzamin',
  description: 'Sprawdź swoją wiedzę rozwiązując egzamin',
});

function formatSecondsAsTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m < 10 ? 0 : ''}${m}:${s < 10 ? 0 : ''}${s}`;
}

// TODO: Exam timer
// TODO: Different logic for basic and advanced questions
// TODO: Question counter on right
// FIXME: In advanced question there should be no time for reading,
// and timer should be set to 50 seconds.
export default function Exam() {
  const { questions, category } = useLoaderData<LoaderData>();

  const [examStarted, setExamStarted] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[questionIndex];
  const mediaType = getMediaType(question.media);
  const isThereNextQuestion = questionIndex < questions.length - 1;

  const [timer, setTimer] = useState(5);
  const [examTimer, setExamTimer] = useState(60 * 25);
  const timerRef = useRef<NodeJS.Timeout>();

  const [hideMedia, setHideMedia] = useState(true);

  const [resumeTimer, setResumeTimer] = useState(false);

  useEffect(() => {
    let examTimerId: NodeJS.Timeout;
    let timerId: NodeJS.Timeout;

    if (examStarted) {
      examTimerId = setInterval(() => {
        setExamTimer((t) => t - 1);
      }, 1000);

      timerId = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      timerRef.current = timerId;
    }

    return () => {
      clearInterval(examTimerId);
      clearInterval(timerId);
    };
  }, [examStarted]);

  // Reset state on question change
  useEffect(() => {
    const isBasic = question.scope === 'basic';

    setHideMedia(isBasic);
    setTimer(isBasic ? 20 : 50);
  }, [questionIndex]);

  useEffect(() => {
    if (timer <= 0) {
      if (hideMedia) {
        showMedia();
      } else {
        nextQuestion();
      }
    }
  }, [timer]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (resumeTimer) {
      timerId = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      timerRef.current = timerId;
    }

    return () => {
      clearInterval(timerId);
    };
  }, [resumeTimer]);

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef?.current);
      setResumeTimer(false);
    }
  };

  const startExam = useCallback(() => setExamStarted(true), []);

  const showMedia = useCallback(() => {
    setHideMedia(false);

    setTimer(15);
    pauseTimer();
  }, []);

  const handleMediaEnded = useCallback(() => {
    setResumeTimer(true);
  }, []);

  const nextQuestion = useCallback(() => {
    setQuestionIndex((index) => index + 1);
  }, []);

  const endExam = useCallback(() => {
    setExamStarted(false);
    alert('exam ended');
  }, []);

  return (
    <PageOffset>
      <div
        className={clsx(
          'flex flex-1 flex-row gap-4',
          !examStarted && 'justify-center',
          examStarted && '',
        )}
      >
        {!examStarted && (
          <Card>
            <Button onClick={startExam}>Rozpocznij egzamin</Button>
          </Card>
        )}

        {examStarted && (
          <div className="flex flex-1 flex-col lg:flex-row lg:items-start gap-4">

            <div className="flex flex-col flex-1 grow-[3] gap-4">
              <Card className="flex flex-row justify-between">
                <span>{`Wartość punktowa: ${question.points}`}</span>
                <span>{`Wybrana kategoria: ${category.name}`}</span>
                <span>{`Pozostały czas: ${formatSecondsAsTimer(examTimer)}`}</span>
              </Card>
              <QuestionCard
                question={question}
                checkedAnswer={false}
                hideMedia={hideMedia}
                onMediaClick={showMedia}
                onMediaEnded={handleMediaEnded}
              />
            </div>

            <div className="flex flex-col flex-1 grow-[1] gap-4">

              <div className="flex gap-4">
                <Card className="flex-1">
                  <h1 className="text-xl text-center">Pytania podstawowe</h1>
                  <h1 className="text-xl text-center">{`${Math.min(questionIndex + 1, 20)}/20`}</h1>
                </Card>
                <Card className="flex-1">
                  <h1 className="text-xl text-center">Pytania specjalistyczne</h1>
                  <h1 className="text-xl text-center">{`${Math.max(0, questionIndex - 19)}/12`}</h1>
                </Card>
              </div>

              <Card>
                {hideMedia ? (
                  <>
                    <p className="text-lg mb-3 text-center">Czas na zapoznanie się z pytaniem</p>
                    <ProgressBar
                      value={timer}
                      max={20}
                      progressValueStyles={clsx(
                        (timer <= 8 && timer > 5) && 'bg-yellow-500',
                        timer <= 5 && 'bg-red-500',
                      )}
                    >
                      {`${timer} s`}
                    </ProgressBar>
                  </>
                ) : (
                  <>
                    <p className="text-lg mb-3 text-center">Czas na udzielenie odpowiedzi</p>
                    <ProgressBar
                      value={timer}
                      max={question.scope === 'basic' ? 15 : 50}
                      progressValueStyles={clsx(
                        (timer <= 8 && timer > 5) && 'bg-yellow-500',
                        timer <= 5 && 'bg-red-500',
                      )}
                    >
                      {`${timer} s`}
                    </ProgressBar>
                  </>
                )}
              </Card>

              <Card className="flex flex-col ">
                <Button onClick={showMedia} disabled={!hideMedia || mediaType === 'none'}>{`Pokaż ${mediaType === 'video' ? 'nagranie' : 'zdjęcie'}`}</Button>
                <Button onClick={nextQuestion} disabled={!isThereNextQuestion}>Następne pytanie</Button>

                <Button className="bg-red-500 mt-6" onClick={endExam}>Zakończ egzamin</Button>

              </Card>

              {/* <AdCard className="flex-1 grow-[1]" /> */}

            </div>
          </div>
        )}
      </div>
    </PageOffset>
  );
}
