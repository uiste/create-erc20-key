// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Home from './components/Home'
import WalletHome from './components/WalletHome'
import WalletCreate from './components/WalletCreate'
import WalletImport from './components/WalletImport'
import WalletView from './components/WalletView'
import WalletIn from './components/WalletIn'
import WalletOut from './components/WalletOut'
import WalletAddCoin from './components/WalletAddCoin'
import { LoadingPlugin } from 'vux'

import util from './util'
Vue.use(util)

import coin from './common/coin'
Vue.use(coin)

Vue.use(VueRouter)

Vue.use(LoadingPlugin)

const routes = [{
  path: '/',
  name: 'home',
  component: Home
}, {
  path: '/wallet/home',
  name: 'wallet-home',
  component: WalletHome
}, {
  path: '/wallet/create',
  name: 'wallet-create',
  component: WalletCreate
}, {
  path: '/wallet/import',
  name: 'wallet-import',
  component: WalletImport
}, {
  path: '/wallet/view/:name',
  name: 'wallet-view',
  component: WalletView
}, {
  path: '/wallet/in/:name',
  name: 'wallet-in',
  component: WalletIn
}, {
  path: '/wallet/out/:name/:coinName',
  name: 'wallet-out',
  component: WalletOut
}, {
  path: '/wallet/addcoin/:name',
  name: 'wallet-add-coin',
  component: WalletAddCoin
}
]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
