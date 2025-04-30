export type Button = {
  text: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
  addLineBreak?: boolean;
};
