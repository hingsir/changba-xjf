<template>
  <div id="app">
    <div id="avatar">
      <img src="./assets/avatar.jpg" alt="">
    </div>
    <div class="song-list">
      <template v-for="(song, index) in shareState.songList">
        <dl @click="playCurSong(song)" :class="{'current': song.src == shareState.curSong.src}">
          <dt>{{shareState.songList.length - index}}</dt>
          <dd>{{song.songname}}</dd>
        </dl>
      </template>
    </div>
    <div class="footer">
      <Player></Player>
    </div>
  </div>
</template>

<script>
import Player from './components/Player.vue'
import store from './store'
export default {
  name: 'app',
  components: {
      Player
  },
  data () {
    return {
      shareState: store.state,
    }
  },
  methods: {
    playCurSong (song){
      this.shareState.curSong = song
      location.hash = this.shareState.songList.length - this.shareState.songList.indexOf(song)
    }
  },
  mounted: function(){
    scrollCurrentIntoView()
  },
  watch: {
    'shareState.curSong': function(value){
      this.$nextTick(function(){
        scrollCurrentIntoView()
        location.hash = this.shareState.songList.length - this.shareState.songList.indexOf(value)
      })
    }
  }
}
function scrollCurrentIntoView(){
  let current = document.querySelector('.current')
  if(!isInView(current)){
    document.querySelector('.current').scrollIntoView()
  }
}
function isInView(el){
  let ctxHeight = document.querySelector('.song-list').clientHeight
  let rect = el.getBoundingClientRect()
  if(rect.top < 0 || rect.top > ctxHeight - rect.height){
    return false
  }
  return true
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,body{
  height: 100%;
}
#app{
  position: relative;
  max-width: 600px;
  height: 100%;
  margin: 0 auto;
  font: 14px/1.2 'Microsoft Yahei';
}
#avatar{
  display: none;
}
.song-list{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 80px;
  width: 100%;
  color: #666;
  background: #fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
dl{
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 0;
  cursor: pointer;
}
dl:nth-child(odd){
  background: #f3f3f3;
}
dl.current{
  color: #31c27c;
}
dl dt{
  width: 40px;
  text-align: center;
}
dl dd{
  flex: 1;
}
.footer{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

</style>
