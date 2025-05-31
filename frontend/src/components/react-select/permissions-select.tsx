import { AxiosError } from 'axios';
import { AsyncPaginate, type LoadOptions } from 'react-select-async-paginate';
import { toast } from 'sonner';
import { type ReactSelectOption } from '@/_types/common/react-select';
import { type RbacPermission } from '@/_types/rbac-permission';
import { mainInstance } from '@/instances/main-instance';

const PermissionsSelect = ({ ...props }) => {
  const loadOptions: LoadOptions<
    ReactSelectOption,
    never,
    { page: number }
  > = async (searchQuery, _loadedOptions, additional = { page: 1 }) => {
    const page = additional.page || 1;

    try {
      const response = await mainInstance.get(
        `/api/select/permissions?page=${page}&search=${searchQuery}&sort=label`,
      );

      const options = response.data.records.map((role: RbacPermission) => ({
        value: role.id,
        label: role.label,
      }));

      return {
        options,
        hasMore: response.data.info.pages > page,
        additional: {
          page: page + 1,
        },
      };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || error.message || 'An error occurred',
        );
      } else {
        toast.error('An unknown error occurred');
      }

      return {
        options: [],
        hasMore: false,
      };
    }
  };

  return (
    <AsyncPaginate
      className="react-select-container"
      classNamePrefix="react-select"
      loadOptions={loadOptions}
      debounceTimeout={200}
      additional={{
        page: 1,
      }}
      {...(props.isMulti && {
        filterOption: (candidate: ReactSelectOption) => {
          const selectedValues = (props.value || []).map(
            (item: ReactSelectOption) => item.value.toString(),
          );
          return !selectedValues.includes(candidate.value.toString());
        },
      })}
      {...props}
    />
  );
};

export default PermissionsSelect;
