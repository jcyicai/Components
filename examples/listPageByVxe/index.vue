<template>
  <div class="container">
    <VxeListTable
      ref="xTable"
      name="listTable"
      :max-height="tableHeight"
      :data="list"
      :columns="columns"
      :checks="checks"
      :loading="listLoading"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :expand-config="{ height: 250 }"
      table-option-check-prop="label"
      show-option-expand-btn
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <!-- 展开内容 自定义 -->
      <template #expand-content="{ row }">
        <div style="padding: 14px 14px 14px 100px; height: 250px">
          <VxeTable
            :data="row.detailList"
            :columns="childColumns"
            :max-height="225"
          ></VxeTable>
        </div>
      </template>
      <!-- 操作列 -->
      <template #operate>
        <el-button icon="el-icon-document" type="text">详情</el-button>
      </template>
    </VxeListTable>
  </div>
</template>

<script>
import VxeListTable from '../../vxe/VxeListTable'
import VxeTable from '../../vxe/VxeTable'
export default {
  name: 'ListPageByVxe',
  components: { VxeListTable, VxeTable },
  data() {
    return {
      listLoading: false,
      tableHeight: 500, // 可监听页面 动态计算表格撑满高度
      list: [], // 表格数据
      checks: ['姓名', '年龄'], // 或者根据 prop  ['name', 'age']
      columns: [
        {
          label: '姓名',
          prop: 'name',
          width: 180,
        },
        {
          label: '年龄',
          prop: 'age',
          width: 180,
        },
      ],
      childColumns: [
        {
          label: '姓名',
          prop: 'name',
          width: 180,
        },
        {
          label: '年龄',
          prop: 'age',
          width: 180,
        },
      ],
      total: 0,
      currentPage: 1,
      pageSize: 10,
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 根据接口 获取数据
    getData() {},
    // 分页 size change
    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },
    // 当前页 current change
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
  },
}
</script>

<style lang="scss" scoped></style>
