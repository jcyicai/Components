<template>
  <BaseDialog
    ref="dialog"
    :visible.sync="dialogVisible"
    :show-footer="isDetail ? false : true"
    :title="title"
    width="25%"
    :confirm-loading="loading"
    @close="close"
    @confirm="handleConfirm"
    @open="handleOpen"
  >
    <BusForm
      ref="editForm"
      v-model="editForm"
      :loading="loading"
      :is-detail="isDetail"
      :fields="formFields"
      :rules="finallyRules"
      label-width="120px"
      :is-inline="false"
    ></BusForm>
  </BaseDialog>
</template>

<script>
  import { queryById, doAdd, doEdit } from '@/api/currency'
  import { queryUnitList } from '@/api/unit'

  export default {
    name: 'FormDialog',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      rowId: {
        type: Number,
        default: null,
      },
      pageType: {
        type: String,
        default: 'Add',
      },
    },
    data() {
      return {
        loading: false,
        editForm: {
          code: '',
          name: '',
          unitId: null,
          unitName: '',
          rate: null,
          memo: '',
        },
        rules: {
          code: [{ required: true, message: '请输入', trigger: 'blur' }],
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          unitId: [{ required: true, message: '请选择', trigger: 'change' }],
          rate: [{ required: true, message: '请输入', trigger: 'blur' }],
        },
        unitList: [],
      }
    },
    computed: {
      finallyRules() {
        return this.isDetail ? {} : this.rules
      },
      isDetail() {
        return this.pageType === 'Detail'
      },
      dialogVisible: {
        get() {
          const val = this.visible || false
          if (!this.visible) {
            this.$emit('update:visible', val)
          }
          return val
        },
        set(val) {
          this.$emit('update:visible', val)
        },
      },
      title() {
        return this.pageType === 'Edit' ? '编辑' : this.pageType === 'Detail' ? '详情' : '新增'
      },
      formFields() {
        return [
          {
            label: '编码',
            prop: 'code',
            type: 'input',
            //colSpan: 12,
            attrs: {
              placeholder: '请输入',
              clearable: true,
            },
          },
          {
            label: '名称',
            prop: 'name',
            type: 'input',
            //colSpan: 12,
            attrs: {
              placeholder: '请输入',
              clearable: true,
            },
          },
          {
            label: '单位',
            prop: 'unitId',
            viewProp: 'unitName',
            type: 'select',
            //colSpan: 12,
            options: () => this.unitList,
            attrs: {
              placeholder: '请选择',
              clearable: true,
            },
          },
          {
            label: '其他描述',
            prop: 'memo',
            type: 'input',
            //colSpan: 12,
            attrs: {
              placeholder: '请输入',
              clearable: true,
            },
          },
        ]
      },
    },
    created() {},
    mounted() {},
    methods: {
      handleOpen() {
        if (this.pageType !== 'Detail') {
          this.getUnitList()
        }

        if ((this.pageType === 'Edit' || this.pageType === 'Detail') && this.rowId) {
          this.fetchData()
        }
      },
      async getUnitList() {
        const { data } = await queryUnitList()
        this.unitList = data || []
      },
      async fetchData() {
        this.loading = true
        const { data } = await queryById({ id: this.rowId }).catch(() => {
          this.loading = false
        })
        this.editForm = Object.assign(
          {},
          {
            code: data.code,
            name: data.name,
            unitId: data.unitId,
            unitName: data.unitName,
            rate: data.rate,
            memo: data.memo,
          }
        )
        this.loading = false
      },
      close() {
        this.dialogVisible = false
        this.resize()
        this.$emit('close')
      },
      resize() {
        this.editForm = {
          code: '',
          name: '',
          unitId: null,
          unitName: '',
          rate: null,
          memo: '',
        }
      },
      async handleConfirm() {
        const valid = await this.$refs['editForm'].validate()
        if (!valid) return

        this.loading = true

        const params = {
          ...this.editForm,
          id: this.pageType === 'Edit' ? this.rowId : null,
        }

        const httpRequest = this.pageType === 'Edit' ? doEdit : doAdd

        const { data, message } = await httpRequest(params).catch(() => {
          this.loading = false
        })
        this.loading = false
        this.$baseMessage(message, 'success')
        this.dialogVisible = false
        this.$emit('confirm')
      },
    },
  }
</script>

<style lang="scss" scoped></style>
