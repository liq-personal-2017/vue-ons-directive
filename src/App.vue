<template>
    <div id="app">
        <l-demo
            v-if="condition"
            v-ons:click="bindsOnclick"
        >
        </l-demo>
        <button @click="condition = !condition">click</button>
    </div>
</template>

<script>
import demo from "./components/demo.vue";
export default {
    name: "app",
    data() {
        return { condition: false };
    },
    components: {
        [demo.name]: demo
    },
    methods: {
        bindsOnclick(evt) {
            console.log(evt);
        }
    }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
