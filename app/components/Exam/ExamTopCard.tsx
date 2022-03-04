import React from 'react';
import { Category } from '@prisma/client';
import Card from '~/components/Card';
import Timer from '~/components/Timer';
import { QuestionWithTranslation } from '~/data';

export interface ExamTopCardProps {
  question: QuestionWithTranslation;
  category: Category;
  onExamTimeEnd: () => void;
}

const ExamTopCard: React.FC<ExamTopCardProps> = ({ question, category, onExamTimeEnd }) => (
  <Card className="flex flex-row justify-between">
    <span>{`Wartość punktowa: ${question.points}`}</span>
    <span>{`Wybrana kategoria: ${category.name}`}</span>
    <Timer start={60 * 25} onEnd={onExamTimeEnd} />
  </Card>
);

export default ExamTopCard;
