<template>
    <div>
        <div class="vux-demo">
            <h1>钱包 {{wallet.name}} 添加币种</h1>
        </div>
        <group>
            <card :header="{title: wallet.name }">
                <p slot="content" class="card-padding" style="margin:10px;">
                    地址：{{this.sliceAddr(wallet.address)}}<br>
                </p>
            </card>
        </group>
        <box gap="10px 0px">
            <group title="币种">
                <div v-for="coin in coins">
                    <x-switch v-bind:title="coin.name" :inline-desc="coin.address" v-model="coin.status" @click.native="onClick(wallet.name,coin.name)"></x-switch>
                </div>
            </group>
        </box>
    </div>
</template>
<script>
import { Box, XSwitch, Group, Cell, Card, AlertModule, XButton, } from 'vux'

export default {

    components: {
        Box,
        XSwitch,
        Group,
        Cell,
        Card,
        XButton,
    },
    data() {
        var wallet = this.getWallet(this.$route.params.name);
        if (!wallet) {
            AlertModule.show('找不到钱包');
            return false;
        }

        return {
            value: false,
            stringValue: '0',
            wallet: wallet,
            password: '',
            amount: '',
            gas: '',
            address: '',
            coins: this.getActiveCoins(wallet.name),
            // note: changing this line won't causes changes
            // with hot-reload because the reloaded component
            // preserves its current state and we are modifying
            // its initial state.
            // msg: 'Hello World!'
        }
    },
    methods: {
        onClick: function (wname,cname) {
          this.$vux.loading.show({
            text: 'in processing'
          })
          setTimeout(() => {
            console.log('obclick',cname,this.coins[cname], this.coins[cname].status)
            this.saveCoin(wname,cname,this.coins[cname].status)
            
            setTimeout(() => {
              this.$vux.loading.hide()
            },800)
          }, 200)
        },
        validate: function() {
            if (!this.password) {
                AlertModule.show('请输入密码')
                return false
            }
            if (!this.amount) {
                AlertModule.show('请输入金额')
                return false
            }
            if (!this.address) {
                AlertModule.show('请输入地址')
                return false
            }
            if (!this.gas) {
                AlertModule.show('请输入手续费')
                return false
            }

            if ((parseFloat(this.gas)) < 21000) {
                AlertModule.show('最少需要支付 21000 wei 作为手续费')
                return false
            }

            if ((parseFloat(this.amount) * 1.0e18 + parseFloat(this.gas)) > this.getWalletAmount(this.wallet.address, true)) {
                AlertModule.show('余额不足')
                return false
            }
            return true
        },
        confirmTran: function() {
            if (!this.validate()) {
                return false
            }
            this.$vux.loading.show('转账中...');
            var that = this;
            setTimeout(function() {
                that.tran(that.wallet, that.address, that.amount, that.gas, that.password, null, function(err, hash) {
                    that.$vux.loading.hide();
                    if (err) {
                        console.log('转账失败：', err)
                        if (err.message === 'invalid address') {
                            AlertModule.show('账号不存在')
                        } else if (err.message === 'base fee exceeds gas limit') {
                            AlertModule.show('手续费用超过限制')
                        } else {
                            AlertModule.show('转账错误：' + err.message)
                        }
                        return false;
                    }

                    AlertModule.show('转账已提交成功，交易hash：' + hash + '。')
                });

            }, 200);
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
