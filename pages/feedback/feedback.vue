<template>
	<view class="container">
		<uni-forms ref="valiForm" :rules="rules" :modelValue="FormData">
			<uni-forms-item label="标题" required name="title">
				<uni-easyinput v-model="FormData.title" placeholder="请输入问题标题" />
			</uni-forms-item>

			<uni-forms-item label="详细问题" required name="question">
				<uni-easyinput type="textarea" v-model="FormData.question" placeholder="请输入问题描述" />
			</uni-forms-item>
		</uni-forms>
		<tui-button @click="dialogToggle()" class="tui-button-primary" hover-class="tui-button-gray_hover"
			formType="button" type="green" shape="circle">提交</tui-button>
		<view>
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="通知" content="确定发送反馈问题吗？"
					@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				isSend: false,
				FormData: {
					title: null,
					question: null
				},
				rules: {
					title: {
						rules: [{
							required: true,
							errorMessage: '标题不能为空'
						}]
					},
					question: {
						rules: [{
							required: true,
							errorMessage: '问题描述不能为空'
						}]
					},
				},
			}
		},
		methods: {
			dialogToggle() {
				this.$refs['valiForm'].validate().then(res => {
					this.$refs.alertDialog.open()
				
				}).catch(err => {
					console.log('err', err);
				})
				
			},
			dialogConfirm() {
				this.submit()
			},
			submit() {


				this.$refs['valiForm'].validate().then(res => {
					uni.$api.feedBack(this.$store, res, (res) => {
						uni.showToast({
							title: `发送成功`
						})
					}, (err) => {
						uni.showToast({
							title: `发送失败`
						})
					})

				}).catch(err => {
					console.log('err', err);
				})
			},
		}
	}
</script>

<style>
	.container {
		padding: 20rpx 50rpx;
	}
</style>