<template>
    <box>
        <div class="vux-demo">
            <h2>导入钱包</h2>
        </div>
        <div style="padding: 15px;">
            <button-tab v-model="importType">
                <button-tab-item>助词词导入</button-tab-item>
                <button-tab-item>私钥导入</button-tab-item>
                <button-tab-item>KeyStore导入</button-tab-item>
            </button-tab>
        </div>
        <group>
            <x-textarea placeholder="请输入助记词" v-if="importType===0" v-model="seed"></x-textarea>
            <x-textarea placeholder="请输入私钥" v-if="importType===1" v-model="privateKey"></x-textarea>
            <x-textarea placeholder="请输入KeyStore文件内容" v-if="importType===2" v-model="keystoreFile"></x-textarea>
            <x-input title="钱包名称" name="walletName" placeholder="请输入钱包名称" type="text" label-width="80px" v-model="walletName"></x-input>
            <x-input title="密码" name="walletPassword" placeholder="请输入密码" type="password" label-width="80px" v-model="walletPassword"></x-input>
            <x-input title="确认密码" v-if="importType===0||importType===1" name="walletConfirmPassword" placeholder="请再次输入密码" type="password" label-width="80px" v-model="walletConfirmPassword"></x-input>
        </group>
        <div class="agreement">
            <check-icon :value.sync="agree"> 我已经仔细阅读并同意
                <router-link to="#">服务及隐私协议</router-link>
            </check-icon>
        </div>
        <box gap="10px 10px">
            <x-button type="primary" @click.native="importWallet(importType)">导入钱包</x-button>
        </box>
    </box>
</template>
<script>
import { Box, Group, Cell, XButton, Flexbox, FlexboxItem, XInput, CheckIcon, ButtonTab, ButtonTabItem, XTextarea, AlertModule } from 'vux'

export default {
    components: {
        Box,
        Group,
        Cell,
        XButton,
        Flexbox,
        FlexboxItem,
        XInput,
        CheckIcon,
        ButtonTab,
        ButtonTabItem,
        XTextarea
    },
    data() {
        return {
            importType: 0,
            agree: false,
            seed: '',
            privateKey: '',
            keystoreFile: '',
            walletName: '',
            walletPassword: '',
            walletConfirmPassword: '',
            // note: changing this line won't causes changes
            // with hot-reload because the reloaded component
            // preserves its current state and we are modifying
            // its initial state.
            msg: 'Hello World!'
        }
    },
    methods: {
        alert: function(msg) {
            AlertModule.show({
                content: msg
            })
        },
        validate: function(importType) {
            if (!this.walletName) {
                this.alert('钱包名称不能为空');
                return false;
            }
            if (this.getWallet(this.walletName)) {
                this.alert('钱包已经存在，请更换名称');
                return false;
            }
            if (!this.walletPassword) {
                this.alert('钱包密码不能为空');
                return false;
            }
            if (importType != 2) {
                if (!this.walletConfirmPassword) {
                    this.alert('钱包确认密码不能为空');
                    return false;
                }

                if (this.walletPassword != this.walletConfirmPassword) {
                    this.alert('钱包两次密码不一致');
                    return false;
                }
            }

            if (!this.agree) {
                this.alert('请阅读并同意钱包协议');
                return false;
            }
            return true;
        },
        importWallet: function(importType) {
            var that = this;
            if (!this.validate(importType)) {
                return false;
            }
            this.$vux.loading.show({
                text: '导入中..'
            })

            setTimeout(function() {
                try {
                    if (importType === 0) {
                        that.importWalletFromSeed(that.walletName, that.seed, that.walletPassword);
                    } else if (importType === 1) {
                        that.importWalletFromPrivateKey(that.walletName, that.privateKey, that.walletPassword);
                    } else if (importType === 2) {
                        that.importWalletFromKeyStore(that.walletName, that.keystoreFile, that.walletPassword);
                    } else if (importType === 3) {
                        throw new Error("请选择合法的钱包导入方式");
                    }
                } catch (e) {
                    console.log(e.message);
                    that.alert(e.message);
                }
            }, 200)

            this.$vux.loading.hide()
        },
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

.agreement {
    margin: 10px;
    font-size: 12px;
}

.agreement .weui-icon-circle,
.agreement .weui-icon-success {
    font-size: 12px;
}

.weui-cell__bd .weui-textarea {
    display: block;
    border: 0;
    resize: none;
    width: 100%;
    color: inherit;
    font-size: 13px;
    line-height: inherit;
    outline: 0;
}
</style>
