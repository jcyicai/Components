<template>
  <div class="container">
    <BaseFormWork
      ref="form"
      :data="editForm"
      :config="formConfig"
      :rules="rules"
      is-header
      :header-config="headerConfig"
      @submit="handleSubmit"
    >
      <BaseTableWork
        :data.sync="editForm.details"
        :columns="columns"
        is-header
        @add="handleAdd"
      >
        <!-- 部门 -->
        <template #deptId="{ row, index }">
          <el-form-item
            label-width="0px"
            style="margin-top: 18px"
            :prop="`details.${index}.deptId`"
            :rules="detailRules.deptId"
          >
            <el-select
              v-model="row.deptId"
              style="width: 100%"
              placeholder="请选择"
              filterable
              @change="val => handleDeptChange(val, index)"
            >
              <el-option
                v-for="subItem in deptList"
                :key="subItem.id"
                :label="subItem.name"
                :value="subItem.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- 金额 -->
        <template #amount="{ row, index, config }">
          <!-- 动态设置验证 根据 code是否存在 -->
          <el-form-item
            v-if="row.amount"
            label-width="0px"
            style="margin-top: 18px"
            :prop="`details.${index}.amount`"
            :rules="[
              {
                required: row.code ? true : false,
                message: '请输入金额',
                trigger: ['change', 'blur'],
              },
            ]"
          >
            <el-input-number
              v-model="row.amount"
              placeholder="请输入"
              :controls="false"
              style="width: 100%"
              class="num-item"
              :precision="2"
              :min="0"
              @change="val => handleNumberChange(val, index, config.prop, row)"
            />
          </el-form-item>
        </template>
        <!-- 日期 -->
        <template #date="{ row }">
          <el-form-item
            label-width="0px"
            style="margin-top: 18px"
            :prop="`details.${index}.date`"
            :rules="detailRules.date"
          >
            <el-date-picker
              v-model="row.date"
              style="width: 100%"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
              clearable
            ></el-date-picker>
          </el-form-item>
        </template>
        <!-- 操作 -->
        <template #operate="{ row, index }">
          <div style="padding: 10px">
            <el-button size="mini" type="text" @click="handleDelete(index, row)"
              >删除</el-button
            >
          </div>
        </template>
      </BaseTableWork>
    </BaseFormWork>
  </div>
</template>

<script>
import BaseFormWork from '../../element/BaseFormWork'
import BaseTableWork from '../../element/BaseTableWork'
export default {
  name: 'EditPage',
  components: { BaseFormWork, BaseTableWork },
  data() {
    return {
      editForm: {
        code: '',
        date: '',
        deptId: null,
        amount: undefined, // 组件默认为undefiend 显示为空 如设置null 显示为 0
        remark: '',
        details: [],
      },
      pageType: 1,
      // 表单验证
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
      },
      // 表格中表单验证
      detailRules: {
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        amount: [
          {
            required: true,
            message: '请输入金额',
            trigger: ['change', 'blur'],
          },
        ],
      },
      columns: [
        {
          width: '250',
          label: '编号',
          prop: 'code',
        },
        {
          width: '160',
          label: '日期',
          prop: 'date',
          required: true, // 表头带星
          slot: true, // 自定义单元格
        },
        {
          width: '160',
          label: '部门',
          prop: 'deptId',
          required: true,
          slot: true, // 自定义单元格
        },
        {
          width: '160',
          label: '金额',
          prop: 'amount',
          required: true,
          slot: true, // 自定义单元格
          format: val => this.$baseNumFormat(val, 2), // 自定义格式化方法
        },

        {
          width: '80',
          label: '操作',
          prop: 'operate',
          slot: true, // 自定义单元格
        },
      ],
      deptList: [{ id: 1, name: '技术部' }],
    }
  },
  computed: {
    headerConfig() {
      return {
        title: this.pageType === 1 ? '新增' : '编辑',
        backRouterName: 'pageList',
      }
    },
    formConfig() {
      return [
        {
          type: 'input',
          label: '编号',
          prop: 'code',
        },
        {
          type: 'date',
          label: '日期',
          prop: 'date',
        },
        {
          type: 'select',
          label: '部门',
          prop: 'deptId',
          options: this.deptList,
          change: (val, prop) => this.handleSelectDept(val, prop),
        },
        {
          type: 'number',
          label: '金额',
          prop: 'amount',
          precision: 2,
        },
        {
          type: 'textarea',
          label: '备注',
          prop: 'remark',
        },
      ]
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 表单 部门选择 change
    handleSelectDept(val, prop) {},
    // 保存
    handleSubmit() {
      this.$refs['form'].$refs['baseFormWork'].validate(valid => {
        if (valid) {
        }
      })
    },
    // 表格新增
    handleAdd() {
      const rowData = {
        code: '',
        date: '',
        deptId: null,
        amount: undefined,
        remark: '',
      }
      this.editForm.details.push(rowData)
    },
    // 单元格 部门 change
    handleDeptChange(val, index) {},
    // 单元格 数字框 change
    handleNumberChange(val, index, prop, row) {},
    // 表单 行删除
    handleDelete(index, row) {
      this.editForm.details.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped></style>
