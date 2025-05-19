import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Label, Pie, PieChart } from 'recharts';
import PieChartSkeleton from '@/components/skeletons/pie-chart-skeleton';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { mainInstance } from '@/instances/main-instance';

// chart colors
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// chart structure
interface ChartData {
  account_type: string;
  count: number;
  fill: string;
}

const AccountTypesChart = () => {
  // CHART
  // chart - state
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // chart - fetch data
  const { isFetching } = useQuery({
    queryKey: ['dashboard/account-types'],
    queryFn: ({ signal }) =>
      mainInstance.get(`/api/dashboard/account-types`, { signal }).then(res => {
        // set chart data
        setChartData(
          res.data.map((item: ChartData, index: number) => ({
            ...item,
            fill: COLORS[index % COLORS.length],
          })),
        );

        return res.data;
      }),
  });

  // chart - calculate total users
  const totalUsers = chartData.reduce((acc, curr) => acc + curr.count, 0);

  // chart - configure chart
  const chartConfig = chartData.reduce<
    Record<string, { label: string; color: string }>
  >((config, item, index) => {
    config[item.account_type] = {
      label: item.account_type,
      color: COLORS[index % COLORS.length],
    };
    return config;
  }, {});

  return (
    <Card className="col-span-12 sm:col-span-6">
      <CardHeader>
        <CardTitle>Account Types Chart</CardTitle>
      </CardHeader>
      <CardBody>
        {/* show skeleton loader while fetching data */}
        {isFetching ? (
          <PieChartSkeleton />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-[4/3] max-h-[250px]"
          >
            {/* chart */}
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="account_type"
                innerRadius={60}
                strokeWidth={1}
                label={({ name }) => name}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {/* display total users count */}
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalUsers.toLocaleString()}
                          </tspan>
                          {/* "total Users" label */}
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Users
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardBody>
    </Card>
  );
};

export default AccountTypesChart;
