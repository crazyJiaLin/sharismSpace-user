<template>
    <div class="album-children-router">
       <div class="photo-list-wrapper" id="cascade-wrapper">
           <div v-for="(item,key) in photoList" class="photo-item-wrapper">
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
    </div>
</template>

<script>
    import './album-detail.css'
    import '../../../../js/cascade.js'
    export default{
        computed:{
           albumName(){
               return this.$route.params.albumName;
           }
        },
        watch : {
            photoList : {
                handler(val,oldVal){
                    let that = this;
                    
                    //监听到数组变化时，开始进行瀑布流排序
                    
                },
                deep : true
            }
        },
        data(){
            return{
                Cascade : null, 
                photoList : [
                    // {id:'0',albumId:'1',photoName:'照片名称',photoDescribe:'相册描述',photoPath:'http://118.25.50.160:8000/group2/M00/00/01/CpqBPFrR_3yAbC1fAADZNcoHNMg432.jpg'}
                ],
                photoReqInfo : {
                    getPhotoListBool : false,
                    hasNextPage : true,
                    pageNum : 1,
                    pageSize : 10
                }
            }
        },
        methods : {
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
                                that.photoReqInfo.pageSize = that.photoReqInfo.pageSize + 8;     
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
            bindScrollEvent(){
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
                            return;
                        }
                        console.log('开始发送请求');
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
                cascadeWrapper : '#cascade-wrapper',
                itemSelector : '.photo-item-wrapper',
                itemWidth : 250,
                marginLeft : 20,
                marginTop : 20
            });
            // this.arrangePhoto();
            this.selectAlbumByName();
            this.listenLeftWrapperTransitionEnd();
            this.bindScrollEvent();
        }
    }
</script>