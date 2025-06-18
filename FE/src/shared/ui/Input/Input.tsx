import { InputProps } from './model';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  placeholder,
  onChange,
  required = false,
  isTextarea = false,
}: InputProps) => {
  return (
    <label style={{ display: 'block', margin: '1rem 0' }}>
      {label}
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          rows={5}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
        />
      )}
    </label>
  );
};

export default Input;
