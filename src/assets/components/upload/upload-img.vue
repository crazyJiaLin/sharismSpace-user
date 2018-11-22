<template>
    <div class="upload-img-wrapper-wrapper"> 
        <!-- 外部调用方式 -->
        <!-- <UploadImg v-if="showUploadImg" @closeUploadWrapper="closeUploadImg($event)"></UploadImg> -->
        <div class="upload-img-wrapper">
            <div class="upload-img-wrapper-title">
                <span class="model-title">图像上传</span>
                <button @click="closeUploadWrapper" type="button" aria-label="Close" class="el-message-box__headerbtn">
                    <i class="el-message-box__close el-icon-close"></i>
                </button>
            </div>
            <div id="demo" class="demo"></div>
        </div>
    </div>
</template>

<script>
    import './control/css/zyUpload.css'
    import './upload-img.css'
    // import './core/zyFile.js'
    import './control/js/zyUpload.js'
    import './core/jq22.js'
    export default{
        data(){
            return{
                uploadImgList : []
            }
        },
        methods : {
            closeUploadWrapper(){
                this.$emit('closeUploadWrapper',true);
            },
            newUploadInstance(){
                let that = this;
                // 初始化插件
                $("#demo").zyUpload({
                    width            :   "650px",                 // 宽度
                    height           :   "auto",                 // 宽度
                    itemWidth        :   "120px",                 // 文件项的宽度
                    itemHeight       :   "100px",                 // 文件项的高度
                    url              :   window.fileReqUrl + "/file/ueditorImage",  // 上传文件的路径
                    multiple         :   true,                    // 是否可以多个文件上传
                    dragDrop         :   true,                    // 是否可以拖动上传文件
                    del              :   true,                    // 是否可以删除文件
                    finishDel        :   false,  				  // 是否在上传文件完成后删除预览
                    /* 外部获得的回调接口 */
                    onSelect: function(files, allFiles){                    // 选择文件的回调方法
                        // console.info("当前选择了以下文件111：");
                        // console.info(files);
                        // console.info("之前没上传的文件111：");
                        // console.info(allFiles);
                    },
                    onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
                        // file代表删除的文件，surplusFiles代表剩下的文件
                        // console.info("当前删除了此文件222：");
                        // console.info(file.name);
                        for(let i=0; i<that.uploadImgList.length; i++){
                            if(that.uploadImgList[i].title == file.name){
                                that.uploadImgList.splice(i,1);  //删除数组中的这一项
                                break;
                            }
                        }
                    },
                    onSuccess: function(file,response){                    // 文件上传成功的回调方法
                        // console.info("此文件上传成功：");
                        response  = JSON.parse(response);
                        console.log(file)
                        var image = new Image();
                        image.onload = function () {
                            response.width = parseInt(this.width);
                            response.height = parseInt(this.height);
                            // console.log(response);
                            that.uploadImgList.push(response);
                        };
                        image.src = response.url;
                    },
                    onFailure: function(file){                    // 文件上传失败的回调方法
                        console.info("此文件上传失败：");
                        console.info(file);
                    },
                    onComplete: function(responseInfo){           // 所有文件上传完成的回调方法
                        // console.info("外部complet函数收到参数"+responseInfo);
                        that.$message({
                            type : 'success',
                            message : '全部上传成功'
                        });
                        // console.info(responseInfo);
                    },
                    onEnd : function(msg){      //组件内部点击结束上传时的回调函数
                        // console.log(that.uploadImgList);
                        that.$emit('uploadEnd',that.uploadImgList); //将当前上传成功的图片信息返回到父组件
                    },
                    onAlert : function(msg){    //组件内部回调弹窗函数，用vue实现良好的提示
                        that.$message.error(msg);
                    }
                });
            }
        },
        mounted(){
            this.newUploadInstance();
        }
    }
</script>