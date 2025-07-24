import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export type InputProps =
  | ({
      label?: string;
      name: string;
      type?: 'submit' | 'text' | 'email' | 'checkbox';
      placeholder?: string;
      required?: boolean;
      isTextarea?: false;
      error?: string;
      register?: any;
    } & InputHTMLAttributes<HTMLInputElement>)
  | ({
      label?: string;
      name: string;
      type?: 'submit' | 'text' | 'email' | 'checkbox';
      isTextarea: true;
      error?: string;
      register?: any;
    } & TextareaHTMLAttributes<HTMLTextAreaElement>);
