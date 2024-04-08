<template>
	<view class="center" style="padding-top: 50px; height: 94.5vh;">
		<view id="calendar"><uni-icons type="calendar" size="30" color="skyblue"
				@click="!login?goLogin():goPage('checkin')"></uni-icons><tui-badge type="primary" :scaleRatio="0.5"
				absolute translateX="40%" top="-6rpx" v-if="!userInfo.checkin"></tui-badge></view>
		<view class="bg center">
			<view class="bg-radius"></view>
			<view class="logo" @click="goLogin" :hover-class="!login ? 'logo-hover' : ''">
				<view class="tui-badge-item">
					<image class="logo-img" :src="getHeader"></image>
					<tui-badge :type="userInfo.vip>0&&userInfo.isvip?'danger':'gray'" :scaleRatio="0.8" absolute
						translateX="40%" top="-6rpx"><uni-icons type="vip"
							:color="userInfo.vip>0&&userInfo.isvip?'yellow':'grey'"></uni-icons>Vip{{userInfo.vip}}</tui-badge>
				</view>

				<view class="logo-title">
					<text class="uer-name">{{userInfo.email}}</text>
					<view class="vipTime">到期时间：{{vipTime}}</view>
				</view>

				<view class="count">
					<view class="count-item" @click="!login?goLogin():goPage('stars')">
						<text class="count-item-num">{{userInfo.stars}}</text>
						<text class="count-item-text">我的收藏</text>
					</view>
					<view class="count-item"  @click="!login?goLogin():goPage('history')">
						<text class="count-item-num">{{userInfo.historys}}</text>
						<text class="count-item-text">我的足迹</text>
					</view>
					<view class="count-item" @click="!login?goLogin():goPage('comments')">
						<text class="count-item-num">{{userInfo.comments}}</text>
						<text class="count-item-text">我的评论</text>
					</view>
					<view class="count-item" @click="!login?goLogin():goPage('points')">
						<text class="count-item-num">{{userInfo.points}}</text>
						<text class="count-item-text">我的积分</text>
					</view>
				</view>
			</view>
		</view>

		<view class="bg-gray center">

			<view class="center-list">
				<view class="center-list-item border-bottom">
					<uni-icons type="shop-filled" class="list-icon" color="#ffaa00"></uni-icons>
					<text class="list-text" @click="!login?goLogin():goPage('mygoods')">我的饰品</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
				
				<view class="center-list-item border-bottom">
					<uni-icons type="personadd" class="list-icon" color="#00aaff"></uni-icons>
					<text class="list-text" @click="!login?goLogin():goPage('invite')">邀请朋友</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>

				<view class="center-list-item border-bottom">
					<uni-icons type="list" class="list-icon" color="#ffaa00"></uni-icons>
					<text class="list-text">积分任务</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>

			</view>

			<view class="center-list">
				<view class="center-list-item border-bottom">
					<uni-icons type="help" class="list-icon" color="#007aff"></uni-icons>
					<text class="list-text" @click="!login?goLogin():goPage('feedback')">帮助与反馈</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
				<view class="center-list-item">
					<uni-icons type="help" class="list-icon" color="#dd524d"></uni-icons>
					<text class="list-text" @click="goPage('license')">服务条款及隐私</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
			</view>
			<view class="center-list">
				<view class="center-list-item">
					<uni-icons type="info" class="list-icon"></uni-icons>
					<text class="list-text" @click="goPage('pointinfo')">关于积分</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>

				<view class="center-list-item">
					<uni-icons type="gear" class="list-icon" color="#4cd964"></uni-icons>

					<text class="list-text" @click="goPage('settings')">设置</text>
					<text class="navigat-arrow">&#xe65e;</text>
				</view>
			</view>
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

			}
		},

	
		computed: {
			...mapGetters([
				'auth/getUserInfo',
				'auth/getLoginStatus'
			]),
			userInfo() {
				return this['auth/getUserInfo']
			},
			login() {
				return this['auth/getLoginStatus']
			},
			vipTime() {
				if (this['auth/getUserInfo'].vipTime) {
					let time = new Date(this['auth/getUserInfo'].vipTime)
					let time2 = new Date()
					if (time.getTime() - time2.getTime() < 0) {
						return '已到期'
					}
					return uni.$tui.getDateTimeString(time)
				}

				return '-'
			},
			getHeader() {
				return uni.$apiServer + (this['auth/getUserInfo'].photo ? this['auth/getUserInfo'].photo :
					"/media/default/user.jpg")
			}
		},
		async onPullDownRefresh() { //放要执行的动作....
			await this.$store.dispatch('auth/setUserInfo');
			uni.showToast({
				title: '刷新成功',
				icon: 'success'
			});
			wx.stopPullDownRefresh()

			//停止下拉刷新效果的api，如果发现进入刷新状态无法停止，可以用这个

		},
		onShow() {
		   this.$store.dispatch('auth/setUserInfo');
		    // 执行显示时的逻辑
		  },
		methods: {
			goLogin() {
				if (!this.login) {
					uni.$tui.href('/pages/login/login')
				}
			},
			goPage(href) {
				uni.$tui.href(`/pages/${href}/${href}`)
			}
		}
	}
