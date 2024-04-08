<template>
  <view class="c_total">评论 {{ props.tableTotal }}<span class="txt click" @click="() => newCommentFun()"><uni-icons type="chatboxes" size="20"></uni-icons>评论</span></view>
  
  <template v-if="tableData && tableData.length">
    <view class="c_comment" v-for="(item1, index1) in tableData" :key="item1.cid">
      <!-- 一级评论 -->
      <CommonComp
        :data="item1"
        @deleteClick="() => deleteClick({ item1, index1 })"
      />
    </view>
  </template>
  <!-- 空盒子 -->
  <view class="empty_box" v-else>
    <uni-icons type="chatboxes" size="36" color="#c0c0c0"></uni-icons>
    <view>
      <span class="txt"> 这里是一片荒草地, </span>
      <span class="txt click" @click="() => newCommentFun()">说点什么...</span>
    </view>
  </view>
  <!-- 评论弹窗 -->
  <uni-popup ref="cPopupRef" type="bottom" @change="popChange">
    <view class="c_popup_box">
      <view class="reply_text">
        <span  class="text_main">发表新评论</span>
      </view>
      <view class="content">
        <view class="text_area" style="margin-right: 10px;">
          <uni-easyinput
            class="text_area"
            type="textarea"
            v-model="commentValue"
            :placeholder="commentPlaceholder"
            :focus="focus"
            trim
            autoHeight
            maxlength="300"
          ></uni-easyinput>
        </view>
        <view class="send_btn" @tap="() => sendClick()">发送</view>
      </view>
    </view>
  </uni-popup>
  <!-- 删除弹窗 -->
  <uni-popup ref="delPopupRef" type="dialog">
    <uni-popup-dialog
      mode="base"
      title=""
      content="确定删除这条评论吗?"
      :before-close="true"
      @close="delCloseFun"
      @confirm="delConfirmFun"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script setup>
import CommonComp from "./componets/common";
import { reactive, ref, watch, computed, defineExpose } from "vue";
import { useStore } from 'vuex';

