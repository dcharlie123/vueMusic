<template>
    <transition name="slide">
        <!-- <div class="singer-detail"></div> -->
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>  
    </transition>
</template>

<script>
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song.js'
import musicList from 'components/music-list/music-list'
    export default {
        data(){
            return{
                songs:[]
            }
        },
        computed:{
            title(){
                return this.singer.name
            },
            bgImage(){
                return this.singer.avatar
            },
            ...mapGetters(['singer'])
        },
        created(){
            // console.log(this.singer)
            this._getSingerDetail();
        },
        methods:{
            _getSingerDetail(){
                if(!this.singer.id){
                    this.$router.push('/singer')
                    return
                }
                getSingerDetail(this.singer.id).then((res)=>{
                    if(res.code===ERR_OK){
                        // console.log(res.data.list)
                        this.songs=this._normalizeSongs(res.data.list);
                        console.log(this.songs)
                    }
                })
            },
            _normalizeSongs(list){
                let ret=[];
                list.forEach((item)=>{
                    let {musicData}=item
                    if(musicData.songid&&musicData.albumid){
                        ret.push(createSong(musicData)) 
                    }
                })
                return ret
            }
        },
        components:{
            musicList
        }
    }
</script>

<style scoped lang="stylus">
    @import '~common/stylus/variable'
    // .singer-detail
    //     position: fixed
    //     z-index :100
    //     top:0
    //     left:0
    //     right:0
    //     bottom:0
    //     background :$color-background
    .slide-enter-active,.slider-leave-active
        transition:all 0.3s
    .slide-enter,.slide-leave-to
        transform :translate3d(100%,0,0);
</style>