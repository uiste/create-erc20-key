<template>
  <tabbar style="position:fixed;">
      <tabbar-item  link="/wallet/home" v-bind:selected="itemSelected('/wallet/home')">
        <span slot="label">钱包</span>
      </tabbar-item>
      <tabbar-item  >
        <span slot="label">行情</span>
      </tabbar-item>
    </tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'

export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      // msg: 'Hello World!'
    }
  },
  methods: {
    itemSelected: function (path) {
      return path === this.$router.path
    }
  }
}
</script>