// 导入 useStore 函数来获取 Vuex 的 $store
const store = useStore();
const props = defineProps({
  /** 用户信息
   *    id: number // 用户id
   *    user_name: number // 用户名
   *    user_avatar: string // 用户头像地址
   */
  /** 评论列表
   *    id: number // 评论id
   *    parent_id: number // 父级评论id
   *    reply_id: number // 被回复人评论id
   *    reply_name: string // 被回复人名称
   *    user_name: string // 用户名
   *    user_avatar: string // 评论者头像地址
   *    user_content: string // 评论内容
   *    is_like: boolean // 是否点赞
   *    like_count: number // 点赞数统计
   *    create_time: string // 创建时间
   */
  item_id:{
	  type: String,
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  // 评论总数
  tableTotal: {
    type: Number,
    default: 0,
  },
  // 评论删除模式
  // bind - 当被删除的一级评论存在回复评论, 那么该评论内容变更显示为[当前评论内容已被移除]
  // only - 仅删除当前评论(后端删除相关联的回复评论, 否则总数显示不对)
  // all - 删除所有评论包括回复评论
  deleteMode: {
    type: String,
    default: "all",
  },
});
const emit = defineEmits([
  "update:tableTotal",
  // "likeFun", // 点赞事件
  // "replyFun", // 回复事件
  "deleteFun", // 删除事件
  "updateData"
]);




// 点赞
let setLike = (item) => {
  item.is_like = !item.is_like;
  item.like_count = item.is_like ? item.like_count + 1 : item.like_count - 1;
};
function likeClick({ item1, index1, item2, index2 }) {
  let item = item2 || item1;
  setLike(item);
  emit("likeFun", { params: item }, (res) => {
    // 请求后端失败, 重置点赞
    setLike(item);
  });
}

// 回复
let cPopupRef = ref(null); // 弹窗实例
let replyTemp = reactive({}); // 临时数据
function replyClick({ item1, index1, item2, index2 }) {
  replyTemp = JSON.parse(JSON.stringify({ item1, index1, item2, index2 }));
  cPopupRef.value.open();
}

// 发起新评论
let isNewComment = ref(false); // 是否为新评论
defineExpose({ newCommentFun });
function newCommentFun() {
  isNewComment.value = true;
  cPopupRef.value.open();
}

// 评论弹窗
let focus = ref(false);
function popChange(e) {
  // 关闭弹窗
  if (!e.show) {
    commentValue.value = ""; // 清空输入框值
    replyTemp = {}; // 清空被回复人信息
    isNewComment.value = false; // 恢复是否为新评论默认值
  }
  focus.value = e.show;
}
let commentValue = ref(""); // 输入框值
let commentPlaceholder = ref("说点什么..."); // 输入框占位符

// 发送评论
function sendClick() {
  let params = {};
  // 新评论
  params = {
	  item_id: props.item_id, // 评论id
	  content:commentValue.value
	};
   uni.$api.sendComment(store,params,(res)=>{
	   uni.showToast({
	   	title: '发送成功',
	   	icon: 'success'
	   });
	   
   },(err)=>{
	   
	  uni.showToast({
	  	title: '发送成功',
	  	icon: 'success'
	  });
   })
   emit("updateData")
   cPopupRef.value.close();

}

// 删除
const delPopupRef = ref(null);
let delTemp = reactive({}); // 临时数据
function deleteClick({ item1, index1, item2, index2 }) {
  delTemp = JSON.parse(JSON.stringify({ item1, index1, item2, index2 }));
  delPopupRef.value.open();
}
// 关闭删除弹窗
function delCloseFun() {
  delTemp = {};
  delPopupRef.value.close();
}
// 确定删除
function delConfirmFun({ item1, index1, item2, index2 } = delTemp) {
  let c_data =  props.tableData[index1];
  // 一级评论无回复, 直接删除
   emit("deleteFun", c_data.cid),
   emit("updateData")
   delCloseFun()
}

// 更多评论文字显示
function expandTxtShow({ item1, index1 }) {
  return (
    item1.childrenShow &&
    item1.childrenShow.length &&
    item1.children.length - item1.childrenShow.length
  );
}
// 展开更多评论
function expandReplyFun({ item1, index1 }) {
  let csLen = dataList.value[index1].childrenShow.length;
  dataList.value[index1].childrenShow.push(
    ...dataList.value[index1].children.slice(csLen, csLen + 6) // 截取5条评论
  );
}
</script>

<style lang="scss" scoped>
////////////////////////
.center {
  display: flex;
  align-items: center;
}
////////////////////////
.c_total {
  padding: 20rpx 30rpx 0 30rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
}
.empty_box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 150rpx 10rpx;
  font-size: 28rpx;
  .txt {
    color: $uni-text-color-disable;
  }
  .click {
    color: $uni-color-primary;
  }
}
.c_comment {
  padding: 20rpx 30rpx;
  font-size: 28rpx;

  .children_item {
    padding: 20rpx 30rpx;
    margin-top: 10rpx;
    margin-left: 80rpx;
    background-color: $uni-bg-color-grey;
    .expand_reply {
      margin-top: 10rpx;
      margin-left: 80rpx;
      .txt {
        font-weight: 600;
        color: $uni-color-primary;
      }
    }
  }
}
.c_popup_box {
  background-color: #fff;
  .reply_text {
    @extend .center;
    padding: 20rpx 20rpx 0 20rpx;
    font-size: 26rpx;
    .text_aid {
      color: $uni-text-color-grey;
      margin-right: 5rpx;
    }
    .text_main {
    }
  }
  .content {
    @extend .center;
    .text_area {
      flex: 1;
      padding: 20rpx;
    }
    .send_btn {
      @extend .center;
      justify-content: center;
      width: 120rpx;
      height: 60rpx;
      border-radius: 20rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: $uni-color-primary;
      margin-right: 20rpx;
    }
  }
}
</style>
