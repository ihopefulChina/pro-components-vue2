import { onMounted, ref } from "@vue/composition-api";
import { useState } from "./useState";
import { useSuperLock } from "./useSuperLock";

interface IMutateOption<T> {
  /** 默认数据 */
  defaultData?: T;

  /** 额外传递参数 */
  params?: Record<string, any>;

  /** 初始是否发出请求 */
  initRequest?: boolean;

  /** 获取数据 */
  getData: (data: Record<string, any>) => Promise<{ data?: T }>;

  /** 数据格式化 */
  dataFormat?(data?: T): any;

  /** 请求成功后的回调 */
  successCallback?(data?: T): void;
}

export function useMutate<T>(config: IMutateOption<T>) {
  const { defaultData, params, initRequest = true } = config;
  /** 数据 */
  const [detail, setDetail] = useState<T | undefined>(defaultData);
  /** 暂无数据 */
  const [noData, setNoData] = useState<boolean>();
  /** 最近一次请求错误 */
  const error = ref<unknown>();

  const [mutate, loading] = useSuperLock(async () => {
    try {
      error.value = undefined;
      const { data } = await config.getData({ ...params });
      const newData = config.dataFormat ? config.dataFormat(data) : data;

      setDetail(newData);
      config?.successCallback?.(newData);

      /** 暂无数据 */
      let blo = false;

      if (newData !== undefined) {
        if (newData instanceof Array) {
          blo = newData.length === 0;
        } else if (typeof newData === "object" && newData !== null) {
          blo = Object.keys(newData).length === 0;
        }
      } else {
        blo = true;
      }

      setNoData(blo);
    } catch (requestError) {
      error.value = requestError;
      setNoData(true);
    }
  });

  onMounted(() => {
    if (initRequest) {
      mutate();
    }
  });

  return { mutate, detail, noData, loading, error };
}
