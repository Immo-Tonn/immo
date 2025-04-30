import { Button as ButtonProps } from './model';

const Button = ({
  style,
  onClick,
  className,
  text,
  addLineBreak,
}: ButtonProps) => (
  <button style={style} onClick={onClick} className={className}>
    {addLineBreak
      ? text.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))
      : text}
  </button>
);

export default Button;
