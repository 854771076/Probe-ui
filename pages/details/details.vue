<template>
	<view class="goods-info">
		<view class="goods-info-bg"></view>
		<view class="card">

			<view class="card-main">
				<view class="card-img">
					<view class="card-tags">
						<view class="card-tag-rarity" :style="rarityColor(detail.rarity)" v-if="detail.rarity"></view>
						<view class="card-tag-exterior" :style="exteriorColor(detail.exterior)" v-if="detail.exterior">
							{{detail.exterior}}
						</view>
						<view class="card-tag-quality" :style="qualityColor(detail.quality)" v-if="detail.quality">
							{{detail.quality.split(' ')[0]}}
						</view>
					</view>
					<view class="card-price-rate " v-if="info.price_rate>=0" style="color:#15cc4a">
						{{`${(info.price_rate*100).toFixed(2)}%`}}
					</view>
					<view class="card-price-rate " v-else style="color:#ffbb00">
						{{`${(info.price_rate*100).toFixed(2)}%`}}
					</view>
					<image :src="detail.icon_url" alt="加载中..." :style="{ width: '70%', height: '100%' }"></image>
				</view>
				<view class="card-body">
					<uni-tooltip :content="detail.name" placement="bottom">
						<view class="card-title">{{detail.name}}</view>
					</uni-tooltip>


					<view class="card-price">
						<view class="card-price-text">￥{{info.price}}</view>

					</view>
					<!-- <view class="card-content">{{detail.content}}</view> -->
					<view class="card-time">{{timeformet(info.update_time)}}</view>
				</view>
			</view>


		</view>


		<view class="price-card">
			<tui-tabs :tabs="tabs" :currentTab="currentTab" itemWidth="50%" @change="change"
				backgroundColor="transparent" color='white' :unlined="true" :isSlider="false"></tui-tabs>
			<view class="price-info">

				<view class="info-data">
					<view class="info-data-item">
						<view v-if="info.buy_max_price">最高买价：{{info.buy_max_price}}</view>
						<view v-if="info.buy_num">购买数量：{{info.buy_num}}</view>
					</view>
					<view class="info-data-item">
						<view v-if="info.sell_min_price">最低卖价：{{info.sell_min_price}}</view>
						<view v-if="info.sell_num">卖出数量：{{info.sell_num}}</view>
					</view>
				</view>
				<view class="info-none" v-if="!info">
					暂无数据...
				</view>
			</view>

		</view>
		<view class="btn">
			<uni-fav :checked="detail.is_star" class="favBtn" :circle="true" bg-color="rgb(69 127 197)"
				bg-color-checked="#007aff" fg-color="#ffffff" fg-color-checked="#ffffff" @click="starClick" />
		</view>
	</view>
	<view style="height: 750rpx;padding:0 0 0 50rpx;">
		<l-echart ref="chart"></l-echart>
	</view>
	<CComment ref="ccRef" v-model:tableData="items" v-model:tableTotal="total" v-model:item_id="item_id"
		@deleteFun="deleteComment" @updateData="getpage(1)"></CComment>
</template>

