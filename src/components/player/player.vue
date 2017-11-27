<template>
    <div class="player" v-show="playList.length">
        <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leaveA" @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" alt="" width="100%" height="100%">
                </div>
                <div class="top">
                    <div class="back" @click="back"><i class="icon-back"></i></div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls"><img :src="currentSong.image" alt="" class="image"></div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{formatTime(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent"></progress-bar> 
                        </div>
                        <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i class="icon-sequence"></i>
                        </div>
                        <div class="icon i-left" :class="disable">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center" :class="disable">
                            <i @click="togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right" :class="disable">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i>
                        </div>    
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini" v-if="!fullScreen">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon"><img :class="cdCls" :src="currentSong.image" width="40" height="40" alt=""></div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control"><i @click.stop="togglePlaying" :class="miniIcon"></i></div>
                <div class="control"><i class="icon-playlist"></i></div>
            </div>
        </transition> 
        <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>    
    </div>
</template>

<script>
import progressBar from 'base/progress-bar/progress-bar'
import { mapGetters, mapMutations } from "vuex";
import animations from 'create-keyframe-animation'
export default {
  data(){
    return{
        songReady:false,
        currentTime:0
    }
  },  
  computed: {
      percent(){
          return this.currentTime/this.currentSong.duration
      },
      cdCls(){
          return this.playing?'play':'pause'
      },
      playIcon(){
          return this.playing?'icon-pause':'icon-play'
      },
      miniIcon(){
          return this.playing?'icon-pause-mini':'icon-play-mini'
      },
      disable(){
          return this.songReady?'':'disable'
      },
    ...mapGetters(["fullScreen", "playList", "currentSong","playing","currentIndex"])
  },
  watch:{
      currentSong(){
          this.$nextTick(()=>{
              this.$refs.audio.play()
          })
      },
      playing(newPlaying){
          const audio=this.$refs.audio;
          this.$nextTick(()=>{
              newPlaying?audio.play():audio.pause();
          })
      }
  },
  methods: {
    error(){
        this.songReady=true
        alert("error")
    },
    prev(){
        if(!this.songReady){
            return
        }
        let index=this.currentIndex-1;
        if(index===-1){
            index=this.playList.length-1
        }
        this.setCurrentIndex(index);
        if(!this.playing){
            this.togglePlaying()
        }
        this.songReady=false
    },
    next(){
        if(!this.songReady){
            return
        }
        let index=this.currentIndex;
        if(index===this.playList.length-1){
            index=0
        }else{
            index=index+1
        }
        this.setCurrentIndex(index);
        if(!this.playing){
            this.togglePlaying()
        }
        this.songReady=false
    },
    ready(){
        this.songReady=true
    },
    updateTime(e){
        this.currentTime=e.target.currentTime;
        // console.log(this.currentTime);
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlaying(){
        if(!this.songReady){
            return
        }
        this.setPlayingState(!this.playing)
        // this.songReady=false
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState:"SET_PLAYING_STATE",
      setCurrentIndex:"SET_CURRENT_INDEX"
    }),
    enter(el,done){
        const {x, y, scale} = this.getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 600,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter(){
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
    },
    leaveA(el,done){
        this.$refs.cdWrapper.style.transition='all 0.4s';
        const {x,y,scale}=this.getPosAndScale();
        this.$refs.cdWrapper.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend',done)
    },
    afterLeave(){
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style.transform= ''
    },
    formatTime(interval){
        this.interval=interval|0;
        const minute=interval/60|0
        const second=this._pad(interval%60|0)
        return `${minute}:${second}`
    },
    _pad(num,n=2){
        let len=num.toString().length;
        while(len<n){
            num="0"+num;
            len++
        }
        // console.log(num)
        return num
    },
    getPosAndScale(){
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
    }
  },
  components:{
      progressBar
  }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player 
    .normal-player 
        position: fixed
        left: 0
        right: 0
        top: 0
        bottom: 0
        z-index: 150
        background: $color-background

        .background 
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            z-index: -1
            opacity: 0.6
            filter: blur(20px)
        
        &.normal-enter-active,&.normal-leave-active
            transition :all 0.4s
            .top,.bottom
                transition :all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)
        &.normal-enter,&.normal-leave-to
            opacity :0
            visibility:hidden
            .top
                transform :translate3d(0,-100px,0)
            .bottom
                transform :translate3d(0,100px,0)
        .top 
            position: relative
            margin-bottom: 25px

            .back 
                position: absolute
                top: 0
                left: 6px
                z-index: 50

                .icon-back 
                    display: block
                    padding: 9px
                    font-size: $font-size-large-x
                    color: $color-theme
                    transform: rotate(-90deg)
                
            

            .title 
                width: 70%
                margin: 0 auto
                line-height: 40px
                text-align: center
                no-wrap()
                font-size: $font-size-large
                color: $color-text
            

            .subtitle 
                line-height: 20px
                text-align: center
                font-size: $font-size-medium
                color: $color-text
            
        

        .middle 
            position: fixed
            width: 100%
            top: 80px
            bottom: 170px
            white-space: nowrap
            font-size: 0

            .middle-l 
                display: inline-block
                vertical-align: top
                position: relative
                width: 100%
                height: 0
                padding-top: 80%

                .cd-wrapper 
                    position: absolute
                    left: 10%
                    top: 0
                    width: 80%
                    height: 100%

                    .cd 
                        width: 100%
                        height: 100%
                        box-sizing: border-box
                        border: 10px solid rgba(255, 255, 255, 0.1)
                        border-radius: 50%
                        &.play
                            animation:rotate 10s linear infinite
                        &.pause
                            animation-play-state :paused
                        .image 
                            position: absolute
                            left: 0
                            top: 0
                            width: 100%
                            height: 100%
                            border-radius: 50%
        .bottom 
            position: absolute
            bottom: 50px
            width: 100%
            .progress-wrapper
                display :flex
                align-items:center
                width:80%
                margin:0 auto
                padding:10px 0
                .time
                    color:$color-text
                    font-size:$font-size-small
                    flex:0 0 30px
                    line-height:30px
                    width:30px
                    &.time-l
                        text-align :left
                    &.time-r
                        text-align:right
                .progress-bar-wrapper
                    flex: 1
            .operators 
                display: flex
                align-items: center

                .icon 
                    flex: 1
                    color: $color-theme

                    &.disable 
                        color: $color-theme-d
                    
                    i 
                        font-size: 30px

                .i-left 
                    text-align: right

                .i-center 
                    padding: 0 20px
                    text-align: center

                    i 
                        font-size: 40px
                .i-right 
                    text-align: left
                

                .icon-favorite 
                    color: $color-sub-theme

    .mini-player 
        display: flex
        align-items: center
        position: fixed
        left: 0
        bottom: 0
        z-index: 180
        width: 100%
        height: 60px
        background: $color-highlight-background
        &.mini-enter-active,&.mini-leave-active
            transition :all 0.4s
        &.mini-enter,&.mini-leave-to
            opacity :0
            visibility:hidden
        .icon
            flex: 0 0 40px
            width: 40px
            padding: 0 10px 0 20px
            img
                border-radius :50%
                &.play
                    animation:rotate 10s linear infinite
                &.pause
                    animation-play-state :paused
        .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            .name
                margin-bottom: 2px
                no-wrap()
                font-size: $font-size-medium
                color: $color-text
            .desc
                no-wrap()
                font-size: $font-size-small
                color: $color-text-d
        .control
            flex: 0 0 30px
            width: 30px
            padding: 0 10px
            .icon-play-mini, .icon-pause-mini, .icon-playlist
                font-size: 30px
                color: $color-theme-d
            .icon-mini
                font-size: 32px
                position: absolute
                left: 0
                top: 0
    @keyframes rotate 
        0%
            transform :rotate(0)
        100%
            transform :rotate(360deg)    
    
</style>