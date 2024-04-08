### piaoyi-commentList 评论列表

**使用示例如下：**

```
<template>
	<view>
		<piaoyi-comment-list :apprises="apprises"></piaoyi-comment-list>
	</view>
</template>

<script>
	import piaoyiCommentList from '@/uni_modules/piaoyi-commentList/piaoyi-commentList.vue'
	export default {
		data() {
			return {
				apprises: [{
					avatarUrl: '', //头像
					name: '小红', //昵称
					commentStar: 5, //评分
					commentDate: '2023-06-09 15:00:00', //时间
					teachLevel: '一段简介', //描述简介
					appraises: ['认真敬业', '场地好', '热情周到'] // 标签
				},{
					avatarUrl: '',
					name: '小明',
					commentStar: 5,
					commentDate: '2023-06-09 15:00:00',
					teachLevel: '一段简介',
					appraises: ['认真敬业', '场地好', '热情周到']
				}, {
					avatarUrl: '',
					name: '小黑',
					commentStar: 5,
					commentDate: '2023-06-09 15:00:00',
					teachLevel: '一段简介',
					appraises: ['认真敬业', '场地好', '热情周到']
				},{
					avatarUrl: '',
					name: '小红',
					commentStar: 5,
					commentDate: '2023-06-09 15:00:00',
					teachLevel: '一段简介',
					appraises: ['认真敬业', '场地好', '热情周到']
				},{
					avatarUrl: '',
					name: '小明',
					commentStar: 5,
					commentDate: '2023-06-09 15:00:00',
					teachLevel: '一段简介',
					appraises: ['认真敬业', '场地好', '热情周到']
				}, {
					avatarUrl: '',
					name: '小黑',
					commentStar: 5,
					commentDate: '2023-06-09 15:00:00',
					teachLevel: '一段简介',
					appraises: ['认真敬业', '场地好', '热情周到']
				}]
			};
		},
		components: {
			piaoyiCommentList
		}
	}
</script>

<style lang="scss">

</style>
```

#### Prop

| 参数名称 | 描述                           |
| -------- | ------------------------------ |
| apprises | 评论数据，详细内容看上方示例代码 |

### 可接定制化组件开发
### 右侧有本人代表作小程序二维码，可以扫码体验
### 如使用过程中有问题或有一些好的建议，欢迎加QQ群互相学习交流：120594820