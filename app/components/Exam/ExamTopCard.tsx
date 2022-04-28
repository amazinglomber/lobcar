import React from 'react';
import Card from '~/components/Card';
import Timer from '~/components/Timer';

export interface ExamTopCardProps {
  question: Question;
  category: Category;
  onExamTimeEnd: () => void;
  paused: boolean;
}

const ExamTopCard: React.FC<ExamTopCardProps> = ({
  question, category, onExamTimeEnd, paused,
}) => (
  <Card className="flex flex-row justify-between">
    <span>{`Wartość punktowa: ${question.points}`}</span>
    <span>{`Wybrana kategoria: ${category}`}</span>
    <Timer start={60 * 25} onEnd={onExamTimeEnd} paused={paused} />
  </Card>
);

export default ExamTopCard;
