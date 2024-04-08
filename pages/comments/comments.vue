<template>
	<view style="container">
		<le-dropdown v-model:menuList="menuList" themeColor="#eb652b" :duration="300" :isCeiling="false"
			@onConfirm="onConfirm"></le-dropdown>
		<checkbox-group v-for="(card,index) in items" :key="card.cid" class="card-list" @change="checkboxChange">


			<view class="card">
				<view class="card-radio" v-show="isShowButton">
					<checkbox :value="card.cid" color="#FFCC33" style="transform:scale(0.7)" />
				</view>
				<view class="card-main" @click="ToDetail(card.item_id)">
					<view class="card-img">
						<view class="card-tags">
							<view class="card-tag-rarity" :style="rarityColor(card.rarity)" v-if="card.rarity"></view>
							<view class="card-tag-exterior" :style="exteriorColor(card.exterior)" v-if="card.exterior">
								{{card.exterior}}
							</view>
							<view class="card-tag-quality" :style="qualityColor(card.quality)" v-if="card.quality">
								{{card.quality}}
							</view>
						</view>
						<image :src="card.icon_url" alt="加载中..." :style="{ width: '70%', height: '100%' }"></image>
					</view>
					<view class="card-body">
						<view class="card-title">{{card.name}}</view>

						<!-- <view class="card-price"></view> -->
						<view class="card-content">{{card.content}}</view>
						<view class="card-time">{{timeformet(card.last_update)}}</view>
					</view>
				</view>


			</view>
		</checkbox-group>
		<uni-goods-nav :fill="true" :options="{}" :buttonGroup="buttonGroup" @buttonClick="buttonClick"
			v-show="isShowButton" />
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
				pagesize: 20,
				nextPage: 2,
				ordering: '-last_update,-create_time',
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
			this.getpage(1, this.currentTab)
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
					let ids = this.ckeckList('cid')
					if (ids.length != 0) {
						uni.$api.deleteComment(this.$store, {
							ids: ids
						}, async (res) => {

							await this.getpage(1, this.currentTab)
							this.$store.dispatch('auth/setUserInfo');
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
			onConfirm(e) {
				if (e.title === '时间') {
					if (this.ordering == '-last_update,-create_time') {
						this.ordering = 'last_update,create_time'
						this.getpage(1, this.currentTab)
					} else {
						this.ordering = '-last_update,-create_time'
						this.getpage(1, this.currentTab)
					}
				} else if (e.title === '编辑') {
					this.isShowButton = !this.isShowButton
				}
			},
			checkboxChange(e) {

				var items = this.items,
					values = e.detail.value[0];

				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if (values == item.cid) {
						this.$set(item, 'checked', true)
					} else if (!item.checked) {
						this.$set(item, 'checked', false)
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
					await uni.$api.commentsList(this.$store, {
						email: this.userInfo.email,
						page: page,
						ordering: this.ordering,
						pagesize: this.pagesize,
					}, (res) => {
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
								this.nextPage++
							} else {
								this.items = this.items.concat(res.data)
								this.nextPage = 2
							}
						}
					}, (err) => {
						uni.showToast({
							title: '加载失败',
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