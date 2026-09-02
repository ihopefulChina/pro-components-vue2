import { computed, nextTick, inject } from "@vue/composition-api";
import { FormInstance, ProFormProvide } from "../type";

/** 验证表单 - 验证表单项
 * @param name 表单项名称
 * @returns 表单项引用和验证函数
 */
export function useValidateForm(name?: string) {
  const proFormRef = inject<ProFormProvide>("proForm");

  const formRef = computed<FormInstance | undefined>(() => proFormRef?.formRef?.value);

  /**
   * 触发表单验证
   * @param key 表单项名称
   */
  const validateField = (key: string | string[] = name || "") => {
    if (!key) return;

    nextTick(() => {
      proFormRef?.formRef?.value?.validateField(key);
    });
  };

  return { validateField, formRef, proFormRef };
}
