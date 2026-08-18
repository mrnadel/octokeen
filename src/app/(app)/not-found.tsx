import { NotFoundScreen } from '@/components/errors/NotFoundScreen';

export default function AppNotFound() {
  return (
    <NotFoundScreen
      gearSizeClass="w-24 h-24"
      labelSizeClass="text-2xl"
      description="We couldn't find what you were looking for. It might have been moved or doesn't exist."
    />
  );
}
