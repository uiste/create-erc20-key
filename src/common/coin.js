import { AlertModule } from 'vux'

var Web3 = require("web3");
var Tx = require('ethereumjs-tx');


const ABI_EOS = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "stop", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "guy", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "owner_", "type": "address" }], "name": "setOwner", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint128" }], "name": "push", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "name_", "type": "bytes32" }], "name": "setName", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint128" }], "name": "mint", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "stopped", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "authority_", "type": "address" }], "name": "setAuthority", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "src", "type": "address" }, { "name": "wad", "type": "uint128" }], "name": "pull", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "wad", "type": "uint128" }], "name": "burn", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "dst", "type": "address" }, { "name": "wad", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "start", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "authority", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "src", "type": "address" }, { "name": "guy", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "symbol_", "type": "bytes32" }], "payable": false, "type": "constructor" }, { "anonymous": true, "inputs": [{ "indexed": true, "name": "sig", "type": "bytes4" }, { "indexed": true, "name": "guy", "type": "address" }, { "indexed": true, "name": "foo", "type": "bytes32" }, { "indexed": true, "name": "bar", "type": "bytes32" }, { "indexed": false, "name": "wad", "type": "uint256" }, { "indexed": false, "name": "fax", "type": "bytes" }], "name": "LogNote", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "authority", "type": "address" }], "name": "LogSetAuthority", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }], "name": "LogSetOwner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }];
const QCT = '0xa74476443119A942dE498590Fe1f2454d7D4aC0d';
const ETH = "0x0000000000000000000000000000000000000000";
const EOS = "0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0";
const DGD = '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a';
const MKR = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2';
const REP = '0xe94327d07fc17907b4db788e5adf2ed424addff6';
const BNT = '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c';

var coinList = {};
coinList['QCT'] = { 'name': 'QCT', 'address': QCT };
coinList['ETH'] = { 'name': 'ETH', 'address': ETH };
coinList['EOS'] = { 'name': 'EOS', 'address': EOS };
coinList['DGD'] = { 'name': 'DGD', 'address': DGD };
coinList['MKR'] = { 'name': 'MKR', 'address': MKR };
coinList['REP'] = { 'name': 'REP', 'address': REP };
coinList['BNT'] = { 'name': 'BNT', 'address': BNT };

export default {
    install(Vue, options) {
    	Vue.prototype.sliceAddr = function(fullAddr) {
         return fullAddr.substr(0, 7) + "****" + fullAddr.substr(-8);
     }

     Vue.prototype.getAllCoins = function() {
        return coinList
    }

    Vue.prototype.getActiveCoins = function(walletName) {
        var localCoins = this.getLocalCoin(walletName);
        for (var coin in coinList) {
            coinList[coin].status = (localCoins && localCoins[coin]) ? localCoins[coin].status : false;
            coinList[coin].address = this.sliceAddr(coinList[coin].address);
        }

        console.log('activeCoins', coinList)
        return coinList;
    }

    Vue.prototype.getLocalCoin = function(walletName) {
        if (!window.localStorage) {
            AlertModule.show({
                content: '抱歉，本地存储不可用, 请更换其他浏览器'
            })
            return false
        }
        var wallet_coin_name = 'coins_' + walletName;
        var coins = window.localStorage[wallet_coin_name] ? JSON.parse(window.localStorage[wallet_coin_name]) : {}
        return coins;
    }

    Vue.prototype.saveCoin = function(walletName, coinName, status = true) {
        if (!window.localStorage) {
            AlertModule.show({
                content: '抱歉，本地存储不可用, 请更换其他浏览器'
            })
            return false
        }
        var wallet_coin_name = 'coins_' + walletName;
        var coins = this.getLocalCoin(walletName);
        coins[coinName] = {
            name: coinName,
            status: status,
        }
        console.log('保存币类型:', coins);
        window.localStorage[wallet_coin_name] = JSON.stringify(coins)
    }

    Vue.prototype.getCoinBalance = function(coinName, address) {
        if (coinList[coinName] == undefined) {
            throw new Error("当前币种不支持");
        }
        var balance = 0;
        var web3 = new Web3(new Web3.providers.HttpProvider(this.getHttpProvider()))
        console.log("get coin balance :", coinName);
        if (coinName == "ETH") {
            balance = web3.eth.getBalance(address);
        } else {
            try {
                var contractAddr = coinList[coinName].address;
                var metacoin = web3.eth.contract(ABI_EOS).at(contractAddr);
                var balance = parseFloat(metacoin.balanceOf.call(address));
            } catch (e) {
                console.log(e.message);
                    // AlertModule.show({
                    //     content: e.message,
                    // })
                    return 0;
                }
            }
            balance = parseFloat(web3.fromWei(balance));
            console.log("获取" + coinName + "余额balance: ", balance);
            return balance;
        }

        Vue.prototype.sendCoinTran = function(coinName, fromWallet, toAddr, amount, gas, password, nonce, callback) {
            try {
                if (coinList[coinName] == undefined) {
                    throw new Error("当前币种不支持");
                }
                console.log(coinName, fromWallet, toAddr, amount, gas, password);
                if (coinName == "ETH") {
                    return this.tran(fromWallet, toAddr, amount, gas, password, nonce, callback);
                }
                // 初始化web3 对象
                var web3 = new Web3(new Web3.providers.HttpProvider(this.getHttpProvider()))
                var mfcContract = web3.eth.contract(ABI_EOS);
                // 根据币种获取对应代币合约的地址
                var contractAddress = coinList[coinName].address;
                // 初始化合约对象
                var contract = mfcContract.at(contractAddress);
                // 检测地址是合法的以太坊地址
                var fromAddr = fromWallet.address;
                console.log("fromAddr", fromAddr);
                if (!web3.isAddress(fromAddr)) {
                    throw new Error("无效的转账地址");
                }
                if (!web3.isAddress(toAddr)) {
                    throw new Error("无效的接受账户地址");
                }
                // 查询代币余额
                var fromBalance = web3.fromWei(contract.balanceOf.call(fromAddr), 'ether').toNumber();
                if (fromBalance < amount) {
                    throw new Error("主账户没有足够的转账余额：" + fromBalance);
                }
                if (nonce === null) {
                    nonce = web3.eth.getTransactionCount(fromAddr)
                }
                var privateKey = Buffer.from(this.exportWalletPrivateKey(fromWallet.name, password), 'HEX')

                var gasLimit = gas ? '0x' + parseInt(gas).toString(16) : "0x250CA";
                console.log('gas price:', web3.eth.gasPrice, gas, gasLimit)
                var rawTransaction = {
                    "from": fromAddr,
                    "nonce": "0x" + nonce.toString(16),
                    // "gasPrice": "0x003B9ACA00",
                    "gasLimit": gasLimit,
                    "to": contractAddress,
                    "value": "0x0",
                    "data": contract.transfer.getData(toAddr, web3.toWei(amount))
                };

                // 运营钱包地址的私钥，需要用它来签名交易
                var privKey = new Buffer(privateKey, 'hex');
                // 对交易签名
                var tx = new Tx(rawTransaction);
                tx.sign(privKey);
                var serializedTx = tx.serialize();

                // 发送交易到以太坊
                web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                    if (!err) {
                        console.log("转账交易hash：", hash);
                    } else {
                        console.log("转账交易错误：", err);
                    }
                    callback(err, hash);
                });
            } catch (e) {
                console.log("代币转账错误：[" + e.message + "]，请求参数：[coinName:" + coinName + "|fromAddr:" + fromAddr + "|toAddr:" + toAddr + "|amount:" + amount + "]");
                callback(e, '');
            }


        }
    }
}
