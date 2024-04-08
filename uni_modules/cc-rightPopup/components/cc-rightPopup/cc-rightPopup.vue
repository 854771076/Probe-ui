<template>
	<scroll-view>

		<view class="mask" @tap="hideright" v-if="popShow == true"></view>

		<!-- 点击筛选弹出的右侧弹出窗口 -->
		<view :class="popShow == true ? 'right_popup':'hide_popup'">
			<view class="pop_scroll">
				<view class="top_price">
					<text class="top_priceText">关键词</text>

				</view>

				<view class="input_box">
					<uni-easyinput class="input_boxInput" v-model="paramDict.keyWords"
						placeholder="关键词"></uni-easyinput>

				</view>
				<view class="top_price">
					<text class="top_priceText">价格筛选</text>

				</view>

				<view class="input_box">
					<uni-easyinput class="input_boxInput" v-model="paramDict.minPrice"
						placeholder="最低价"></uni-easyinput>
					<text class="input_boxText">-</text>
					<uni-easyinput class="input_boxInput" v-model="paramDict.maxPrice"
						placeholder="最高价"></uni-easyinput>
				</view>
				<view v-for="(item, index) in classList" :key="index" class="allClass">
					<view class="classtext">{{item.name}}</view>
					<view class="class_box">
						<!-- 选中分类条件 -->
						<view v-for="(subItem, indexs) in item.child" :key="subItem.id" class="class_tag"
							:style="{'color':(subItem.current ? '#fff':'#333'),'background':(subItem.current ? colors:''),'border-color':subItem.current ? colors:''}"
							@tap="setClass(item,subItem,index,indexs)">{{subItem.name}}</view>
					</view>
				</view>
			</view>
			<view class="bottom_btn">
				<view class="reset bottom_btnView" :style="'color:' + colors + ';border-color:' + colors"
					@tap="onreset">重置</view>
				<view class="enter bottom_btnView" :style="'background:' + colors" @tap="onenter">确定</view>
			</view>
		</view>

	</scroll-view>
</template>

<script>
	export default {
		mixins: [{
			methods: {
				setData: function(obj, callback) {
					let that = this;
					const handleData = (tepData, tepKey, afterKey) => {
						tepKey = tepKey.split('.');
						tepKey.forEach(item => {
							if (tepData[item] === null || tepData[item] === undefined) {
								let reg = /^[0-9]+$/;
								tepData[item] = reg.test(afterKey) ? [] : {};
								tepData = tepData[item];
							} else {
								tepData = tepData[item];
							}
						});
						return tepData;
					};
					const isFn = function(value) {
						return typeof value == 'function' || false;
					};
					Object.keys(obj).forEach(function(key) {
						let val = obj[key];
						key = key.replace(/\]/g, '').replace(/\[/g, '.');
						let front, after;
						let index_after = key.lastIndexOf('.');
						if (index_after != -1) {
							after = key.slice(index_after + 1);
							front = handleData(that, key.slice(0, index_after), after);
						} else {
							after = key;
							front = that;
						}
						if (front.$data && front.$data[after] === undefined) {
							Object.defineProperty(front, after, {
								get() {
									return front.$data[after];
								},
								set(newValue) {
									front.$data[after] = newValue;
									that.$forceUpdate();
								},
								enumerable: true,
								configurable: true
							});
							front[after] = val;
						} else {
							that.$set(front, after, val);
						}
					});
					isFn(callback) && this.$nextTick(callback);
				}
			}
		}],
		mounted(){
			this.paramDict.keyWords=this.value
		},
		data() {
			return {

				paramDict: {
					minPrice: '0',
					maxPrice: '1000000',
					keyWords: ""
				}
			}
		},

		props: {
			value:{
				type:String,
				default:""
			},
			// 是否单选
			isSingleSel: {
				type: Boolean
			},
			// 菜单图标
			colors: {
				type: String,
				default: '#fa436a',
			},
			// 是否显示
			popShow: {
				type: Boolean,
				default: false,
			},
			// 分类数组
			classList: {
				type: Array
			}

		},
		methods: {


			hideright() {
				this.$emit("hideClick");

			},

			setClass(item, subItem, index, indexs) { //选择条件

				// 单选 清除所有选中
				if (this.isSingleSel) {

					let data = this.classList;
					let count = 0;
					data.forEach(e => {

						if (count == index) {
							e.child.forEach(ele => {
								ele.current = false;
							});
						}

						count++;
					});


				}

				subItem.current = !subItem.current;


				item.child[indexs] = subItem;
				let data = item;
				let newdata = 'classList[' + index + ']';
				this.setData({
					[newdata]: data
				});

				// 适配小程序
				this.$emit("change", this.classList);


			},

			onreset() { //重置筛选条件
				let data = this.classList;
				data.forEach(e => {
					e.child.forEach(ele => {
						ele.current = false;
					});
				});

				this.classList = data;
				this.paramDict = {};

				// 适配小程序
				this.$emit("change", this.classList);

			},

			onenter() { //确认筛选条件
				this.classList.forEach(e => {
					e.child.forEach(ele => {
						if (ele.current == true) {

							let type = String(ele.id)[0]
							if (type == "1") {
								this.paramDict.exterior = ele.name == "不限" ? "" : ele.name
							} else if (type == "2") {
								this.paramDict.quality = ele.name == "不限" ? "" : ele.name
							} else if (type == "3") {
								this.paramDict.rarity = ele.name == "不限" ? "" : ele.name
							} else if (type == "4") {
								this.paramDict.type = ele.name == "不限" ? "" : ele.name
							}else if (type == "5") {
								this.paramDict.col =  ele.name
							}
						}
					});
				})

				this.$emit("sureClick", this.paramDict)

			},
		}
	}
