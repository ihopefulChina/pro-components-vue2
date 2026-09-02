<template>
  <ProFormItem
    :name="name"
    :label="label"
    :span="span"
    :required="required"
    :rules="rules"
    :tooltip="tooltip"
  >
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="multiple"
      :data="data"
      :name="uploadName"
      :with-credentials="withCredentials"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="accept"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :list-type="listType"
      :auto-upload="autoUpload"
      :file-list="displayFileList"
      :http-request="httpRequest"
      :disabled="disabled"
      :limit="limit"
      :on-exceed="handleExceed"
      v-bind="$attrs"
    >
      <slot>
        <el-button v-if="!drag" size="small" type="primary">点击上传</el-button>
        <div v-else>
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </div>
      </slot>
      <template v-if="tip" #tip>
        <div class="el-upload__tip">
          {{ tip }}
        </div>
      </template>
    </el-upload>
  </ProFormItem>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import ProFormItem from "../ProFormItem.vue";

export default defineComponent({
  name: "ProFormUpload",
  components: { ProFormItem },
  inheritAttrs: false,
  props: {
    // 表单项属性
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    span: {
      type: Number,
      default: 24,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    // 提示信息
    tooltip: {
      type: String,
      default: "",
    },
    // 上传属性
    value: {
      type: [String, Array],
      default: "",
    },
    action: {
      type: String,
      default: "",
    },
    headers: {
      type: Object,
      default: () => ({}),
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    uploadName: {
      type: String,
      default: "file",
    },
    withCredentials: {
      type: Boolean,
      default: false,
    },
    showFileList: {
      type: Boolean,
      default: true,
    },
    drag: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: "",
    },
    listType: {
      type: String,
      default: "text",
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: undefined,
    },
    tip: {
      type: String,
      default: "",
    },
    // 事件处理函数
    onPreview: Function,
    onRemove: Function,
    onSuccess: Function,
    onError: Function,
    onProgress: Function,
    onChange: Function,
    beforeUpload: Function,
    beforeRemove: Function,
    httpRequest: Function,
    onExceed: Function,
  },
  emits: ["input", "preview", "remove", "success", "error", "progress", "change", "exceed"],
  setup(props, { emit }) {
    const displayFileList = computed(() => {
      if (props.fileList.length > 0) return props.fileList;
      return Array.isArray(props.value) ? props.value : [];
    });

    const syncFileList = (fileList: unknown[]) => {
      emit("input", fileList);
    };

    const handlePreview = (file: any) => {
      emit("preview", file);
      props.onPreview?.(file);
    };

    const handleRemove = (file: any, fileList: any[]) => {
      syncFileList(fileList);
      emit("remove", file, fileList);
      props.onRemove?.(file, fileList);
    };

    const handleSuccess = (response: any, file: any, fileList: any[]) => {
      syncFileList(fileList);
      emit("success", response, file, fileList);
      props.onSuccess?.(response, file, fileList);
    };

    const handleError = (err: any, file: any, fileList: any[]) => {
      emit("error", err, file, fileList);
      props.onError?.(err, file, fileList);
    };

    const handleProgress = (event: any, file: any, fileList: any[]) => {
      emit("progress", event, file, fileList);
      props.onProgress?.(event, file, fileList);
    };

    const handleChange = (file: any, fileList: any[]) => {
      syncFileList(fileList);
      emit("change", file, fileList);
      props.onChange?.(file, fileList);
    };

    const handleExceed = (files: any, fileList: any[]) => {
      emit("exceed", files, fileList);
      props.onExceed?.(files, fileList);
    };

    return {
      displayFileList,
      handlePreview,
      handleRemove,
      handleSuccess,
      handleError,
      handleProgress,
      handleChange,
      handleExceed,
    };
  },
});
</script>
