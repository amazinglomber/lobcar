import { useEffect, useState } from 'react';
import QuestionMedia from '~/components/QuestionMedia';
import Card from '~/components/Card';
import Answer from '~/components/Answer';
import { QuestionWithTranslation } from '~/data';

export interface QuestionCardProps {
  question: QuestionWithTranslation;
  checkedAnswer: boolean;
  className?: string;
}

type AnswerValueType = 'T' | 'N' | 'A' | 'B' | 'C';

const QuestionCard = ({ question, checkedAnswer, className }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValueType>();

  useEffect(() => {
    setSelectedAnswer(undefined);
  }, [question]);

  const handleAnswerClick = (value: AnswerValueType) => () => {
    if (!checkedAnswer) {
      setSelectedAnswer(value);
    }
  }

  return (
    <Card
      className={className}
    >
      <div className="flex flex-row justify-center">
        <QuestionMedia question={question} />
      </div>

      <h1 className={"text-xl mb-6 whitespace-normal"}>
        {question.question}
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
              label={question.answers[x]}
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
