<template>
  <div>
    <div class="vux-demo">
      <h1>查看钱包 {{wallet.name}}</h1>
    </div>
    <group >
      <card  :header="{title: '币种：' + coinName }">
        <p slot="content" class="card-padding" style="margin:10px;font-size: 12px;">
          地址：{{wallet.address}}<br>
          余额：{{getCoinBalance(coinName, wallet.address) }}<br>
        </p>
      </card>
    </group>
    <box gap="10px 0px">
      <group>
        <x-input title="转账地址" v-model="address" placeholder="请输入转账地址"></x-input>
        <x-input title="数量" v-model="amount" placeholder="请输入金额"></x-input>
        <x-input title="手续费（Wei）" v-model="gas" placeholder="请输入手续费"></x-input>
        <x-input title="密码" v-model="password" placeholder="请输入密码"></x-input>

        <box gap="10px 10px">
          <x-button type="primary" action-type="button" @click.native="confirmTran">确定</x-button>
        </box>
      </group>
    </box>
  </div>
</template>

<script>
import { Box, Group, Card, XButton, Flexbox,
    FlexboxItem, AlertModule, Alert, XDialog, XInput } from 'vux'

export default {
  
  components: {
    Box,
    Group,
    XButton,
    Flexbox,
    FlexboxItem,
    Card,
    XDialog,
    XInput
  },
  data () {
    var wallet = this.getWallet(this.$route.params.name);
    if(!wallet) {
      AlertModule.show('找不到钱包');
      return false;
    }
    var coinName = this.$route.params.coinName;
    console.log("获取coinname的值：", coinName);

    return {
      wallet:wallet,
      coinName: coinName,
      password:'',
      amount:'',
      gas:'',
      address:''
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      // msg: 'Hello World!'
    }
  },
  methods: {
    validate:function () {
      if(!this.password) {
        AlertModule.show('请输入密码')
        return false
      }
      if(!this.amount) {
        AlertModule.show('请输入金额')
        return false
      }
      if(!this.address) {
        AlertModule.show('请输入地址')
        return false
      }
      if(!this.gas) {
        AlertModule.show('请输入手续费')
        return false
      }

      if( (parseFloat(this.gas)) < 21000) {
        AlertModule.show('最少需要支付 21000 wei 作为手续费')
        return false
      }

      // if( (parseFloat(this.amount) * 1.0e18 + parseFloat(this.gas)) >this.getWalletAmount(this.wallet.address, true)) {
      //   AlertModule.show('余额不足')
      //   return false
      // }

      return true
    },
    confirmTran:function() {
      if(!this.validate()) {
        return false
      }
      // this.erc20Tran();
      // return false;
      this.$vux.loading.show('转账中...');
      var that = this;
      setTimeout(function(){
        that.sendCoinTran(that.coinName, that.wallet,that.address,that.amount,that.gas, that.password, null, function(err, hash){
          that.$vux.loading.hide();
          if(err) {
            console.log('转账失败：', err)
            if(err.message==='invalid address') {
              AlertModule.show('账号不存在')
            } else if (err.message==='base fee exceeds gas limit') {
              AlertModule.show('手续费用超过限制')
            } else {
              AlertModule.show('转账错误：'+err.message)
            }
            return false;
          }
          
          AlertModule.show('转账已提交成功，交易hash：'+hash+'。')
        });
        
      },200);
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
