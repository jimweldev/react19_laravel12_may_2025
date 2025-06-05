import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Label, Pie, PieChart } from 'recharts';
import PieChartSkeleton from '@/components/skeletons/pie-chart-skeleton';
import { Card, CardBody, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { chartColors } from '@/configs/chart-colors.config';
import { mainInstance } from '@/instances/main-instance';

interface ChartData {
  account_type: string;
  count: number;
  fill: string;
}

const DashboardAccountTypesChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const { isFetching } = useQuery({
    queryKey: ['dashboard/account-types'],
    queryFn: ({ signal }) =>
      mainInstance.get(`/api/dashboard/account-types`, { signal }).then(res => {
        setChartData(
          res.data.map((item: ChartData, index: number) => ({
            ...item,
            fill: chartColors[index % chartColors.length],
          })),
        );

        return res.data;
      }),
  });

  const totalUsers = chartData.reduce((acc, curr) => acc + curr.count, 0);

  const chartConfig = chartData.reduce<
    Record<string, { label: string; color: string }>
  >((config, item, index) => {
    config[item.account_type] = {
      label: item.account_type,
      color: chartColors[index % chartColors.length],
    };
    return config;
  }, {});

  return (
    <Card className="col-span-12 @3xl/main:col-span-3">
      <CardBody className="h-full">
        <CardTitle>Account Types Chart</CardTitle>

        <div className="flex h-full items-center justify-center">
          <div className="w-full">
            {isFetching ? (
              <PieChartSkeleton />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="mx-auto mt-auto aspect-[4/3] max-h-[250px]"
              >
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
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalUsers.toLocaleString()}
                              </tspan>

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
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default DashboardAccountTypesChart;
