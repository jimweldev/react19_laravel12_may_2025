import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { RbacUserRole } from '@/_types/rbac-user-role';
import type { User } from '@/_types/user';
import fallbackImage from '@/assets/images/default-avatar.png';
import { mainInstance } from '@/instances/main-instance';
import { formatName } from '@/lib/format-name';
import { getImageUrl } from '@/lib/get-image-url';
import ReactImage from '../images/react-image';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type ProfileToolTipProps = {
  userId?: number;
  children: React.ReactNode;
  delayDuration?: number;
};

const ProfileToolTip = ({
  userId,
  children,
  delayDuration = 500,
}: ProfileToolTipProps) => {
  const [open, setOpen] = useState(false);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async (): Promise<User> => {
      const res = await mainInstance.get(`/api/users/${userId}`);
      return res.data;
    },
    enabled: !!userId && open,
    staleTime: 1000 * 60 * 60 * 12,
  });

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </TooltipTrigger>
      <TooltipContent className="relative overflow-hidden p-0 shadow-lg">
        <div className="bg-card text-card-foreground min-w-[220px] rounded border p-2">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Skeleton className="outline-primary border-card size-8 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-25" />
                  <Skeleton className="h-3 w-30" />
                </div>
              </div>
              <Separator />
              <div className="flex flex-wrap items-center gap-1">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-15" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div
                  className={`${user?.is_admin ? 'outline-warning' : 'outline-primary'} border-card flex size-8 cursor-pointer items-center overflow-hidden rounded-full border-1 outline-2 select-none`}
                >
                  <ReactImage
                    className="pointer-events-none h-full w-full object-cover"
                    src={getImageUrl(
                      `${import.meta.env.VITE_STORAGE_BASE_URL}/avatars`,
                      user?.avatar,
                      fallbackImage,
                    )}
                    unloaderSrc={fallbackImage}
                  />
                </div>
                <div>
                  <p className="font-semibold">
                    {formatName(user, 'semifull')}
                  </p>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Separator />

              <div>
                {user?.rbac_user_roles?.length === 0 ? (
                  <Badge variant="secondary">No roles</Badge>
                ) : (
                  <div className="flex flex-wrap items-center gap-1">
                    {user?.rbac_user_roles?.map((role: RbacUserRole) => (
                      <Badge key={role.id}>{role.rbac_role?.label}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default ProfileToolTip;