</script>

<style scoped>
	.mask {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 800;
	}

	/* 右侧弹出框 */
	.right_popup {
		width: 85%;
		height: 100%;
		position: fixed;
		right: 0;
		top: 0;
		// #ifdef H5
		top: 30px;

		// #endif
		background-color: #fff;
		z-index: 920;
		transition: all 0.3s;
	}

	.hide_popup {
		transition: all 0.3s;
		width: 85%;
		height: 100%;
		position: fixed;
		right: -100%;
		top: 0;
		z-index: 920;
		transition: all 0.3s;
		background-color: #fff;
	}

	.pop_scroll {
		/* #ifndef H5 */
		height: calc(90% - 135upx);
		margin-top: 60upx;
		/* #endif
		/* #ifdef H5 */
		height: calc(90% - 135upx);
		margin-top: 60upx;
		/* #endif
		overflow-y: auto;
		z-index: 1000;
	}

	.top_price {
		height: 60upx;
		line-height: 60upx;
		display: flex;
		padding: 0 30upx;
	}

	.top_priceText {
		flex: 1;
		text-align: left !important;
		font-size: 28upx;
		font-weight: bold;
		color: #333;
	}

	.input_box {
		padding: 0 30upx;
		height: 60upx;
		line-height: 60upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 30upx;
	}

	.input_boxText {
		color: #999;
	}

	.input_boxInput {
		flex: 1;
		max-width: 45%;
		height: 100%;
		background-color: #F7F7F7;
		border-radius: 40upx;
		box-sizing: border-box;
		text-align: center;
		font-size: 24upx;
	}

	.allClass {
		margin-top: 50upx;
		padding: 0 30upx;
	}

	.allClass .classtext {
		font-size: 28upx;
		font-weight: bold;
		color: #333;
	}

	.allClass .class_box {
		margin-top: 30upx;
		overflow: hidden;
	}

	.class_box .class_tag {
		margin-top: 10px;
		height: 60upx;
		line-height: 60upx;
		padding: 0 20upx;
		font-size: 26upx;
		color: #333;
		border: 1upx solid #999;
		text-align: center;
		border-radius: 10upx;
		float: left;
		margin-right: 20upx;
	}

	.bottom_btn {
		height: 10%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 30upx;
		margin-top: 0px;
	}

	.bottom_btnView {
		max-width: 45%;
		min-width: 45%;
		height: 72upx;
		line-height: 72upx;
		background-color: #FA436A;
		text-align: center;
		border-radius: 36upx;
		color: #fff;
	}

	.bottom_btn .reset {
		background-color: #fff;
		color: #FA436A;
		border: 1upx solid #FA436A;
	}
</style>