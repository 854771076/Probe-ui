<template>
	<view class="container">
		<tui-list-cell :hover="false" @click="uploadHeader">
			<view class="tui-line-cell">
				<view class="tui-title">头像</view>
				<view class="tui-content">
					<image class="logo-img" :src="getHeader"></image>
					<uni-icons type="right" class="value"></uni-icons>
				</view>


			</view>
		</tui-list-cell>
		<tui-white-space size="large"></tui-white-space>
		<tui-list-cell :hover="false" @click="changeName">
			<view class="tui-line-cell">
				<view class="tui-title ">昵称</view>
				<view class="tui-content ">
					<view>{{name}}</view>
					
					<uni-icons type="right" class="value"></uni-icons>
				</view>
			</view>
		</tui-list-cell>
		<tui-list-cell :hover="false" @click="changeSteamUrl">
			<view class="tui-line-cell">
				<view class="tui-title ">Steam主页链接</view>
				<view class="tui-content ">
					<view>{{steam_url_show[0]}}</view>
					
					<uni-icons type="right" class="value"></uni-icons>
				</view>
			</view>
		</tui-list-cell>
		<tui-white-space size="large"></tui-white-space>
		<tui-list-cell :hover="false" @click="changeSex">
			<view class="tui-line-cell">
				<view class="tui-title ">性别</view>
				<view class="tui-content ">
					<view>{{genderTranslation}}</view>

					<uni-icons type="right" class="value"></uni-icons>
				</view>
			</view>
		</tui-list-cell>
		<tui-list-cell :hover="false">
			<view class="tui-line-cell">
				<view class="tui-title ">生日</view>
				<view class="tui-content ">
					<uni-datetime-picker type="date" v-model="birth" @change="changeBirth" :clear-icon="false"
						:border="false" />
					<uni-icons type="right" class="value"></uni-icons>
				</view>
			</view>
		</tui-list-cell>
		<tui-white-space size="large"></tui-white-space>
		
		
		<tui-actionsheet :show="showActionSheet" :item-list="itemList" @click="itemClick" @cancel="closeActionSheet">
		</tui-actionsheet>
		
		<view>
			<!-- 输入框示例 -->
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose" mode="input" title="修改昵称" :value="name" placeholder="请输入昵称"
					@confirm="changeNameConfirm"></uni-popup-dialog>
			</uni-popup>
			
			<uni-popup ref="inputDialog2" type="dialog">
				<uni-popup-dialog ref="inputClose" mode="input" title="修改Steam主页链接" :value="steam_url" placeholder="https://steamcommunity.com/id(profiles)/xxxx/"
					@confirm="changeSteamUrlConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {

		data() {
			return {
				serverUrl: uni.$api.uploadphoto,
				showActionSheet: false,
				itemList: [],

				click: (index) => {}
			}
		},

		computed: {
			...mapGetters([
				'auth/getUserInfo',
				'auth/getLoginStatus',

			]),
			steam_url(){
				return this.userInfo.steam_url
				
			},
			steam_url_show(){
				let url=this.userInfo.steam_url
				if(url.slice(-1)=='/'){
					return url.split('/').slice(-2)
				}else{
					return url.split('/').slice(-1)
				}
			},
			genderTranslation() {
				return this.userInfo.genderCode == "0" ? "女" : "男"

			},
			birth() {
				return this.userInfo.birth
			},
			userInfo() {
				return this['auth/getUserInfo']
			},
			name() {
				return this.userInfo.name
			},
			login() {
				return this['auth/getLoginStatus']
			},
			vipTime() {
				if (this['auth/getUserInfo'].vipTime) {
					let time = new Date(this['auth/getUserInfo'].vipTime)
					let time2 = new Date()
					console.log(time.getTime() - time2.getTime())
					if (time.getTime() - time2.getTime() < 0) {
						return '已到期'
					}
					return time.toLocaleString()
				}

				return '-'
			},
			getHeader() {
				return uni.$apiServer + (this['auth/getUserInfo'].photo ? this['auth/getUserInfo'].photo :
					"/media/default/user.jpg")
			},

		},
		methods: {
			changeNameConfirm(e) {
				uni.$api.updateName(this.$store, {
						name:e,
					},
					(res) => {
						uni.$tui.toast('修改成功')
						this.$store.dispatch('auth/setUserInfo')
					}, (err) => {
						uni.$tui.toast('修改失败')
						console.error(err)
					}
				)
				
			},
			changeName() {
				this.$refs.inputDialog.open()
			},
			changeSteamUrlConfirm(e) {
				uni.$api.updateSteamUrl(this.$store, {
						steam_url:e,
					},
					(res) => {
						uni.$tui.toast('修改成功')
						this.$store.dispatch('auth/setUserInfo')
					}, (err) => {
						uni.$tui.toast('修改失败')
						console.error(err)
					}
				)
				
			},
			changeSteamUrl() {
				this.$refs.inputDialog2.open()
			},

			dialogClose() {
				console.log('点击关闭')
			},
			changeBirth: function(e) {
				//选择的结果

				uni.$api.updateBirth(this.$store, {
						birth: e,
					},
					(res) => {
						uni.$tui.toast('修改成功')
						this.$store.dispatch('auth/setUserInfo')
					}, (err) => {
						uni.$tui.toast('修改失败')
						console.error(err)
					}
				)
			},
			closeActionSheet: function() {
				this.showActionSheet = false
			},
			//调用此方法显示组件
			openActionSheet: function(type) {
				this.showActionSheet = true;
			},
			itemClick: function(e) {
				this.closeActionSheet();
				console.log(e)
				this.click(e.index)
			},
			changeSex() {
				this.itemList = [{
						text: "女",
					},
					{
						text: "男",
					}
				]
				var self = this

				this.click = (index) => {
					let type;
					let genderCode
					if (index === 0) {
						genderCode = "0"
					} else {
						genderCode = "1"
					}
					uni.$api.updateSex(self.$store, {
							genderCode: genderCode,
							genderTranslation: genderCode == "0" ? "女" : "男"
						},
						(res) => {
							uni.$tui.toast('修改成功')
							self.$store.dispatch('auth/setUserInfo')
						}, (err) => {
							uni.$tui.toast('修改失败')
							console.error(err)
						}
					)

				}
				this.openActionSheet()
			},
			uploadHeader() {
				this.itemList = [{
						text: "从相册选择",
					},
					{
						text: "相机",
					}
				]
				var self = this

				this.click = (index) => {
					let type;
					if (index === 0) {
						type = 'album'
					} else {
						type = 'camera'
					}
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: [type], //从相册选择
						success: function(res) {
							var tempFilePaths = res.tempFilePaths;
							self.$store.dispatch('auth/refreshToken')
							uni.uploadFile({
								url: uni.$api.uploadphoto, // 替换为你的接口地址
								filePath: tempFilePaths[0], // 选择的图片文件的临时路径
								name: 'file',
								header: {
									'Authorization': 'Bearer ' + self.$store.getters[
										'auth/getToken']
								},
								success: function(uploadRes) {

									uni.$tui.toast('修改成功')
									self.$store.dispatch('auth/setUserInfo')
									// 图片上传成功，可以在这里处理上传成功后的逻辑
								}
							});
						}
					});
				}
				this.openActionSheet()
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 样式 */
	.container {
		padding: 20rpx 0 50rpx 0;
	}

	.value {
		margin-left: 15px;
	}

	.logo-img {
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		border: solid 1rpx #efefef;

	}

	.tui-line-cell {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
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