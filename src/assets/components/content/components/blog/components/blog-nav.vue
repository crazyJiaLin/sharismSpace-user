<template>
        <div class="blog-nav-wrapper">
            <div class="blog-nav">
                <div v-if="!hasBlogType" class="no-blog-type-wrapper">
                    您还没有创建文集，点击下面的按钮，马上给你的博客建一个归宿吧 (๑• . •๑)
                </div>
                <div class="add-blog-folder-wrapper">
                    <el-button @click="foldAddBlogFolderWrapper" plain>新建文集</el-button>
                    <el-form :model="ruleForm" :rules="rules" :status-icon="true" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
                        <el-form-item label-width="0" prop="name">
                            <el-input v-model="ruleForm.name" placeholder="请输入文集名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
                            <el-button @click="resetForm('ruleForm')">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-menu default-active="1-4-1" @select="getBlogListBySelectedType" class="blog-nav-content el-menu-vertical-demo" :collapse="false">
                    <el-submenu v-for="(item,key) in blogTypeList" :index="item.key+'+'+key">
                        <template slot="title" class="cjl">
                            <span slot="title">{{item.key}}</span>
                            <i @click.stop.prevent="editFolderName($event)" class="eidt-folder-btn fa fa-edit"></i>
                            <i @click.stop.prevent="deleteFolder($event)" class="delete-folder-btn fa fa-trash-o"></i>
                        </template>
                        <div class="add-blog-type-wrapper">
                            <el-button plain class="add-blog-type-btn" size="mini">添加分类</el-button>
                            <div class="add-blog-type-form-wrapper">
                                <el-form :inline="true" size="mini" class="demo-form-inline">
                                    <el-form-item style="width:150px;">
                                        <el-input class="blog-type-name-input" placeholder="请输入分类名称"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button class="go-add-blog-type-btn" type="primary">确认</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button class="cancel-add-blog-Type">取消</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <el-menu-item v-for="(item2,key2) in item.value" :index="item2.blogType+'+'+key" :blogtypename="item2.blogType" :blogtypeid="item2.id">
                            {{item2.blogType}}
                            <i @click.stop.prevent="eidtBlogType($event)" class="manage-blog-type-btn eidt-blog-type-btn fa fa-edit"></i>
                            <i @click.stop.prevent="deleteBlogType($event)" class="manage-blog-type-btn delete-blog-type-btn fa fa-trash-o"></i>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
            <div @click="showBlogNav" class="show-blog-nav-btn"><i class="fa fa-angle-double-right"></i></div>
        </div>
</template>

