<template>
  <div id="app">
    <router-view></router-view>
    <bottom-menu></bottom-menu>
  </div>
</template>

<script>
import BottomMenu from './components/BottomMenu'
export default {
  name: 'app',
  components: {
    'bottom-menu': BottomMenu
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
