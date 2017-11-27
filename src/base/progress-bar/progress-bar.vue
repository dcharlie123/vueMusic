<template>
    <div class="progress-bar" ref="progressBar">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" 
                 ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd"   
            >
                <div class="progress-btn"></div>
            </div>
        </div>    
    </div>
</template>

<script>
    const progressBtnWidth=16;
    export default {
        props:{
            percent:{
                type:Number,
                default:0
            }
        },
        watch:{
            percent(newPercent){
                if(newPercent>=0&&!this.touch.initiated){
                    const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth;
                    const offsetWidth=newPercent*barWidth;
                    this._offset(offsetWidth);
                }
            }
        },
        created(){
            this.touch={}
        },
        methods:{
            progressTouchStart(e){
                this.touch.initiated=true;//表示已经初始化
                this.touch.startX=e.touches[0].pageX
                this.touch.left=this.$refs.progress.clientWidth
            },
            progressTouchMove(e){
                if(!this.touch.initiated){
                    return
                }
                //x偏移
                const deltaX=e.touches[0].pageX-this.touch.startX
                const offsetWidth=Math.min(this.$refs.progressBar.clientWidth-progressBtnWidth,Math.max(0,this.touch.left+deltaX))
                this._offset(offsetWidth);
            },
            progressTouchEnd(e){
                this.touch.initiated=false
                this._triggerPercent();
            },
            _triggerPercent(){
                const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth;
                const percent=this.$refs.progess.clientWidth/barWidth
                this.$emit('percentChange',precent)
            },
            _offset(x){
                this.$refs.progress.style.width=`${x}px`;
                this.$refs.progressBtn.style.transform=`translate3d(${x}px,0,0)`;
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import "~common/stylus/variable"
    .progress-bar
        height:30px
        .bar-inner
            position:relative
            top: 13px
            height: 4px
            background: rgba(0, 0, 0, 0.3)
            .progress
                position: absolute
                height: 100%
                // width:10%
                background: $color-theme
            .progress-btn-wrapper
                position: absolute
                left: -8px
                top: -13px
                width: 30px
                height: 30px
                // background :red
                .progress-btn
                    position: relative
                    top: 7px
                    left: 7px
                    box-sizing: border-box
                    width: 16px
                    height: 16px
                    border: 3px solid $color-text
                    border-radius: 50%
                    background: $color-theme
</style>