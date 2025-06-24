import { InputProps } from './model';
import React from 'react';

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ label, type, isTextarea = false, error, ...rest }, ref) => {
  return label ? (
    <label>
      {label}
      {isTextarea ? (
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={5}
        />
      ) : (
        <input
          type={type}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as React.Ref<HTMLInputElement>}
        />
      )}
      {error && <span>{error}</span>}
    </label>
  ) : (
    <>
      {isTextarea ? (
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={5}
          style={{ resize: 'none' }}
        />
      ) : (
        <input
          type={type}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as React.Ref<HTMLInputElement>}
        />
      )}
      {error && <span>{error}</span>}
    </>
  );
});

export default Input;
