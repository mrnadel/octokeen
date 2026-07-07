interface AuthButtonProps {
  loading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}

export function AuthButton({ loading, disabled, children }: AuthButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-200 disabled:shadow-none disabled:translate-y-0 text-white font-extrabold rounded-2xl transition-all text-[17px] tracking-wide active:translate-y-[2px]"
      style={{
        boxShadow: loading || disabled ? 'none' : '0 5px 0 #0F766E',
      }}
    >
      {children}
    </button>
  );
}
