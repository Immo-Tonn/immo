import { InputProps } from './model';
import React from 'react';
const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ label, type = 'text', isTextarea = false, error, ...rest }, ref) => {
  return (
    <label style={{ display: 'block', margin: '1rem 0' }}>
      {label}
      {isTextarea ? (
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={5}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
        />
      ) : (
        <input
          type={type}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as React.Ref<HTMLInputElement>}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
        />
      )}
      {error && (
        <span style={{ color: 'red', fontSize: '0.875rem' }}>{error}</span>
      )}
    </label>
  );
});

export default Input;
