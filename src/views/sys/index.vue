<script>
import markClass from './markClass.vue'
import markStudy from './markStudy.vue'
import psd from './psd.vue'
import topic from './topic.vue'
import score from './score.vue'
import scene from './scene.vue'

export default {
  name: 'sysIndex',
  components: { markClass, psd, topic, score,markStudy,scene },
  data() {
    return {
      menu: [
        { 'name': '标识分类', id: 1, path: 'markClass' },
        { 'name': '标识学习', id: 6, path: 'markStudy' },
        { 'name': '认知考试', id: 2, path: 'topic' },
        { 'name': '场景考试', id: 3, path: 'scene' },
        { 'name': '成绩管理', id: 4, path: 'score' },
        { 'name': '密码管理', id: 5, path: 'psd' }
      ],
      id: 1,
      show: 'markClass'
    }
  },
  beforeDestroy() {

  },
  created() {

  },
  methods: {
    goToPath(item, index) {
      this.id = item.id
      this.show = item.path
    },
    loginOut(){
      this.$router.back()
    }
  }
}
</script>

<template>
  <div style="height: 100%;">
    <div class="navbar">
      <div class="flex">
<!--        <img style="width: 40px;height: 40px;"-->
<!--             src="@/assets/images/login.png"-->
<!--        />-->
        <div style="margin-left: 20px;  cursor: pointer;">安全标识识别管理后台</div>
      </div>
      <div style="padding-right: 20px" @click="loginOut"><el-button type="primary">退出登陆</el-button></div>
    </div>
    <div class="center">
      <div class="sidebar">
        <div v-for="(item,index) in menu" :key="index" class="item" @click="goToPath(item,index)"
             :class="id==item.id?'itembg':''"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="min">
        <!--        <education></education>-->
        <component v-bind:is="show"></component>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flex {
  display: flex;
  align-items: center;
}

.navbar {
  width: 100%;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #409EFF;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 20px;
  color: #FFFFFF;
}

.center {
  height: calc(100% - 70px);
  display: flex;
  //margin-top: 20px;
}

.sidebar {
  padding: 20px 20px 20px 0;
  color: #FFFFFF;
  -webkit-transition: width .28s;
  transition: width .28s;
  width: 200px !important;
  background-color: #ffffff;
  height: 100%;
  //border-radius: 0 10px 10px 0;
  //position: fixed;
  //font-size: 0;
  //top: 50px;
  //bottom: 0;
  //left: 0;
  z-index: 1001;
  overflow: hidden;
  -webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
  box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
}

.item {
  padding: 10px 0;
  border-radius: 0 10px 10px 0;
  padding-left: 20%;
  color: #333333;
  cursor: pointer;
}

.itembg {
  background-color: #409EFF;
  color: #FFFFFF;
  //transition: background-color 0.5s ease
}

.min {
  padding: 20px;
  width: 1700px;
}
</style>
