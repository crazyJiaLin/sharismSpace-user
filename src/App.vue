<template>
  <div id="app">
      <el-container>
        <el-header class="active">
          <Header></Header>
          <div class="header-fold-btn" @click="foldHeader">
              <i class="fa fa-angle-double-up"></i>
          </div>
        </el-header>
        <el-main><Content></Content></el-main>
      </el-container>  
  </div>
</template>

<script>
  import Content from './assets/components/content/content.vue'
  import Header from './assets/components/header/header.vue'
  export default {
    components:{
      Header,
      Content
    },
    data() {
        return {
          
        }
      }, 
    methods: {
        foldHeader(){
            if($('.el-header').hasClass('active')){
                $('.el-header').removeClass('active');
                $('.header-fold-btn i').addClass('fa-rotate-180');
                $('.el-main ').addClass('active');
            }else{
                $('.el-header').addClass('active');
                $('.header-fold-btn i').removeClass('fa-rotate-180');
                $('.el-main ').removeClass('active');
            }
            
        }
      }
    }
</script>

<style scoped>
  .el-header{
    text-align: center;
    height: 0 !important;
    line-height: 50px;
    min-width: 1340px;
    position: fixed ;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
    transition: all .8s ease;
    -webkit-transition: all .8s ease;
  }
 .el-header.active{
  height: 50px !important;
  box-shadow: 2px 0 20px 0 rgba(0, 0, 0, 0.5);
 }
  .el-main {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    min-width: 1340px;
    overflow: hidden;
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /* line-height: 160px; */
    padding: 50px 20px 0;
    transition: all .8s ease;
    -webkit-transition: all .8s ease;
  }
  .el-main.active{
    padding-top: 5px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
</style>
