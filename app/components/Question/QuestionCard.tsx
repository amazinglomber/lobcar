import React, { useEffect, useState } from 'react';
import QuestionMedia, { QuestionMediaProps } from '~/components/Question/QuestionMedia';
import Card from '~/components/Card';
import Answer from '~/components/Answer';

export type AnswerValueType = 'T' | 'N' | 'A' | 'B' | 'C';

export interface QuestionCardProps {
  question: Question;
  checkedAnswer: boolean;
  hideMedia?: boolean;
  hideControls?: boolean;
  onMediaClick?: QuestionMediaProps['onClick'];
  onMediaEnded?: QuestionMediaProps['onMediaEnded'];
  onAnswerSelect?: (answer: AnswerValueType) => void;
  className?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  checkedAnswer,
  className,
  hideMedia = false,
  hideControls = false,
  onMediaClick,
  onMediaEnded,
  onAnswerSelect,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValueType>();

  useEffect(() => {
    setSelectedAnswer(undefined);
  }, [question]);

  const handleAnswerClick = (value: AnswerValueType) => () => {
    if (!checkedAnswer) {
      setSelectedAnswer(value);

      if (onAnswerSelect) {
        onAnswerSelect(value);
      }
    }
  };

  return (
    <Card
      className={className}
    >
      <div className="flex flex-row justify-center">
        <QuestionMedia
          question={question}
          hidden={hideMedia}
          hideControls={hideControls}
          onClick={onMediaClick}
          onMediaEnded={onMediaEnded}
        />
      </div>

      <h1 className="text-xl mb-6 whitespace-normal">
        {question.translations.pl.question}
      </h1>
      {(question.correctAnswer === 'T' || question.correctAnswer === 'N') ? (
        <div>
          {(['t', 'n'] as const).map((x) => (
            <Answer
              key={`answer-${x}`}
              checked={selectedAnswer === x.toUpperCase()}
              label={x === 't' ? 'Tak' : 'Nie'}
              onClick={handleAnswerClick(x.toUpperCase() as AnswerValueType)}
              isCorrect={question.correctAnswer.toLowerCase() === x}
              checkedAnswer={checkedAnswer}
            />
          ))}
        </div>
      ) : (
        <div>
          {(['a', 'b', 'c'] as const).map((x) => (
            <Answer
              key={`answer-${x}`}
              checked={selectedAnswer === x.toUpperCase()}
              label={question.translations.pl.answers[x]}
              onClick={handleAnswerClick(x.toUpperCase() as AnswerValueType)}
              isCorrect={question.correctAnswer.toLowerCase() === x}
              checkedAnswer={checkedAnswer}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;
