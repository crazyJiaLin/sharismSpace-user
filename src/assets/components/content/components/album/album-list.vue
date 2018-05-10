<template>
    <div class="album-children-router" >
        <div class="album-folder-list-wrapper" v-loading="albumInfo.albumListLoading">
             <div @click="createAlbum" class="album-box add-album-wrapper animated pulse">
                <i class="fa fa-plus"></i>
            </div>
            <div class="album-box favorite-album animated pulse">
                <div class="favorite-album-icon-wrapper"><span class="animated fadeIn">我的最爱</span><i class="fa fa-heartbeat"></i></div>
                <div class="img-list-wrapper"><img src="./images/studio_0002.jpg" /></div>
            </div>
            <div @click.stop.parent="showPhotoList($event)" v-for="(item,key) in albumList" :albumname="item.albumName" :albumid="item.id" :key="key" class="album-box albums-tab-thumb sim-anim-1 animated pulse">
                <div class="img-list-wrapper"><img src="./images/studio_0001.jpg" /></div>
                <div class="img-list-wrapper"><img src="./images/studio_0002.jpg" /></div>
                <div class="img-list-wrapper"><img src="./images/studio_0003.jpg" /></div>
                <div class="img-list-wrapper"><img src="./images/studio_0004.jpg" /></div>
                <div class="img-list-wrapper"><img :src="item.iconPath" /></div>
                <div class="album-title-wrapper animated fadeIn">
                    <div class="album-setting">
                        <el-dropdown  @command="handleAlbumManage" trigger="hover">
                            <span class="el-dropdown-link">
                                <i class="fa fa-cog"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="rename" :albumid="item.id" :albumname="item.albumName">重命名</el-dropdown-item>
                                <el-dropdown-item command="delete" :albumid="item.id">删除相册</el-dropdown-item>
                                <el-dropdown-item command="setting" :albumid="item.id">相册设置</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="album-title">{{item.albumName}}</div>
                    <!-- <div class="album-description">这里是相册描述这里是相册描述这里是相册描述这里是相册描述</div> -->
                    <div class="album-createDate"><span>{{item.createDate}}</span></div>
                    
                    <div class="album-privacy">
                        <i v-if="item.privacySet" class="fa fa-eye-slash"></i>
                        <i v-if="item.albumPassword" class="fa fa-lock"></i>
                    </div>
                </div>
            </div>
            <div v-if="albumInfo.showBlogListLoading" class="album-list-loading" v-html="albumInfo.loadingHTML"></div>
        </div>
        <!-- 添加博客模态框 -->
        <el-dialog inline="true" title="创建相册" :visible.sync="dialogFormVisible" width="500px">
            <el-form :model="createAlbumForm" :rules="createAlbumFormRules" ref="createAlbumForm" class="create-alum-dialog">
                <el-form-item label="相册名称" prop="albumName" :label-width="formLabelWidth">
                    <el-input v-model="createAlbumForm.albumName" auto-complete="off" placeholder="请输入相册名称"></el-input>
                </el-form-item>
                <el-form-item label="相册标签" :label-width="formLabelWidth">
                    <el-tag
                        :key="tag"
                        v-for="tag in createAlbumForm.albumSort"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-form-item label="公开相册" :label-width="formLabelWidth">
                            <el-switch v-model="createAlbumForm.privacySet"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="17" :offset="3">
                        <el-form-item label="密码保护" :label-width="formLabelWidth">
                            <el-col :span="4">
                                <el-switch v-model="createAlbumForm.setPassword"></el-switch>
                            </el-col> 
                            <el-col :span="18" :offset="2">
                                    <el-input type="password" :disabled="!createAlbumForm.setPassword" v-model="createAlbumForm.password" auto-complete="off" placeholder="请输入相册密码"></el-input>
                            </el-col> 
                        </el-form-item>
                    </el-col>
                </el-row>               
                <el-form-item label="相册描述" prop="description" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="createAlbumForm.description"></el-input>
                </el-form-item>
                <el-form-item label="上传封皮" :label-width="formLabelWidth">
                    <el-col class="select-album-btn-wapper" :span="12">
                        <el-button @click="clickToSelectAlbumIcon($event)">选择封皮</el-button>
                        <input accept="image/*" v-show="false" class="album-icon-file-input" type="file" @change="selectAlbumIcon($event,'new')"/>
                        <!-- <input @change="selectAlbumIcon($event)" class="album-icon-file-input" type="file" ></input> -->
                    </el-col> 
                    <el-col :span="12" >
                        <div class="preview-album-icon-wrapper" v-html="createAlbumForm.previewAlbumIconHTML"></div>
                        <!-- <div class="preview-album-icon-wrapper"><i class="fa fa-spinner fa-spin"></i>&nbsp;上传中...</div> -->
                        <!-- <div class="preview-album-icon-wrapper">
                            <img src="http://118.25.48.91:8000/group2/M00/00/01/CpqBPFrNY8eARTXnAAFO_mKpm5I052.jpg" alt="">
                        </div> -->
                    </el-col> 
                   
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitNewAlbumForm('createAlbumForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog inline="true" title="修改相册信息" :visible.sync="updateAlbumInfoDialogVisble" width="500px">
            <el-form :model="updateAlbumInfo" :rules="createAlbumFormRules" ref="updateAlbumInfo" class="create-alum-dialog">
                <el-form-item label="相册标签" :label-width="formLabelWidth">
                    <el-tag
                        :key="tag"
                        v-for="tag in updateAlbumInfo.albumSort"
                        closable
                        :disable-transitions="false"
                        @close="handleClose2(tag)">
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-form-item label="公开相册" :label-width="formLabelWidth">
                            <el-switch v-model="updateAlbumInfo.privacySet"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="17" :offset="3">
                        <el-form-item label="密码保护" :label-width="formLabelWidth">
                            <el-col :span="4">
                                <el-switch v-model="updateAlbumInfo.setPassword"></el-switch>
                            </el-col> 
                            <el-col :span="18" :offset="2">
                                    <el-input type="password" :disabled="!updateAlbumInfo.setPassword" v-model="updateAlbumInfo.password" auto-complete="off" placeholder="请输入相册密码"></el-input>
                            </el-col> 
                        </el-form-item>
                    </el-col>
                </el-row>               
                <el-form-item label="相册描述" prop="description" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="updateAlbumInfo.description"></el-input>
                </el-form-item>
                <el-form-item label="上传封皮" :label-width="formLabelWidth">
                    <el-col class="select-album-btn-wapper" :span="12">
                        <el-button @click="clickToSelectAlbumIcon($event)">选择封皮</el-button>
                        <input v-show="false" class="album-icon-file-input" type="file" @change="selectAlbumIcon($event,'update')"/>
                        <!-- <input @change="selectAlbumIcon($event)" class="album-icon-file-input" type="file" ></input> -->
                    </el-col> 
                    <el-col :span="12" >
                        <div class="preview-album-icon-wrapper" v-html="updateAlbumInfo.previewAlbumIconHTML"></div>
                        <!-- <div class="preview-album-icon-wrapper"><i class="fa fa-spinner fa-spin"></i>&nbsp;上传中...</div> -->
                        <!-- <div class="preview-album-icon-wrapper">
                            <img :src="updateAlbumInfo.iconPath" alt="图片预览">
                        </div> -->
                    </el-col> 
                   
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateAlbumInfoDialogVisble = false">取 消</el-button>
                <el-button type="primary" @click="updateAlbumForm('updateAlbumInfo')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default{
       
        data(){
            return{
                updateAlbumInfoDialogVisble : false,
                updateAlbumInfo : {
                    id : "",
                    albumName: '',
                    albumSort : [],
                    privacySet : true,
                    setPassword : false,
                    password : '',
                    description : '',
                    albumIcon : 'default',
                    previewAlbumIconHTML : '<span>封皮最佳尺寸 300x200px</span>',    //预览容器中的内容
                    iconPath : ''   //封皮地址
                },
                inputVisible: false,
                inputValue: '',
                dialogTableVisible: false,
                dialogFormVisible: false,
                createAlbumForm: {
                    albumName: '',
                    albumSort : [],
                    privacySet : true,
                    setPassword : false,
                    password : '',
                    description : '',
                    previewAlbumIconHTML : '<span>封皮最佳尺寸 300x200px</span>',    //预览容器中的内容
                    albumIcon : 'default', 
                    iconPath : ''   //封皮地址
                },
                createAlbumFormRules: {
                    albumName: [
                        { required: true, message: '请输入相册名称', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入相册描述', trigger: 'blur' },
                        { max: 100, message: '不能超过100字哦~', trigger: 'blur' }
                    ],
                },
                formLabelWidth: '80px',
                albumInfo : {
                    getAlbumListBool : true,    //控制请求的发送，每次滚动只发送一次请求
                    pageSize : 7,            //默认刚开始显示最多相册数
                    hasNextPage : false,     //默认没有下一页
                    albumListLoading : false,   //是否开启列表加载图
                    showBlogListLoading : false,    //是否显示按需加载底部信息
                    loadingHTML : '<i class="fa fa-circle-o-notch fa-spin"></i>'
                },
                albumList : [
                    // {
                    //     id : "",
                    //     albumIcon : "default",
                    //     albumName : "相册名称",
                    //     albumPassword : "",
                    //     albumSort : "相册分类",
                    //     createDate : "2018-04-13",
                    //     description : "相册描述",
                    //     iconPath : '',
                    //     privacySet : 1
                    // }
                ]
            }
        },
        methods : {
            showPhotoList($event){
                if($($event.target).parents('.album-setting').length == 0){ //判断，如果不是setting按钮，跳转到详情
                    // var queryId = $($event.target).parents('.album-box ').attr('albumid');
                    var albumName = $($event.target).parents('.album-box ').attr('albumname');
                    window.location.hash = '#/album/detail/'+albumName;
                }
                
            },
            handleAlbumManage(command,$event){
                let queryId = $($event.$el).attr('albumid');
                if(command == 'rename'){
                    let oldName = $($event.$el).attr('albumname');
                    this.renameAlbumName(queryId,oldName);
                }else if(command == 'delete'){
                    this.deleteAlbum(queryId);
                }else if(command == 'setting'){
                    this.getAlbumInfoById(queryId);
                }
            },
            getAlbumInfoById(queryId){  //点击修改后，查询对应相册信息，显示到对话框上
                let that = this;
                that.updateAlbumInfoDialogVisble = true;
                var id = queryId;		
                var formData=new FormData();
                formData.append("albumId",id);
                
                $.ajax({
                    type: "post",  
                    url: window.albumReqUrl + "/album/selectAlbumById",
                    contentType: false, 
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        console.log(data)
                      	if(data.code == 1){
                            that.updateAlbumInfo.id = data.value.id;
                            that.updateAlbumInfo.albumName = data.value.albumName;
                            that.updateAlbumInfo.albumSort = data.value.albumSort.split(',');
                            that.updateAlbumInfo.description = data.value.description;
                            that.updateAlbumInfo.previewAlbumIconHTML = '<img src="'+data.value.iconPath+'" alt="图片预览">';
                            that.updateAlbumInfo.iconPath = data.value.iconPath;
                            that.updateAlbumInfo.privacySet = data.value.privacySet==0 ? true : false;
                            that.updateAlbumInfo.setPassword = data.value.setPassword==1? true : false;
                            console.log(that.updateAlbumInfo);
                        }else{
                            that.$message.error(data.message);  
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });

            },
            deleteAlbum(queryId){   //删除相册
                let that = this;
                console.log(queryId);
                this.$confirm('确定删除本相册以及相册内所有图片？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log('删除相册');
                    var albumId = queryId;
                    var formData=new FormData();
                    formData.append("albumId",albumId);
                    $.ajax({
                        type: "post",  		   
                        url: window.albumReqUrl + "/album/deleteAlbumById",
                        contentType: false, 
                        processData: false,
                        dataType: 'json',
                        data : formData,
                        success:function(data){	
                            console.log(data)
                            if(data.code == 1){
                                that.$message({
                                    type : 'success',
                                    message : '删除相册成功'
                                });
                                that.getAlbumList();    //重新获取相册列表
                            }else{
                                that.$message.error(data.message);  
                            }
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });
                  
                }).catch(() => {
                });
            },
            renameAlbumName(queryId,oldName){
                let that = this;
                // console.log('rename'+queryId,oldName);
                this.$prompt('请输入相册名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:  /^.{1,10}$/,
                    inputValue : oldName,
                    inputErrorMessage: '长度在1~10之间哦 ^8^'
                }).then(({ value }) => {
                    if(value == oldName){
                        return;
                    }
                    var map = {};
                    //当前相册id  此项必填
                    map['id']= queryId;
                    //修改相册名称
                    map['albumName']= value;
                    var formData=new FormData();
                    formData.append("updateAlbumInfoMap",JSON.stringify(map));
                    $.ajax({
                        type: "post",   		    
                        url: window.albumReqUrl + "/album/updateAlbumInfo",
                        contentType: false, 
                        processData: false,
                        dataType: 'json',
                        data : formData,
                        success:function(data){	
                            // console.log(data)
                            if(data.code == 1){
                                that.$message({
                                    type : 'success',
                                    message : '重命名相册成功'
                                });
                                that.getAlbumList();
                            }else{
                                that.$message.error(data.message);  
                            }
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });

                }).catch(() => {
                });
            },
            clickToSelectAlbumIcon($event){ //点击上传封皮按钮，转移点击事件到file-input
                let $albumIconFileInput = $($event.target).parents('.select-album-btn-wapper').find('.album-icon-file-input');
                $albumIconFileInput.click();
                // $('album-icon-file-input').click();
            },
            selectAlbumIcon($event,command){    //选择了图片后，上传图片并显示预览图
                let that = this;
                console.log(command);   //通过传入参数判断是更新还是新建
                if(command == 'new'){
                    that.createAlbumForm.previewAlbumIconHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp;上传中...';
                }else{
                    that.updateAlbumInfo.previewAlbumIconHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp;上传中...';
                }
                // console.log($event.target.files[0]);
                //选中图片后，进行文件的上传，并将上传后返回的结果添加到预览图上
                var file = $event.target.files[0];
                var formData=new FormData();
                    formData.append("file",file);
                $.ajax({
                    type: "post",          
                    url: window.fileReqUrl + "/file/upload",
                    contentType: false,         
                    processData: false, //必须false才会自动加上正确的Content-Type
                    dataType :'json',   //或者text
                    data : formData,
                    success:function(data){	    
                        console.log(data);	
                        if(data.code == 1){
                            if(command == 'new'){
                                that.createAlbumForm.previewAlbumIconHTML = '<img src="'+ data.value +'" alt="">';  //添加预览图
                                that.createAlbumForm.iconPath  = data.value;
                            }else{
                                that.updateAlbumInfo.previewAlbumIconHTML = '<img src="'+ data.value +'" alt="">';  //添加预览图
                                that.updateAlbumInfo.iconPath  = data.value;
                            }
                            that.$message({
                                type : 'success',
                                message : '上传封皮图片成功'
                            });
                        }else{
                            that.$message.error(data.message);  
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                }); 

            },
            submitNewAlbumForm(formName){   //点击创建表单对话层中的确认按钮，进行表单校验和提交表单信息
                let that = this;
                console.log(that.createAlbumForm)
                that.$refs[formName].validate((valid) => {
                    if (valid) {    //如果表单校验没有错误，在这里进行提交操作
                        var map = {};
                        //相册分类  人物   风光  动物 卡通   生活  工作  旅行   纪实  生态   建筑  商业
                        map['albumSort']= that.createAlbumForm.albumSort.toString();
                        //相册描述
                        map['description']= that.createAlbumForm.description;
                        //相册名称
                        map['albumName']= that.createAlbumForm.albumName;
                        //相册权限（公开/隐藏）1公开 0隐藏（仅自己可看）
                        map['privacySet']= that.createAlbumForm.privacySet ? 0 : 1;
                        //相册密码
                        map['setPassword']= that.createAlbumForm.setPassword ? 1 : 0;   //是否开启密码
                        map['albumPassword']= that.createAlbumForm.password;    //密码
                        //相册封面图标标识   如果用户没有自定义封面 设置为"default"
                        map['albumIcon']= that.createAlbumForm.albumIcon;
                        //相册封面图标路径 url		
                        map['iconPath']=    that.createAlbumForm.iconPath;
                        map['showStyle']=   '风格1';
                        var formData=new FormData();
                        formData.append("createAlbumMap",JSON.stringify(map));
                        $.ajax({
                        type: "post",  		  		    
                            url: window.albumReqUrl + "/album/createAlbum",
                            contentType: false,            
                            processData: false, 
                            dataType: 'json',
                            data : formData,
                            success:function(data){	
                                console.log(data)
                                if(data.code == 1){
                                    that.$refs['createAlbumForm'].resetFields();//重置表单
                                    that.createAlbumForm.albumSort = [];
                                    that.createAlbumForm.previewAlbumIconHTML = '<span>封皮最佳尺寸 300x200px</span>';
                                    that.createAlbumForm.setPassword = false;
                                    that.createAlbumForm.password = '';
                                    that.dialogFormVisible = false;
                                    that.getAlbumList();    //重新获取相册列表
                                }else{
                                    that.$message.error(data.message);  
                                }
                            }, 				 
                            error:function(){  
                                that.$message.error("服务器开小差了~稍后重试 ^8^");  
                            }  
                        });

                    } else {    //表单信息有误
                        that.$message.error('亲，表单信息有误，请重新填写哦~');
                        return false;
                    }
                });
            },
            updateAlbumForm(formName){  //相册更新
                let that = this;
                // console.log(that.createAlbumForm)
                var map = {};
                //当前相册id  此项必填
                map['id']= that.updateAlbumInfo.id;
                //以下信息 根据实际情况设置，比如只修改了 albumSort ，就只传map['albumSort']="xxx" 一个就可以，改哪个就传哪个 
                //修改相册分类 
                map['albumSort']= that.updateAlbumInfo.albumSort.toString();
                //修改相册描述
                map['description']= that.updateAlbumInfo.description;
                //相册权限（公开/隐藏）1公开 0隐藏（仅自己可看）
                map['privacySet']= that.updateAlbumInfo.privacySet ? 0 : 1;
                //相册密码
                map['setPassword']= that.updateAlbumInfo.setPassword ? 1 : 0;   //是否开启密码
                map['albumPassword']= that.updateAlbumInfo.password;    //密码
                //相册封面图标标识   如果用户没有自定义封面 设置为"default"
                map['albumIcon']= that.updateAlbumInfo.albumIcon;
                //相册封面图标路径 url		
                map['iconPath']=    that.updateAlbumInfo.iconPath;
                
                var formData=new FormData();
                formData.append("updateAlbumInfoMap",JSON.stringify(map));
                $.ajax({
                type: "post",  		  		    
                    url: window.albumReqUrl + "/album/updateAlbumInfo",
                    contentType: false,            
                    processData: false, 
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        console.log(data)
                        if(data.code == 1){
                            that.updateAlbumInfoDialogVisble = false;
                            that.getAlbumList();    //重新获取相册列表
                            that.$message({
                                type : 'success',
                                message: '相册修改成功！'
                            });
                        }else{
                            that.$message.error(data.message);  
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });
            },
            showInput() {       //点击添加标签按钮，显示input
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {      //确认添加标签
                let that = this;
                // if(that.isInArr(that.createAlbumForm.albumSort,that.inputValue)){
                //     console.log('有重复的');
                // }
                let inputValue = that.inputValue;
                if (inputValue) {
                    if(that.isInArr(that.createAlbumForm.albumSort,that.inputValue)){
                        that.$message.error('您已经添加了相应的标签了哦~');
                    }else{
                        that.createAlbumForm.albumSort.push(inputValue);
                    }
                }
                that.inputVisible = false;
                that.inputValue = '';
               
            },
            handleClose(tag) {  //去除标签
                this.createAlbumForm.albumSort.splice(this.createAlbumForm.albumSort.indexOf(tag), 1);
            },
            handleClose2(tag) {  //去除标签
                this.updateAlbumInfo.albumSort.splice(this.updateAlbumInfo.albumSort.indexOf(tag), 1);
            },
            isInArr(arr,value){  //判断元素是否在数组内,如果在，返回true
                for(let i=0; i<arr.length; i++){
                    if(value == arr[i]){ 
                       return true;
                    }
                }
                return false;
            },
            getAlbumList(){     //获取相册列表
                let that = this;
                that.albumInfo.albumListLoading = true; //打开加载动画
                var map = {};
                //当前页号
                map['pageNum']=1;
                //每页显示的数据条数
                map['pageSize']= that.albumInfo.pageSize;	
                //查询存在的相册列表，如果查询回收站里的列表 isDel=1 
                map['isDel']=0;	
                var formData=new FormData();
                formData.append("albumPageMap",JSON.stringify(map));
                $.ajax({
                    type: "post",  		    
                    url:window.albumReqUrl + "/album/albumList",
                    contentType: false,
                    processData: false,		   
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        console.log(data)
                        if(data.code == 1){
                            that.albumList = data.value.list;
                            that.albumInfo.albumListLoading = false;                 //关闭加载动画
                            that.albumInfo.pageSize = that.albumInfo.pageSize + 6;   //每次请求相册数量+6
                            that.albumInfo.getAlbumListBool = true;                 //打开请求开关
                            that.albumInfo.hasNextPage = data.value.hasNextPage;    //通过数据设置是否有下一页
                            if(data.value.pageSize <= 7){
                                that.albumInfo.showBlogListLoading = false;         //如果相册个数小于7,关闭加载小按钮  
                            }else{
                                that.albumInfo.showBlogListLoading = true;          //大于7，打开列表下方加载图标
                            }
                            
                            if(data.value.hasNextPage){    
                                that.albumInfo.loadingHTML = '<i class="fa fa-circle-o-notch fa-spin"></i>'
                            }else{  //如果没有下一页，将加载图标换为没有的文字
                                that.albumInfo.loadingHTML = '<span>啊哦，您没有更多相册了~ ^8^<span>'
                            }
                               
                        }else{
                            that.$message.error(data.message);  
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });
            },
            bindAlbumListScrollEvent(){  //绑定相册列表滚动事件，实现按需加载
                let that = this;
                $('.blog-list-wrapper').on('scroll',function(){
                    if(!that.albumInfo.getAlbumListBool){ 
                        return;
                    }
                    let ScrollTop = $(this)[0].scrollTop,               //子元素相对父元素滚动的距离
                        parentHeight = $(this)[0].offsetHeight,         //父元素的高度
                        childHeight = $(this).find('.album-second-router-wrapper')[0].offsetHeight;   //子元素的高度
                    let dis = childHeight - ScrollTop - parentHeight + 100;  //100是子元素的margin+面包屑高度，默认会少个上下margin
                    // console.log(dis);
                    if(dis <= 20){
                        if(!that.albumInfo.hasNextPage){    //如果没有下一页，不再发送请求
                            return;
                        }
                        that.albumInfo.getAlbumListBool = false;    //关闭请求开关，等数据返回后在吧开关打开，防止请求重复
                        that.getAlbumList();
                    }
                });
            },
            createAlbum(){      //创建相册
                this.dialogFormVisible = true;
            },
            bindAlbumIconFileChangeEvent(){ //给上传封皮input监听change事件，显示预览图
                $('.album-icon-file-input').off('change').on('change',function(){
                    console.log(this);
                });
            },
            stopSettingBtnPropagation(){
                // console.log( $('.album-folder-list-wrapper').find('.album-setting'));
                // $('.album-folder-list-wrapper').on('click','.album-setting',function(ev){
                //     ev.stopPropagation();
                //     ev.preventDefault();
                //     console.log(this);
                // });
            }
        },
        mounted(){
            this.getAlbumList();    //获取相册列表
            this.bindAlbumListScrollEvent();    //绑定相册列表滚动事件，实现按需加载
            this.bindAlbumIconFileChangeEvent();    //给上传封皮input监听change事件，显示预览图
            this.stopSettingBtnPropagation();   //组织设置按钮冒泡
        }
    }
</script>
