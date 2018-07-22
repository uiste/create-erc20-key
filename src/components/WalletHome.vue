<template>
  <div style="padding-bottom:50px">
    <div class="vux-demo">
      <h1>数字钱包</h1>
    </div>
    <group v-for="wallet in getWallets()">
      <card :header="{title: '钱包：' + wallet.name }">
        <p slot="content" class="card-padding" style="margin:10px;" @click="routerTo(wallet.name)">
          地址：{{sliceAddr(wallet.address)}}
          <br>
        </p>
      </card>
    </group>
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
          <x-button type="primary" link="/wallet/create">新建钱包</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn" link="/wallet/import">导入钱包</x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>
<script>
import {
  Box,
  Group,
  Card,
  XButton,
  Flexbox,
  FlexboxItem,
  AlertModule,
  Alert
} from 'vux'

export default {
  components: {
    Box,
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    Card
  },
  data() {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      // msg: 'Hello World!'
    }
  },
  methods: {
    routerTo: function(name) {
      console.log('router to ' + name);
      this.$router.push('/wallet/view/' + name)
    }
  }
}

</script>
<style>
.vux-demo {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px
}

</style>
