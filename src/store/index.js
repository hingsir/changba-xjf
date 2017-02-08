let songList =  require('../data.js').filter(item => item.type === 'MP3')
let idx = location.hash ? +location.hash.substring(1) || 0 : 0
if(idx > songList.length || idx <= 0){
  idx = songList.length
}
idx = songList.length - idx
export default {
  state: {
    songList: songList,
    curSong: songList[idx]
  }
}
