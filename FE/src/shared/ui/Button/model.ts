export type Button = {
  onClick?: () => void;
  className?: string;
  addLineBreak?: boolean;
  initialText?: string;
  clickedText?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};
