<template>
	<view style="container">
		<checkbox-group v-for="(card,index) in items" :key="card.item_id" class="card-list">


			<view class="card">
				<view class="card-main" @click="ToDetail(card.item_id)">
					<view class="card-img">
						<view class="card-tags">
							<view class="card-tag-rarity" :style="rarityColor(card.rarity)" v-if="card.rarity"></view>
							<view class="card-tag-exterior" :style="exteriorColor(card.exterior)" v-if="card.exterior">
								{{card.exterior}}
							</view>
							<view class="card-tag-quality" :style="qualityColor(card.quality)" v-if="card.quality">
								{{card.quality.split(' ')[0]}}
							</view>
						</view>
						
						<image :src="card.icon_url" alt="加载中..." :style="{ width: '70%', height: '100%' }"></image>
					</view>
					<view class="card-body">
						<uni-tooltip :content="card.name" placement="bottom">
						  <view class="card-title">{{card.name}}</view>
						</uni-tooltip>
						<view class="card-content">{{card.content}}</view>
						<view class="card-time">{{timeformet(card.create_time)}}</view>
					</view>
				</view>


			</view>
		</checkbox-group>
		<view v-if="items.length==0">
			<tui-no-data imgUrl="/static/images/img_nodata.png">暂无数据</tui-no-data>
		</view>
		<tui-nomore text="NO MORE" v-if="no_more"></tui-nomore>
		<tui-white-space size="large"></tui-white-space>
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
				isShowButton: false,
				buttonGroup: [{
						text: '取消',
						backgroundColor: '#fff',
						color: '#000'
					},
					{
						text: '删除',
						backgroundColor: '#ff0000',
						color: '#fff'
					}
				],
				header: {
					line: true,
					bgcolor: "#fff"
				},
				no_more: false,
				menuList: [{
						title: '时间',
						type: 'sort',
						value: 'desc'
					},
					{
						title: '编辑',
						type: 'click',

					},
				],
				items: [

				],
				has_next: true,
				pagesize: 5000,
				nextPage: 2,
				ordering: '-last_update',
				pullText: '下拉刷新',
				pulling: false,
				scrollTop: 0
			}
		},
		onShow() {
			this.getpage(1, this.currentTab)
		},
		computed: {
			...mapGetters([
				'auth/getUserInfo',
				'auth/getLoginStatus'
			]),
			userInfo() {
				return this['auth/getUserInfo']
			},


		},
		onReachBottom() {
			this.getpage(this.nextPage, this.currentTab)

		}, //下拉执行的时候触发 （下拉刷新）  

		onPullDownRefresh() { //放要执行的动作....
			this.items = []
			this.getpage(1)
			wx.stopPullDownRefresh()

			//停止下拉刷新效果的api，如果发现进入刷新状态无法停止，可以用这个

		},
		
		methods: {
			ckeckList(name) {
				let list = []
				this.items.forEach((e) => {
					if (e.checked) {
						list.push(e[name])
					}
				})
				return list
			},
			buttonClick(e) {
				if (e.index == 0) {
					this.isShowButton = !this.isShowButton
				} else {
					let ids = this.ckeckList('item_id')
					if (ids.length != 0) {
						uni.$api.deleteHistory(this.$store, {
							ids: ids
						}, async (res) => {

							await this.getpage(1, this.currentTab)
							await this.$store.dispatch('auth/setUserInfo');
							uni.showToast({
								title: '删除成功',
								icon: 'succee'
							});
						}, (err) => {
							uni.showToast({
								title: '删除失败',
								icon: 'error'
							});
						})
					} else {
						uni.showToast({
							title: '未选择',
							icon: 'error'
						});
					}

				}

			},
			rarityColor(name) {
				return {
					backgroundColor: uni.$api.getRarityColor[name]
				}
			},
			exteriorColor(name) {
				return {
					color: uni.$api.getExteriorColor[name]
				}
			},
			qualityColor(name) {
				return {
					color: uni.$api.getQualityColor[name]
				}
			},
			ToDetail(item_id) {
				uni.navigateTo({
				    url: '/pages/details/details?item_id='+item_id, 
				});
			},
			timeformet(time) {
				return uni.$tui.getCurrentDateTimeString(new Date(time))
			},
			async getpage(page) {
				if (this.has_next || page == 1) {
					await uni.$api.MyGoodsList(this.$store, (res) => {
						if (res.data.length < this.pagesize) {
							this.no_more = true
							this.has_next = false
							if (page == 1) {
								this.items = res.data
							} else {
								this.items = this.items.concat(res.data)
							}
						} else {
							this.no_more = false
							if (page == 1) {
								this.items = res.data
								this.nextPage = 2
								
							} else {
								this.items = this.items.concat(res.data)
								this.nextPage++
							}
						}
					}, (err) => {
						uni.showToast({
							title: err.msg,
							icon: 'error'
						});
					})
				} else {
					uni.showToast({
						title: '没有更多啦~',
						icon: 'error'
					});
				}

			}
		}
	}
</script>

<style scoped>

</style>