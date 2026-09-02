import { reactive, ref, shallowRef } from "@vue/composition-api";

interface Pagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

interface UseProTableRequestOptions<T> {
  /** 格式化参数 */
  paramsFormat?: (params: Record<string, unknown>) => Record<string, unknown>;
  /** 格式化数据 */
  dataFormat?: (data: T[]) => T[];
}

interface ProTableRequestResult<T> {
  data: T[];
  success: boolean;
  total: number;
}

export function useProTableRequest<T = unknown>(
  api: (params: Record<string, unknown>) => Promise<{ list?: T[]; total?: number }>,
  options: UseProTableRequestOptions<T> = {}
) {
  const { paramsFormat, dataFormat } = options;

  const loading = ref(false);
  const data = shallowRef<T[]>([]);
  const pagination = reactive<Pagination>({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });

  const requestParams = ref<Record<string, unknown>>({});
  const dataSource = shallowRef<T[]>([]);
  let requestSequence = 0;

  const request = async (
    params: Record<string, unknown>,
    sort: unknown = {},
    filter: unknown = {}
  ): Promise<ProTableRequestResult<T>> => {
    const requestId = ++requestSequence;
    const currentPage = Number(params.currentPage ?? pagination.currentPage);
    const pageSize = Number(params.pageSize ?? pagination.pageSize);

    requestParams.value = { ...params, currentPage, pageSize };
    const { currentPage: ignoredCurrentPage, ...rest } = requestParams.value;
    void ignoredCurrentPage;
    const apiParams = paramsFormat
      ? paramsFormat({ ...rest, pageNow: currentPage })
      : { ...rest, pageNow: currentPage };

    loading.value = true;

    try {
      const response = await api(apiParams);
      const list = response.list ?? [];

      if (requestId !== requestSequence) {
        return { data: [], success: false, total: pagination.total };
      }

      if (list.length === 0 && currentPage > 1) {
        pagination.currentPage = 1;
        return request({ ...requestParams.value, currentPage: 1 }, sort, filter);
      }

      const result = dataFormat ? dataFormat(list) : list;
      const total = response.total ?? 0;

      pagination.currentPage = currentPage;
      pagination.pageSize = pageSize;
      pagination.total = total;
      data.value = result;
      dataSource.value = result;

      return { data: result, success: true, total };
    } catch (error) {
      console.error(error);
      return { data: [], success: false, total: pagination.total };
    } finally {
      if (requestId === requestSequence) {
        loading.value = false;
      }
    }
  };

  const handleSizeChange = (size: number) => {
    pagination.pageSize = size;
    pagination.currentPage = 1;
    return request({ ...requestParams.value, currentPage: 1, pageSize: size });
  };

  const handleCurrentChange = (page: number) => {
    pagination.currentPage = page;
    return request({ ...requestParams.value, currentPage: page, pageSize: pagination.pageSize });
  };

  const onRefresh = (resetPage = false) => {
    if (resetPage) {
      pagination.currentPage = 1;
    }

    return request({
      ...requestParams.value,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };

  const onReset = () => {
    pagination.currentPage = 1;
    requestParams.value = {};
    return request({ currentPage: 1, pageSize: pagination.pageSize });
  };

  return {
    loading,
    data,
    pagination,
    requestParams,
    dataSource,
    request,
    handleSizeChange,
    handleCurrentChange,
    onRefresh,
    onReset,
  };
}
