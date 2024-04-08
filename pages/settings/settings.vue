<template>
	<view class="container">
		<tui-white-space size="large"></tui-white-space>
		<tui-list-cell :hover="false" @click="!login?goLogin():goPage('userinfo')">
			<view class="tui-line-cell">
				<view class="tui-title "><text class="list-text" >修改信息</text></view>
			</view>
		</tui-list-cell>
		<tui-list-cell :hover="false" >
			<view class="tui-line-cell">
				<view class="tui-title ">版本</view>

				<view class="tui-content ">
					<view>{{version}}</view>
				</view>
			</view>
		</tui-list-cell>
		<tui-list-cell :hover="false" @click="!login?goLogin():logout()">
			<view class="tui-line-cell">
				<view class="tui-title ">退出登录</view>
			</view>
		</tui-list-cell>

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
				version:uni.$version
			}
		},
		computed:{
			...mapGetters([
				'auth/getUserInfo',
				'auth/getLoginStatus'
			]),
			login() {
				return this['auth/getLoginStatus']
			},
		},
		methods: {
		logout(){
			uni.$api.logout(this.$store)
		},
		goLogin() {
			if (!this.login) {
				uni.$tui.href('/pages/login/login')
			}
		},
		goPage(href){
			uni.$tui.href(`/pages/${href}/${href}`)
		}
		}
	}
</script>

<style>
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

	.value {
		margin-left: 15px;
	}
</style>