<script>
    export default  {
        data(){
            return{
                hasBlogType : false,
                ruleForm: {
                    name: '',
                },
                rules: {
                    name: [
                        { required: true, message: '文集名不能为空哦 ^8^', trigger: 'blur' },
                        { min: 1, max: 10, message: '长度1到10个字符哦 ^8^', trigger: 'blur' }
                    ]
                },
                blogTypeList : []
            }
        },
        methods : {
            getBlogListBySelectedType(index,indexPath){
                let classify = indexPath[0].split('+')[0];
                let blogType = index.split('+')[0];
                let blogTypeInfo = {
                    classify : classify,
                    blogType : blogType
                }
                this.$emit('blogTypeInfo',blogTypeInfo);
                // this.$emit('blogType',blogType);
            },
            eidtBlogType($event){       //修改二级分类名
                let that = this;
                let parentDOM = $($event.target).parent('.el-menu-item');
                let editClassify = parentDOM.parents('.el-submenu').find('.el-submenu__title span').html()
                let queryId = $(parentDOM).attr('blogtypeid');
                let oldBlogTypeName = $(parentDOM).attr('blogtypename');
                // let blogTypeName = $(parentDOM).find('.blog-type-name').html();
                this.$prompt('请输入分类名称名称', '重命名', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue : oldBlogTypeName,   //显示初始文本
                inputPattern:  /^.{1,10}$/,
                inputErrorMessage: '长度在1~10之间哦 ^8^'
                }).then(({ value }) => {
                    if(value == oldBlogTypeName){
                        return;
                    }
                    var map = {};
                    //要更新的分类id 必填
                    map['id']= queryId;
                    //要更新的博客类型 必填
                    map['blogType']= value;

                    var formData=new FormData();
                    formData.append("updateBlogTypeMap",JSON.stringify(map));
                    $.ajax({
                        type: "post",        
                        url: window.blogReqUrl +  "/blogtype/updateBlogType",
                        contentType: false, 
                        processData: false, 
                        dataType: 'json',
                        data : formData,
                        success:function(data){	    
                            // console.log(data)
                            if(data.code == 1){
                                that.getBlogType(); //修改完成后，重新获取文章列表信息  
                                let newBlogType = {
                                    classify : editClassify,
                                    blogType : value
                                };
                                that.$emit('changeBlogType',newBlogType);    //向父级发送修改博客列表信息的请求
                                that.$message({
                                    type: 'success',
                                    message: '修改文集名称成功'
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
                        message: '您已取消修改'
                    });       
                });
                

            },
            deleteBlogType($event){     //删除二级分类
                let that = this;
                let parentDOM = $($event.target).parent('.el-menu-item');
                let queryId = $(parentDOM).attr('blogtypeid');
                that.$confirm('为了您的操作更加安全，我们将再您删除本分类后将文章放入回收站 ', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //在这里进行删除操作
                    // console.log('在这里进行删除文集');
                    var formData=new FormData();
                    formData.append("blogTypeId",queryId);
                    $.ajax({
                        type: "post",        
                        url: window.blogReqUrl + "/blogtype/deleteBlogType",
                        contentType: false, 
                        processData: false, 
                        dataType: 'json',
                        data : formData,
                        success:function(data){	 
                            // console.log('删除分类');  
                            // console.log(data);
                            if(data.code == 1){
                                that.$message({
                                    type: 'success',
                                    message: '删除分类成功'
                                });   
                                that.getBlogType();
                                let newBlogType = {
                                    classify : '',
                                    blogType : ''
                                };
                                that.$emit('changeBlogType',newBlogType);    //向父级发送修改博客列表信息的请求，这里是删除，删除后请求全部数据，将blogType变为空值
                            }else{
                                that.$message.error(data,message);  
                            }
                            
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
                

            },
            editFolderName($event){     //修改文集名
                let that = this;
                let parentDOM = $($event.target).parent('.el-submenu__title');
                let oldFoldName = parentDOM.find('span').html();
                // console.log(oldFoldName);

                this.$prompt('请输入文集名称', '重命名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:  /^.{1,10}$/,
                    inputValue : oldFoldName,
                    inputErrorMessage: '长度在1~10之间哦 ^8^'
                    }).then(({ value }) => {
                        if(value == oldFoldName){
                            return;
                        }
                        // console.log('修改一级标题'+value);   //value为输入框内容
                        var map = {};
                        //要更新哪一个分类名称
                        map['classifyOld']= oldFoldName;
                        //要更新后的一级分类名称
                        map['classify']= value;
                        var formData=new FormData();
                        formData.append("updateFirstClassBlogType",JSON.stringify(map));
                        $.ajax({
                            type: "post",        
                            url: window.blogReqUrl + "/blogtype/updateFirstClassBlogType",
                            contentType: false, 
                            processData: false, 
                            dataType: 'json',
                            data : formData,
                            success:function(data){	  
                                // console.log(data);
                                if(data.code == 1){
                                    that.getBlogType(); //修改完成后，重新获取文章列表信息  
                                }else{
                                    that.$message.error(data.message);
                                }
                                
                            }, 				 
                            error:function(){  
                                this.$message.error("服务器开小差了~稍后重试 ^8^");  
                            }  
                        });

                    this.$message({
                        type: 'success',
                        message: '修改文集名称成功'
                    });
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '您已取消修改'
                    });       
                });
            },
            deleteFolder($event){         //删除文集
                let that = this;
                let parentDOM = $($event.target).parent('.el-submenu__title');
                let oldFoldName = parentDOM.find('span').html();    //要删除的文集名称
                that.$confirm('此操作将永久删除该文集，以及该文集下所有博客, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //在这里进行删除操作
                    // console.log('在这里进行删除文集');
                    //要删除的一级分类名称
                    let formData=new FormData();
                    formData.append("classify",oldFoldName);
                    $.ajax({
                        type: "post",        
                        url: window.blogReqUrl + "/blogtype/deleteBlogClassify",
                        contentType: false, 
                        processData: false, 
                        dataType: 'json',
                        data : formData,
                        success:function(data){	    
                            // console.log(data);
                            if(data.code == 1){
                                that.$message({
                                    type: 'success',
                                    message: '删除文集成功'
                                });   
                                that.getBlogType();
                            }else{
                                that.$message.error(data,message);  
                            }
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });

                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            foldAddBlogFolderWrapper(){
                $('.add-blog-folder-wrapper').addClass('active');
            },
            submitForm(formName) {      //添加文集名称
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //提交创建文集
                        var map = {};
                        //博客分类  必填
                        map['classify']= that.ruleForm.name;
                        var formData=new FormData();
                        formData.append("blogTypeMap",JSON.stringify(map));
                        $.ajax({
                            type: "post",        
                            url: window.blogReqUrl + "/blogtype/addBlogType",
                            contentType: false, 
                            processData: false, 
                            dataType: 'json',
                            data : formData,
                            success:function(data){	 
                                // console.log(data);	
                                if(data.code == 1){
                                    that.getBlogType();	
                                    that.resetForm('ruleForm');
                                }else{
                                    that.$message.error(data.message);  
                                }
                                
                            }, 				 
                            error:function(){  
                                that.$message.error("服务器开小差了~稍后重试 ^8^");  
                            }  
                        });

                    } else {
                        that.$message.error('表单信息有误，请重新填写哦 -_-||');
                        return false;
                    }
                });
            },
            resetForm(formName) {       //重置添加文集表单
                this.$refs[formName].resetFields();
                $('.add-blog-folder-wrapper').removeClass('active');
            },
            showBlogNav(){
                if($('.blog-nav-wrapper').hasClass('active')){
                    $('.blog-nav-wrapper').removeClass('active');
                    $('.second-chilren-router-wrapper').removeClass('show-blog-nav');
                    $('.show-blog-nav-btn i').removeClass('fa-rotate-180');
                }else{
                    $('.blog-nav-wrapper').addClass('active');
                    $('.second-chilren-router-wrapper').addClass('show-blog-nav');
                    $('.show-blog-nav-btn i').addClass('fa-rotate-180');
                }
            },
            getBlogType(){          //获取博客分类信息
                let that = this;
                var map = {};
                //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
                map['arrange']="ASC";
                //1为 正常列表  0为回收站列表
                map['isDelete']=0;
                var formData=new FormData();
                formData.append("blogTypeMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url: window.blogReqUrl+ "/blogtype/selectBlogType",
                    contentType: false, 
                    processData: false, 
                    dataType: 'json',
                    data : formData,
                    success:function(data){	    
                        // console.log(data)
                         if(data.code == 1){
                            if(data.value.length <= 0){
                                that.hasBlogType = false;
                            }else{
                                that.hasBlogType = true;
                            }
                           that.blogTypeList = data.value;
                        }else{
                            that.$message.error(data.message);
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });
            },
            bindaddBlogTypeEvent(){
                let that = this;
                // console.log($('.blog-nav-wrapper .blog-nav-content'));
                //绑定展开二级分类按钮事件
                $('.blog-nav-wrapper .blog-nav-content').on('click','.add-blog-type-btn',function(){
                    $(this).parents('.add-blog-type-wrapper').addClass('active');
                });
                 //绑定取消添加二级分类按钮事件
                 $('.blog-nav-wrapper .blog-nav-content').on('click','.cancel-add-blog-Type',function(){
                    $(this).parents('.add-blog-type-wrapper').removeClass('active');    //收起添加二级分类列表
                    $(this).parents('.add-blog-type-wrapper').find('.blog-type-name-input input').val('');  //清空二级分类列表输入框
                });
                //绑定确认添加二级分类按钮事件
                $('.blog-nav-wrapper .blog-nav-content').on('click','.go-add-blog-type-btn',function(){
                    let that2 = this;
                    let newBlogTypeName = $(this).parents('.add-blog-type-wrapper').find('.blog-type-name-input input').val();
                    //在这里添加二级分类
                    // console.log(newBlogTypeName);
                    let classifyName = $(this).parents('.el-submenu').children('.el-submenu__title').children('span').html();
                    // console.log(classifyName);

                    var map = {};
                    //博客分类  必填
                    map['classify']= classifyName;
                    //博客类型 非必填
                    map['blogType']= newBlogTypeName;
                    var formData=new FormData();
                    formData.append("blogTypeMap",JSON.stringify(map));
                    $.ajax({
                        type: "post",        
                        url: window.blogReqUrl + "/blogtype/addBlogType",
                        contentType: false, 
                        processData: false, 
                        dataType: 'json',
                        data : formData,
                        success:function(data){	    
                            // console.log(data);
                            if(data.code == 1){
                                that.getBlogType(); //重新获取博客列表信息
                                $(that2).parents('.add-blog-type-wrapper').removeClass('active');   //
                                $(that2).parents('.add-blog-type-wrapper').find('.blog-type-name-input input').val('');  //清空二级分类列表输入框
                            }else{
                                that.$message.error(data.message);
                            }
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });

                });
               
            }
        },
        mounted(){
            let timer = setTimeout(function(){
                $('.blog-nav-wrapper').addClass('active');
                $('.second-chilren-router-wrapper').addClass('show-blog-nav');
                $('.show-blog-nav-btn i').addClass('fa-rotate-180');
            },800);
            this.getBlogType();      //获取博客分类
            this.bindaddBlogTypeEvent();  //绑定二级分类折叠按钮
        }
    }
</script>