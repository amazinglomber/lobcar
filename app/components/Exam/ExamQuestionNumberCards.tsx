import React from 'react';
import Card from '~/components/Card';

export interface ExamQuestionNumberCardsProps {
  questionNumber: number;
}

const ExamQuestionNumberCards: React.FC<ExamQuestionNumberCardsProps> = ({ questionNumber }) => (
  <div className="flex gap-4">
    <Card className="flex-1">
      <h1 className="text-xl text-center">Pytania podstawowe</h1>
      <h1 className="text-xl text-center">{`${Math.min(questionNumber + 1, 20)}/20`}</h1>
    </Card>
    <Card className="flex-1">
      <h1 className="text-xl text-center">Pytania specjalistyczne</h1>
      <h1 className="text-xl text-center">{`${Math.max(0, questionNumber - 19)}/12`}</h1>
    </Card>
  </div>
);

export default ExamQuestionNumberCards;
