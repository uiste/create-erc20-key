<template>
    <div>
        <div class="center-title">
            <h1>钱包 {{wallet.name}}</h1>
        </div>
        <group>
            <card :header="{title: '钱包：' + wallet.address }"></card>
        </group>
        <group v-for="coin in localCoins">
            <card>
                <p slot="content" class="card-padding" style="margin:10px;" v-show="coin.status" @click="goOut(wallet.name,coin.name)">
                    币种：{{coin.name}}
                    <br> 余额：{{getCoinBalance(coin.name, wallet.address) }}
                    <br>
                </p>
            </card>
        </group>
        <box gap="10px 10px">
            <flexbox>
                <flexbox-item>
                    <x-button type="primary" @click.native="addCoin">添加资产</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="default" @click.native="showPasswordDialog('privateKey')">导出私钥</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button type="default" @click.native="showPasswordDialog('keyStore')">导出KS</x-button>
                </flexbox-item>
            </flexbox>
        </box>
        <div>
            <x-dialog v-model="showHideOnBlur" class="dialog-pwd" hide-on-blur>
                <box gap="10px 10px">
                    <group>
                        <x-input title="密码" type="password" placeholder="请输入密码" v-model="password"></x-input>
                    </group>
                    <div style="margin-top:20px;">
                        <x-button type="primary" action-type="button" @click.native="enterPassword">确定</x-button>
                    </div>
                </box>
            </x-dialog>
        </div>
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
    Alert,
    XDialog,
    XInput
} from 'vux'

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
    data() {
        var wallet = this.getWallet(this.$route.params.name);
        if (!wallet) {
            AlertModule.show('找不到钱包');
            return false;
        }
        return {
            wallet: wallet,
            password: '',
            showHideOnBlur: false,
            exportType: null,
            localCoins: this.getLocalCoin(wallet.name)
            // note: changing this line won't causes changes
            // with hot-reload because the reloaded component
            // preserves its current state and we are modifying
            // its initial state.
            // msg: 'Hello World!'
        }
    },
    methods: {
        showPasswordDialog: function(type) {
            console.log("show pwd dialog")
            this.showHideOnBlur = true
            this.exportType = type
        },
        showLoading(text) {
            this.$vux.loading.show({
                text: text
            })
        },
        goOut: function(walletName, coinName) {
            this.$router.push({ path: '/wallet/out/' + this.wallet.name +'/' + coinName })
        },
        addCoin: function() {
            this.$router.push({ path: '/wallet/addcoin/' + this.wallet.name })
        },
        enterPassword: function() {
            if (!this.password) {
                AlertModule.show('请输入密码');
                return false;
            }
            this.showHideOnBlur = false;
            this.showLoading('导出中..')
            var that = this;
            setTimeout(function() {
                try {
                    var ret = that.exportWalletPrivateKey(that.wallet.name, that.password);
                } catch (Error) {
                    console.log(Error);
                    that.$vux.loading.hide();

                    if (Error.message === 'message authentication code mismatch') {
                        AlertModule.show('密码不正确');
                        return false;
                    } else {
                        AlertModule.show('导出错误：' + Error.message);
                        return false;
                    }
                }
                that.$vux.loading.hide()

                if (that.exportType === 'keyStore') {
                    AlertModule.show('你的KeyStore为：<br/>' + that.wallet.keyStore);
                } else {
                    AlertModule.show('你的私钥为：<br/>' + ret);
                }

            }, 200);

            return false;

        },
        exportPrivateKey: function() {
            var privateKey = this.exportPrivateKey(this.password);
            AlertModule.show(privateKey)
        },
        exportKeyStore: function() {
            AlertModule.show('你的KeyStore为：<br/>' + ret);
        }
    }
}

</script>
<style>
.center-title {
    text-align: center;
}

.logo {
    width: 100px;
    height: 100px
}

</style>
