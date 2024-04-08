<template>
	<view class="content">
		<!-- 自定义顶部搜索框 用于搜索跳转 skipUrl:跳转url为绝对路径 /pages开头 -->
		<!-- <cc-headSearch skipUrl="/pages/home/search"></cc-headSearch> -->

		<view class="search">
			<cc-headSearch class="search1" skipUrl="/pages/home/search" :value="filter_data.keyWords"></cc-headSearch>

			<view class="search-btn" @click="showPopClick">
				<uni-icons type="settings" size="30" color="#ffaa00"></uni-icons>
			</view>
		</view>

		<scroll-view :scroll-y="true" :scroll-x="false" class="mui-content-padded" @scrolltolower="lower">

			<view v-for="(card,index) in items" :key="card.item_id" class="card-list">
			
			
				<view class="card" @click="ToDetail(card.item_id)">
					
					<view class="card-main" >
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
		<view class="download" @click="download"><uni-icons type="cloud-download" size="30" color="#fff"></uni-icons>
		</view>
		

	</view>
	
	<cc-rightPopup :pop-show="popShow" :colors="colors" :classList="classList" @sureClick="sureClick"
		@hideClick="hideright" :isSingleSel="true" :value="filter_data.keyWords"></cc-rightPopup>
</template>

<script>


	export default {
		
		onLoad(options) {
			// 获取GET参数
			this.filter_data.keyWords = options.keywords;

		},
		mounted() {
			this.getpage(1)
		},
		data() {
			return {
				items: [

				],
				filter_data: {
					col:"steam",
					minPrice: "0",
					maxPrice: "1000000",
					keyWords: "",
					exterior: "",
					quality: "",
					rarity: "",
					type: ""
				},
				colors: '#ffb700',
				popShow: false,
				no_more:false,
				classList: [{
						name: "平台",
						id: 5,
						child: [

							{
								name: 'steam',
								id: 50,
								current: true
							}, {
								name: 'buff',
								id: 51,
								current: false
							}, {
								name: 'uuyp',
								id: 52,
								current: false
							}, {
								name: 'c5',
								id: 53,
								current: false
							}, {
								name: 'igxe',
								id: 54,
								current: false
							}
						]
					},
					{
						name: '外观',
						id: 1,
						child: [{
							name: '不限',
							id: 10,
							current: true
						}, {
							name: '崭新出厂',
							id: 11,
							current: false
						}, {
							name: '略有磨损',
							id: 12,
							current: false

						}, {
							name: '久经沙场',
							id: 13,
							current: false

						}, {
							name: '破烂不堪',
							id: 14,
							current: false

						}, {
							name: '战痕累累',
							id: 145,
							current: false

						}]
					}, {
						name: '质量',
						id: 2,
						child: [{
								name: '不限',
								id: 20,
								current: true

							}, {
								name: '普通',
								id: 21,
								current: false

							}, {
								name: '纪念品',
								id: 22,
								current: false

							},
							{
								name: '★',
								id: 23,
								current: false

							},
							{
								name: 'StatTrak™',
								id: 24,
								current: false

							},
							{
								name: '★ StatTrak™',
								id: 25,
								current: false

							}
						]
					},
					{
						name: '品质',
						id: 3,
						child: [{
								name: '不限',
								id: 30,
								current: true

							},
							{
								name: '隐秘',
								id: 31,
								current: false

							},
							{
								name: '大师',
								id: 32,
								current: false

							},
							{
								name: '违禁',
								id: 33,
								current: false

							},
							{
								name: '奇异',
								id: 34,
								current: false

							},
							{
								name: '消费级',
								id: 35,
								current: false

							},
							{
								name: '普通级',
								id: 36,
								current: false

							},
							{
								name: '高级',
								id: 37,
								current: false

							},
							{
								name: '工业级',
								id: 38,
								current: false

							},
							{
								name: '军规级',
								id: 39,
								current: false

							},
							{
								name: '卓越',
								id: 310,
								current: false

							},
							{
								name: '保密',
								id: 311,
								current: false

							},
						]
					},
					{
						name: '类型',
						id: 4,
						child: [{
								name: '不限',
								id: 40,
								current: true

							},
							{
								name: '匕首',
								id: 41,
								current: false

							},
							{
								name: '手套',
								id: 42,
								current: false

							},
							{
								name: '步枪',
								id: 43,
								current: false

							},
							{
								name: '手枪',
								id: 44,
								current: false

							},
							{
								name: '微型冲锋枪',
								id: 45,
								current: false

							},
							{
								name: '霰弹枪',
								id: 46,
								current: false

							},
							{
								name: '机枪',
								id: 47,
								current: false

							},
							{
								name: '其他',
								id: 48,
								current: false

							},
							{
								name: '印花',
								id: 49,
								current: false

							},
							{
								name: '探员',
								id: 410,
								current: false

							}
						]
					}
				],
				has_next: true,
				pagesize: 20,
				nextPage: 2,
				ordering: '-last_update,-create_time',
				pullText: '下拉刷新',
				pulling: false,
				scrollTop: 0,
				skipUrl: ''
				// 列表数组
			}
		},
		methods: {
			download() {
				uni.showModal({
					title: '下载',
					content: '下载查询数据,要求(vip8,1积分)',
					success: (e) => {

						if (e.confirm) {
							uni.$api.getGoodsDownloadList(this.$store, this.filter_data.col+'_csgo', {
								name: this.filter_data.keyWords,
								exterior: this.filter_data.exterior,
								quality: this.filter_data.quality,
								type: this.filter_data.type,
								rarity: this.filter_data.rarity,
								price_gte: this.filter_data.minPrice,
								price_lte:this.filter_data.maxPrice,
							},(res)=>{
								uni.showToast({
									title: res.msg,
									icon: 'success'
								});
							},(err)=>{
								uni.showToast({
									title: err.msg,
									icon: 'error'
								});
							})
						}

					}

				})
			},
			fliter(params) {
				this.filter_data = params
				console.log(params)
			},
			showPopClick() {

				this.popShow = true;
			},

			hideright() {
				this.popShow = false;
			},

			sureClick(paramDict, selArr) {

				this.popShow = false;
				this.fliter(paramDict)
				this.getpage(1)


			},
			lower() {
				this.getpage(this.nextPage)
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
					await uni.$api.getGoodsList(this.$store, this.filter_data.col+'_csgo', {
						name: this.filter_data.keyWords,
						page: page,
						exterior: this.filter_data.exterior,
						pagesize: this.pagesize,
						quality: this.filter_data.quality,
						type: this.filter_data.type,
						rarity: this.filter_data.rarity,
						price_gte: this.filter_data.minPrice,
						price_lte:this.filter_data.maxPrice,
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

			}

		}
	}
</script>

<style scoped>
	.card{
		background-color: #f7f7f7;
		cursor: pointer;
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
		position: relative;
		display: flex;
		height: 94.5vh;
		flex-direction: column;

		box-sizing: border-box;
		// #ifndef H5
		height: 100vh;

		// #endif
	}

	.uni-select__input-box {
		width: 45px;
	}

	.download {
		position: absolute;
		bottom: 50px;
		right: 10px;
		width: 40px;
		height: 40px;
		border-radius: 40px;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.search-btn {
		// #ifdef H5
		margin-right: 15px // #endif
	}

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
</style>