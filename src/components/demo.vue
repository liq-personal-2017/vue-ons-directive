<template>
    <div>
        <input
            v-if="condition"
            type="text"
            v-model="text"
        >
        {{text}}
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
            text: "123",
            condition: true
        };
    },
    beforeUpdate() {
        console.log("beforeUpdate");
    }
};
</script>
<style lang="less">
</style>
