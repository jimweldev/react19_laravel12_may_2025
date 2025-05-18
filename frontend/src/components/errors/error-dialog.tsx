import { type AxiosError } from 'axios';
import { FaFaceDizzy } from 'react-icons/fa6';
import { type ErrorResponse } from '@/_types/common/error-response';

interface ErrorDialogProps {
  error: ErrorResponse;
}

const ErrorDialog = ({ error }: ErrorDialogProps) => {
  return (
    <>
      <FaFaceDizzy className="text-destructive mx-auto mb-4" size={64} />
      <h3 className="text-center text-xl">An error occurred</h3>
      <p className="text-center text-slate-600">
        {(error as AxiosError<ErrorResponse>)?.response?.data?.message ||
          error.message ||
          'Failed to fetch data'}
      </p>
    </>
  );
};

export default ErrorDialog;
