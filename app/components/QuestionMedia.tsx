import React, { createRef, useEffect } from 'react';
import { getMediaType, Question } from '~/data';

export interface QuestionMediaProps {
  question: Question;
}

const QuestionMedia = ({ question }: QuestionMediaProps) => {
  const videoRef = createRef<HTMLVideoElement>();

  useEffect(() => {
    videoRef.current?.load();
  }, [question.media]);

  switch (getMediaType(question)) {
    case 'none':
      return null;

    case 'image':
      return (
        <img
          className="rounded-lg mb-6 "
          width={640}
          height={360}
          src={question.media}
        />
      );

    case 'video':
      return (
        <video
          ref={videoRef}
          className="rounded-lg mb-6"
          width={640}
          height={360}
          autoPlay
          muted
          controls
        >
          <source src={question.media} type="video/mp4" />
        </video>
      );
  }
};

export default QuestionMedia;
