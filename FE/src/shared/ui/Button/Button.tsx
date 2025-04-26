import { Button as ButtonProps } from './model';

const Button = ({ style, onClick, text }: ButtonProps) => {
  return (
    <button style={style} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
