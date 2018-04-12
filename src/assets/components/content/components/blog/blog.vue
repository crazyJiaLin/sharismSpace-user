<template>
    <div class="router-view-wrapper">
        <transition name="children-router-view" class="animated">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default{
        mounted(){

        }
    }
</script>

<style>
    .router-view-wrapper{
        width: 100%;
        height: 100%;
    }
    .children-router-view{
        width: 90%;
        height: 90%;
        background: tan;
    }
    .children-router-view-enter-active{
        animation: fadeIn .5s ease;
    }
    
</style>