<template>
    <div>
        <div class="vux-demo">
            <h2>数字钱包</h2>
        </div>
        <group title="cell demo">
            <cell title="VUX" value="cool" is-link></cell>
        </group>
        <tabbar>
            <tabbar-item link="/wallet/home">
                <span slot="label">钱包</span>
            </tabbar-item>
            <tabbar-item show-dot>
                <span slot="label">行情</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>
<script>
import { Group, Cell, Tabbar, TabbarItem } from 'vux'

export default {
    components: {
        Group,
        Cell,
        Tabbar,
        TabbarItem
    },
    data() {
        return {
            // note: changing this line won't causes changes
            // with hot-reload because the reloaded component
            // preserves its current state and we are modifying
            // its initial state.
            msg: 'Hello World!'
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
