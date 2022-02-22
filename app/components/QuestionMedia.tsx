import React from 'react';
import { getMediaType, Question } from '~/data';

export interface QuestionMediaProps {
  question: Question;
}

const QuestionMedia = ({ question }: QuestionMediaProps) => {
  switch (getMediaType(question)) {
    case 'none':
      return null;

    case 'image':
      return (
        <img
          className="rounded-lg"
          width={640}
          height={360}
          src={question.media}
        />
      );

    case 'video':
      return (
        <video
          className="rounded-lg"
          width={640}
          height={360}
        >
          <source src={question.media} type="video/mp4" />
        </video>
      );
  }
};

export default QuestionMedia;
