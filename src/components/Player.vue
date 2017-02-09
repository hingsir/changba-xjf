<template>
  <div class="vue-music-player">
    <div class="song-info">
      <div class="song-name">{{shareState.curSong.songname}}</div>
      <Spinner v-if="loading"></Spinner>
      <div class="song-time" v-if="!loading">{{time}}</div>
    </div>
    <div class="controls">
      <Control class="control control-prev" :handler="prev"></Control>
      <Control class="control" :class="'control-' + status" :handler="play_pause"></Control>
      <Control class="control control-next" :handler="next"></Control>
      <Control class="control control-mode" :class="'control-' + mode" :handler="switchMode"></Control>
    </div>
    <audio preload="none" :src="shareState.curSong.src" ref="audio" @playing="playing" @timeupdate="timeupdate" @ended="ended" @canplay="canplay"></audio>

  </div>
</template>

<script>
import Control from './Control.vue'
import Spinner from './Spinner.vue'
import store from '../store'

let playList = []
let status = ['play','pause']
let modes = ['loop','random','single']
make_looper(modes)

export default {
  name: 'player',
  components: {
      Control,
      Spinner
  },
  data () {
    return {
      time: '',
      status: 'play',
      mode: 'loop',
      loading: false,
      shareState: store.state
    }
  },
  methods: {
    canplay: function(e){
      this.time = formatTime(e.target.duration)
    },
    timeupdate: function(e){
      this.time = formatTime(e.target.duration - e.target.currentTime)
    },
    playing: function(e){
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    ended: function(){
      this.shareState.curSong = playList.next()
      this.play()
    },
    next: function(){
      if(this.mode === 'single'){
        this.setMode('random')
      }
      this.shareState.curSong = playList.next()
      this.play()
    },
    prev: function(){
      if(this.mode === 'single'){
        this.setMode('random')
      }
      this.shareState.curSong = playList.prev()
      this.play()
    },
    play: function(){
      this.loading = true
      this.status = 'pause'
      this.$refs.audio.autoplay = 'autoplay'
      this.$refs.audio.play()
    },
    pause: function(){
      this.loading = false
      this.status = 'play'
      this.$refs.audio.pause()
    },
    play_pause: function(){
      if(this.status == 'play'){
        this.play()
      }else{
        this.pause()
      }
    },
    switchMode: function(){
      var mode = modes.next()
      this.setMode(mode)
    },
    setMode: function(mode){
      if(mode === 'loop'){
        playList = this.shareState.songList.slice(0)
      }else if(mode === 'random'){
        playList = this.shareState.songList.slice(0).sort(function(){
          return Math.random() > 0.5 ? 1 : -1
        })
      }else if(mode === 'single'){
        playList = [this.shareState.curSong]
      }
      make_looper(playList, setCurrent)
      this.mode = mode
    }
  },
  watch: {
    'shareState.curSong': function(val){
      if(this.mode === 'single'){
        this.setMode('random')
      }
      playList.current(this.shareState.curSong.src)
      this.play()
    }
  },
  mounted (){
    this.$nextTick(function(){
      playList = this.shareState.songList
      make_looper(playList, setCurrent)
    })
  }
}

function setCurrent(src){
  var idx = 0
  this.forEach(function(item, index){
    if(src === item.src){
      return idx = index
    }
  })
  return idx
}

function make_looper(arr, setCurrent){

    arr.loop_idx = 0

    arr.current = function(current){
      if(current){
        this.loop_idx = setCurrent.call(this, current)
      }
      if( this.loop_idx < 0 ){
        this.loop_idx = this.length - 1
      }
      if( this.loop_idx >= this.length ){
        this.loop_idx = 0
      }
      return arr[ this.loop_idx ]
    }

    arr.next = function(){
      this.loop_idx++
      return this.current()
    }

    arr.prev = function(){
      this.loop_idx--
      return this.current()
    }
}

function formatTime(seconds){
  var min = ~~(seconds / 60)
  var sec = parseInt(seconds - min * 60)
  return min + ':' + ('00' + sec).substr(-2)
}

</script>
<style>
.vue-music-player{
  background: #31c27c;
  color: #fff;
}
.song-info{
  display: flex;
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
}
.song-info .song-name{
  flex: 1;
  overflow: hidden;
}
.song-info .song-time{
  width: 50px;
  text-align: right;
}
.controls{
  padding: 5px 0;
  font-size: 15px;
  text-align: center;
}
.controls .control{
  display: inline-block;
  width: 40px;
  height: 40px;
  margin: 0 5px;
  text-align: center;
  text-indent: -99999px;
  background-size: 100% 100%;
  cursor: pointer;
}
.controls .control-mode{
  position: absolute;
  width: 24px;
  height: 24px;
  right: 15px;
  bottom: 13px;
}
.controls .control-prev{
  background-image: url(../assets/prev.png)
}
.controls .control-next{
  background-image: url(../assets/next.png)
}
.controls .control-pause{
  background-image: url(../assets/pause.png)
}
.controls .control-play{
  background-image: url(../assets/play.png)
}
.controls .control-random{
  background-image: url(../assets/random.png)
}
.controls .control-single{
  background-image: url(../assets/single.png)
}
.controls .control-loop{
  background-image: url(../assets/loop.png)
}
</style>
