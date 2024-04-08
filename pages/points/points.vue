<template>
	<view style="container">
		<tui-tabs :tabs="tabs" :currentTab="currentTab" @change="change"></tui-tabs>
		<view v-for="(item,index) in items" :key="index">
			<list-item>
				<tui-list-cell :hover="false">
					<view class="points-items">
						<view style="flex:1;text-align:left">{{item.source}}</view>
						<view  :style="{flex:1,textAlign:'right',color:item.points>=0?'green':'red'}">{{item.points}}
						</view>
					</view>
					<view class="points-items">
						<view style="flex:1;text-align:left">{{item.email}}</view>
						<view class="points-time" :style="{flex:1,textAlign:'right'}">{{timeformet(item.create_time)}}
						</view>
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
				currentTab: 0,
				tabs: [{
					name: "全部"
				}, {
					name: "收入"
				}, {
					name: "支出"
				}],
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
			this.getpage(1,this.currentTab)
		},
		onReachBottom() {
			this.getpage(this.nextPage,this.currentTab)

		}, //下拉执行的时候触发 （下拉刷新）  

		onPullDownRefresh() { //放要执行的动作....
			this.getpage(1,this.currentTab)
			wx.stopPullDownRefresh()

			//停止下拉刷新效果的api，如果发现进入刷新状态无法停止，可以用这个

		},
		methods: {
			change(e){
				this.currentTab=e.index
				
				this.getpage(1,this.currentTab)
			},
			timeformet(time) {
				return uni.$tui.getCurrentDateTimeString(new Date(time))
			},
			getpage(page,type) {
				uni.showLoading()
				uni.$api.pointsList(this.$store, {
						page: page,
						type:type
					}, (res) => {
						if (page != 1) {
							if (res.data.length != 0) {
								console.log(res.data)
								this.items = this.items.concat(res.data)
								this.no_more = false
							} else {
								this.no_more = true
							}
							this.nextPage++
						} else {
							if (res.data.length != 0) {
								console.log(res.data)
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