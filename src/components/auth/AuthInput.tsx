interface AuthInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  id?: string;
  minLength?: number;
  maxLength?: number;
  autoFocus?: boolean;
}

export function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  id,
  minLength,
  maxLength,
  autoFocus,
}: AuthInputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      autoFocus={autoFocus}
      suppressHydrationWarning
      className="w-full px-4 py-3.5 bg-surface-50 border-2 border-surface-200 rounded-2xl text-surface-900 font-semibold placeholder-surface-300 focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
    />
  );
}
