export type InputProps = {
  label: string;
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  required?: boolean;
  isTextarea?: boolean;
  checked?: boolean;
};
