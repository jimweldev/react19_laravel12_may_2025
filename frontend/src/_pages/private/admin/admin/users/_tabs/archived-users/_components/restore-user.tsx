import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircleHelp } from 'lucide-react';
import { toast } from 'sonner';
import { type User } from '@/_types/user';
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
import { formatName } from '@/lib/format-name';

type RestoreUserProps = {
  selectedItem: User | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<User | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const RestoreUser = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: RestoreUserProps) => {
  const {
    data: user,
    isFetching,
    error,
  } = useQuery<User>({
    queryKey: ['users/archived', selectedItem?.id],
    queryFn: async ({ signal }): Promise<User> => {
      const res = await mainInstance.get(
        `/api/users/${selectedItem?.id}/archived`,
        { signal },
      );
      return res.data;
    },
    enabled: !!selectedItem?.id && open,
  });

  const [isLoadingRestoreItem, setIsLoadingRestoreItem] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoadingRestoreItem(true);

    toast.promise(
      mainInstance.post(`/api/users/${selectedItem?.id}/archived/restore`),
      {
        loading: 'Loading...',
        success: () => {
          refetch();
          setOpen(false);
          setSelectedItem(null);
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
          setIsLoadingRestoreItem(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setTimeout(() => {
          setSelectedItem(null);
        }, 200);
      }}
    >
      <DialogContent>
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
                    <CircleHelp
                      className="text-warning mx-auto mb-4"
                      size={64}
                    />
                    <h3 className="text-center text-xl">Restore User</h3>

                    <p className="text-muted-foreground mb-2 text-center">
                      Are you sure you want to restore this record?
                    </p>

                    <h2 className="text-center text-2xl font-semibold">
                      {formatName(user, 'semifull')}
                    </h2>
                  </>
                )}
              </DialogBody>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>

                <Button
                  variant="warning"
                  type="submit"
                  disabled={isLoadingRestoreItem || !!error}
                >
                  Restore
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestoreUser;
