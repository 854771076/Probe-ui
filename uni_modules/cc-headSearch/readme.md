# cc-headSearch

####  自定义顶部搜索框 用于搜索跳转使用方法

```使用方法

	
<!-- 自定义顶部搜索框 用于搜索跳转 skipUrl:跳转url为绝对路径 /pages开头 -->
		
<cc-headSearch skipUrl="/pages/index/search"></cc-headSearch>



```

#### HTML代码实现部分
```html

<template>
	<view class="content">

		<!-- 自定义顶部搜索框 用于搜索跳转 skipUrl:跳转url为绝对路径 /pages开头 -->
		<cc-headSearch skipUrl="/pages/index/search"></cc-headSearch>


		<!-- 1.推荐流贷产品”“推荐固贷产品”“推荐供应链产品”“推荐综合服务” -->
		<div class="mui-content-padded">

			<!-- 列表组件 -->
			<CCBProjectList :productList="projectList" @click="goProDetail"></CCBProjectList>

		</div>



	</view>
</template>

<script>
	import CCBProjectList from '../../components/CCProjectList.vue';

	export default {
		components: {
			CCBProjectList
		},

		data() {
			return {

				skipUrl: '',
				// 列表数组
				projectList: []
			}
		},
		mounted() {
			this.requestData();
		},
		methods: {

			requestData() {

				// 模拟请求参数设置
				let reqData = {

					'area': '',
					"pageSize": 10,
					"pageNo": this.curPageNum
				}
				// 模拟请求接口
				this.totalNum = 39;
				this.projectList = [];
				for (let i = 0; i < 10; i++) {

					this.projectList.push({
						'proName': '商品名称' + i,
						'proUnit': '商品详情' + i,
						'area': '商品介绍',
						'proType': '优质',
						'stage': '七天无理由退货',
						'id': i + ''
					});
				}
			}


		}
	}
</script>

<style>
	page {

		background-color: #f7f7f7;
	}

	.content {
		display: flex;
		flex-direction: column;

	}

	.mui-content-padded {
		margin: 0px 14px;
		/* background-color: #ffffff; */
	}
</style>

```
