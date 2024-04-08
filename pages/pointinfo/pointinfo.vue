<template>
	<view>
		<uni-section class="mb-10" title="VIP 积分规则" sub-title="欢迎使用我们的网站服务。以下是我们的VIP 积分规则，请仔细阅读：" type="line"></uni-section>
		<uni-section class="mb-10" title="概述" type="line"
			padding="0 0 5px 10px">VIP 积分规则用于确定用户的 VIP 等级，根据用户的积分和当前是否为 VIP 用户来决定其 VIP 等级。</uni-section>
		<uni-section class="mb-10" title="规则说明" type="line"
				padding="0 0 5px 10px">
		* 如果用户的积分小于 10，并且当前为 VIP 用户，则其 VIP 等级为 1。<br />
		* 如果用户的积分大于等于 10，但小于 30，则其 VIP 等级为 2。<br />
		* 如果用户的积分大于等于 30，但小于 50，则其 VIP 等级为 3。<br />
		* 如果用户的积分大于等于 50，但小于 70，则其 VIP 等级为 4。<br />
		* 如果用户的积分大于等于 70，但小于 90，则其 VIP 等级为 5。<br />
		* 如果用户的积分大于等于 90，但小于 150，则其 VIP 等级为 6。<br />
		* 如果用户的积分大于等于 150，但小于 200，则其 VIP 等级为 7。<br />
		* 如果用户的积分大于等于 200，但小于 500，则其 VIP 等级为 8。<br />
		* 如果用户的积分大于等于 500，则其 VIP 等级为 9。		
		</uni-section>
		<uni-section class="mb-10" title="VIP特权" type="line"
			padding="0 0 5px 10px">
			* vip2以上：查看steam自己账号饰品列表权限开放<br />
			* vip5以上：查看捡漏列表权限开放<br />
			* vip8以上：下载搜索数据权限开放
			
		</uni-section>
		<uni-section class="mb-10" title="积分获取" type="line"
			padding="0 0 5px 10px">
			* 每日签到，0.5积分<br />
			* 邀请好友，一级：10积分；二级：3积分；三级1积分<br />
			* 充值：1积分=1RMB`
			
		</uni-section>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>