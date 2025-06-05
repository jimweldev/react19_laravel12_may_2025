import { useQuery } from '@tanstack/react-query';
import { FaUsers, FaUsersGear, FaUsersSlash, FaUserTie } from 'react-icons/fa6';
import { Card, CardBody } from '@/components/ui/card';
import { mainInstance } from '@/instances/main-instance';
import { formatNumber } from '@/lib/format-number';

const DashboardStatistics = () => {
  const { data } = useQuery({
    queryKey: ['dashboard/statistics'],
    queryFn: ({ signal }) =>
      mainInstance.get(`/api/dashboard/statistics`, { signal }).then(res => {
        return res.data;
      }),
  });

  return (
    <div className="grid grid-cols-12 gap-3">
      <Card className="relative col-span-12 @lg/main:col-span-6 @3xl/main:col-span-3">
        <CardBody>
          <h6 className="text-muted-foreground mb-3 text-lg font-semibold">
            Users
          </h6>
          <p className="text-3xl font-bold">{formatNumber(data?.users, 0)}</p>
          <FaUsers className="text-muted-foreground/50 absolute top-3 right-3 size-8" />
        </CardBody>
      </Card>
      <Card className="relative col-span-12 @lg/main:col-span-6 @3xl/main:col-span-3">
        <CardBody>
          <h6 className="text-muted-foreground mb-3 text-lg font-semibold">
            Deleted Users
          </h6>
          <p className="text-3xl font-bold">
            {formatNumber(data?.deleted_users, 0)}
          </p>
          <FaUsersSlash className="text-muted-foreground/50 absolute top-3 right-3 size-8" />
        </CardBody>
      </Card>
      <Card className="relative col-span-12 @lg/main:col-span-6 @3xl/main:col-span-3">
        <CardBody>
          <h6 className="text-muted-foreground mb-3 text-lg font-semibold">
            Admins
          </h6>
          <p className="text-3xl font-bold">{formatNumber(data?.admins, 0)}</p>
          <FaUsersGear className="text-muted-foreground/50 absolute top-3 right-3 size-8" />
        </CardBody>
      </Card>
      <Card className="relative col-span-12 @lg/main:col-span-6 @3xl/main:col-span-3">
        <CardBody>
          <h6 className="text-muted-foreground mb-3 text-lg font-semibold">
            Account Types
          </h6>
          <p className="text-3xl font-bold">
            {formatNumber(data?.account_types, 0)}
          </p>
          <FaUserTie className="text-muted-foreground/50 absolute top-3 right-3 size-8" />
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardStatistics;
