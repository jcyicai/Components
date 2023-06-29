<template>
  <div class="vxe-table-container">
    <vxe-table
      ref="xTable"
      border
      empty-text="暂无数据"
      :loading="loading"
      show-overflow
      auto-resize
      sync-resize
      :data="data"
      size="small"
      :max-height="maxHeight"
      :column-config="{ resizable: true }"
      :show-footer="showFooter"
      :footer-method="handleFooterCalc"
      :scroll-x="{ enabled: false }"
      :scroll-y="{ enabled: true }"
      :expand-config="expandConfig"
      @checkbox-change="handleSelectionChange"
      @checkbox-all="handleSelectionChange"
    >
      <vxe-column v-if="showSelect" type="checkbox" align="center" width="50"></vxe-column>
      <vxe-column v-if="showSerial" type="seq" field="seq" align="center" title="序号" width="50"></vxe-column>
      <vxe-column v-if="showExpand" type="expand" width="50" align="center">
        <template #content="{ row, rowIndex }">
          <slot name="expand-content" :row="row" :rowIndex="rowIndex"></slot>
        </template>
      </vxe-column>

      <template v-for="(item, index) in columns">
        <template v-if="item.children && item.children.length > 0">
          <ChildrenColumn
            :key="`${item.prop}${index}`"
            :current-column="item"
            :columns="item.children"
          ></ChildrenColumn>
        </template>
        <template v-else>
          <!-- key不能设置 prop 否则 排序更新 column 无法生效 -->
          <vxe-column
            :key="`${item.prop}${index}`"
            :field="item.prop"
            :title="item.label"
            :width="item.width"
            min-width="100"
            :fixed="item.fixed"
            :type="item.type"
            :align="item.align || 'center'"
          >
            <template #default="{ row, column, $rowIndex }">
              <template v-if="item.slot">
                <slot :name="item.prop" :row="row" :column="column" :rowIndex="$rowIndex" :item="item" />
              </template>
              <template v-else>
                <!-- 格式化内容 -->
                <span v-if="item.format && Object.keys(item.format).length">
                  {{ formatValue(row[item.prop], item.format) }}
                </span>
                <!-- 常规 -->
                <span v-else>
                  {{ row[item.prop] }}
                </span>
              </template>
            </template>
          </vxe-column>
        </template>
      </template>
    </vxe-table>
    <!-- 分页 -->
    <el-pagination
      v-if="showPage"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="pageSize"
      :total="total"
      background
      :page-sizes="[10, 20, 30, 40, 50, 100, 500]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import ChildrenColumn from './components/ChildrenColumn.vue'

  export default {
    name: 'VxeTable',
    components: {
      ChildrenColumn,
    },
    props: {
      // 数据
      data: {
        type: Array,
        default: () => [],
        required: true,
      },
      // 表格 列数据
      columns: {
        type: Array,
        default: () => [],
        required: true,
      },
      // 表格 loading
      loading: {
        type: Boolean,
        default: false,
      },
      // 表格最大高度
      maxHeight: {
        type: [String, Number],
        default: 'auto',
      },
      // 是否显示序号
      showSerial: {
        type: Boolean,
        default: false,
      },
      // 是否表格选择
      showSelect: {
        type: Boolean,
        default: false,
      },
      // 是否分页
      showPage: {
        type: Boolean,
        default: false,
      },
      // 分页总数
      total: {
        type: Number,
        default: 0,
      },
      // 当前页
      currentPage: {
        type: Number,
        default: 1,
      },
      // 每页条数
      pageSize: {
        type: Number,
        default: 10,
      },
      // 底部栏是否显示  显示 totalColumns为必填项！
      showFooter: {
        type: Boolean,
        default: false,
      },
      // 所有数据 总和 用于底部合计 showFooter使用
      totalData: {
        type: Object,
        default: () => {},
      },
      // 底部合计 是否显示 查询合计 即 所有数据 总合计  显示 totalData 为必填项！
      showFooterAllTotal: {
        type: Boolean,
        default: false,
      },
      // 需要合计的列
      totalColumns: {
        type: Array,
        default: () => [],
      },
      // 展开
      showExpand: {
        type: Boolean,
        default: false,
      },
      // 展开配置 lazy loadMethod height
      expandConfig: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    methods: {
      // 每页条数 change
      handleSizeChange(size) {
        this.$emit('size-change', size)
      },
      // 当前页数 change
      handleCurrentChange(page) {
        this.$emit('current-change', page)
      },
      // 表格 checkbox 多选
      handleSelectionChange() {
        const allCheckedData = this.$refs.xTable.getCheckboxRecords()
        this.$emit('selection-change', allCheckedData)
      },
      // 累加值
      getSumNum(data, column) {
        let count = 0
        data.forEach((item) => {
          const value = Number(item[column.property])
          if (!isNaN(value)) {
            count += item[column.property]
          }
        })
        return count
      },
      // 所有数据累加值
      getSumAllNum(column) {
        return this.totalData[column.property]
      },
      // 底部栏计算
      handleFooterCalc(params) {
        const { columns, data } = params
        const totalRowData = []
        const allTotalRowData = []

        columns.forEach((column, columnIndex) => {
          if (columnIndex === 0) {
            totalRowData.push('合计')
            allTotalRowData.push('总和')
          } else {
            let currentMergeCell = null
            let allMergeCell = null
            if (this.totalColumns.includes(column.property)) {
              // 查找当前 column format
              const curColumnItem = this.initColumns.find((item) => item.prop === column.property)
              // 累加当前行
              currentMergeCell = this.$baseNumFormat(
                this.getSumNum(data, column),
                curColumnItem?.format?.digits || 2,
                's'
              )
              // 所有数据总和
              if (this.showFooterAllTotal) {
                allMergeCell = this.$baseNumFormat(this.getSumAllNum(column), curColumnItem?.format?.digits || 2, 's')
              }
            }
            totalRowData.push(currentMergeCell)
            if (this.showFooterAllTotal) {
              allTotalRowData.push(allMergeCell)
            }
          }
        })
        return this.showFooterAllTotal ? [totalRowData, allTotalRowData] : [totalRowData]
      },
      // 格式化列内容
      formatValue(val, foramt) {
        // 1 日期  2 数字
        let value = null
        if (foramt.type === 'date') {
          // 日期
          value = this.$baseDateFormat(val)
        } else if (foramt.type === 'number') {
          // 数字
          value = this.$baseNumFormat(val, foramt.digits || 2, 's')
        }
        return value
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep(.vxe-footer--column) {
    background-color: #f5f7fa !important;
    background-repeat: no-repeat;
    background-size: 1px 100%, 100% 1px;
    background-position: 100% 0, 100% 100%;
  }
  :deep(.vxe-header--column) {
    background-color: #f5f7fa !important;
    background-repeat: no-repeat;
    background-size: 1px 100%, 100% 1px;
    background-position: 100% 0, 100% 100%;
  }
</style>
