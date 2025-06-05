import PageHeader from '@/components/typography/page-header';
import DashboardAccountTypesChart from './_components/dashboard-account-types-chart';
import DashboardStatistics from './_components/dashboard-statistics';
import DashboardUserRegistrationStats from './_components/dashboard-user-registration-stats';

const DashboardPage = () => {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>Dashboard</PageHeader>
      </div>

      <div className="space-y-3">
        <DashboardStatistics />
        <div className="grid grid-cols-12 gap-3">
          <DashboardUserRegistrationStats />
          <DashboardAccountTypesChart />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