</script>


<style lang="scss" scoped>
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('../../static/fonts/font.ttf') format('truetype');
	}
	page,
	view {
		display: flex;
	}
	$head-color: #fff;
	$white-color: #fff;
	$main-color: #333;
	$radius: 0rpx;
	$border-color: #efefef;
	$color-1: #007aff;
	$color-2: #4cd964;
	$color-3: #f0ad4e;
	$color-4: #dd524d;
	$list-item-height: 100rpx;
	$list-margin: 20rpx;
	$width: 100%;
	$head-height: 550rpx;
	$head-width: 120vw;
	$margin-left: -60vw;
	.center {
		flex-direction: column;
	}
	#calendar {
		position: absolute;
		height: 30px;
		line-height: 30px;
		top: 50px;
		left: 20px;
		z-index: 100;
		color: skyblue
	}

	.vipTime {
		color: gray;
		font-size: 12px;

	}

	.count {
		z-index: 100
	}

	.center {
		box-sizing: border-box;
		position: relative;
		background-color: #cd3b33;
	}

	.bg {
		width: 100vw;
		height: 500rpx;
		overflow: hidden;
		position: relative;
		box-sizing: border-box;
		
		.bg-radius {
			background-color: $head-color;
			border-top-left-radius: 50%;
			border-top-right-radius: 50%;
			width: $head-width;
			height: $head-height;
			box-sizing: border-box;
			position: absolute;
			left: 50%;
			margin-left: $margin-left;
			top: 150rpx;
			z-index: 0;
		}

		.logo {
			background-color: transparent;
			border-top-left-radius: 50%;
			border-top-right-radius: 50%;
			width: 100vw;
			box-sizing: border-box;
			flex-direction: column;
			align-items: center;
			position: absolute;
			left: 0;
			top: 70rpx;
			z-index: 9;

			.logo-img {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				border: solid 1rpx #efefef;
			}

			.logo-title {
				height: 150rpx;
				flex: 1;
				align-items: center;

				justify-content: space-between;
				flex-direction: column;

				.uer-name {
					height: 60rpx;
					line-height: 60rpx;
					font-size: 34rpx;
					color: #333;
				}
			}

			.count {
				margin: 30rpx auto 0rpx;
				width: $width;

				.count-item {
					flex-direction: column;
					flex: 1;
					text-align: center;

					.count-item-num {
						color: $main-color;
						font-size: 36rpx;
						font-weight: 500;
					}

					.count-item-text {
						color: $main-color;
						font-size: 28rpx;
						font-weight: 400;
						margin-top: 10rpx;
					}
				}
			}
		}
	}

	.tui-badge-item {
		position: relative;
	}

	.center-list {
		background-color: #FFFFFF;
		margin: 0 auto $list-margin;
		width: $width;
		flex-direction: column;
		border-radius: $radius;

		.center-list-item {
			height: $list-item-height;
			width: 100%;
			box-sizing: border-box;
			flex-direction: row;
			padding: 0rpx 20rpx;

			.list-icon {
				width: 40rpx;
				// height: $list-item-height;
				line-height: $list-item-height;
				font-size: 45rpx;
				// color: #4cd964;
				text-align: center;
				// font-family: texticons;
				margin-right: 20rpx;
			}

			.color-1 {
				color: $color-1;
			}

			.color-2 {
				color: $color-2;
			}

			.color-3 {
				color: $color-3;
			}

			.color-4 {
				color: $color-4;
			}

			.list-text {
				height: $list-item-height;
				line-height: $list-item-height;
				font-size: 32rpx;
				color: #555;
				flex: 1;
				text-align: left;
			}

			.navigat-arrow {
				height: $list-item-height;
				line-height: $list-item-height;
				width: 40rpx;
				font-size: 30rpx;
				color: #999;
				text-align: right;
				font-family: texticons;
			}
		}

		.border-bottom {
			border-bottom-width: 1rpx;
			border-color: $border-color;
			border-bottom-style: solid;
		}
	}

	.center-nav {
		background-color: #FFFFFF;
		padding-top: 1rpx;
		margin: 20rpx auto $list-margin;
		width: $width;
		flex-direction: column;
		border-radius: $radius;

		.center-nav-title {
			padding: 25rpx 30rpx;
			font-size: 34rpx;
			color: #333;
			font-weight: 400;
			border-bottom: solid 1rpx $border-color;
		}

		.center-nav-content {
			height: 180rpx;
			display: flex;
			align-items: center;

			.center-nav-item {
				flex-direction: column;
				flex: 1;
				text-align: center;

				.center-nav-item-icon {
					color: #333;
					font-size: 48rpx;
					font-weight: 500;
					font-family: texticons;
				}

				.center-nav-item-text {
					color: #666;
					font-size: 30rpx;
					font-weight: 400;
					margin-top: 15rpx;
				}
			}
		}
	}

	.margin-top {
		margin-top: 20rpx;
		min-height: 230rpx;
	}

	.bg-gray {
		background: #f4f4f4;
		height: calc(100vh - 435rpx);
	}
</style>