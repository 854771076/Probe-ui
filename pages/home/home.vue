<template>
	<view class="content">
		<view class="title">

			<view class="logo">
				<image src="../../static/logo.png" alt="加载中..." :style="{ width: '100%', height: '100%' }"></image>
			</view>
			<view class="name">
				Probe
			</view>
		</view>

		<!-- 自定义顶部搜索框 用于搜索跳转 skipUrl:跳转url为绝对路径 /pages开头 -->
		<view class="search">
			<cc-headSearch class="search1" skipUrl="/pages/home/search"></cc-headSearch>
		</view>
		<uni-section class="mb-10" title="最近更新" type="line">

			<tui-tabs :tabs="tabs" :currentTab="currentTab" @change="change"></tui-tabs>
		</uni-section>

		<scroll-view :scroll-y="true" :scroll-x="false" class="mui-content-padded" @scrolltolower="lower" ref="scorlls">

			<view v-for="(card,index) in items" :key="card.item_id" class="card-list">


				<view class="card" @click="ToDetail(card.item_id)">

					<view class="card-main">
						<view class="card-img">
							<view class="card-tags">
								<view class="card-tag-rarity" :style="rarityColor(card.rarity)" v-if="card.rarity">
								</view>
								<view class="card-tag-exterior" :style="exteriorColor(card.exterior)"
									v-if="card.exterior">
									{{card.exterior}}
								</view>
								<view class="card-tag-quality" :style="qualityColor(card.quality)" v-if="card.quality">
									{{card.quality.split(' ')[0]}}
								</view>
							</view>
							<view class="card-price-rate " v-if="card.price_rate>=0" style="color:#15cc4a">
								{{`${(card.price_rate*100).toFixed(2)}%`}}
							</view>
							<view class="card-price-rate " v-else style="color:#ffbb00">
								{{`${(card.price_rate*100).toFixed(2)}%`}}
							</view>
							<image :src="card.icon_url" alt="加载中..." :style="{ width: '70%', height: '100%' }"></image>
						</view>
						<view class="card-body">
							<uni-tooltip :content="card.name" placement="bottom">
								<view class="card-title">{{card.name}}</view>
							</uni-tooltip>


							<view class="card-price">
								<view class="card-price-text">￥{{card.price}}</view>
							</view>
							<!-- <view class="card-content">{{card.content}}</view> -->
							<view class="card-time">{{timeformet(card.update_time)}}</view>
						</view>
					</view>


				</view>
			</view>
			<view v-if="items.length==0">
				<tui-no-data imgUrl="/static/images/img_nodata.png">暂无数据</tui-no-data>
			</view>
			<tui-nomore text="NO MORE" v-if="no_more"></tui-nomore>
			<!-- <tui-white-space size="large"></tui-white-space> -->

		</scroll-view>



	</view>
</template>

<script>
	export default {

		onShow() {
			this.getpage(1)
		},
		data() {
			return {
				items: [

				],
				currentTab: 0,
				tabs: [{
					name: "STEAM",
					key: "steam"
				}, {
					name: "BUFF",
					key: "buff"
				}, {
					name: "IGXE",
					key: "igxe"
				}, {
					name: "悠悠有品",
					key: "uuyp"
				}, {
					name: "C5game",
					key: "c5"
				}],
				has_next: true,
				pagesize: 20,
				nextPage: 2,
				ordering: '-last_update,-create_time',
				pullText: '下拉刷新',
				pulling: false,

				no_more: false,
				skipUrl: '',
				filter_data: {
					col: "steam",
					minPrice: "300",
					maxPrice: "10000000",
					keyWords: "",
					exterior: "",
					quality: "",
					rarity: "",
					type: ""
				},
			}
		},
		methods: {
			change(e) {
				this.currentTab = e.index
				this.filter_data.col = this.tabs[this.currentTab].key
				this.getpage(1)


			},
			lower() {
				this.getpage(this.nextPage, this.currentTab)
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
					url: '/pages/details/details?item_id=' + item_id,
				});
			},
			timeformet(time) {
				return uni.$tui.getCurrentDateTimeString(new Date(time))
			},
			async getpage(page) {
				if (this.has_next || page == 1) {
					await uni.$api.getGoodsList(this.$store, this.filter_data.col + '_csgo', {
						name: this.filter_data.keyWords,
						page: page,
						exterior: this.filter_data.exterior,
						pagesize: this.pagesize,
						quality: this.filter_data.quality,
						type: this.filter_data.type,
						rarity: this.filter_data.rarity,
						price_gte: this.filter_data.minPrice,
						price_lte: this.filter_data.maxPrice,
					}, (res) => {
						console.log(res)
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
						console.log(err)
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

			},



		}
	}
</script>

<style scoped>
	.mui-content-padded {
		box-sizing: border-box;
		padding: 0;
		width: 100%;
		/* flex:1; */
		height: 100%;
		// #ifndef H5
		height: calc(100% - 160rpx);

		// #endif
		overflow-y: auto;
	}

	.search-btn {
		// #ifdef H5
		margin-right: 15px // #endif
	}

	.title {
		display: flex;

		height: 50px;
		padding: 0 15px;
		// #ifndef H5
		padding: 0 40rpx;
		padding-top: 80rpx;
		height: 70rpx;
		// #endif
		align-items: center;
		background-color: #fff;
	}

	.logo {
		height: 50rpx;
		width: 50rpx;
	}

	.logo>image {}

	.name {
		height: 100%;
		line-height: 50px;
		font-weight: 600;
		margin-left: 15px;
		// #ifndef H5
		height: 100%;
		line-height: 70rpx;
		font-weight: 600;
		margin-left: 30rpx;
		// #endif
	}

	page {

		background-color: #f7f7f7;
	}

	.content {
		display: flex;
		height: 94vh;
		flex-direction: column;
		/* padding: 20rpx 0; */
		box-sizing: border-box;
		// #ifndef H5
		height: 100vh;

		// #endif

	}

	.search {
		height: 35px;
		// #ifndef H5
		height: 90rpx;
		// #endif
		display: flex;
		width: 100%;
		background-color: #fff;
		padding: 20rpx 0;

		align-items: center;
	}

	.search1 {
		flex: 1
	}
</style>