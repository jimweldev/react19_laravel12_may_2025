import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import type { Cat } from '@/_types/cat';
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

type DeleteCatProps = {
  selectedItem: Cat | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<Cat | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const DeleteCat = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: DeleteCatProps) => {
  // QUERY
  // query - use query hook
  const {
    data: cat,
    isFetching,
    error,
  } = useQuery<Cat>({
    queryKey: ['cats', 'delete-cat', selectedItem?.id],
    queryFn: async ({ signal }): Promise<Cat> => {
      const res = await mainInstance.get(`/api/cats/${selectedItem?.id}`, {
        signal,
      });
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

    toast.promise(mainInstance.delete(`/api/cats/${selectedItem?.id}`), {
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
          error.response?.data?.message || error.message || 'An error occurred'
        );
      },
      finally: () => {
        setIsLoadingDeleteItem(false);
      },
    });
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
                    <h3 className="text-center text-xl">Delete Cat</h3>
                    {/* description */}
                    <p className="text-muted-foreground mb-2 text-center">
                      Are you sure you want to delete this record?
                    </p>
                    {/* cat name */}
                    <h2 className="text-center text-2xl font-semibold">
                      {cat?.name}
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

export default DeleteCat;
