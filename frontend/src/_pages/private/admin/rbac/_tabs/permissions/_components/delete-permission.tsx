import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { type RbacPermission } from '@/_types/rbac-permission';
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

type DeletePermissionProps = {
  selectedItem: User | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<User | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
};

const DeletePermission = ({
  selectedItem,
  setSelectedItem,
  open,
  setOpen,
  refetch,
}: DeletePermissionProps) => {
  // QUERY
  // query - use query hook
  const {
    data: rbacPermission,
    isFetching,
    error,
  } = useQuery<RbacPermission>({
    queryKey: ['users', 'delete-permission', selectedItem?.id],
    queryFn: async ({ signal }): Promise<RbacPermission> => {
      const res = await mainInstance.get(
        `/api/rbac/permissions/${selectedItem?.id}`,
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
      mainInstance.delete(`/api/rbac/permissions/${selectedItem?.id}`),
      {
        loading: 'Loading...',
        success: () => {
          // refetch
          refetch();
          // reset
          setSelectedItem(null);
          setOpen(false);
          return 'Permission deleted successfully';
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
                    <h3 className="text-center text-xl">Delete Permission</h3>
                    {/* description */}
                    <p className="mb-2 text-center text-slate-600">
                      Are you sure you want to delete this permission?
                    </p>
                    {/* permission name */}
                    <h2 className="text-center text-2xl font-semibold">
                      {rbacPermission?.label}
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

export default DeletePermission;
