# cc-rightPopup

#### 使用方法 
```使用方法
 <!-- pop-show:是否显示弹框 isSingleSel：是否单选 color:主题色 classList：分类数组 @changeClick：数据发生变化 @sureClick：筛选确认 @hideClick：隐藏事件  -->
<cc-rightPopup :pop-show="popShow" :colors="colors" :classList="classList" @sureClick="sureClick"
	@hideClick="hideright"></cc-rightPopup>	

// 数据发生变化
changeClick(arr) {
	// 适配小程序 样式需要在父级改变
	this.classList = arr;
},
// 隐藏处理				
hideright() {
	this.popShow = false;
},

// 筛选确认 
sureClick(paramDict, selArr) {

		this.popShow = false;
		uni.showModal({
			title: '筛选数据',
		    content: '筛选价格数据 = ' + JSON.stringify(paramDict) + ' 筛选按钮数据= ' + JSON.stringify(selArr)
		})

}

```

#### HTML代码实现部分
```html
<template>
	<view class="content">

		<button style="margin: 60px 90px;" @click="showPopClick">点击弹框</button>

        <!-- pop-show:是否显示弹框  color:主题色 classList：分类数组 @changeClick：数据发生变化 @sureClick：筛选确认 @hideClick：隐藏事件  -->
		<cc-rightPopup :pop-show="popShow" :colors="colors" :classList="classList" @change="changeClick"
			@sureClick="sureClick" @hideClick="hideright"></cc-rightPopup>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				colors: '#fa436a',
				popShow: false,
				classList: [{
					name: '营业事件',
					id: 1,
					child: [{
						name: '0-5时',
						id: 10,
						current: true
					}, {
						name: '5-10时',
						id: 11,
						current: false

					}, {
						name: '10-14时',
						id: 12,
						current: false

					}, {
						name: '14-18时',
						id: 13,
						current: false

					}, {
						name: '18-22时',
						id: 14,
						current: false

					}, {
						name: '22-24时',
						id: 15,
						current: false

					}]
				}, {
					name: '用餐人数',
					id: 2,
					child: [{
							name: '单人餐',
							id: 20,
							current: false

						}, {
							name: '双人餐',
							id: 21,
							current: false

						}, {
							name: '3-4人餐',
							id: 22,
							current: false

						},
						{
							name: '5-10人餐',
							id: 23,
							current: false

						}
					]
				}],



			}
		},

		methods: {
			changeClick(arr) {
				// 适配小程序 样式需要在父级改变
				this.classList = arr;
			},
			showPopClick() {

				this.popShow = true;
			},

			hideright() {
				this.popShow = false;
			},

			sureClick(paramDict, selArr) {


				this.popShow = false;
				uni.showModal({
					title: '筛选数据',
					content: '筛选价格数据 = ' + JSON.stringify(paramDict) + ' 筛选按钮数据= ' + JSON.stringify(selArr)
				})

			}

		}
	}
</script>

<style>
	page {

		background-color: #f2f2f2;
		margin-bottom: 50px;
	}
</style>
```