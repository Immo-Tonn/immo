import { useEffect, useState } from 'react';
import { Button as ButtonProps } from './model';

const Button = ({
  onClick,
  className,
  addLineBreak,
  initialText = '',
  clickedText = '',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const [internalDisabled, setInternalDisabled] = useState(false);
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (disabled) {
      setText(clickedText);
      // При внешнем disabled внутреннюю блокировку не включаем, чтобы не мешать форме
      setInternalDisabled(false);
    } else if (!internalDisabled) {
      setText(initialText);
    }
  }, [disabled, clickedText, initialText, internalDisabled]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Вызов onClick при клике, только если кнопка НЕ заблокирована (внешне или внутренне)
    if (disabled || internalDisabled) return;

    setText(clickedText);
    setInternalDisabled(true);

    if (onClick) onClick();

    setTimeout(() => {
      setText(initialText);
      setInternalDisabled(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={disabled || internalDisabled}
      type={type}
    >
      {typeof text === 'string' && addLineBreak
        ? text.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))
        : text}
    </button>
  );
};

export default Button;
