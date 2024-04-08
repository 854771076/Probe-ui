<template>
	<view class="searchBg" @click.passive="fuzzySearch_blur">
		<view class="search">
			
			<view class="searchTxt-box">
				<input style="margin-top: 4px;" type="text" placeholder="请输入搜索的饰品名称" v-model="Txt" class="searchTxt" @focus="fuzzySearch_focus"  @input="fuzzySearch_change" @click.stop="true">
			</view>
			<input type="button" class="searchBtn" v-model="btnTxt" @click="cancel" />
			
		</view>
		<view class="fuzzySearch" v-show="fuzzy_search" >
			<view v-for="(item,index) in fuzzy_search_list" :key="index">
				<tui-list-cell :hover="false">
					
					<view  :data-value="item.value" @click="fuzzySearch_click" v-html="item.name"></view >
				</tui-list-cell>
			</view>
			
		</view>
		<view class="hot-search" >
			<view class="search-title">
				热门搜索
			</view>
			<view class="hot-list">
				<view class="hot-item" v-for="(item,index) in hot" :key="index">
					<view  :data-value="item" @click="fuzzySearch_click" v-html="item"></view >
					<!-- {{item}} -->
				</view>
			</view>
		</view>
		<view class="history-search">
			<view class="search-title">
				<view >历史搜索</view>
				
				<view ><uni-icons type="trash" size="30rpx" @click="clearHistory"></uni-icons></view>
			</view>
			<view class="history-list">
				<view class="hot-item" v-for="(item,index) in history" :key="index">
					<!-- {{item}} -->
					<view  :data-value="item" @click="fuzzySearch_click" v-html="item"></view >
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {

		data() {
			return {
				btnTxt: "取消",
				Txt: '',
				hot: ["AK","蝴蝶刀"],
				history:uni.getStorageSync('search_history')||[],
				
				
				
				
				fuzzy_search:false,
				fuzzy_search_list:[]
			}
		},
		watch: {
			Txt(val) {
				if (val == '') {
					this.btnTxt = '取消'
				} else {
					this.btnTxt = '搜索'
				}
			}
		},
		onLoad() {

		},
		methods: {
			fuzzySearch_focus(){
				this.fuzzy_search=true
				
				
			},
			fuzzySearch_blur(){
				this.fuzzy_search=false
				
			},
			fuzzySearch_change(e){
				if(e.detail.value.length>=2){
					// #ifdef H5
					uni.$api.associatedWords(e.detail.value,(res)=>{
						console.log(res)
						this.fuzzy_search_list=res.data
					},(err)=>{
						console.error(err)
					})
					// #endif
					// #ifndef H5
					uni.$api.associatedWords(e.target.value,(res)=>{
						console.log(res)
						this.fuzzy_search_list=res.data
					},(err)=>{
						console.error(err)
					})
					// #endif
				}
				
			},
			fuzzySearch_click(e){
				
				let value=e.currentTarget.dataset.value
				value=e.currentTarget.dataset.value
				if(!this.history.includes(value)){
					this.history.push(value)
				}
				
				uni.setStorageSync('search_history',this.history)
				this.search(value)
			},
			//搜索,跳转
			search(keywords){
				uni.navigateTo({
				    url: '/pages/home/filter?keywords='+keywords,
				    
				});
			},
			
			//取消或开始查询,添加搜索记录
			cancel(){
				if (this.btnTxt== '取消'){
					uni.navigateBack({
						delta: 1
					});
				}else{
					if(!this.history.includes(this.Txt)){
						this.history.push(this.Txt)
					}
					
					uni.setStorageSync('search_history',this.history)
					this.search(this.Txt)
				}
			},
			clearHistory(){
				uni.showModal({
					title: '删除记录',
					content: '确认删除记录吗?',
					success:(e)=>{
						
						if(e.confirm){
							this.history=[]
							uni.removeStorageSync('search_history')
							
						}
						
					}
				})
			}
		}
	}
</script>

<style>

	.fuzzySearch{
		position: absolute;
		top:90rpx;
		width: 100%;
		
		background-color: #fff;
	}
	.searchBg {
		height: 100vh;
		background: #fff
	}

	.search {
		height: 90rpx;
		display: flex;
		margin: 0 30rpx;
		align-items: center;
	}

	.searchTxt-box {
		flex: 1;
		font-size: 28rpx;
		background: #f5f5f5;
		height: 60rpx;
		border-radius: 60rpx;
		line-height: 60rpx;
	}

	.searchTxt {
		margin-left: 30rpx
	}

	.searchBtn {
		width: 80rpx;
		font-size: 28rpx;
		text-align: center;
	}

	.hot-search {
		border-top: 1rpx solid #e5e5e5;
		padding: 0 30rpx 10rpx;
		border-bottom: 10rpx solid #f5f5f5;
		height: auto;
		overflow: hidden;
	}

	.search-title {
		height: 90rpx;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 90rpx;
		display: flex;
		justify-content: space-between;
	}
	.search-title>view{
		height: 90rpx;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 90rpx;
	}

	.hot-item {
		font-size: 28rpx;
		height: 48rpx;
		border: 1rpx solid #f5f5f5;
		float: left;
		color: #666;
		padding: 0 10rpx;
		line-height: 48rpx;
		margin-right: 10rpx;
		margin-bottom: 15rpx;
		border-radius: 4px;
	}

	.history-search {
		padding: 0 30rpx 10rpx;
		height: auto;
		overflow: hidden;
	}
</style>