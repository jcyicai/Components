# Components
通用组件封装

## 更新日期
2024-08-09

## 前言
由于 element table 组件存在`性能问题`，针对该问题，可以通过修改源码引入虚拟列表等方案来处理，或者使用第三方组件，如 [vxe-table](https://vxetable.cn/v3/#/table/start/install)。另外使用 element 2.15.9 之前的版本会存在表头抖动问题，影响整体渲染性能，具体内容可查看 element 官方相关更新记录。

如果只是使用表格的基础功能，那么可以继续使用 `element table` 组件；如果是复杂表格，推荐使用 `vxe-table` 等第三方组件库！

## 说明
1. 目前 VxeListTable 和 VxeTable 组件是基于 vxe-table 组件二次封装，VxeListTable 支持 操作栏、分页、行展开详情、多选、表头分组、表格列显示隐藏、列宽度调整、列固定、单元格背景色调整，VxeTable 仅支持基础表格数据展示及表头分组。
2. 可以查看 vxe-table 官方文档，建议后期使用 vxe-grid 高级表格组件来进行重新封装。（待优化）
3. 各组件仅供参考，如有问题，欢迎提 issues。

## element
1. [BaseDialog 基础Dialog](https://github.com/jcyicai/Components/tree/main/element/BaseDialog)
2. [BaseForm 基础Form（更新2024-08-09）](https://github.com/jcyicai/Components/tree/main/element/BaseForm)
3. [BaseFormSearch 查询表单](https://github.com/jcyicai/Components/tree/main/element/BaseFormSearc)
4. [BaseFormWork 业务表单](https://github.com/jcyicai/Components/tree/main/element/BaseFormWork)
5. [BaseTab 基础Tab](https://github.com/jcyicai/Components/tree/main/element/BaseTab)
6. [BaseTable 基础Table](https://github.com/jcyicai/Components/tree/main/element/BaseTable)
7. [BaseTableSearch 查询表格](https://github.com/jcyicai/Components/tree/main/element/BaseTableSearch)
8. [BaseTableWork 业务表格](https://github.com/jcyicai/Components/tree/main/element/BaseTableWork)
9. [BaseInputNumber 业务数字框](https://github.com/jcyicai/Components/tree/main/element/BaseInputNumber)

## vxe
1. [VxeListTable 列表表格](https://github.com/jcyicai/Components/tree/main/vxe/VxeListTable)
2. [VxeTable 基础表格](https://github.com/jcyicai/Components/tree/main/vxe/VxeTable)

## examples
1. [editPageByElement 编辑页 Demo](https://github.com/jcyicai/Components/tree/main/examples/editPageByElement)
2. [listPageByVxe 列表页 Demo](https://github.com/jcyicai/Components/tree/main/examples/listPageByVxe)
3. [searchPageByElement 搜索页 Demo](https://github.com/jcyicai/Components/tree/main/examples/searchPageByElement)