<script>
	import CComment from "@/components/cc-comment/index"
	import * as echarts from 'echarts';
	export default {
		onLoad(options) {
			// 获取GET参数
			this.item_id = options.item_id;

		},
		onReachBottom() {
			this.getpage(this.nextPage)

		},
		async mounted() {
			this.historyClick()
			this.getpage(1)
			this.getDetail()
			this.getHistoryPrice()
			


		},
		data() {
			return {
				item_id: "",
				items: [],
				detail: {
					name: ''
				},
				total: 0,
				has_next: true,
				pagesize: 20,
				nextPage: 2,
				currentTab: 0,
				info: {},
				tabs: [{
					name: "BUFF",
					key: "buff_csgo"
				}, {
					name: "STEAM",
					key: "steam_csgo"
				}, {
					name: "悠悠有品",
					key: "uuyp_csgo"
				}, {
					name: "IGXE",
					key: "igxe_csgo"
				}, {
					name: "C5game",
					key: "c5_csgo"
				}],
				name:{
					buff_csgo: "BUFF",
					steam_csgo:"STEAM",
					uuyp_csgo:"悠悠有品",
					igxe_csgo:"IGXE",
					c5_csgo:"C5game"
				},
				history_price: {},
				option: {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['BUFF', 'STEAM', '悠悠有品', 'IGXE', 'C5game']
					},
					// grid: {
					// 	left: '3%',
					// 	right: '4%',
					// 	bottom: '3%',
					// 	containLabel: true
					// },
					xAxis: {
						type: 'category',
						// boundaryGap: false,
						data: this.getDatesFromPast(7)
					},
					yAxis: {
						type: 'value'
					},
					series: []
				}
			};

		},
		methods: {
			getHistoryPrice() {
				uni.$api.getGoodsHistoryList({
						item_id: this.item_id,
						days: 7
					},
					(res) => {
						console.log(res.data)
						this.history_price = res.data
						for (let key in this.history_price) {
							var values=[]
							this.history_price[key].forEach(e => {
								values.push(parseFloat(e.price))
							});
							this.option.series.push({
								name: this.name[key],
								type: 'line',
								data:values
							})
						}
						this.$refs.chart.init(echarts, chart=> {
							chart.setOption(this.option);
						});

					},
					(err) => {
						console.error(err)

					})
			},
			getDatesFromPast(days) {
			    var today = new Date();
			    var dates = [];
			
			    // 循环生成日期列表
			    for (var i = days - 1; i >= 0; i--) {
			        var pastDate = new Date(today);
			        pastDate.setDate(today.getDate() - i);
			        var dateStr = pastDate.toISOString().split('T')[0]; // 获取日期字符串，格式为YYYY-MM-DD
			        dates.push(dateStr);
			    }
			
			    return dates;
			},
			historyClick() {
				uni.$api.addHistory(this.$store, this.item_id, (res) => {


				}, (err) => {
					console.error(err)

				})
			},
			starClick() {
				uni.$api.addStar(this.$store, this.item_id, (res) => {
					this.detail.is_star = !this.detail.is_star
					if (this.detail.is_star) {
						uni.showToast({
							title: '收藏成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: '取消成功',
							icon: 'success'
						});
					}

				}, (err) => {
					console.error(err)
					uni.showToast({
						title: '收藏失败',
						icon: 'error'
					});
				})
			},
			change(e) {
				this.currentTab = e.index
				var info = this.detail[this.tabs[e.index].key] || []

				if (info.length != 0 && e.index != 0) {
					this.info = info[0]
				} else if (e.index == 0) {
					this.info = this.detail
				} else {
					this.info = false
				}
				console.log(this.info)
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

			timeformet(time) {
				return uni.$tui.getCurrentDateTimeString(new Date(time))
			},
			async getDetail() {
				await uni.$api.getGoodsDetail(this.$store, this.item_id, (res) => {
					this.detail = res.data
					this.info = this.detail
					console.log(this.detail)
				}, (err) => {
					console.error(err)
					uni.showToast({
						title: '加载失败',
						icon: 'error'
					});
				})

			},
			deleteComment(id) {
				console.log(id)
				uni.$api.deleteCommentById(this.$store, id, (res) => {
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
				}, (err) => {
					console.error(err)
					uni.showToast({
						title: '删除失败',
						icon: 'error'
					});
				})
				this.getpage(1)




			},
			async getpage(page) {
				if (this.has_next || page == 1) {
					await uni.$api.commentsList(this.$store, {
						item_id: this.item_id,
						page: page,
						ordering: '-last_update,-create_time'
					}, (res) => {

						if (res.data.length < this.pagesize) {
							this.no_more = true
							this.has_next = false
							if (page == 1) {
								this.items = res.data
								this.total = res.total
							} else {
								this.items = this.items.concat(res.data)
							}
						} else {
							this.no_more = false
							if (page == 1) {
								this.items = res.data
								this.total = res.total
								this.nextPage = 2
							} else {
								this.items = this.items.concat(res.data)
								this.nextPage++
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
		},
		components: {

			CComment
		}
	}
</script>

<style lang="scss" scoped>
	.info-data-item {
		display: flex;
		justify-content: space-between;
		align-content: center;


	}

	.btn {
		padding: 50rpx 70rpx 0px 70rpx;
	}

	.price-info {
		color: white;
		height: 70rpx;
		box-sizing: border-box;
		padding: 0 70rpx;
		font-size: 20rpx;
	}

	.tag {
		width: 40px;
		height: 25px;
		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 8px;
	}

	.buff {
		background-color: #21212b;
	}

	.steam {
		background-color: #071936;
	}

	.uuyp {
		background-color: #141213;
	}

	.c5 {
		background-color: #1d2935;
	}

	.igxe {
		background-color: #037ffb;
	}

	.price-card {}

	.goods-info-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 500rpx;
		background: url(/static/images/header-bg_csgo.jpg);
		background-size: cover;
		z-index: -100;
	}

	.goods-info {
		width: 100%;
		height: 500rpx;
		background-color: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(15px);
		position: relative;
		z-index: 1;
	}

	.goods-info .card-title,
	{
	color: white;
	}

	.goods-info .card-time {
		color: white;
	}

	.card-title {
		font-size: 30rpx;
		width: 420rpx;
		white-space: break-spaces !important;
		/* 文本不换行 */
		overflow: unset;
		/* 溢出部分隐藏 */
		text-overflow: unset;
		/* 溢出部分显示省略号 */
	}
</style>