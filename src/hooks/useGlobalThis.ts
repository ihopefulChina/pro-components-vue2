import { getCurrentInstance } from "@vue/composition-api";
import type Vue from "vue";

export const useGlobalThis = (): Vue => {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error("useGlobalThis must be called from a component setup function");
  }

  return instance.proxy as Vue;
};
