import { ref, Ref } from "@vue/composition-api";

/**
 * 超级锁钩子。未运行完毕锁。500毫秒运行一次锁。运行成功500毫秒后才能运行锁。
 *
 * @param fun 要锁定的函数
 * @param delay 延迟时间，默认500毫秒
 * @returns [fn, lock] - 锁定函数和锁定状态
 */
export function useSuperLock<T extends (...args: any) => any>(
  fun: T,
  delay = 500
): [T, Ref<boolean>] {
  const lock = ref(false);
  const lastDate = ref<Date>();

  const fn = async function (this: unknown, ...args: Parameters<T>) {
    if (lock.value) {
      return;
    }

    const nowDate = new Date();
    if (lastDate.value && nowDate.getTime() - lastDate.value.getTime() <= delay) {
      return;
    }

    lastDate.value = nowDate;
    lock.value = true;

    let returnValue: any;
    try {
      returnValue = await fun.apply(this, args);
    } catch (error) {
      lock.value = false;
      throw error;
    }

    setTimeout(() => {
      lock.value = false;
    }, delay);

    return returnValue;
  };

  return [fn as T, lock];
}
