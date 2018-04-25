<template>
    <div class="album-children-router" v-loading="photoReqInfo.cascadeWrapperLoading">
       <div class="photo-list-wrapper" id="cascade-wrapper" >
           <div @click="showAddPhotoDialog = true" class="photo-item-wrapper add-photo-wrapper">
                <i class="fa fa-plus"></i>
           </div>
           <div v-for="(item,key) in photoList" :key="key" class="photo-item-wrapper">
               <div class="img-wrapper">
                    <img :src="item.photoPath" :alt="item.photoName">
               </div>
               <div class="img-detail-wrapper">
                   <div class="photo-name">{{item.photoName}}</div>
                   <div class="photo-info-wrapper">
                        <i class="fa fa-thumbs-up"></i> 22
                        <i class="fa fa-heart"></i> 5
                   </div>
                   <div class="add-time">{{item.addTime}}</div>
               </div>
            </div>
       </div>
        <UploadImg v-if="showAddPhotoDialog" @closeUploadWrapper="closeUploadImg($event)"></UploadImg>
    </div>
</template>

<script>
    import './album-detail.css'
    import '../../../../js/cascade.js'
    import UploadImg from '../../../upload/upload-img.vue'
    export default{
        components : {
            UploadImg
        },
        computed:{
           albumName(){
               return this.$route.params.albumName;
           }
        },
        data(){
            return{
                Cascade : null, 
                showAddPhotoDialog : false,  //是否显示添加照片模态框
                photoList : [
                    // {id:'0',albumId:'1',photoName:'照片名称',photoDescribe:'相册描述',photoPath:'http://118.25.50.160:8000/group2/M00/00/01/CpqBPFrR_3yAbC1fAADZNcoHNMg432.jpg'}
                ],
                photoReqInfo : {
                    cascadeWrapperLoading : false,
                    getPhotoListBool : false,
                    hasNextPage : true,
                    pageNum : 1,
                    pageSize : 10
                }
            }
        },
        methods : {
            closeUploadImg(msg){
                console.log('关闭了');
                console.log(msg);
                this.showAddPhotoDialog = false;
            },
            selectAlbumByName(){
                let that = this;
                // console.log('开始检索');
                // console.log(that.albumName);
                if(that.photoReqInfo.hasNextPage){  //如果有下一页
                    var map = {};
                    //当前页号
                    map['pageNum']= that.photoReqInfo.pageNum;
                    //每页显示的数据条数
                    map['pageSize']= that.photoReqInfo.pageSize;	
                    //相册名称
                    map['albumName']= "北京七日游";
                    var formData=new FormData();
                    formData.append("photoPageList",JSON.stringify(map));
                    $.ajax({
                        type: "post",  		    
                        url:window.albumReqUrl + "/photo/selectPhotoPageByAlbumName",
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        data : formData,
                        success:function(data){	
                            console.log(data)
                            if(data.code == 1){
                                that.photoList = data.value.list;
                                that.photoReqInfo.hasNextPage = data.value.hasNextPage; 
                                that.photoReqInfo.pageSize = that.photoReqInfo.pageSize + 8;    //请求内容+8 
                                that.photoReqInfo.cascadeWrapperLoading = false; //关闭loading   
                                that.Cascade.arrangeDOM(0,function(msg){
                                    console.log(msg);
                                    that.photoReqInfo.getPhotoListBool = true;  //排序完成后，打开请求开关
                                });                           
                            }else{
                                that.$message.error(data.message);  
                            }
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });
                }
                

            },
            listenLeftWrapperTransitionEnd(){
                let that = this;
                $('.hide-user-info-btn').on('click',function(){
                    //重新排序之前，关闭请求按钮，不不再发送请求
                    that.photoReqInfo.getPhotoListBool = false;
                    let timer = setTimeout(function(){
                        console.log('开始重新排序');
                        // that.arrangePhoto();
                        that.Cascade.resetCascade(0,function(){
                            console.log('重新排序完成');
                            //重新排序完成后，打开请求按钮
                            that.photoReqInfo.getPhotoListBool = true;
                        });
                    },1000);
                    
                });
            },
            bindScrollEvent(){          //绑定滚动事件，滚动到页面底部触发请求照片事件
                let that = this;
                $('.blog-list-wrapper').on('scroll',function(){
                    // console.log('scroll');
                    if(!that.photoReqInfo.getPhotoListBool){ 
                        return;
                    }
                    let ScrollTop = $(this)[0].scrollTop,               //子元素相对父元素滚动的距离
                        parentHeight = $(this)[0].offsetHeight,         //父元素的高度
                        childHeight = $(this).find('.album-second-router-wrapper')[0].offsetHeight;   //子元素的高度
                    let dis = childHeight - ScrollTop - parentHeight + 100;  //100是子元素的margin+面包屑高度，默认会少个上下margin
                    // console.log(dis);
                    if(dis <= 20){
                        if(!that.photoReqInfo.hasNextPage){    //如果没有下一页，不再发送请求
                            return that.$message({
                                type : 'info',
                                message : ' 您没有更多照片了哦，马上点击添加按钮，添加您的照片吧'
                            });
                        }
                        console.log('开始发送请求');
                        that.photoReqInfo.cascadeWrapperLoading = true; //打开页面loading
                        that.photoReqInfo.getPhotoListBool = false;    //关闭请求开关，等数据返回后在吧开关打开，防止请求重复
                        that.selectAlbumByName();
                    }
                });
            }
        },
        updated(){
            // this.arrangePhoto();
        },
        mounted(){
            //实例化瀑布流组件
            this.Cascade = new Cascade({
                cascadeWrapper : '#cascade-wrapper',    //父容器，需要根据父容器宽度进行排序
                itemSelector : '.photo-item-wrapper',   //item选择器，是cascadeWrapper下的子标签
                itemWidth : 250,    //item宽度
                marginLeft : 20,    //每个item左右边距
                marginTop : 25,     //每个item上下边距
                speed : 150         //瀑布流运动素的，毫秒
            });
            // this.arrangePhoto();
            this.selectAlbumByName();
            this.listenLeftWrapperTransitionEnd();
            this.bindScrollEvent();
        }
    }
</script>