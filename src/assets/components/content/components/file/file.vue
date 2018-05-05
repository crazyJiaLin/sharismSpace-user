<template>
    <div class="sec-router-wrapper">
        <div class="second-chilren-router-wrapper">
            <div class="second-chilren-router-left-wrapper">
                <div class="blog-list-wrapper album-list-wrapper">
                    <div class="album-breadcrumb-wrapper file-breadcrumb-wrapper">
                        <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item   v-for="(item,key) in breadcrumbList" >
                                <span @click.stop.prevent="rebackBreadcrumb(item.id,key)">{{item.breadcrumb}}</span>
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                        <div class="change-view-btn">
                            <i class="fa fa-th-large"></i>
                        </div>
                    </div>
                    <div class="album-second-router-wrapper file-second-router-wrapper">
                        <div class="file-operate-btns-wrapper">
                            <el-button size="medium" type="primary" plain icon="fa fa-cloud-upload fa-lg">上传</el-button>
                            <el-button @click.stop.prevent="createNewFolder" size="medium" type="primary" plain icon="fa fa-folder-open-o">新建文件夹</el-button>
                            <el-button-group class="file-operate-btns">
                                <el-button size="medium" plain icon="fa fa-share-alt fa-lg fa-lg">分享</el-button>
                                <el-button size="medium" plain icon="fa fa-cloud-download fa-lg">下载</el-button>
                                <el-button size="medium" plain >重命名</el-button>
                                <el-button size="medium" plain >移动到</el-button>
                                <el-button @click.stop="deleteResource" size="medium" plain icon="fa fa-trash-o fa-lg">删除</el-button>
                            </el-button-group>
                        </div>
                        <div class="file-list-wrapper">
                                <el-table ref="multipleTable" :data="fileList" tooltip-effect="dark"
                                    style="width: 100%"  @selection-change="handleSelectionChange"
                                    v-loading="fileListReqInfo.fileListLoading">
                                    <el-table-column type="selection"  width="60" label-class-name="selection-cjl"></el-table-column>
                                    <el-table-column label="文件名" :show-overflow-tooltip="true" sortable min-width="150" prop="name">
                                        <template slot-scope="scope">
                                            <i :class="scope.row.fileType | fileTypeFilter"></i>
                                            <span :class="scope.row.folder == 1 ? 'is-folder' : ''" :title="scope.row.fileDes"
                                            @click="selectFileListById(scope.row.id,scope.row.folder,scope.row.fileName)">
                                                {{ scope.row.fileName }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :show-overflow-tooltip="true" sortable label="大小" width="120"> 
                                        <template slot-scope="scope">
                                            {{scope.row.fileSize | fileSizeFilter}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="createDate" :show-overflow-tooltip="true" sortable label="创建日期" show-overflow-tooltip> </el-table-column>
                                    <el-table-column prop="updateTime" :show-overflow-tooltip="true" sortable label="修改日期" show-overflow-tooltip> </el-table-column>
                              </el-table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="second-chilren-router-right-wrapper">
                <div class="user-blog-info-wrapper">
                    <div class="user-blog-info">
                        <div class="user-portrait-wrapper">
                            <div class="user-info-wrapper">
                                <div class="portrait-line line-top"></div>
                                <div class="portrait-line line-right"></div>
                                <div class="portrait-line line-bottom"></div>
                                <div class="portrait-line line-left"></div>
                                <div class="user-info user-nickname">{{fileUserInfo.userNickname}}</div>
                                <div class="user-info mail">{{fileUserInfo.mail}}</div>
                                <div class="user-info">
                                    <div class="user-info-item user-age">{{fileUserInfo.userAge}}</div>
                                    <div class="user-info-item user-sex" v-html="userSexIcon"></div>
                                    <div class="user-info-item constellation">{{fileUserInfo.constellation}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="blog-info-wrapper">
                            <div class="blog-user-info">
                                <div class="blog-info-label">总文件</div>
                                <div class="blog-info-number">{{fileUserInfo.attentonCount}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">下载</div>
                                <div class="blog-info-number">{{fileUserInfo.attentonedCount}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">积分</div>
                                <div class="blog-info-number">999</div>
                            </div>
                        </div>
                        <div class="show-file-capacity">
                            <div class="show-capacity-info">
                                <span>256.5G/500G</span> 
                                <el-button class="extend-capacity-btn" type="text">扩容</el-button>
                            </div>
                            <el-progress :text-inside="true" :stroke-width="18" :percentage="51.2"></el-progress>
                        </div>
                    </div>
                    <div @click="foldUserInfo" class="hide-user-info-btn"><i class="fa fa-angle-double-right"></i></div>
                </div>                
            </div>
        </div>
    </div>
</template>

<script>
    import './file.css'
    export default{
        computed : {
            userSexIcon(){  //计算属性，将性别数据变为图标
               return this.fileUserInfo.userSex == '女' ? '<i class="fa fa-venus"></i>' : '<i class="fa fa-mars"></i>';
            }
        },
        data(){
            return {
                fileList: [],
                
                breadcrumbList : [
                    // {path:{},breadcrumb:'相册管理'},
                    {id:'root',breadcrumb:'全部文件'}
                ],
                fileUserInfo : {
                    userNickname : 'crazyjialin',
                    iconPath: 'http://photocdn.sohu.com/20110518/Img307890814.jpg',
                    mail : 'crazyjialin@foxmail.com',
                    userAge : 22,
                    userSex : '女',
                    constellation: '处女座',
                    attentonCount : 0,          //关注量
                    attentonedCount : 0,        //被关注量
                    blogOriginal : 0,           //原创
                    blogTransshipment : 0,      //转载
                    blogTranslate : 0           //翻译
                },
                fileListReqInfo : {     //文件列表请求信息
                    fileListLoading : true,  //是否加入表格loading
                    pageNum : 1,
                    pageSize : 20,
                    parentId : 'root',    //父级文件夹的id
                },
                insertResourceInfo : {   //创建资源的请求信息
                    folder : 1,
                    fileName : '',    //文件名
                    fileDes : '',    //文件描述，如果是文件夹，不传
                    fileSize : 0,           //文件大小，文件夹不传
                    filePath : ''           //文件路径，文件夹不传
                },
                manageDataList : []     //操作文件及文件夹的数据数组
            }
        },
        methods : {
            createNewFolder(){          //创建文件夹
                let that = this;
                console.log(this.fileListReqInfo.parentId);
                console.log('新建文件夹 ');
                this.$prompt('文件夹名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPlaceholder : '请输入文件夹名称',
                    inputValidator : function(value){
                        if(value.length == 0){
                            return '啊哦，文件夹名称不能为空 ^8^"'
                        }
                        if(value.length >= 64){
                            return '啊哦，文件夹名长度不能超过64个字符 ^8^"'
                        }
                        if(/[/\\:?？*<>《》|]/i.test(value)){
                            return '文件夹名不能包含以下字符：/ \ : ? ？ * < > 《》|'
                        }
                    },
                }).then(({ value }) => {
                    that.insertResourceInfo.folder = 1;
                    that.insertResourceInfo.fileName = value;
                    that.insertResourceInfo.fileDes = '';
                    that.insertResourceInfo.fileSize = -1;
                    that.insertResourceInfo.filePath = '';
                    
                    that.insertResource();
                }).catch(() => {
                      
                });
            },
            insertResource(){   //添加资源（文件夹和文件通用接口）
                let that = this;
                that.fileListReqInfo.fileListLoading = true;    //打开loading
                var map = {};
                //父级目录id   如果没有父级目录，而是在一级列表创建，则空着，不填
                map['parentId']= that.fileListReqInfo.parentId;
                //是否是文件夹    1:新建文件夹  2：上传的文件
                map['folder']= that.insertResourceInfo.folder;
                //文件夹名称  如果用户未输入 ，可以给一个默认的名称，如果上传的是文件，则这里是文件名称
                map['fileName']= that.insertResourceInfo.fileName;
        //文件类型（如果是文件夹，则空着）
                // map['fileType']="zip";	
                //文件描述    如果是创建文件夹，则不填
                map['fileDes']= that.insertResourceInfo.fileDes;
                //文件大小 单位（kb）  如果是创建文件夹，则不填
                map['fileSize']=that.insertResourceInfo.fileSize;
                //从文件服务器获取的 文件路径 格式如下。 如果是创建文件夹，则不填
                map['filePath']= that.insertResourceInfo.filePath;	

                var formData=new FormData();
                formData.append("resourceInfoMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url:window.resourceReqUrl + "/resource/saveResource",
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    success:function(data){	    
                        if(data.code == 1){
                            if(that.insertResourceInfo.folder == 1){    //说明是创建文件夹
                                that.$message({
                                    type : 'success',
                                    message : '创建文件夹成功'
                                });
                            }else{
                                that.$message({
                                    type : 'success',
                                    message : '上传文件成功'
                                });
                            }
                            that.getFileList();
                        }else{
                            that.$message.error(data.message);  
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });
            },
            rebackBreadcrumb(queryId,index){    //回退面包屑
                
                if(index >= this.breadcrumbList.length-1){
                    return;
                }
                // 改变面包屑
                this.breadcrumbList.splice(index+1,this.breadcrumbList.length-index);
                console.log(queryId,index);
                this.fileListReqInfo.parentId = queryId;
                this.fileListReqInfo.fileListLoading = true;
                this.getFileList();
            },
            selectFileListById(queryId,folder,fileName){    //点击文件或者文件列表，进行查询
                let that = this;
                // console.log(folder);
                // console.log(fileName);  
                if(folder != 1){    //说明点击的不是文件夹，return
                    return;
                }
                //添加面包屑
                let newBreadcrumb = {id:queryId,breadcrumb:fileName};
                that.breadcrumbList.push(newBreadcrumb);
                
                //进行文件夹查询
                that.fileListReqInfo.fileListLoading = true;
                that.fileListReqInfo.parentId = queryId;    //设置文件夹查询id为传入id
                that.getFileList();
                
            },
            getFileList(){  //获取文件列表
                let that = this;
                var map = {};		
                //当前页号
                map['pageNum']= that.fileListReqInfo.pageNum;
                //每页显示的数据条数
                map['pageSize']= that.fileListReqInfo.pageSize;		
                map['del']= 0;		
                //父级目录id  如果是没有父级目录，而是刚进入文件模块的列表，就空着。
                //如果是进入某个文件夹，则填写该文件夹的id
                map['parentId']= that.fileListReqInfo.parentId;   
                console.log('开始获取文件列表，查询id：'+that.fileListReqInfo.parentId);                 
                var formData=new FormData();
                formData.append("resourcePageMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url: window.resourceReqUrl + "/resource/ResourceList",
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    success:function(data){
                        console.log(data)
                        if(data.code == 1){
                            that.fileList = data.value.list;    //回显数据到data
                            that.fileListReqInfo.fileListLoading = false;   //关闭loading
                        }else{
                            that.$message.error(data.message);
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });	
            },
            handleSelectionChange(val) {
                this.manageDataList = val;
                console.log(val);
            },
            deleteResource(){   //删除资源
                let that = this;
                if(that.manageDataList.length <=0){
                    return that.$message({
                        type : 'warning',
                        message : '请选择文件'
                    });
                }
                that.$confirm('确认删除选中的文件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    that.fileListReqInfo.fileListLoading = true;    //打开loading
                    //传入文件id，多个照片用逗号隔开  英文状态下的逗号
                    let ids ="";		
                    console.log(that.manageDataList);
                    for(let i=0;i<that.manageDataList.length;i++){
                        console.log('进入循环');
                        ids += that.manageDataList[i].id + ',';
                    }                    
                    console.log('ids'+ids);
                    var formData=new FormData();
                    formData.append("resourceArrayList",ids);
                    $.ajax({
                        type: "post",  
                        url: window.resourceReqUrl + "/resource/deleteResource",
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        data : formData,
                        success:function(data){	
                            console.log(data)
                            if(data.code == 1){
                                that.$message({
                                    type : 'success',
                                    message : '删除成功'
                                });
                                that.getFileList();
                            }else{
                                that.$message.error(data.message); 
                            }
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });
                }).catch(() => {});
                
               
                
            },
            foldUserInfo(){     //折叠用户信息
                if($('.second-chilren-router-wrapper').hasClass('close-user')){
                    $('.second-chilren-router-wrapper').removeClass('close-user');
                    $('.hide-user-info-btn i').removeClass('fa-rotate-180');
                }else{
                    $('.second-chilren-router-wrapper').addClass('close-user');
                    $('.hide-user-info-btn i').addClass('fa-rotate-180');
                }
            },
        },
        mounted(){
            this.getFileList();
        }
    }
</script>