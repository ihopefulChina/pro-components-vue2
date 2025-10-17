import { ref, reactive } from "@vue/composition-api"

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

interface UseProTableRequestOptions<T> {
  /** 格式化参数 */
  paramsFormat?: (params: any) => any
  /** 格式化数据 */
  dataFormat?: (data: T[]) => T[]
}

export function useProTableRequest<T = any>(api: (params: any) => Promise<{ list: T[]; total: number }>, options: UseProTableRequestOptions<T> = {}) {
  const { paramsFormat, dataFormat } = options

  const loading = ref(false)
  const data = ref<T[]>([])
  const pagination = reactive<Pagination>({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })

  // 缓存请求参数
  const requestParams = ref<Record<string, any>>({})
  // 数据缓存
  const dataSource = ref<T[]>([])

  // 表格请求
  const request = async (params: any, sort: any, filter: any) => {
    const { currentPage, ...rest } = params
    let newParams = { ...rest, pageNow: currentPage }

    // 格式化并缓存参数
    requestParams.value = paramsFormat ? paramsFormat(newParams) : newParams

    // 重置数据
    let total = 0
    let result: T[] = []

    try {
      loading.value = true

      // 参数长度过长不处理
      if (JSON.stringify(requestParams.value).length < 1000) {
        const res = await api(requestParams.value)

        // 如果当前列表为空并且pageNow不为1，则重新发起请求
        if (!res.list?.length && requestParams.value.pageNow !== 1) {
          setTimeout(() => {
            pagination.currentPage = 1
            request({ ...params, currentPage: 1 }, sort, filter)
          })
        }

        const { list = [] } = res
        total = res.total || 0
        result = dataFormat ? dataFormat(list) : list
        dataSource.value = result as any[]
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }

    return {
      data: result,
      success: true,
      total
    }
  }

  // 分页大小改变
  const handleSizeChange = (size: number) => {
    pagination.pageSize = size
    pagination.currentPage = 1
    request({ ...requestParams.value, currentPage: 1, pageSize: size }, {}, {})
  }

  // 分页当前页改变
  const handleCurrentChange = (page: number) => {
    pagination.currentPage = page
    request({ ...requestParams.value, currentPage: page, pageSize: pagination.pageSize }, {}, {})
  }

  // 刷新
  const onRefresh = (resetPage = false) => {
    if (resetPage) {
      pagination.currentPage = 1
    }
    request({ ...requestParams.value, currentPage: pagination.currentPage, pageSize: pagination.pageSize }, {}, {})
  }

  // 重置
  const onReset = () => {
    pagination.currentPage = 1
    requestParams.value = {}
    request({ currentPage: 1, pageSize: pagination.pageSize }, {}, {})
  }

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
    onReset
  }
}
