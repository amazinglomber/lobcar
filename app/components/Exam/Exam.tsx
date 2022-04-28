import React, { useCallback, useEffect, useState } from 'react';
import ExamTopCard from '~/components/Exam/ExamTopCard';
import QuestionCard, { AnswerValueType } from '~/components/Question/QuestionCard';
import ExamQuestionNumberCards from '~/components/Exam/ExamQuestionNumberCards';
import Card from '~/components/Card';
import Button from '~/components/Button';
import { getMediaType } from '~/utils/dataHelpers';
import useInterval from '~/hooks/useInterval';
import ExamProgressBar from '~/components/Exam/ExamProgressBar';

const questionReadTime = 20;
const questionAnswerTime = 15;
const advancedQuestionAnswerTime = 50;

export interface ExamProps {
  questions: Question[];
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
    setTimer((prevTimer) => prevTimer - 1);
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
    setSelectedAnswer(undefined);
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
  }, []);

  const addScore = useCallback(() => {
    if (selectedAnswer === question.correctAnswer) {
      onScoreChange(question.points);
    }
  }, [question, selectedAnswer, onScoreChange]);

  const handleEndExam = useCallback(() => {
    addScore();
    onExamEnd();
  }, [addScore, onExamEnd]);

  const handleNextQuestion = useCallback(() => {
    if (questionIndex <= 30) {
      setQuestionIndex((index) => index + 1);
      addScore();
    } else {
      handleEndExam();
    }
  }, [addScore, questionIndex, handleEndExam]);

  return (
    <div className="flex flex-1 flex-col lg:flex-row lg:items-start gap-4">

      {/* Exam main panel */}
      <div className="flex flex-col flex-1 grow-[3] gap-4">
        <ExamTopCard
          question={question}
          category={category}
          onExamTimeEnd={handleEndExam}
          paused={!timerRunning}
        />
        <QuestionCard
          question={question}
          checkedAnswer={false}
          hideMedia={hideMedia}
          hideControls
          onMediaClick={showMedia}
          onMediaEnded={handleMediaEnded}
          onAnswerSelect={handleAnswerSelect}
        />
      </div>

      {/* Exam right panel */}
      <div className="flex flex-col flex-1 grow-[1] gap-4">

        <ExamQuestionNumberCards questionNumber={questionIndex} />

        {/* Exam progress */}
        <Card className="flex flex-col items-center gap-4">
          {hideMedia ? (
            <>
              <p>Czas na zapoznanie się z pytaniem</p>
              <ExamProgressBar value={timer} max={questionReadTime} />
            </>
          ) : (
            <>
              <p>Czas na udzielenie odpowiedzi</p>
              <ExamProgressBar value={timer} max={question.scope === 'basic' ? questionAnswerTime : advancedQuestionAnswerTime} />
            </>
          )}
        </Card>

        {/* Exam controls */}
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
