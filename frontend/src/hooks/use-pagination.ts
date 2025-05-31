import { useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { mainInstance } from '@/instances/main-instance';

const usePagination = (
  endpoint: string,
  defaultSort: string,
  extendedParams: string = '',
) => {
  const [limit, setLimit] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sort, setSort] = useState(defaultSort);
  const [searchTerm, setSearchTerm] = useDebouncedState('', 200);

  const { isLoading, isFetching, error, data, refetch } = useQuery({
    queryKey: [endpoint, searchTerm, limit, currentPage, sort, extendedParams],
    queryFn: async ({ signal }) => {
      const res = await mainInstance.get(
        `${endpoint}?search=${searchTerm}&limit=${limit}&page=${currentPage}&sort=${sort}${extendedParams ? `&${extendedParams}` : ''}`,
        { signal },
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  return {
    limit,
    setLimit,
    currentPage,
    setCurrentPage,
    sort,
    setSort,
    searchTerm,
    setSearchTerm,
    isLoading,
    isFetching,
    error,
    data,
    refetch,
    info: data?.info || { total: 0, pages: 1 },
  };
};

export default usePagination;
