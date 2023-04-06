<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :append-to-body="appendToBody"
    :destroy-on-close="destroyOnClose"
    :show-close="showClose"
    :close-on-click-modal="closeOnClickModal"
    :custom-class="customClass"
    :top="top"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- 自定义内容 -->
    <slot></slot>
    <!-- 是否显示底部内容 默认提供 取消 和 确认 按钮及cancel  confirm事件 -->
    <span v-if="isFooter" slot="footer" class="dialog-footer">
      <slot name="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseDialog',
  props: {
    // dialog 标题
    title: {
      type: String,
      default: '提示',
    },
    // 是否显示 dialog
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    // dailog 宽度
    width: {
      type: String,
      default: '70%',
    },
    // dialog 的 margin-top
    top: {
      type: String,
      default: '12vh',
    },
    // 是否插入body上
    appendToBody: {
      type: Boolean,
      default: true,
    },
    // 关闭时销毁dialog元素
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
    // 是否显示底部
    isFooter: {
      type: Boolean,
      default: false,
    },
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true,
    },
    // 是否可以通过点击遮罩层关闭
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    // 自定义 dialog class name
    customClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 弹窗打开
    handleOpen() {
      this.$emit('open')
    },
    // 弹窗关闭
    handleClose() {
      this.$emit('close')
    },
    // 弹窗取消
    handleCancel() {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    // 弹窗确认
    handleConfirm() {
      this.$emit('confirm')
    },
  },
}
</script>

<style lang="scss" scoped></style>
