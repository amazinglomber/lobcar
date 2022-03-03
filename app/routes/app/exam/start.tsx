import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import clsx from 'clsx';
import {
  LoaderFunction, MetaFunction, redirect, useLoaderData,
} from 'remix';
import { Category } from '@prisma/client';
import { MdCheck, MdClose } from 'react-icons/md';
import Card from '~/components/Card';
import QuestionCard, { AnswerValueType } from '~/components/QuestionCard';
import ProgressBar from '~/components/ProgressBar';
import Button from '~/components/Button';
import { getMediaType } from '~/utils/dataHelpers';
import { getCategoryById, getExam, QuestionWithTranslation } from '~/data';
import { getCategoryCookie } from '~/utils/cookieHelpers';
import LinkButton from '~/components/LinkButton';

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

  const questions = await getExam(category.id, 'pl');

  return {
    questions,
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

function StartExam() {
  const { questions, category } = useLoaderData<LoaderData>();

  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[questionIndex];
  const mediaType = getMediaType(question.media);
  const isThereNextQuestion = questionIndex < questions.length - 1;

  const [timer, setTimer] = useState(20);
  const [examTimer, setExamTimer] = useState(60 * 25);
  const timerRef = useRef<NodeJS.Timeout>();
  const examTimerRef = useRef<NodeJS.Timeout>();

  const [hideMedia, setHideMedia] = useState(true);

  const [resumeTimer, setResumeTimer] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValueType>();
  const [score, setScore] = useState(0);
  const [examEnded, setExamEnded] = useState(false);

  useEffect(() => {
    const examTimerId = setInterval(() => {
      setExamTimer((t) => t - 1);
    }, 1000);
    examTimerRef.current = examTimerId;

    const timerId = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    timerRef.current = timerId;

    return () => {
      clearInterval(examTimerId);
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    if (examTimer <= 0) {
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
        endExam();
      }
    }
  }, [examTimer]);

  // Reset state on question change
  useEffect(() => {
    const isBasic = question.scope === 'basic';

    setHideMedia(isBasic);
    setTimer(isBasic ? 20 : 50);

    // console.log(`correct answer: ${question.correctAnswer} | score: ${score}`);
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
      clearInterval(timerRef.current);
      setResumeTimer(false);
    }
  };

  const showMedia = useCallback(() => {
    setHideMedia(false);

    setTimer(15);
    pauseTimer();
  }, []);

  const handleMediaEnded = useCallback(() => {
    setResumeTimer(true);
  }, []);

  const handleAnswerSelect = useCallback((answer: AnswerValueType) => {
    // console.log(`answer: ${answer} | correct answer: ${question.correctAnswer} | selected answer: ${selectedAnswer}`);

    setSelectedAnswer(answer);
  }, [question]);

  const addScore = () => {
    if (selectedAnswer === question.correctAnswer) {
      setScore((currentScore) => currentScore + question.points);
    }
  };

  const nextQuestion = useCallback(() => {
    // console.log(`${question.correctAnswer} | selected answer: ${selectedAnswer}`);

    addScore();

    setQuestionIndex((index) => index + 1);
  }, [question, selectedAnswer]);

  const endExam = useCallback(() => {
    addScore();
    setExamEnded(true);
    pauseTimer();
  }, [question, selectedAnswer]);

  if (examEnded) {
    const passed = score >= 68;

    const iconStyles = clsx(
      'text-8xl',
      passed && 'text-green-500',
      !passed && 'text-red-500',
    );

    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <Card className="flex flex-col items-center">
          {passed ? <MdCheck className={iconStyles} /> : <MdClose className={iconStyles} />}
          <p className="text-3xl">{passed ? 'Wynik pozytywny' : 'Wynik negatywny'}</p>
          <p className="text-xl">{`Uzyskano ${score}/74 punktów`}</p>
          <LinkButton to="/app/exam" className="mt-8">Spróbuj ponownie</LinkButton>
        </Card>
      </div>
    );
  }

  return (
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
          onAnswerSelect={handleAnswerSelect}
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
          <Button
            onClick={showMedia}
            disabled={!hideMedia || mediaType === 'none'}
          >
            {`Pokaż ${mediaType === 'video' ? 'nagranie' : 'zdjęcie'}`}
          </Button>
          <Button onClick={nextQuestion} disabled={!isThereNextQuestion}>Następne pytanie</Button>

          <Button className="bg-red-500 mt-6" onClick={endExam}>Zakończ egzamin</Button>
        </Card>

      </div>
    </div>
  );
}

export default StartExam;
