<template>
	<view class="content">
		<div v-for="(announcement, index) in announcements" :key="index" class="card2 mb-3">
			<div class="card2-body">
				<h5 class="card2-title">
					<uni-icons type="info" size="25"></uni-icons>
					{{ announcement.title }}
				</h5>
				<p class="card2-text">{{ announcement.content }}</p>
				<p class="card2-text">
					<small class="text-muted">
						发布时间: {{time(announcement.create_time) }}
					</small>
				</p>
			</div>
		</div>
	</view>
</template>

<script>
	
	export default {
		onShow(){
			this.getData()
		},
		data() {
			return {
				announcements: [],
			}
		},
		methods: {
			time(date){
				let d=new Date(date)
				return uni.$tui.getDateTimeString(d)
			},
			getData(){
				uni.$api.getAnnouncements((res)=>{
					this.announcements=res.data
				},(err)=>{
					
				})
			}
		}
	}
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
}

.card2 {
    border: 2px solid #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
	padding: 10rpx;
	box-sizing: border-box;
}

.card2-title {
    font-size: 1.5rem;
    color: #333;
}

.card2-text {
    font-size: 1.2rem;
    color: #666;
}

h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
}

/* 添加悬停效果 */
.card2:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 添加背景颜色 */
body {
    background-color: #f9f9f9;
}
.content {
		display: flex;
		height: 89vh;
		flex-direction: column;
		padding: 20rpx;
		box-sizing: border-box;
		// #ifndef H5
		height: 100vh;

		// #endif

	}
</style>