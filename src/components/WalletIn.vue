<template>
  <div>
    <div class="vux-demo">
      <h1>收款 {{wallet.name}}</h1>
    </div>
    <group >
      <card  :header="{title: wallet.name }">
        <p slot="content" class="card-padding" style="margin:10px;">
          地址：{{wallet.address[0] }}<br>
        </p>
      </card>
    </group>
    <box gap="10px 10px">
      <flexbox>
        <flexbox-item>
            <x-button type="primary" link="/wallet/income">复制地址</x-button>
          </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>

<script>

import { Box, Group, Card, XButton, Flexbox,
    FlexboxItem, AlertModule, Alert } from 'vux'

export default {
  components: {
    Box,
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    Card
  },
  data () {
    var wallet = this.getWallet(this.$route.params.name);
    if(!wallet) {
      AlertModule.show('找不到钱包');
      return false;
    }
    return {
      wallet:wallet
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      // msg: 'Hello World!'
    }
  },
  methods: {
    exportPrivateKey:function() {
      var pwd = promp('请输入密码','password');
    },
    exportKeyStore:function() {

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
