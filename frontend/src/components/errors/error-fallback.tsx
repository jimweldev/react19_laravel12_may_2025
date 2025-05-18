import { FaFaceDizzy } from 'react-icons/fa6';
import { Button } from '../ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center">
      <FaFaceDizzy className="mb-8" size={125} />

      <h1 className="mb-4 text-5xl font-bold">Oops! Something went wrong.</h1>
      <p className="mb-8 text-lg font-semibold">{error.message}</p>

      <Button onClick={resetErrorBoundary}>Try Again</Button>
    </div>
  );
};

export default ErrorFallback;
