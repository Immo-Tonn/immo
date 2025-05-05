import { useState } from 'react';
import { Button as ButtonProps } from './model';

const Button = ({
  onClick,
  className,
  addLineBreak,
  initialText,
  clickedText,
}: ButtonProps) => {
  const [text, setText] = useState(initialText);

  const [isButtonDisabled, setButtonState] = useState(false);
  const handleClick = () => {
    setText(clickedText);
    if (onClick) {
      onClick();
    }
    setButtonState(true);

    setTimeout(() => {
      setText(initialText);
      setButtonState(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={isButtonDisabled}
    >
      {typeof text === 'string' && addLineBreak
        ? text.split('\n').map((line, id) => (
            <span key={id}>
              {line}
              <br />
            </span>
          ))
        : text}
    </button>
  );
};

export default Button;
