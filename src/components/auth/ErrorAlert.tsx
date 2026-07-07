export function ErrorAlert({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-semibold">
      {message}
    </div>
  );
}
