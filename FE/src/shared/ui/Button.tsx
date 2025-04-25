const Button = ({ text, style, onClick }) => {
  return (
    <button style={style} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
