import { AlertModule } from 'vux'
import keythereum from 'keythereum'
import Web3 from 'web3'
import ethLightWallet from 'eth-lightwallet'

var crypto = require("crypto")
var keyStore = ethLightWallet.keystore;
var hdPath = "m/44'";

export default {
    install(Vue, options) {
        Vue.prototype.getHttpProvider = function() {
            // return 'http://118.89.233.54:7545'
            return 'https://mainnet.infura.io/JHFpXnQ8wCmgwB4ySWyY'
        }
        Vue.prototype.getWallets = function() {
            if (!window.localStorage) {
                AlertModule.show({
                    content: '抱歉，本地存储不可用, 请更换其他浏览器'
                })
                return false
            }
            var ret = window.localStorage['wallets'] ? JSON.parse(window.localStorage['wallets']) : {}
            console.log('wallets', ret)
            return ret
        }
        Vue.prototype.getWallet = function(name) {
            if (!window.localStorage) {
                AlertModule.show({
                    content: '抱歉，本地存储不可用, 请更换其他浏览器'
                })
                return false
            }
            var wallets = this.getWallets()
            return wallets ?
                (wallets[name] ? wallets[name] : null) :
                null
        }
        Vue.prototype.saveWallet = function(name, address, keyStore, amount) {
            console.log('保存钱包')
            var wallets = this.getWallets()
            wallets[name] = {
                name: name,
                address: address,
                amount: amount,
                keyStore: keyStore,
            }
            window.localStorage['wallets'] = JSON.stringify(wallets)
        }
        Vue.prototype.exportWalletPrivateKey = function(name, pwd) {
            console.log('导出钱包私钥')
            var wallet = this.getWallet(name)
            if (!wallet) {
                AlertModule.show('找不到钱包')
                return false
            }
            var privateKey = keythereum.recover(pwd, JSON.parse(wallet['keyStore']))
            return privateKey.toString('hex')
        }
        Vue.prototype.exportWalletKeyStore = function(name, pwd) {
            console.log('导出钱包keyStore')
            var wallet = this.getWallet(name)
            if (!wallet) {
                AlertModule.show('找不到钱包')
                return false
            }
            return JSON.stringify(wallet.keyStore)
        }
        // 通过私钥和密码获取钱包的keystore
        Vue.prototype.getKeyStore = function(privateKey, password, salt = 0, iv = 0) {
            var options = {
                kdf: "scrypt",
                cipher: "aes-128-ctr",
                kdfparams: {
                    c: 262144,
                    dklen: 32,
                    prf: "hmac-sha256"
                }
            };

            if (salt == 0) {
                salt = crypto.randomBytes(32).toString('hex');
            }
            if (iv == 0) {
                iv = crypto.randomBytes(16).toString('hex');
            }

            console.log("password", password, privateKey, salt, iv);
            var keyObject = keythereum.dump(password, privateKey, salt, iv, options);
            return JSON.stringify(keyObject);
        }

        Vue.prototype.importWalletFromKeyStore = function(walletName, ksContent, password) {

            try {
                var keyObject = JSON.parse(ksContent);
                var privateKey = keythereum.recover(password, keyObject);
                var private_key = privateKey.toString("hex");
                if (!private_key) {
                    throw new Error("密码错误或者keyStore不合法");
                }
            } catch (e) {
                throw new Error("请输入合法的keystore");
            }

            var addr = keythereum.privateKeyToAddress(private_key);
            this.saveWallet(walletName, addr, ksContent, 0);

            this.$vux.loading.hide()
            this.$router.push({ path: '/wallet/home' });

            console.log('通过keyStore导入钱包')
            return true
        }
        Vue.prototype.importWalletFromPrivateKey = function(walletName, privateKey, password) {
            if (!privateKey) {
                throw new Error("请输入私钥内容");
            }
            try {
                var addr = keythereum.privateKeyToAddress(privateKey);
            } catch (e) {
                if (e.message == "private key length is invalid") {
                    e.message = "私钥长度不合法";
                }
                throw new Error(e.message);
            }

            var ksContent = this.getKeyStore(privateKey, password);
            this.saveWallet(walletName, addr, ksContent, 0);

            this.$vux.loading.hide()
            this.$router.push({ path: '/wallet/home' });
            console.log('通过私钥导入钱包')
            return true;
        }
        Vue.prototype.importWalletFromSeed = function(walletName, seed, password) {
            try {
                var that = this;

                if (!seed || !keyStore.isSeedValid(seed)) {
                    throw new Error("请输入合法助记词");
                }

                keyStore.createVault({
                    password: password,
                    seedPhrase: seed,
                    hdPathString: hdPath
                }, function(err, ks) {
                    if (err) throw err;

                    ks.keyFromPassword(password, function(err, pwDerivedKey) {
                        if (err) throw err;

                        ks.generateNewAddress(pwDerivedKey, 1);
                        var addrs = ks.getAddresses();
                        var addr = addrs[0];

                        var privateKey = ks.exportPrivateKey(addr, pwDerivedKey);
                        var ksContent = that.getKeyStore(privateKey, password);

                        that.saveWallet(walletName, addr, ksContent, 0);

                        that.$vux.loading.hide()
                        that.$router.push({ path: '/wallet/home' });
                        return true;
                    });
                });

            } catch (e) {
                e.message == 'Index out of range';
                throw new Error("请输入合法助记词");
            }
            console.log('通过助记词导入钱包')
        }
        Vue.prototype.getWalletAmount = function(address, wei) {
            console.log('获取账户余额')
            var web3 = new Web3(new Web3.providers.HttpProvider(this.getHttpProvider()))
            return wei ? parseFloat(web3.eth.getBalance(address)) : parseFloat(web3.fromWei(web3.eth.getBalance(address)))
        }
        Vue.prototype.tran = function(fromWallet, to, amount, gas, password, nonce, callback) {
            var Tx = require('ethereumjs-tx')
            console.log('password:', password)
            var web3 = new Web3(new Web3.providers.HttpProvider(this.getHttpProvider()))
            if (nonce === null) {
                nonce = web3.eth.getTransactionCount(fromWallet.address)
            }
            // amount = web3.toWei(amount)
            var privateKey = Buffer.from(this.exportWalletPrivateKey(fromWallet.name, password), 'HEX')
            console.log('gas price:', web3.eth.gasPrice, gas)
            var rawTx = {
                nonce: nonce, // 0x00
                // gas: '0x' + parseInt(gas).toString(16),
                // gasPrice: '0x3b9aca00',
                gasLimit: '0x' + parseInt(gas).toString(16),
                to: to,
                value: parseFloat(amount) * 1.0e18, // parseInt(amount), // web3.toWei(amount, 'ether'),
                data: ''
            }

            console.log('rawTx:', rawTx)
            var tx = new Tx(rawTx)
            tx.sign(privateKey)
            var serializedTx = tx.serialize()
            // console.log(serializedTx.toString('hex'));
            // f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
            web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                if (!err) {
                    console.log(hash) // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                } else {
                    console.log(err)
                }
                callback(err, hash)
            })
        }

        Vue.prototype.bitcoinTran = function(fromWallet, to, amount, gas, password, nonce, callback) {
            var alice = bitcoin.ECPair.fromWIF('L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy')
            var txb = new bitcoin.TransactionBuilder()

            // txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0) // Alice's previous transaction output, has 15000 satoshis
            txb.addOutput('to', amount)
            // (in)15000 - (out)12000 = (fee)3000, this is the miner fee

            txb.sign(0, alice)

            bitcoin.broadcast(txb.build().toHex())

            // prepare for broadcast to the Bitcoin network, see "can broadcast a Transaction" below
            bitcoin.assert.strictEqual(txb.build().toHex(), '01000000019d344070eac3fe6e394a16d06d7704a7d5c0a10eb2a2c16bc98842b7cc20d561000000006b48304502210088828c0bdfcdca68d8ae0caeb6ec62cd3fd5f9b2191848edae33feb533df35d302202e0beadd35e17e7f83a733f5277028a9b453d525553e3f5d2d7a7aa8010a81d60121029f50f51d63b345039a290c94bffd3180c99ed659ff6ea6b1242bca47eb93b59fffffffff01e02e0000000000001976a91406afd46bcdfd22ef94ac122aa11f241244a37ecc88ac00000000')

        }

        function getBitcoinTrans(address, confirmBloackNum, callback) {
            // all config options are optional
            var client = new bitcoin.Client({
                host: 'localhost',
                port: 8332,
                user: 'username',
                pass: 'password',
                timeout: 30000
            })
            client.getBalance('*', confirmBloackNum, function(err, balance, resHeaders) {
                if (err) return console.log(err)
                console.log('Balance:', balance)
                callback(err, balance, resHeaders)
            })
            client.sendRawTransaction()
        }

    }
}
