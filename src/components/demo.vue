<template>
    <div>
        <input v-if="condition" type="text" v-model="text">
        {{text}}
        <br>
        <button @click="condition = !condition">click3</button>
        <l-child v-if="condition" ref="child"></l-child>
    </div>
</template>
<script>
import child from "./child.vue";
export default {
    components: {
        lChild: child
    },
    name: "LDemo",
    data() {
        return {
            text:'123',
            condition: true
        };
    },
    ons: {
        ref: "child"
    }
};
</script>
<style lang="less">
</style>
