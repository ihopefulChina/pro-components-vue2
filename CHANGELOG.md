# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-09-02

### Added

- Initial release
- ProForm component with all field types
- ProTable component
- CustomTabs component
- SearchForm component
- Segmented component
- ModalForm and DrawerForm components
- Comprehensive hooks collection
- TypeScript support
- Full documentation

### Fixed

- Corrected the Vue 2.6 Composition API runtime and type-checking toolchain
- Restored Vue 2 `v-model` behavior for search forms and form fields
- Fixed async submission loading, dynamic tag deletion, stale table requests, and zero-value rendering
- Corrected package entry points, CSS exports, global field registration, CI, and release scripts
- Added keyboard-accessible tabs and segmented controls

### Components

- ProForm, ProFormItem
- ProFormText, ProFormTextarea, ProFormNumber
- ProFormSelect, ProFormRadio, ProFormCheckbox
- ProFormSwitch, ProFormDate, ProFormRange
- ProFormSlider, ProFormRate, ProFormUpload
- ProFormCascader, ProFormDynamicTags
- ProFormDependency, ProFormInfo, ProFormList
- ProTable, SearchForm, CustomTabs, Segmented
- ModalForm, DrawerForm

### Hooks

- useValidateForm
- useDialog, useDrawerForm
- useGlobalThis, useMessage
- useMutate, useProTableRequest
- useState, useSuperLock

### Utils

- guid utility function
