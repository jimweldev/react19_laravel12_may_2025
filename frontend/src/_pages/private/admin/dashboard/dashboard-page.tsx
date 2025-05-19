import PageHeader from '@/components/typography/page-header';
import AccountTypesChart from './_components/account-types-chart';
import AdminChart from './_components/admin-chart';

const DashboardPage = () => {
  return (
    <>
      {/* page title */}

      {/* page header */}
      <div className="mb-3 flex items-center justify-between">
        <PageHeader>Dashboard</PageHeader>
      </div>

      {/* grid layout for dashboard charts */}
      <div className="grid grid-cols-12 gap-3">
        {/* admin chart */}
        <AdminChart />
        {/* account types chart */}
        <AccountTypesChart />
      </div>
    </>
  );
};

export default DashboardPage;
