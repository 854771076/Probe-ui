<template>
	<view class="headerSearch">
		<navigator class="searchBox" :url="skipUrl">
			<image src="./search_icon.png" mode=""></image>
			<!-- <navigator to="#"> -->
			{{value}}
			<!-- </navigator> -->
		</navigator>
	</view>
</template>

<script>
	
	export default {
	
		props: {
			// 左边标题栏
			skipUrl: {
				type: String,
				default: ""
			},
			value:{
				type: String,
				default: "搜索"
			}
	
		},
		data() {
			return {
	
			}
		},
		methods: {
	
	
		}
	
	}
	
</script>

<style scoped>
	.headerSearch {
		height: 35px;
		background: #fff;
		width: 100%;

		// #ifndef H5
		height: 110rpx;
		background: #fff;
		width: 100%;
		overflow: hidden;
		// #endif
		
	}

	.searchBox {
		width: 97%;
		height: 35px;
		background: #F4F4F4;
		font-size: 18px;
		color: #999;
		border-radius: 10rpx;
		margin: 0 auto;
		// #ifndef H5
		font-size: 28rpx;
		margin: 20rpx auto;
		// #endif
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.searchBox navigator {}

	.searchBox image {
		width: 18px;
		height: 18px;
		margin-right: 10rpx;
	}
</style>