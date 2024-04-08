<template>
	<view class="container">
		<form @submit="formSubmit" @reset="formReset">
			<tui-list-cell :hover="false">
				<view class="tui-line-cell">
					<view class="tui-title">账号</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="account" placeholder="请输入手机号或邮箱"
						maxlength="50" type="text" v-model="formData.account" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false">
				<view class="tui-line-cell">
					<view class="tui-title">密码</view>
					<input password placeholder-class="tui-phcolor" class="tui-input" name="pwd" placeholder="请输入密码"
						maxlength="16" type="text" v-model="formData.pwd" />
				</view>
			</tui-list-cell>

			<tui-list-cell>
			<view class="tui-line-cell">
				<view class="tui-title">验证码</view>
				<input placeholder-class="tui-phcolor" class="tui-input" name="code" placeholder="请输入验证码" maxlength="4"
					type="text" v-model="formData.code" />

				<view style="height:64rpx;width: 200rpx">
					<img :src="imgCodeUrl" alt="xxxx" @click="resetCode" style="height:64rpx;width: 200rpx">
				</view>
				
			</view>
			</tui-list-cell>
			<view class="forget">
				<view @click="switchRegister">注册账号</view>
				<view @click="switchForget">忘记密码?</view>
			</view>
			<tui-white-space size="large"></tui-white-space>
			<view class="tui-btn-box">
				<tui-button class="tui-button-primary" hover-class="tui-button-gray_hover" formType="submit" type="green"
					shape="circle">登录</tui-button>
				<tui-white-space size="large"></tui-white-space>
				<tui-button class="tui-button-primary tui-button-gray" hover-class="tui-button-hover"
					formType="reset" shape="circle" type="gray">重置</tui-button>
			</view>
		</form>
		
	</view>
</template>

<script>
	import form from "@/components/common/tui-validation/tui-validation.js"

	//定义表单校验规则
	let rules = [{
		name: "account",
		rule: ["required", "isMobileOrEmail"],
		msg: ["请输入账号", "请输入正确的账号"]
	}, {
		name: "pwd",
		rule: ["required", "minLength:8","maxLength:16"],
		msg: ["请输入密码", "密码为8~16位"]
	}, {
		name: "code",
		rule: ["required", "minLength:4","maxLength:4"],
		msg: ["请输入验证码", "请输入正确的验证码"]

	}];
	export default {
		created() {
			this.resetCode()
		},
		data() {
			return {
				imgCodeUrl: '',
				imgCookie: '',
				formData:{
					account:'',
					pwd:'',
					code:''
				}
			}
		},

		methods: {
			formSubmit: function(e) {
				//进行表单数据
				
				//校验
				let checkRes = form.validation(this.formData, rules);
				if (!checkRes) {
					this.submit(this.formData)
				} else {
					//校验失败 checkRes 为错误信息
					uni.showToast({
						title: checkRes,
						icon: "none"
					});
				}
			},
			formReset:function(e){
				this.resetCode()
			},
			resetCode: function(e) {
				// #ifndef H5
				uni.request({
					url: uni.$api.imgcode,
					method: "GET",
					responseType: "arraybuffer",
					success: (res) => {
						// 获取响应头中的 Cookie
						this.imgCookie = res.header['Set-Cookie'];
						// 获取二进制图片数据
						
						const imageData = "data:image/jpeg;base64," + uni.arrayBufferToBase64(res.data);
						this.imgCodeUrl = imageData // 假设图像数据为 JPEG 格式
					},
					fail: (err) => {
						console.error("Failed to fetch image data:", err);
					}
				})
				// #endif
				// #ifdef H5
				this.imgCodeUrl =uni.$api.imgcode+'?'+Math.random()
				// #endif

			},
			submit: function(data) {
				this.$store.dispatch('auth/login', {
					data: data,
					success: (res) => {
						uni.$tui.href('/pages/home/home', true)
					},
					fail: (err) => {
						this.resetCode()
					},
					cookie: this.imgCookie
				});
			},
			switchRegister:function(e){
				uni.$tui.href('/pages/register/register')
				
			},
			switchForget:function(e){
				uni.$tui.href('/pages/foreget/foreget')
				
			}
		}
	}
</script>

<style>
	.forget{
		font-size: 30rpx;
		
		display: flex;
		padding:11px 18px;
		width: 100%;
		height: 50px;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	

	/* 样式 */
	.container {
		padding: 20rpx 0 50rpx 0;
	}

	.tui-line-cell {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-title {
		line-height: 32rpx;
		min-width: 120rpx;
		flex-shrink: 0;
	}

	.tui-input {
		font-size: 32rpx;
		color: #333;
		padding-left: 20rpx;
		flex: 1;
		overflow: visible;
	}

	.tui-btn-box {
		padding: 40rpx 50rpx;
		box-sizing: border-box;
	}

	.tui-button-gray {
		margin-top: 30rpx;
	}
</style>