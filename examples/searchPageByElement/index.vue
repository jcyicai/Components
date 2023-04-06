<template>
  <div class="container">
    <BaseFormSearch
      ref="baseFormSearch"
      :data="searchData.query"
      :config="formConfig"
      @search="handleSearch"
      @reset="handleReset"
    ></BaseFormSearch>
    <BaseTableSearch
      name="customsConfirmList"
      :show-loading="listLoading"
      :data="list"
      :columns="columns"
      :current-page="searchData.pageIndex"
      :page-size="searchData.pageSize"
      :total="total"
      :max-height="tableHeight"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      @add="handleToPage(1)"
    >
      <template #operate="{ row }">
        <el-button
          icon="el-icon-document"
          type="text"
          @click="handleToPage(3, row)"
          >详情</el-button
        >
      </template>
    </BaseTableSearch>
  </div>
</template>

<script>
import BaseFormSearch from '../../element/BaseFormSearch'
import BaseTableSearch from '../../element/BaseTableSearch'
export default {
  name: 'SearchPage',
  components: { BaseFormSearch, BaseTableSearch },
  data() {
    return {
      columns: [
        {
          label: '编号',
          width: '180',
          prop: 'code',
        },
        {
          label: '日期',
          width: '100',
          prop: 'date',
        },
        {
          label: '操作人',
          width: '100',
          prop: 'operatorName',
        },
        {
          label: '内容',
          width: '180',
          prop: 'content',
        },
        {
          label: '状态',
          width: '120',
          prop: 'status',
          fixed: 'right',
        },
        {
          label: '操作',
          width: '160',
          prop: 'operate',
          slot: true,
          fixed: 'right',
        },
      ],
      searchData: {
        pageIndex: 1,
        pageSize: 30,
        query: {
          code: '',
          date: '',
          operatorId: null,
          content: '',
          statusId: null,
        },
      },
      total: 0,
      tableHeight: 500,
      list: [],
      listLoading: false,
      operatorList: [],
      statusList: [],
    }
  },
  computed: {
    // 写在这 由于下拉数据需要根据接口获取
    // 表单配置数据
    formConfig() {
      return [
        {
          type: 'input', // input框
          label: '编号',
          prop: 'code',
        },
        {
          type: 'dateRange', // 开始结束日期
          label: '日期',
          prop: 'date',
        },
        {
          type: 'select', // 下拉
          label: '人员',
          prop: 'operatorId',
          multiple: true, // 多选
          options: this.operatorList, // 下拉数据
        },
        {
          type: 'select', // 下拉
          label: '状态',
          prop: 'statusId',
          multiple: true,
          props: {
            // 重置数据 参数
            id: 'value',
            name: 'text',
          },
          options: this.statusList,
          hidden: true, // 搜索列默认显示三个，超过四个需要设置先隐藏
        },
      ]
    },
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.operatorList = [{ id: 1, name: '张三' }]
      this.statusList = [{ value: 1, text: '通过' }]
    }, 2000)
  },
  methods: {
    // 获取数据
    getData() {
      this.listLoading = true
      setTimeout(() => {
        this.list = [
          {
            code: '123',
            date: '2023-04-06',
            name: '测试人员',
            content: '测试内容',
            status: '通过',
          },
        ]
        this.listLoading = false
      }, 3000)
    },
    // size change
    handleSizeChange(val) {
      this.searchData.pageSize = val
      this.getData()
    },
    // 分页 change
    handleCurrentChange(val) {
      this.searchData.pageIndex = val
      this.getData()
    },
    // 查询
    handleSearch() {
      this.searchData.pageIndex = 1
      this.getData()
    },
    // 重置
    handleReset() {
      this.searchData = {
        pageIndex: 1,
        pageSize: 30,
        query: {
          code: '',
          date: '',
          operatorId: null,
          content: '',
          statusId: null,
        },
      }
      this.getData()
    },
    // 页面跳转
    handleToPage(type) {
      // 根据 type 类型处理跳转不同页面
      this.$router.push({
        name: '页面名称',
        query: '页面参数',
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
