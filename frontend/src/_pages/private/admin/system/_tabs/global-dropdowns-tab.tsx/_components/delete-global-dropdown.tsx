import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import type { SystemGlobalDropdown } from '@/_types/system-global-dropdown';
import ErrorDialog from '@/components/errors/error-dialog';
import DialogDeleteSkeleton from '@/components/skeletons/dialog-delete-skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { mainInstance } from '@/instances/main-instance';

type DeleteGlobalDropdownProps = {
  selectedItem: SystemGlobalDropdown | null;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<SystemGlobalDropdown | null>
  >;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const DeleteGlobalDropdown = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: DeleteGlobalDropdownProps) => {
  // QUERY
  // query - use query hook
  const {
    data: systemGlobalDropdown,
    isFetching,
    error,
  } = useQuery<SystemGlobalDropdown>({
    queryKey: ['system/globalDropdowns', 'delete', selectedItem?.id],
    queryFn: async ({ signal }): Promise<SystemGlobalDropdown> => {
      const res = await mainInstance.get(
        `/api/system/global-dropdowns/${selectedItem?.id}`,
        { signal },
      );
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  // FORM
  // form - state
  const [isLoadingDeleteItem, setIsLoadingDeleteItem] = useState(false);

  // form - submit
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoadingDeleteItem(true);

    toast.promise(
      mainInstance.delete(`/api/system/global-dropdowns/${selectedItem?.id}`),
      {
        loading: 'Loading...',
        success: () => {
          // refetch
          refetch();
          // reset
          setSelectedItem(null);
          setOpen(false);
          return 'Success!';
        },
        error: error => {
          return (
            error.response?.data?.message ||
            error.message ||
            'An error occurred'
          );
        },
        finally: () => {
          setIsLoadingDeleteItem(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        // reset selected item after animation
        setTimeout(() => {
          setSelectedItem(null);
        }, 200);
      }}
    >
      <DialogContent>
        {/* delete form */}
        <form onSubmit={onSubmit}>
          {isFetching ? (
            <DialogDeleteSkeleton />
          ) : (
            <>
              <DialogTitle />
              <DialogDescription />
              <DialogBody>
                {error ? (
                  <ErrorDialog error={error} />
                ) : (
                  <>
                    {/* warning icon */}
                    <CircleAlert
                      className="text-destructive mx-auto mb-4"
                      size={64}
                    />
                    {/* title */}
                    <h3 className="text-center text-xl">
                      Delete GlobalDropdown
                    </h3>
                    {/* description */}
                    <p className="mb-2 text-center text-slate-600">
                      Are you sure you want to delete this record?
                    </p>
                    {/* globalDropdown name */}
                    <h2 className="text-center text-2xl font-semibold">
                      {systemGlobalDropdown?.label}
                    </h2>
                  </>
                )}
              </DialogBody>
              <DialogFooter className="flex justify-end gap-2">
                {/* close button */}
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                {/* submit button */}
                <Button
                  variant="destructive"
                  type="submit"
                  disabled={isLoadingDeleteItem || !!error}
                >
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGlobalDropdown;
