<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import mHeader from './components/m-header/m-header.vue'
import Tab from 'components/tab/tab.vue'
import Player from 'components/player/player'
export default {
  name: 'app',
  components:{
    mHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus">

</style>
