<template>
    <div class="child">
        <div
            class="click-area"
            @click="$emit('click','bbb')"
        ></div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="less">
.click-area {
    width: 300px;
    height: 300px;
    background-color: #efefef;
}
</style>
