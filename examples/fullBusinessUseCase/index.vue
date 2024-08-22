<template>
    <div>
      <el-card>
        <BusForm
          v-model="queryForm.condition"
          :fields="formFields"
          is-search
          @query="handleQuery"
          @reset="resetQuery"
        ></BusForm>
        <BusListTable
          ref="xTable"
          name="tableList"
          :max-height="tableHeight"
          :data="list"
          :columns="columns"
          :checks="checks"
          :loading="listLoading"
          :total="total"
          show-select
          :current-page="queryForm.currentPage"
          :page-size="queryForm.pageRow"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @selection-change="handleSelectRows"
        >
          <template #toolbar-left>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
            <el-dropdown v-if="selectRows && selectRows.length" class="ml-10" @command="handleCommand">
              <el-button type="primary">
                启用/禁用
                <i class="el-icon-arrow-down el-icon--left"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="isValid" icon="el-icon-smoking">启用</el-dropdown-item>
                <el-dropdown-item command="invalid" icon="el-icon-no-smoking">禁用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
  
          <template #operate="{ row }">
            <TableOperateColumn @view="handleToDetail(row)" @command="(command) => handleTableCommand(command, row)">
              <el-dropdown-item command="edit" icon="el-icon-edit">编辑</el-dropdown-item>
            </TableOperateColumn>
          </template>
        </BusListTable>
      </el-card>
  
      <FormDialog
        :visible.sync="dialogVisible"
        :row-id="rowId"
        :page-type="pageType"
        @close="handleDialogClose"
        @confirm="handleDialogConfirm"
      ></FormDialog>
    </div>
  </template>
  
  <script>
    import { getListByPage, doDelete, doValid } from '@/api/currency'
    import FormDialog from './components/FormDialog.vue'
    import { VALID_STATUS_LIST } from '@/utils/enums'
  
    export default {
      name: 'TableList',
      components: { FormDialog },
      data() {
        return {
          treeKey: Math.random(),
          filterName: '',
          isDetail: false,
          dialogVisible: false,
          checks: [
            '编码',
            '名称',
            '状态',
          ],
          columns: [
            {
              label: '编码',
              width: 'auto',
              prop: 'code',
            },
            {
              label: '名称',
              width: 'auto',
              prop: 'name',
            },
            {
              label: '状态',
              width: 'auto',
              prop: 'isValid',
            },
          ],
          listLoading: false,
          list: [],
          total: 0,
          selectRows: [],
          queryForm: {
            currentPage: 1,
            pageRow: 30,
            condition: {},
          },
          validList: VALID_STATUS_LIST,
          rowId: null,
          pageType: 'Add',
        }
      },
      computed: {
        formFields() {
          return [
            {
              label: '编码',
              prop: 'code',
              type: 'input',
              attrs: {
                placeholder: '请输入',
                clearable: true,
              },
            },
            {
              label: '名称',
              prop: 'name',
              type: 'input',
              attrs: {
                placeholder: '请输入',
                clearable: true,
              },
            },
            {
              label: '状态',
              prop: 'isValid',
              type: 'select',
              options: () => this.validList,
              attrs: {
                placeholder: '请选择',
                clearable: true,
              },
            },
          ]
        },
      },
      watch: {
        $route(to, from) {
          this.$refs['xTable'].handleClose()
          if (from.name !== to.name && to.name === 'TableList') {
            if (this.$route.query.refresh) {
              this.resetQuery()
            }
          }
        },
      },
      created() {
        this.fetchData()
      },
      methods: {
        handleSelectRows(val) {
          this.selectRows = val
        },
        async handleCommand(command) {
          switch (command) {
            case 'isValid':
              this.handleValid(1)
              break
            case 'invalid':
              this.handleValid(0)
              break
          }
        },
        async handleValid(type) {
          const ids = this.selectRows.map((item) => item.id).join()
          const { data, message } = await doValid({ ids: ids, isValid: type })
          this.$baseMessage(message || '设置成功', 'success')
          this.fetchData()
        },
        handleQuery() {
          this.queryForm.currentPage = 1
          this.fetchData()
        },
        resetQuery() {
          this.queryForm = {
            currentPage: 1,
            pageRow: 30,
            condition: {},
          }
          this.fetchData()
        },
        handleSizeChange(val) {
          this.queryForm.pageRow = val
          this.fetchData()
        },
        handleCurrentChange(val) {
          this.queryForm.currentPage = val
          this.fetchData()
        },
        fetchData() {
          this.listLoading = true
  
          const params = {
            ...this.queryForm,
          }
  
          getListByPage(params)
            .then((res) => {
              const data = res.data
              this.list = data.resultList || []
              this.total = data.totalRows
              this.listLoading = false
            })
            .catch(() => {
              this.listLoading = false
            })
        },
        handleTableCommand(command, row) {
          switch (command) {
            case 'edit':
              this.handleEdit(row)
              break
            case 'delete':
              this.handleDelete(row)
              break
          }
        },
        handleToDetail(row) {
          this.dialogVisible = true
          this.rowId = row.id
          this.pageType = 'Detail'
        },
        handleAdd() {
          this.dialogVisible = true
          this.pageType = 'Add'
        },
        handleEdit(row) {
          this.dialogVisible = true
          this.rowId = row.id
          this.pageType = 'Edit'
        },
        handleDelete(row) {
          this.$baseConfirm('你确定要删除吗?', null, () => {
            this.listLoading = true
            doDelete({
              ids: String(row.id),
            })
              .then((res) => {
                this.listLoading = false
                this.$baseMessage('删除成功', 'success')
                this.fetchData()
              })
              .catch(() => {
                this.listLoading = false
              })
          })
        },
        handleDialogClose() {
          this.rowId = null
        },
        handleDialogConfirm() {
          this.fetchData()
        },
      },
    }
  </script>
  
  <style lang="scss" scoped></style>
  