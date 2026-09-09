<template>
  <div id="app">
    <router-view />
    <audio id="bgmusic" src="./assets/bg.mp3"  loop style="display: none;"></audio>
<!--    <audio-->
<!--      loop="loop"-->
<!--      preload="preload"-->
<!--      id="bgmusic"-->
<!--      controls="controls"-->
<!--      ref="MusicPlay"-->
<!--      style="display: none;"-->
<!--    >-->
<!--    </audio>-->
    <audio id="bgmusic2" src="./assets/success.mp3"  style="display: none;"></audio>
<!--    <audio-->
<!--      preload="preload"-->
<!--      id="bgmusic2"-->
<!--      controls="controls"-->
<!--      ref="MusicPlayTwo"-->
<!--      style="display: none;"-->
<!--    >-->
<!--    </audio>-->
  </div>
</template>

<script>
import {deviceHeartBeat, getLoginStatus} from "@/api/login";
import {getToken, setToken} from "@/utils/auth";
import router from "@/router";

export default {
  name: 'App',
  data(){
    return{
    }
  },
  beforeDestroy(){
    // this.$refs.MusicPlay.pause();
  },
  watch:{
    // '$route.path':{
    //   handler(newRoute,oldRoute){
    //     let routerArry = ['/login','/index2','/identifierExam2','/','/identifierStudy']
    //     console.log(routerArry.includes(newRoute))
    //     if(routerArry.includes(newRoute)){
    //       console.log(newRoute)
    //       clearInterval(this.deviceHeartBeatIntervalId);
    //     }else{
    //       console.log(newRoute)
    //       let isData = store.get('activateData');
    //       this.deviceHeartBeatIntervalId = setInterval(() => {
    //         console.log(isData.registerCode)
    //         deviceHeartBeat({device_sn:isData.registerCode}).then(res=>{
    //         })
    //       }, 5000); // 5000毫秒，即5秒
    //     }
    //     console.log('当前路由发生变化');
    //     console.log('新的路由信息：', newRoute);
    //     console.log('旧的路由信息：', oldRoute);
    //   }
    // }
  },
  created() {

  },
  mounted() {

  },
  methods:{
    payOne(){
      const audio = document.getElementById('bgmusic');
      // audio.playbackRate = 0.5;
      audio.volume = 0.5;
      audio.play()
    },
    pay(){
      console.log('333')
      let bgmusic2 = document.getElementById('bgmusic2');
      bgmusic2.play();
    }
  }
}
</script>
