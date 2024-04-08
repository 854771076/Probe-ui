<template>
	<view style="container">

		<view v-for="(item,index) in items" :key="index">
			<list-item>
				<tui-list-cell :hover="false">
					<view class="points-items">
						<view style="flex:1;text-align:left">{{item.email}}</view>
						<view class="points-time" :style="{flex:1,textAlign:'right'}">{{timeformet(item.date_joined)}}</view>
					</view>


				</tui-list-cell>
			</list-item>
		</view>
		<view v-if="items.length==0">
			<tui-no-data imgUrl="/static/images/img_nodata.png">暂无数据</tui-no-data>
		</view>
		<tui-nomore text="NO MORE" v-if="no_more"></tui-nomore>
		<tui-white-space size="large"></tui-white-space>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				no_more: false,
				items: [

				],
				nextPage: 2,
				pullText: '下拉刷新',
				pulling: false,
				scrollTop: 0
			}
		},
		onShow() {
			this.getpage(1)
		},
		onReachBottom() {
			this.getpage(this.nextPage)

		}, //下拉执行的时候触发 （下拉刷新）  

		onPullDownRefresh() { //放要执行的动作....
			this.getpage(1)
			wx.stopPullDownRefresh()

			//停止下拉刷新效果的api，如果发现进入刷新状态无法停止，可以用这个

		},
		methods: {
			timeformet(time){
				return uni.$tui.getCurrentDateTimeString(new Date(time))
			},
			getpage(page) {
				uni.showLoading()
				uni.$api.invitedList(this.$store, {
						page: page
					}, (res) => {
						if (page != 1) {
							if (res.length != 0) {
								
								
								this.items = this.items.concat(res.data)
								this.no_more = false
							} else {
								this.no_more = true
							}
							this.nextPage++
						} else {
							if (res.length != 0) {
								
								this.items = res.data
								this.no_more = false
							} else {
								this.no_more = true
							}
							this.nextPage = 2
						}

						uni.hideLoading()

					},
					(err) => {
						uni.hideLoading()
						uni.showToast({
							title: '加载失败',
							icon: 'error'
						});
					})
			}
		}
	}
</script>

<style scoped>
	.container {
		height: 100vh;
		overflow-y: scroll;
	}

	.points-items {
		width: 100%;
		display: flex;
		align-items: center;
		justify-self: space-between;
	}

	.points-time {
		text-align: right;
		color: "#777";
		font-size: 20rpx;
	}
</style>