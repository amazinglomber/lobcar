import { Question } from '~/data';
import QuestionMedia from '~/components/QuestionMedia';
import Card from '~/components/Card';

export interface QuestionCardProps {
  question: Question;
  className?: string;
}

const QuestionCard = ({ question, className }: QuestionCardProps) => {
  return (
    <Card
      className={className}
    >
      <QuestionMedia question={question} />
      <h1
        className={"text-xl mt-6 whitespace-normal"}
      >
        {question.question.pl}
      </h1>
    </Card>
  );
};

export default QuestionCard;
