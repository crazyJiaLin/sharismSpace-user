<template>
    <div class="router-view-wrapper">
        <transition name="children-router-view" class="animated">
            <!-- <keep-alive> -->
                <router-view :edit-id="editId" @editBlog="goEditBlog($event)"></router-view>
            <!-- </keep-alive> -->
        </transition>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                editId : ''
            }
        },
        methods : {
            goEditBlog(msg){
                // console.log('父组件收到了参数'+msg);
                this.editId = msg;
                window.location.hash = '#/blog/add'
            }
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