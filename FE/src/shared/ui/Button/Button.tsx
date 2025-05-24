import { Button as ButtonProps } from './model';

const Button = ({
  onClick,
  className,
  addLineBreak,
  initialText,
  clickedText,
  type,
  disabled,
}: ButtonProps & { disabled?: boolean }) => {
  const displayText = disabled ? clickedText : initialText;

  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={type}
    >
      {typeof displayText === 'string' && addLineBreak
        ? displayText.split('\n').map((line, id) => (
            <span key={id}>
              {line}
              <br />
            </span>
          ))
        : displayText}
    </button>
  );
};

export default Button;
