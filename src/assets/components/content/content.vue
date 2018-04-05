<template>
    <div class="content-wrapper">
        <transition name="router-transition" class="animated">
            <router-view class="transition-box"></router-view>
            <!-- <div v-show="show" class="transition-box">.el-fade-in</div> -->
        </transition>
    </div>
</template>
<script>
    export default{
        methods : {
           
        }
    }
</script>

<style>
    .content-wrapper{
        width: 100%;
        height: 100%;
    }
    .router-transition-enter-active{
        animation: fadeIn 2s ease ;
    }
</style>