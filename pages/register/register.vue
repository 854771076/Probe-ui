<template>
	<view class="container">
		<form @submit="formSubmit" @reset="formReset" id="form">
			<tui-list-cell :hover="false">
				<view class="tui-line-cell">
					<view class="tui-title">邮箱</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="email" placeholder="请输入邮箱"
						maxlength="50" type="text" v-model="formData.email" />
				</view>
			</tui-list-cell>

			<tui-list-cell :hover="false">
				<view class="tui-line-cell">
					<view class="tui-title">密码</view>
					<input password placeholder-class="tui-phcolor" class="tui-input" name="pwd" placeholder="请输入密码"
						maxlength="16" type="text" v-model="formData.password" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false">
				<view class="tui-line-cell">
					<view class="tui-title">重复密码</view>
					<input password placeholder-class="tui-phcolor" class="tui-input" name="pwd2" placeholder="请输入重复密码"
						maxlength="16" type="text" v-model="formData.checkpassword" />
				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false">
				<view class="tui-line-cell">
					<view class="tui-title">手机号</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="phone" placeholder="请输入手机号"
						maxlength="11" type="text" v-model="formData.phone" />
				</view>
			</tui-list-cell>
			<tui-list-cell>
				<view class="tui-line-cell">
					<view class="tui-title">验证码</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="code" placeholder="请输入验证码"
						maxlength="6" type="text" v-model="formData.code" />
					<tui-button formType="button" width="188rpx" height="64rpx" background="#f2f2f2" color="#5677fc"
						size="24" bold radius="20rpx" @click="sendEmailCode">{{codeTime}}</tui-button>

				</view>
			</tui-list-cell>
			<tui-list-cell :hover="false">
				<view class="tui-line-cell">
					<view class="tui-title">邀请者</view>
					<input placeholder-class="tui-phcolor" class="tui-input" name="Inviter" placeholder="请输入邀请者邮箱"
						maxlength="50" type="text" v-model="formData.Inviter" />
				</view>
			</tui-list-cell>
			<tui-white-space size="large"></tui-white-space>
			<view class="tui-btn-box">
				<tui-button class="tui-button-primary" hover-class="tui-button-gray_hover" formType="submit"
					type="green" shape="circle">注册</tui-button>
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
			name: "email",
			rule: ["required", "isEmail"],
			msg: ["请输入邮箱", "请输入正确的邮箱"]
		},

		{
			name: "password",
			rule: ["required", "minLength:8", "maxLength:16"],
			msg: ["请输入密码", "密码为8~16位"]
		},
		{
			name: "checkpassword",
			rule: ["required", "isSame:password"],
			msg: ["请输入重复密码", "密码不一致"]
		},
		{
			name: "phone",
			rule: ["required", "isMobile"],
			msg: ["请输入手机号", "请输入正确的手机号"]
		},
		{
			name: "code",
			rule: ["required", "isNum", "minLength:6"],
			msg: ["请输入验证码", "请输入正确的验证码"]

		},
		{
			name: "Inviter",
			rule: ["isEmail"],
			msg: ["请输入邀请者（选填）", "请输入正确的邀请者邮箱"]
		}
	];
	export default {
		created() {

		},
		data() {
			return {
				imgCodeUrl: '',
				imgCookie: '',
				codeTime: "获取验证码",

				formData: {
					email: '',
					password: '',
					checkpassword: '',
					phone: '',
					code: '',
					Inviter:''
				},
				Interval: null
			}
		},

		methods: {
			formSubmit: function(e) {
				//进行表单数据


				//校验
				let checkRes = form.validation(this.formData, rules);
				if (!checkRes) {
					this.submit()
				} else {
					//校验失败 checkRes 为错误信息
					console.info(this.formData)
					uni.showToast({
						title: checkRes,
						icon: "none"
					});
				}
			},
			formReset: function(e) {

			},
			sendCodeCountDown: function() {
				if (this.codeTime === "获取验证码") {
					this.codeTime = 60
					this.Interval = setInterval(() => {
						if (this.codeTime > 0) {
							this.codeTime--
						} else {
							this.codeTime = "获取验证码"
							clearInterval(this.Interval)
							this.Interval=null
						}

					}, 1000)
				}

			},
			sendEmailCode: function(e) {
				
				let email = [{
					name: "email",
					rule: ["required", "isEmail"],
					msg: ["请输入邮箱", "请输入正确的邮箱"]
				}]
				//校验
				let checkRes = form.validation(this.formData, email);
				
				if (!checkRes) {
					
					//发送验证码
					if (!Boolean(this.Interval)) {
						uni.showLoading({mask:true})
						uni.request({
							url: uni.$api.emailcode,
							method: "POST",
							data: {
							email:this.formData.email,
							action:"注册账号"
							},
							success: (res) => {
								this.sendCodeCountDown()
								uni.hideLoading()
								uni.$tui.toast("发送成功")
								
							},
							fail: (err) => {
								console.error("Failed to fetch image data:", err);
								uni.hideLoading()
								uni.$tui.toast("发送失败")
								
							}
						})
					} else {
						uni.$tui.toast("频繁操作")
					}
					


				} else {
					//校验失败 checkRes 为错误信息
					uni.showToast({
						title: checkRes,
						icon: "none"
					});
				}
			},
			submit: function() {
				uni.showLoading({mask:true})
				uni.request({
					url: uni.$api.signup,
					method: "POST",
					data: this.formData,
					success: (res) => {
						uni.hideLoading()
						if(res.data.code!=200){
							uni.$tui.toast(res.data.error)
						}else{
							uni.navigateBack(
							{
								delta: 1,
								success(){
									uni.$tui.toast("注册成功")
								}
							}
							)
						}
						
					},
					fail: (err) => {
						console.error("Failed to fetch image data:", err);
						uni.hideLoading()
						uni.$tui.toast("注册失败")
						
					}
				})
			}
		}
	}
</script>

<style>
	.forget {
		font-size: 30rpx;

		display: flex;
		padding: 11px 18px;
		width: 100%;
		height: 50px;
		align-items: center;
		justify-content: flex-end;
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