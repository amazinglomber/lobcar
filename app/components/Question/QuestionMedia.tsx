import React, { createRef, useCallback, useEffect } from 'react';
import { Question } from '@prisma/client';
import { FiCamera, FiCameraOff, FiVideo } from 'react-icons/fi';
import { getMediaType } from '~/utils/dataHelpers';

export interface QuestionMediaProps {
  question: Question;
  hidden?: boolean;
  onClick?: () => void;
  onMediaEnded?: () => void;
  hideControls?: boolean;
}

// TODO: Add "hide controls" prop
const QuestionMedia: React.FunctionComponent<QuestionMediaProps> = ({
  question, hidden = false, onClick, onMediaEnded, hideControls = false,
}) => {
  const videoRef = createRef<HTMLVideoElement>();

  const mediaType = getMediaType(question.media);

  useEffect(() => {
    videoRef.current?.load();
  }, [question.media]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  if (mediaType === 'none') {
    return <QuestionMediaPlaceholder mediaType="none" />;
  }

  if (hidden) {
    return <QuestionMediaPlaceholder mediaType={mediaType} handleClick={handleClick} />;
  }

  switch (mediaType) {
    case 'image':
      return (
        <img
          className="rounded-lg mb-6 "
          width={640}
          height={360}
          src={question.media}
          onLoad={onMediaEnded}
        />
      );

    case 'video':
      return (
        <video
          ref={videoRef}
          className="rounded-lg mb-6"
          width={640}
          height={360}
          onEnded={onMediaEnded}
          autoPlay
          muted
          controls={!hideControls}
        >
          <source src={question.media} type="video/mp4" />
        </video>
      );

    default:
      return null;
  }
};

export interface QuestionMediaPlaceholderProps {
  mediaType: ReturnType<typeof getMediaType>;
  handleClick?: () => void;
}

const QuestionMediaPlaceholder: React.FunctionComponent<QuestionMediaPlaceholderProps> = ({ mediaType, handleClick }) => (
  <div className="bg-gray-500 text-8xl text-white flex items-center justify-center mb-6" style={{ width: 640, height: 360 }} onClick={handleClick}>
    {mediaType === 'image' && <FiCamera />}
    {mediaType === 'video' && <FiVideo />}
    {mediaType === 'none' && <FiCameraOff />}
  </div>
);

export default QuestionMedia;
