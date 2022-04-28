import React from 'react';
import Card from '~/components/Card';
import { QuestionWithTranslation } from '~/data/data';

interface QuestionInfoProps {
  question: QuestionWithTranslation;
}

const QuestionInfo: React.FC<QuestionInfoProps> = ({ question }) => (
  <Card>
    <p>{`Wartość punktowa: ${question.points}`}</p>
  </Card>
);

export default QuestionInfo;
