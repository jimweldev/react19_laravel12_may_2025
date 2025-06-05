import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { type RbacRole } from '@/_types/rbac-role';
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

type DeleteRoleProps = {
  selectedItem: User | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<User | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const DeleteRole = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: DeleteRoleProps) => {
  const {
    data: rbacRole,
    isFetching,
    error,
  } = useQuery<RbacRole>({
    queryKey: ['rbac/roles', 'delete', selectedItem?.id],
    queryFn: async ({ signal }): Promise<RbacRole> => {
      const res = await mainInstance.get(
        `/api/rbac/roles/${selectedItem?.id}`,
        { signal },
      );
      return res.data;
    },
    enabled: !!selectedItem && open,
  });

  const [isLoadingDeleteItem, setIsLoadingDeleteItem] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoadingDeleteItem(true);

    toast.promise(mainInstance.delete(`/api/rbac/roles/${selectedItem?.id}`), {
      loading: 'Loading...',
      success: () => {
        refetch();

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
                    <CircleAlert
                      className="text-destructive mx-auto mb-4"
                      size={64}
                    />

                    <h3 className="text-center text-xl">Delete Role</h3>

                    <p className="text-muted-foreground mb-2 text-center">
                      Are you sure you want to delete this record?
                    </p>

                    <h2 className="text-center text-2xl font-semibold">
                      {rbacRole?.label}
                    </h2>
                  </>
                )}
              </DialogBody>
              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>

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

export default DeleteRole;
