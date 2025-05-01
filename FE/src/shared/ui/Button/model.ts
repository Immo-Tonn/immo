export type Button = {
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
  addLineBreak?: boolean;
  initialText: string;
  clickedText: string;
};
