import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export type InputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  isTextarea?: boolean;
  error?: string;
  register?: any; // Тип от react-hook-form
} & (
  | InputHTMLAttributes<HTMLInputElement>
  | TextareaHTMLAttributes<HTMLTextAreaElement>
);
