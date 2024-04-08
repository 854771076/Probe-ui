<script>

	export default {
		onLaunch: function() {
			console.log('App Launch')

			
			this.$store.dispatch('auth/setUserInfo');
			// uni.$refresh_userinfo=setInterval(this.refreshUserInfo,30000)

		},
		
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
		    refreshUserInfo() {
		      this.$store.dispatch('auth/setUserInfo');
		    }
		  }
	}
</script>

<style>
	

	.card-price-text{
		color: orange;
		line-height: 40rpx;
		font-size: 30rpx;
	}
	.card-price-rate{
		
		height: 24rpx;
		line-height: 20rpx;
		font-size: 16rpx;
		text-align: center;
		background: rgba(0, 0, 0, 0.3);
		margin-right: 4rpx;
		padding: 2rpx 8rpx;
		box-sizing: border-box;
		position: absolute;
		
		bottom: 0;
		right: 0;
		z-index:100;
		margin:0
	}
	.card-price-difference{
		padding-right:20rpx ;
		font-size: 20rpx;
		
		color: #eb2715;
	}
	.uni-goods-nav {
		position: fixed;
		width: 100%;
		bottom: 0;
	}
	.card-price{
		height: 40rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		
	}
	.card-main {
		height: 100%;
		display: flex;
		flex: 1
	}

	.card-tags {
		display: flex;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
		height: 24rpx;
		z-index:100

	}

	.card-tag-exterior {
		/* flex: 1; */
		width: auto;
		height: 100%;
		line-height: 20rpx;
		font-size: 16rpx;
		text-align: center;
		background: rgba(0, 0, 0, 0.3);
		margin-right: 4rpx;
		padding: 2rpx 8rpx;
		z-index:100;
		box-sizing: border-box;
	}

	.card-title {
		font-size: 30rpx;
		width: 420rpx;
		white-space: nowrap;
		/* 文本不换行 */
		overflow: hidden;
		/* 溢出部分隐藏 */
		text-overflow: ellipsis;
		/* 溢出部分显示省略号 */
	}

	.card-tag-quality {
		/* flex: 1; */
		width: auto;
		z-index:100;
		height: 100%;
		line-height: 20rpx;
		font-size: 16rpx;
		text-align: center;
		background: rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
		padding: 2rpx 8rpx;

	}

	.card-tag-rarity {
		width: 10rpx;
		
		height: 100%;
		z-index:100
	}

	.container {
		height: 100vh;
		overflow-y: scroll;
	}

	.content {
		height:auto;
		// #ifndef H5
		padding: 20rpx;
		height: 100rpx;
		// #endif
		
	}

	.card-content {
		font-size: 30rpx;
		width: 420rpx;
		white-space: nowrap;
		/* 文本不换行 */
		overflow: hidden;
		/* 溢出部分隐藏 */
		text-overflow: ellipsis;
		/* 溢出部分显示省略号 */
	}

	.card {
		display: flex;
		position: relative;
		width: 100%;
		height: 180rpx;
		padding: 30rpx 20rpx;
		box-sizing: border-box;


	}

	.card-radio {
		height: 100%;
	}

	.card-img {
		position: relative;
		display: block;
		text-align: center;
		background: url(/static/images/item_bg.png);
		background-size: cover;
		width: 240rpx;
		margin-right: 30rpx;
	}

	.card-img>image {
		margin: 0 auto;
	}

	.card-body {
		flex: 1;
		position: relative;
	}

	.card-time {
		text-align: right;
		color: "#777";
		font-size: 20rpx;
		box-sizing: border-box;
		padding-right: 30rpx;
		position: absolute;
		bottom: 0;
		right: 0;

	}

	.time {
		text-align: right;
		color: "#777";
		font-size: 20rpx;
		padding: 10rpx;
		padding-left: 70rpx;
	}
</style>