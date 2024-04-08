<template>
	<view>
		<!-- <ad-rewarded-video ref="adRewardedVideo" adpid="" :preload="false" :loadnext="false" :disabled="true"
			v-slot:default="{loading, error}" @load="onadload" @close="onadclose" @error="onaderror">
			<view class="ad-error" v-if="error">{{error}}</view>
		</ad-rewarded-video>
		<tui-section title="观看激励视频广告签到" is-line background="#fff"></tui-section> -->
		<!-- <uni-calendar class="uni-calendar--hook" :selected="info.selected" :showMonth="false" @change="showAd"
			@monthSwitch="monthSwitch" /> -->
		<uni-calendar class="uni-calendar--hook" :selected="info.selected" :showMonth="false" @change="submit"
			@monthSwitch="monthSwitch" />
	</view>
</template>

<script>
	/**
	 * 获取任意时间
	 */
	function getDate(date, AddDayCount = 0) {
		if (!date) {
			date = new Date()
		}
		if (typeof date !== 'object') {
			date = date.replace(/-/g, '/')
		}
		const dd = new Date(date)

		dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期

		const y = dd.getFullYear()
		const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return {
			fullDate: y + '-' + m + '-' + d,
			year: y,
			month: m,
			date: d,
			day: dd.getDay()
		}
	}
	export default {
		data() {
			return {
				info: {
					lunar: true,
					range: true,
					insert: false,
					selected: []
				},
				isLoading: false,
				clickItem: null,
			}
		},
		onReady() {
			this.$nextTick(() => {
				this.showCalendar = true
			})
			// this.isLoading = true;
			// this.$refs.adRewardedVideo.load();
			let date = getDate(new Date())
			this.updateData(date.year, date.month)
		},
		methods: {
			showAd(e) {
				if (this.isLoading) {
					return
				}
				this.clickItem = e
				this.$refs.adRewardedVideo.show();
			},
			updateData(year, month) {
				uni.$api.checkInList(this.$store, {
						year: year,
						month: month
					},
					(res) => {
						
						this.info.selected = res.data
					}, (err) => {
						uni.showToast({
							title: `数据加载失败`
						})
						console.error(err)
					}
				)
			},
			onadload(e) {
				this.isLoading = false;
				console.log('广告数据加载成功');
			},
			onadclose(e) {
				const detail = e.detail
				// 用户点击了【关闭广告】按钮
				if (detail && detail.isEnded) {
					// 正常播放结束
					console.log("onClose " + detail.isEnded);
					this.submit(this.clickItem)
				} else {
					// 播放中途退出
					console.log("onClose " + detail.isEnded);
				}
				//this.isLoading = true;
				//this.$refs.adRewardedVideo.load();
			},
			onaderror(e) {
				// 广告加载失败
				console.log(e.detail);
				this.isLoading = false;
			},
			async submit(e) {



				if (e.fulldate == getDate(new Date()).fullDate) {
					await uni.$api.checkIn(this.$store, {
						date: e.fulldate
					}, (res) => {
						
						this.updateData(e.year, e.month)
						this.$store.dispatch('auth/setUserInfo');
						uni.showToast({
							title: res.msg
						})
					}, (err) => {
						uni.showToast({
							title: err.msg
						})
					})
				} else {
					await uni.$api.checkIn(this.$store, {
						date: e.fulldate
					}, (res) => {
						
						this.updateData(e.year, e.month)
						uni.showToast({
							title: res.msg
						})
					}, (err) => {
						uni.showToast({
							title: err.msg
						})
					})
				}
			},
			monthSwitch(e) {
				this.updateData(e.year, e.month)
			}
		}
	}
</script>

<style>
	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.calendar-button {
		flex: 1;
		font-weight: bold;
		font-size: 32rpx;
	}
</style>