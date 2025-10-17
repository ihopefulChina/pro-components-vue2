import { getCurrentInstance } from "@vue/composition-api"

export const useGlobalThis = () => {
  const { proxy } = getCurrentInstance()!
  return proxy as any
}
