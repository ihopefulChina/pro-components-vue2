import { computed, ComputedRef, ref, Ref, watch } from "@vue/composition-api";

/**
 * useState, 一个用于管理受控和非受控状态的 Hook，类似于 React 的受控/非受控模式。
 * https://inhiblabcore.github.io/vue-hooks-plus/zh/hooks/useControlledState
 * @param value
 * @param defaultValue
 * @param onChange
 * @returns
 */
export function useState<T, C = T>(
  defaultValue?: T,
  value?: Ref<T | undefined>,
  onChange?: (v: C, ...args: any[]) => void
): [ComputedRef<T | undefined>, (value: T | ((prev: T) => T), ...args: any[]) => void] {
  const isControlled = computed(() => value?.value !== undefined);
  const initialValue = value?.value ?? defaultValue;
  const internalState = ref(initialValue) as Ref<T>;
  const lastControlledValue = ref(value?.value) as Ref<T | undefined>;

  const currentValue = computed(() => (isControlled.value ? value?.value : internalState.value));

  if (value) {
    watch(value, newValue => {
      if (newValue !== undefined) {
        lastControlledValue.value = newValue;
      }
    });
  }

  watch(isControlled, (newVal, oldVal) => {
    if (!newVal && oldVal && lastControlledValue.value !== undefined) {
      internalState.value = lastControlledValue.value;
    }
  });

  function setValue(newValue: T | ((prev: T) => T), ...args: any[]) {
    if (typeof newValue === "function") {
      // 函数回调模式：支持 setValue(prev => prev + 1) 这种写法
      const prev = currentValue.value;
      const updatedValue = (newValue as (prev?: T) => T)(prev);

      if (!isControlled.value) {
        internalState.value = updatedValue;
      }

      if (!Object.is(prev, updatedValue)) {
        onChange?.(updatedValue as unknown as C, ...args);
      }
    } else {
      const shouldUpdate = !Object.is(currentValue.value, newValue);
      if (!isControlled.value) {
        internalState.value = newValue;
      }

      if (shouldUpdate) {
        onChange?.(newValue as unknown as C, ...args);
      }
    }
  }

  return [currentValue, setValue];
}
