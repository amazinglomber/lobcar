import { useEffect, useState } from 'react';
import { Question } from '~/data';
import QuestionMedia from '~/components/QuestionMedia';
import Card from '~/components/Card';
import Answer from '~/components/Answer';

export interface QuestionCardProps {
  question: Question;
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
        {question.question.pl}
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
              label={question.answers.pl[x]}
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
