import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  error?: string;
  register?: any;
} & (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
);
