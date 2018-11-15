<template>
    <div class="content-wrapper">
        <transition name="router-transition" class="animated">
            <keep-alive>
                <router-view class="transition-box"></router-view>
                <!-- <div v-show="show" class="transition-box">.el-fade-in</div> -->
            </keep-alive>
        </transition>
    </div>
</template>
<script>
    export default{
        methods : {
           
        },
        mounted(){
            let that = this;
            let timer = setTimeout(function(){
                that.$notify({
                    title: '更新v4.2',
                    message: '再度使用异步加载组件，加快网页相应速度，哪怕是多一毫秒也不行！！',
                    type: 'success',
                    duration : 6000
                });
                let timer2 = setTimeout(function(){
                    that.$notify({
                        title: '更新v4.1',
                        message: '静态资源的按需加载+组件的异步加载测试,减小网站开始加载速度，本功能可能会造成一些bug,程序猿已经努力排查了，如果发现及时反馈！',
                        type: 'success',
                        duration : 6000
                    });
                },500);
            },1000);
           
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