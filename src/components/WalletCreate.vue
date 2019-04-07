<template>
  <box>
    <div class="vux-demo">
      <h2>创建钱包</h2>
    </div>
    <group>
      <x-input title="钱包名称" name="walletName" placeholder="请输入钱包名称" type="text" label-width="80px" v-model="walletName"></x-input>
      <x-input title="密码" name="walletPassword" placeholder="请输入密码" type="password" label-width="80px" v-model="walletPassword"></x-input>
      <x-input title="确认密码" name="walletConfirmPassword" placeholder="请再次输入密码" type="password" label-width="80px" v-model="walletConfirmPassword"></x-input>
    </group>
    <div class="agreement">
      <check-icon :value.sync="agree"> 我已经仔细阅读并同意
        <router-link to="#">服务及隐私协议</router-link>
      </check-icon>
    </div>
    <box gap="10px 10px">
      <x-button type="primary" @click.native="create">创建钱包</x-button>
    </box>
  </box>
</template>
<script>
import {
  AlertModule,
  Alert,
  Box,
  Group,
  Cell,
  XButton,
  Flexbox,
  FlexboxItem,
  XInput,
  CheckIcon,
  Loading,
  LoadingPlugin
} from 'vux'

import ethLightWallet from 'eth-lightwallet'
import keythereum from 'keythereum'
var crypto = require("crypto")

var keyStore = ethLightWallet.keystore

export default {
  components: {
    AlertModule,
    Alert,
    Box,
    Group,
    Cell,
    XButton,
    Flexbox,
    FlexboxItem,
    XInput,
    CheckIcon,
    Loading
  },
  data() {
    return {
      agree: false,
      walletName: '',
      walletPassword: '',
      walletConfirmPassword: ''
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      // msg: 'Hello World!'
    }
  },
  methods: {
    randomWord: function(randomFlag, min, max) {
      var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
    alert: function(msg) {
      AlertModule.show({
        content: msg
      })
    },
    validate: function() {
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
      if (!this.walletConfirmPassword) {
        this.alert('钱包确认密码不能为空');
        return false;
      }

      if (this.walletPassword != this.walletConfirmPassword) {
        this.alert('钱包两次密码不一致');
        return false;
      }

      if (!this.agree) {
        this.alert('请阅读并同意钱包协议');
        return false;
      }
      return true;
    },
    create: function() {
      if (!this.validate()) {
        return false;
      }
      // the seed is stored encrypted by a user-defined password
      var password = this.walletPassword;
      console.log('pwd:' + password);
      var seedPhrase = keyStore.generateRandomSeed(this.randomWord(true, 128, 256));
      var hdPath = "m/44'";
      console.log('seedPhrase:' + seedPhrase);
      var that = this;
      this.$vux.loading.show({
        text: '创建中..'
      })

      keyStore.createVault({
        password: password,
        seedPhrase: seedPhrase, // Optionally provide a 12-word seed phrase
        //salt: this.randomWord(32),     // Optionally provide a salt.
        // A unique salt will be generated otherwise.
        hdPathString: hdPath // Optional custom HD Path String
      }, function(err, ks) {
        console.log(ks);
        // Some methods will require providing the `pwDerivedKey`,
        // Allowing you to only decrypt private keys on an as-needed basis.
        // You can generate that value with this convenient method:
        ks.keyFromPassword(password, function(err, pwDerivedKey) {
          if (err) throw err;

          // generate five new address/private key pairs
          // the corresponding private keys are also encrypted
          ks.generateNewAddress(pwDerivedKey, 1);
          var addr = ks.getAddresses();
          console.log('addr:' + addr);


          var privateKey = ks.exportPrivateKey(addr[0], pwDerivedKey);
          console.log('private key:' + privateKey);

          var ksContent = that.getKeyStore(privateKey, password, ks.salt, crypto.randomBytes(16));
          console.log("ksContent:", ksContent);
          that.saveWallet(that.walletName, addr[0], ksContent, 0);

          ks.passwordProvider = function(callback) {
            callback(null, password);
          };

          that.$vux.loading.hide()
           AlertModule.show({
             content:'下面是钱包的助记词，请牢记：<br/>'+seedPhrase, 
             onHide () {
              that.$router.push({ path: '/wallet/home' });
              }
           })
          // Now set ks as transaction_signer in the hooked web3 provider
          // and you can start using web3 using the keys/addresses in ks!
        });
      });
    },
    getKeyStore: function(privateKey, password, salt, iv) {
      console.log('Iv:', iv);
      var options = {
        kdf: "scrypt",
        cipher: "aes-128-ctr",
        kdfparams: {
          c: 262144,
          dklen: 32,
          prf: "hmac-sha256"
          //"salt": salt
        }
      };
      //var privateKey = "070f0b5d0c7ec78ee4659186257728192454bc0ef1f485f3b94fd4a43728fb5e";
      var salt = crypto.randomBytes(32).toString('hex');
      //var iv = "bda427191686ac4455142bc449543129";

      // synchronous
      console.log("password", password, privateKey, salt, iv);
      var keyObject = keythereum.dump(password, privateKey, salt, iv, options);
      return JSON.stringify(keyObject);
      // console.log("keystore:",JSON.stringify(keyObject));


      //var privateKey = keythereum.recover(password, keyObject);
      //private_key = privateKey.toString("hex");
      //console.log("私钥内容：",private_key);

      //var address = privateKeyToAddress(private_key);
      //console.log("账户地址：",address);
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

.agreement {
  margin: 10px;
  font-size: 12px;
}

.agreement .weui-icon-circle,
.agreement .weui-icon-success {
  font-size: 12px;
}

</style>
