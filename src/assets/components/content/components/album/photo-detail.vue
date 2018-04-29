<template>
    <div class="show-photo-detail-wrapper" >
        <div @click.stop="closeDetailWrapper" class="close-photo-detail-wrapper-btn">
            <i class="fa fa-close"></i>
        </div>
        <div class="detail-info-wrapper">
            <div class="detail-left-wrapper">
                <div class="show-photo-img-wrapper" 
                    v-loading="!showPhoto"  
                    element-loading-spinner="fa fa-spinner fa-pulse"
                    element-loading-background="rgba(0, 0, 0, 0)">
                    <div class="detail-img-wrapper">
                        <img v-show="showPhoto" @load="imgLoaded" :src="photoDetailInfo.photoPath" :alt="photoDetailInfo.photoName"  class="detail-img animated fadeIn">
                    </div>
                </div>
                <div @click.stop="prePhoto" class="change-photo-btn pre-photo-btn"><i class="fa fa-arrow-left"></i></div>
                <div @click.stop="nextPhoto" class="change-photo-btn next-photo-btn"><i class="fa fa-arrow-right"></i></div>
            </div>
            
            <div :class="showPhotoInfo ? 'detail-right-wrapper active' : 'detail-right-wrapper'">
                <div @click.stop="showPhotoInfo = !showPhotoInfo" class="fold-photo-info-wrapper-btn">
                    <i :class="showPhotoInfo ? 'fa fa-angle-double-right' : 'fa fa-angle-double-right fa-rotate-180'"></i>
                </div>
                <div class="show-photo-info-wrapper">
                    <div class="photo-info-background">
                        <img v-show="showPhoto" @load="imgLoaded" :src="photoDetailInfo.photoPath">
                    </div>
                    <div class="edit-photo-info-btn">
                        <i @click.stop="showEdit($event)" class="fa fa-edit"></i>
                    </div>
                    <el-form :model="photoDetailInfo" :rules="photoDetailInfoRules" ref="photoDetailInfo" label-width="100px" class="edit-photo-info-form">
                        <el-form-item :label="!photoInfoReadOnly? '相片名称:' : ''" prop="photoName" :label-width="!photoInfoReadOnly? '90px' : '30px'">
                            <div v-if="photoInfoReadOnly" class="show-photo-info-line photo-name" v-html="photoDetailInfo.photoName"></div>
                            <el-input v-if="!photoInfoReadOnly" class="photo-name-input" :readonly="photoInfoReadOnly" v-model="photoDetailInfo.photoName" placeholder="请输入相片名称"></el-input>
                        </el-form-item>
                        <el-form-item :label="!photoInfoReadOnly? '相片描述:' : ''" prop="photoDescribe" :label-width="!photoInfoReadOnly? '90px' : '30px'">
                            <div v-if="photoInfoReadOnly" class="show-photo-info-line photo-desc" v-html="photoDetailInfo.photoDescribe"></div>
                            <el-input v-if="!photoInfoReadOnly" :readonly="photoInfoReadOnly" type="textarea" v-model="photoDetailInfo.photoDescribe" placeholder="请输入相片描述"></el-input>
                        </el-form-item>
                        <div v-if="!photoInfoReadOnly" class="confirm-eidt-photo-info-wrapper animated fadeIn">
                            <el-button @click.stop="updatePhotoInfo" type="primary" plain>确认修改</el-button>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        props : {
            showPhotoDetailInfo : Object
        },
        data(){
            return {
                showPhoto : false,
                photoInfoReadOnly : true,
                showPhotoInfo : true,
                selectPhotoInfo : {
                    pageNum : 1,
                    pageSize : 1,
                    hasNextPage : true,
                    hasPreviousPage : false
                },
                photoDetailInfo : {     //相片详情信息
                    photoName : '相册名称',
                    photoDescribe : '相册描述',
                    photoPath : ''
                },
                photoDetailInfoRules:{  
                    photoName: [
                        { required: true, message:'照片名称不能为空', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    photoDescribe : [
                        { max: 100, message: '不能超过100个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods : {
            nextPhoto(){
                this.selectPhotoInfo.pageNum ++;
                if(!this.selectPhotoInfo.hasNextPage){
                    return this.$message({
                        type : 'warning',
                        message : '已经是最后一张了哦~'
                    });
                }
                if($('.edit-photo-info-btn').find('i').hasClass('active')){
                    this.photoInfoReadOnly = true;  //改为只读状态
                    $('.edit-photo-info-btn').find('i').removeClass('active');
                }
                this.showPhoto = false;
                this.selectPhoto();
            },
            prePhoto(){
                this.selectPhotoInfo.pageNum--;
                if(this.selectPhotoInfo.pageNum < 1){
                    this.selectPhotoInfo.pageNum = 1;
                }
                if(!this.selectPhotoInfo.hasPreviousPage){
                    return this.$message({
                        type : 'warning',
                        message : '已经是第一张了哦~'
                    });
                }
                if($('.edit-photo-info-btn').find('i').hasClass('active')){
                    this.photoInfoReadOnly = true;  //改为只读状态
                    $('.edit-photo-info-btn').find('i').removeClass('active');
                }
                this.showPhoto = false;
                this.selectPhoto();
            },
            showEdit($event){
                if($($event.target).hasClass('active')){    //转化为只读状态
                    $($event.target).removeClass('active');
                    this.photoInfoReadOnly = true;
                }else{                                      //编辑状态
                    $($event.target).addClass('active');
                    this.photoInfoReadOnly = false;
                    $('.photo-name-input').find('input').focus();
                }
            },
            closeDetailWrapper(){   //关闭本组件
                this.$emit('closeDetailWrapper',true);
            },
            imgLoaded(){    //图片加载完成后，去掉loading，显示图片
                // console.log('加载完成');
                this.showPhoto = true;
            },
            selectPhoto(){
                let that = this;
                var map = {};
                //当前页号
                map['pageNum']= that.selectPhotoInfo.pageNum;
                //每页显示的数据条数
                map['pageSize']= that.selectPhotoInfo.pageSize;	
                //相册名称
                map['albumName']= that.showPhotoDetailInfo.albumName;
                //查询存在的相册列表，如果查询回收站里的列表 isDel=1 
                map['isDel']= 0;	
                //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
                map['arrange']= "DESC";
                var formData=new FormData();
                formData.append("photoPageList",JSON.stringify(map));
                $.ajax({
                    type: "post",  		    
                    url: window.albumReqUrl + "/photo/selectPhotoPageByAlbumName",
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        console.log(data)
                        if(data.code == 1){
                            that.photoDetailInfo = data.value.list[0];
                            that.selectPhotoInfo.hasPreviousPage = data.value.hasPreviousPage;
                            that.selectPhotoInfo.hasNextPage = data.value.hasNextPage;
                        }else{
                            that.$message.error(data.message);  
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });
            },
            updatePhotoInfo(){  //修改相册信息
                let that = this;
                that.$confirm('确认修改相册信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var map = {};
                    //当前照片id  此项必填
                    map['id']= that.showPhotoDetailInfo.queryId;
                    map['photoName']= that.photoDetailInfo.photoName;
                    map['photoDescribe']= that.photoDetailInfo.photoDescribe;
                    var formData=new FormData();
                    formData.append("updatePhotoInfoMap",JSON.stringify(map));
                    $.ajax({
                        type: "post",  
                        url: window.albumReqUrl + "/photo/updatePhotoInfo",
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        data : formData,
                        success:function(data){	
                            console.log(data);
                            if(data.code == 1){
                                that.photoInfoReadOnly = true;  //改为只读状态
                                $('.edit-photo-info-btn').find('i').removeClass('active');
                                that.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                            }else{
                                that.$message.error(data.message);  
                            }
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消修改'
                    });          
                });
            },
           
        },
        mounted(){
            console.log(this.showPhotoDetailInfo);
            this.selectPhotoInfo.pageNum = this.showPhotoDetailInfo.photoIndex;
            this.selectPhoto();
        }
    }
</script>