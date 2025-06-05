import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import type { DateRange } from 'react-day-picker';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import DateRangePicker from '@/components/date-pickers/date-range-picker';
import BarChartSkeleton from '@/components/skeletons/bar-chart-skeleton';
import { Card, CardBody, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { chartColors } from '@/configs/chart-colors.config';
import { mainInstance } from '@/instances/main-instance';

const chartConfig = {
  count: {
    label: 'Users',
    color: chartColors[0],
  },
} satisfies ChartConfig;

const DashboardUserRegistrationStats = () => {
  const [chartMode, setChartMode] = useState<string>('cumulative');
  const [group, setGroup] = useState<string>('month');
  const [date, setDate] = useState<DateRange | undefined>({
    from: moment().subtract(11, 'months').toDate(),
    to: moment().toDate(),
  });

  const { data: chartData, isFetching } = useQuery({
    queryKey: ['dashboard/user-registration-stats', chartMode, group, date],
    queryFn: ({ signal }) => {
      const startDate = encodeURIComponent(moment(date?.from).toISOString());
      const endDate = encodeURIComponent(moment(date?.to).toISOString());

      return mainInstance
        .get(
          `/api/dashboard/user-registration-stats?mode=${chartMode}&group_by=${group}&start_date=${startDate}&end_date=${endDate}`,
          { signal },
        )
        .then(res => res.data);
    },
    enabled: !!date?.from && !!date?.to,
  });

  useEffect(() => {
    if (group === 'month') {
      setDate({
        from: moment().subtract(11, 'months').toDate(),
        to: moment().toDate(),
      });
    } else if (group === 'week') {
      setDate({
        from: moment().subtract(4, 'weeks').toDate(),
        to: moment().toDate(),
      });
    } else if (group === 'day') {
      setDate({
        from: moment().subtract(6, 'days').toDate(),
        to: moment().toDate(),
      });
    }
  }, [group]);

  return (
    <Card className="col-span-12 @3xl/main:col-span-9">
      <CardBody>
        <div className="mb-3 flex items-center justify-between">
          <CardTitle>User Registration Stats</CardTitle>
          <div className="flex gap-2">
            <Select value={chartMode} onValueChange={setChartMode}>
              <SelectTrigger className="w-[120px]" size="sm">
                <SelectValue placeholder="Select date Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mode</SelectLabel>
                  <SelectItem value="cumulative">Cumulative</SelectItem>
                  <SelectItem value="periodic">Periodic</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger className="w-[120px]" size="sm">
                <SelectValue placeholder="Select date Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Group</SelectLabel>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <DateRangePicker
              className="w-[220px]"
              date={date}
              setDate={setDate}
              size="sm"
            />
          </div>
        </div>

        {isFetching ? (
          <BarChartSkeleton />
        ) : (
          <ChartContainer
            className="mx-auto max-h-[250px] w-full"
            config={chartConfig}
          >
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardBody>
    </Card>
  );
};

export default DashboardUserRegistrationStats;
