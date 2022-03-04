import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Category } from '@prisma/client';
import ExamTopCard from '~/components/Exam/ExamTopCard';
import QuestionCard, { AnswerValueType } from '~/components/QuestionCard';
import ExamQuestionNumberCards from '~/components/Exam/ExamQuestionNumberCards';
import Card from '~/components/Card';
import ProgressBar from '~/components/ProgressBar';
import Button from '~/components/Button';
import { getMediaType } from '~/utils/dataHelpers';
import useInterval from '~/hooks/useInterval';
import { QuestionWithTranslation } from '~/data';

const questionReadTime = 5;
const questionAnswerTime = 3;
const advancedQuestionAnswerTime = 10;

export interface ExamProps {
  questions: QuestionWithTranslation[];
  category: Category;
  onExamEnd: () => void;
  onScoreChange: (newScore: number) => void;
}

const Exam: React.FC<ExamProps> = ({
  questions, category, onExamEnd, onScoreChange,
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[questionIndex];
  const mediaType = getMediaType(question.media);
  const isThereNextQuestion = questionIndex < questions.length - 1;

  const [hideMedia, setHideMedia] = useState(true);

  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValueType>();

  const [timer, setTimer] = useState(questionReadTime);
  const [timerRunning, setTimerRunning] = useState(true);

  useInterval(() => {
    setTimer((currentTimer) => currentTimer - 1);
  }, timer > 0 && timerRunning ? 1000 : null);

  useEffect(() => {
    if (timer <= 0) {
      // When time to read question ends | else: when time to answer question ends
      if (hideMedia && question.scope === 'basic') {
        showMedia();
      } else {
        handleNextQuestion();
      }
    }
  }, [timer]);

  // Reset state on question change
  useEffect(() => {
    const isBasic = question.scope === 'basic';

    setHideMedia(isBasic);
    setTimer(isBasic ? questionReadTime : advancedQuestionAnswerTime);
    setTimerRunning(isBasic || mediaType === 'none');
  }, [questionIndex]);

  const showMedia = useCallback(() => {
    setTimer(questionAnswerTime);
    setTimerRunning(false);
    setHideMedia(false);
  }, []);

  const handleMediaEnded = useCallback(() => {
    setTimerRunning(true);
  }, []);

  const handleAnswerSelect = useCallback((answer: AnswerValueType) => {
    setSelectedAnswer(answer);
  }, [question]);

  const addScore = useCallback(() => {
    if (selectedAnswer === question.correctAnswer) {
      onScoreChange(question.points);
    }
  }, [question, selectedAnswer]);

  const handleNextQuestion = useCallback(() => {
    addScore();
    setQuestionIndex((index) => index + 1);
  }, [addScore]);

  const handleEndExam = useCallback(() => {
    addScore();
    onExamEnd();
  }, [addScore]);

  return (
    <div className="flex flex-1 flex-col lg:flex-row lg:items-start gap-4">
      <div className="flex flex-col flex-1 grow-[3] gap-4">
        <ExamTopCard question={question} category={category} onExamTimeEnd={handleEndExam} />
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

        <ExamQuestionNumberCards questionNumber={questionIndex} />

        <Card className="flex flex-col items-center gap-4">
          {(hideMedia && question.scope === 'basic') && <p>Czas na zapoznanie się z pytaniem</p>}
          {(!hideMedia || question.scope === 'advanced') && <p>Czas na udzielenie odpowiedzi</p>}

          <ProgressBar
            value={timer}
            max={20}
            valueSuffix="s"
            progressValueStyles={clsx(
              (timer <= 8 && timer > 5) && 'bg-yellow-500',
              timer <= 5 && 'bg-red-500',
            )}
          />
        </Card>

        <Card className="flex flex-col ">

          {/* Show media button */}
          <Button
            onClick={showMedia}
            disabled={!hideMedia || mediaType === 'none'}
          >
            {`Pokaż ${mediaType === 'video' ? 'nagranie' : 'zdjęcie'}`}
          </Button>

          {/* Next question button */}
          <Button
            onClick={handleNextQuestion}
            disabled={!isThereNextQuestion}
          >
            Następne pytanie
          </Button>

          {/* End exam button */}
          <Button
            className="bg-red-500 mt-6"
            onClick={handleEndExam}
          >
            Zakończ egzamin
          </Button>

        </Card>

      </div>
    </div>
  );
};

export default Exam;
