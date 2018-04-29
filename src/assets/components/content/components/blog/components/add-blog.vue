<template>
    <div class="sec-router-wrapper">
        <div class="second-chilren-router-wrapper-add-blog">
            <div class="second-chilren-router-left-wrapper ">
                <div class="edit-blog-wrapper-wrapper">
                    <div class="edit-blog-wrapper">
                        
                        <div class="blog-title-wrapper">
                            <el-form class="blog-title-form" label-width="80px" :model="submitBlogForm">
                                <el-form-item label="博客标题">
                                    <el-input v-model="submitBlogForm.blogTitle" placeholder="请输入博客标题"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="blog-content-wrapper">
                            <div id="editor" style="width:100%; height:520px"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="second-chilren-router-right-wrapper">
                <div class="back-to-blog-list-wrapper">
                    <el-button type="primary" round> <a href="#/blog/list">返回博客列表</a></el-button>
                </div>
                <div class="select-add-option-wrapper animated swing">
                    <el-form ref="submitBlogForm" :model="submitBlogForm" label-width="80px">
                        <el-form-item label="公开">
                            <el-col :span="4">
                                <el-switch v-model="submitBlogForm.public"></el-switch>
                            </el-col> 
                            <el-col :span="8">
                                <el-form-item label="支持打赏">
                                    <el-switch v-model="submitBlogForm.reward"></el-switch>
                                </el-form-item>
                            </el-col> 
                            <el-col :span="6" :offset="2">
                                <el-select size="small" v-model="submitBlogForm.nature" placeholder="请选择">
                                    <el-option label="原创" value="原创"></el-option>
                                    <el-option label="转载" value="转载"></el-option>
                                </el-select>
                            </el-col>    
                        </el-form-item>
                        <el-form-item label="分类选择">
                            <el-row :gutter="20">
                                
                                <el-col :span="10">
                                    <el-autocomplete
                                        v-model="submitBlogForm.classify"
                                        :fetch-suggestions="searchClassify"
                                        placeholder="文集名称"
                                        @select="selectClassify"
                                    ></el-autocomplete>
                                </el-col>    
                                <el-col :span="10">
                                    <el-autocomplete
                                        v-model="submitBlogForm.blogType"
                                        :fetch-suggestions="searchBlogType"
                                        placeholder="博客类别"
                                        @select="selectClassify"
                                    ></el-autocomplete>
                                </el-col>       
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                                <el-row :gutter="20">
                                    <el-col :span="9" >
                                        <el-button @click="createNewBlog" >新建博客</el-button>
                                    </el-col>
                                    <el-col :span="9">
                                        <el-badge :hidden="hiddenSaveDraftBadge" is-dot class="item"><el-button type="primary" plain  @click="submitBlogToDraft" :loading="submitBlogForm.isSaveDraft">保存草稿</el-button></el-badge>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        <el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="9">
                                    <el-button>博客预览</el-button>
                                </el-col>    
                                <el-col :span="9">
                                    <el-button type="primary" :loading="submitBlogForm.isSending" @click="createBlog">发布博客</el-button>
                                </el-col>       
                            </el-row>
                        </el-form-item>
                        
                    </el-form>
                    <el-collapse>
                        <el-collapse-item title="草稿箱" name="1" class="draft-wrapper">
                            <ul class="draft-list">
                                <li @click="selectBlogFromDraft($event)" v-for="(item,key) in draftBlogList" :key="key" :blogid="item.id">
                                    {{item.blogTitle}}
                                    <i @click.stop.prevent="deleteDraftBlog($event)" class="fa fa-trash-o" ></i>
                                </li>
                            </ul>
                        </el-collapse-item>
                    </el-collapse>
                </div>

            </div>
        </div>
        
    </div>
</template>

<script>
    export default{
        props : {
            editId : String
        },
        data(){
            return {
                classifyList: [],
                blogTypeList : [],
                draftBlogList : [],
                hiddenSaveDraftBadge : true,   //是否隐藏保存草稿箱的小圆点
            　  editor: null,
                submitBlogForm: {   //发布博客内容
                    blogId : '',
                    isInline : true,
                    isSendingBolog : false,
                    isSaveDraft : false,
                    public: true,
                    draft : 0,
                    nature : '原创',
                    blogTitle : '',
                    titleIcon : '',
                    baseBlog : '',
                    blog : '',
                    classify : '',
                    blogType : '',
                    reward : true   //1支持打赏，0不打赏
                }
            } 
        },
        watch:{
            'submitBlogForm.blogTitle'(val,oldVal){
                this.hiddenSaveDraftBadge = false;
            },
            'submitBlogForm.public'(val,oldVal){
                this.hiddenSaveDraftBadge = false;
            },
            'submitBlogForm.reward'(val,oldVal){
                this.hiddenSaveDraftBadge = false;
            },
            'submitBlogForm.nature'(val,oldVal){
                this.hiddenSaveDraftBadge = false;
            },
            'submitBlogForm.blog'(val,oldVal){
                this.hiddenSaveDraftBadge = false;
            },
            'submitBlogForm.classify'(val,oldVal){
                this.hiddenSaveDraftBadge = false;
            },
            'submitBlogForm.blogType'(val,oldVal){
                this.hiddenSaveDraftBadge = false;
            }
        },
        methods : {
            createNewBlog(){    //新建博客
                console.log('新建博客');
                let that = this;
                if(!that.hiddenSaveDraftBadge){ //如果有小圆点，提示用户先保存现有的博客
                    return that.$confirm('您还有没有保存的博客，请把现在的博客存入草稿在新建博客哦 ʚتɞ', '提示', {
                        confirmButtonText: '现在保存',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            that.submitBlogToDraft();
                        }).catch(() => {
                        that.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }
                that.submitBlogForm.blogId = '';
                that.submitBlogForm.draft = 0;
                that.submitBlogForm.nature = '原创';
                that.submitBlogForm.blogTitle = '';
                that.submitBlogForm.titleIcon = '';
                that.submitBlogForm.classify = '';
                that.submitBlogForm.blogType = '';
                that.editor.setContent('');
            },
            createBlog() {      //发布博客入口函数
                let that = this;
                that.submitBlogForm.draft = 0;
                console.log('发布博客!');
                that.createBlogType();
            },
            submitBlogToDraft(){    //提交博客到草稿箱入口
                let that = this;
                that.submitBlogForm.draft = 1;
                console.log('插入博客到草稿箱!');
                that.createBlogType();
            },      
            createBlogType(){   //创建博客分类，并在创建完成后发布博客
                let that = this;
                if(that.submitBlogForm.blogTitle == ''){
                    return that.$message.error('请输入博客标题 ( ´∵｀)');
                }
                if(that.submitBlogForm.classify == '' || that.submitBlogForm.blogType == ''){
                    return that.$message.error('请选择博客分类，博客不能没有家 ( ´∵｀)');
                }
                if(that.submitBlogForm.draft == 1){ //存入草稿，将草稿按钮变为loading
                    that.submitBlogForm.isSaveDraft = true;
                }else{  //发布博客，发布博客按钮变为loading
                    that.submitBlogForm.isSendingBolog = true;
                }
                var map = {};
                //博客分类  必填
                map['classify']= that.submitBlogForm.classify;
                //博客类型 非必填
                map['blogType']= that.submitBlogForm.blogType;
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
                        that.hiddenSaveDraftBadge = true;  //将保存到草稿按钮的小圆点去掉
                        if(data.code == 1 || data.code == 2){
                            //创建完分类后判断是发布博客还是修改博客
                            if(that.submitBlogForm.blogId == ''){   //没有博客id，说明需要发布博客
                                that.submitBlog();
                            }else{      //存在id，说明需要修改博客
                                that.updateBlog();
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
            updateBlog(){   //修改博客
                let that = this;
                console.log('在这里进行博客修改');
                var map = {
                    id : that.submitBlogForm.blogId,
                    blogTitle : that.submitBlogForm.blogTitle,
                    classify : that.submitBlogForm.classify,
                    blogType : that.submitBlogForm.blogType,
                    baseBlog : that.submitBlogForm.baseBlog,
                    blog : that.submitBlogForm.blog,
                    draft : that.submitBlogForm.draft,
                    privacySet : that.submitBlogForm.public ? 1 : 0,
                    reward : that.submitBlogForm.reward ? 1 : 0
                };
                console.log('发布到草稿箱还是主列表？'+ that.submitBlogForm.draft);
                var formData=new FormData();
                formData.append("updateBlogInfoMap",JSON.stringify(map));
                $.ajax({
                    type: "post",          
                    url: window.blogReqUrl + "/blog/updateBlogInfo",
                    contentType: false, 
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    success:function(data){	   
                        if(data.code == 1){
                            
                            if(that.submitBlogForm.draft == 1){ //存入草稿
                                //将id设置为草稿id
                                that.$message({
                                    type: 'success',
                                    message: '存入草稿箱成功'
                                });
                                that.submitBlogForm.isSaveDraft = false;     //取消存入草稿按钮loading
                                that.hiddenSaveDraftBadge = true;
                                that.getDraftBlog();    //保存草稿后，重新获取草稿箱列表
                            }else{                              //发布博客
                                that.$message({
                                    type: 'success',
                                    message: '发布博客成功'
                                });
                                that.submitBlogForm.isSending =false;   //取消发布博客按钮loading
                                that.hiddenSaveDraftBadge = true;
                                //发布成功后，在这这里进行跳转到详情页面
                                that.getDraftBlog();    //保存草稿后，重新获取草稿箱列表
                            }
                        } else{
                            that.$message.error(data.message);
                        }
                        console.log(data);  			
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });

            },
            submitBlog(){   //发布博客
                let that = this;
                that.submitBlogForm.blog = that.editor.getContent();    //博客内容
                that.submitBlogForm.baseBlog = that.editor.getContentTxt().substr(0,200);   //博客纯文本前200字符
                // console.log(that.submitBlogForm.baseBlog);
                var map = {
                    blogTitle : that.submitBlogForm.blogTitle,      //标题
                    titleIcon : that.submitBlogForm.titleIcon,      //标题图片
                    classify : that.submitBlogForm.classify,        //博文分类
                    blogType : that.submitBlogForm.blogType,        //博文类型
                    nature : '原创',                                 //博客性质（原创、转载、翻译）
                    baseBlog : that.submitBlogForm.baseBlog,        //基本内容（前200个字）字数待定
                    blog : that.submitBlogForm.blog,                //内容
                    draft : that.submitBlogForm.draft,              //存放位置  1 存在草稿箱   0 移出草稿箱
                    privacySet : that.submitBlogForm.public ? 1 : 0, //权限（公开隐藏）1公开  0隐藏
                    reward : that.submitBlogForm.reward ? 1 : 0 //权限（公开隐藏）1公开  0隐藏
                };
                var formData=new FormData();
                formData.append("blogMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url: window.blogReqUrl + "/blog/insertBlog",
                    contentType: false,            
                    processData: false,     //必须false才会自动加上正确的Content-Type
                    dataType: 'json',
                    data : formData,
                    success:function(data){	    
                        console.log(data)  
                        if(data.code == 1){
                            if(that.submitBlogForm.draft == 1){ //存入草稿
                                //将id设置为草稿id
                                that.$message({
                                    type: 'success',
                                    message: '存入草稿箱成功'
                                });
                                that.submitBlogForm.blogId = data.value;    //将博客id设置为正在编辑的草稿箱id
                                that.submitBlogForm.isSaveDraft = false;     //取消存入草稿按钮loading
                                that.getDraftBlog();    //保存草稿后，重新获取草稿箱列表
                            }else{                              //发布博客
                                that.$message({
                                    type: 'success',
                                    message: '发布博客成功'
                                });
                                that.submitBlogForm.isSending =false;   //取消发布博客按钮loading
                                //发布成功后，在这这里进行跳转到详情页面
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
            selectBlogFromDraft($event){    //根据草稿箱博客id查询相关草稿
                let that = this;
                console.log($($event.target));
                var queryId = $($event.target).attr('blogid');
                console.log('查询草稿：'+ queryId);
                if(!queryId){
                    return that.$message.error('查询失败了，请重试 ʚتɞ');
                }
                var id = queryId;		
                var formData=new FormData();
                formData.append("blogId",id);
                $.ajax({
                    type: "post",  
                    url: window.blogReqUrl + "/blog/selectBlogById",
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        console.log(data)
                        if(data.code == 1){
                            that.submitBlogForm.blogId = data.value.id;
                            that.submitBlogForm.draft = data.value.draft;
                            that.submitBlogForm.blogTitle = data.value.blogTitle;
                            that.submitBlogForm.titleIcon = data.value.titleIcon;
                            that.submitBlogForm.baseBlog = data.value.baseBlog;
                            that.submitBlogForm.blog = data.value.blog;
                            that.submitBlogForm.classify = data.value.classify;
                            that.submitBlogForm.blogType = data.value.blogType;
                            that.submitBlogForm.public = data.value.privacySet==1 ? true : false;
                            that.submitBlogForm.reward = data.value.reward==1 ? true : false;
                            //将博客文本添加到富文本中
                            // that.editor.ready(function() {
                                that.editor.setContent(that.submitBlogForm.blog);
                            // });
                        }else{
                            that.$message.error(data.message);  
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });

            },
            deleteDraftBlog($event){    //删除草稿箱博客
                let that = this;
                var queryId = $($event.target).parent('li').attr('blogid');
                console.log(queryId);
                //询问框
                that.$confirm('此操作将永久删除该草稿, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var ids= queryId;
                    var formData=new FormData();
                    formData.append("blogArrayList",ids);
                    $.ajax({
                        type: "post",  
                        url: window.blogReqUrl + "/blog/deleteBlog",
                        contentType: false,            
                        processData: false, //必须false才会自动加上正确的Content-Type
                        dataType: 'json',
                        data : formData,
                        success:function(data){	
                            console.log(data)
                            if(data.code == 1){
                                that.$message({
                                    type: 'success',
                                    message: '删除草稿成功'
                                });
                                that.getDraftBlog();    //删除完草稿后，重新获取草稿箱数据
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
            searchClassify(queryString, cb) {   //搜索一级分类
                let that = this;
                var classifyList = this.classifyList;
                var results = queryString ? classifyList.filter(this.createStateFilter(queryString)) : classifyList;
                if(queryString){
                    return cb(results);
                }
                var map = {};
                //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
                map['arrange']="ASC";
                //1为 正常列表  0为回收站列表
                map['isDelete']=0;
                var formData=new FormData();
                formData.append("blogTypeMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url: window.blogReqUrl + "/blogtype/selectBlogType",
                    contentType: false, 
                    processData: false, 
                    dataType: 'json',
                    data : formData,
                    success:function(data){	    
                        if(data.code == 1){
                            results.length = 0;
                            //将数据改变变量存入组件data中
                            for(let i=0;i<data.value.length; i++){
                                let resultsItem = {};      
                                resultsItem.value = data.value[i].key;
                                resultsItem.children = [];
                                for(let j=0; j<data.value[i].value.length; j++){
                                    let itemBlogTypeList = {};
                                    itemBlogTypeList.value = data.value[i].value[j].blogType;
                                    resultsItem.children.push(itemBlogTypeList);
                                }
                                results.push(resultsItem);
                            }
                            cb(results);    //回调显示对应的数据
                        }else{
                            that.$message.error(data.message);
                        }                        
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });

                cb(results);
            },
            createStateFilter(queryString) {
                // console.log(queryString);
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                    // return '后台111'
                };
            },
            selectClassify(item) {  //选取选取分类（一级二级）
                // console.log('选择分类 ：'+ item.value);
                // console.log(item);
                if(item.children){
                    this.blogTypeList = item.children;
                }
            },
            searchBlogType(queryString,cb){   //搜索二级分类
                let that = this;
                var blogTypeList = this.blogTypeList;
                var results = queryString ? blogTypeList.filter(this.createStateFilter(queryString)) : blogTypeList;
                if(queryString){
                    return cb(results);
                }
                cb(results);
            },
            getDraftBlog(){
                let that = this;
                var map = {};
                //当前页号
                map['pageNum']=1;
                //每页显示的数据条数，为0时显示全部
                map['pageSize']=0;	
                //查询已经删除的博客（回收站）时  remove=1， 不加默认都查询
                map['remove']= 0;
                //草稿箱列表 draft=1    不加时默认都查询
                map['draft']=1;
                //按照权限查询（公开/隐藏）  privacySet=1公开  0 隐藏  不加默认都查询
                // map['privacySet']=1;
                //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
                map['arrange']="ASC";
                var formData=new FormData();
                formData.append("blogPageMap",JSON.stringify(map));
                $.ajax({
                    type: "post",          
                    url: window.blogReqUrl + "/blog/blogList",
                    contentType: false, 
                    processData: false,		  
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        // console.log(data)
                        if(data.code == 1){
                            that.draftBlogList = data.value.list;
                            // console.log(that.draftBlogList);
                        }else{
                            that.$message.error(data.message);  
                        }
                        
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });
            },
            selectBlogById(){
                let that = this;
                
                if(!that.submitBlogForm.blogId){
                    return that.$message.error('获取博客信息失败');
                }
                var formData=new FormData();
                formData.append("blogId",that.submitBlogForm.blogId);
                $.ajax({
                    type: "post",  
                    url: window.blogReqUrl + "/blog/selectBlogById",
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        console.log(data)
                        if(data.code == 1){
                            that.submitBlogForm.blogId = data.value.id;
                            that.submitBlogForm.draft = data.value.draft;
                            that.submitBlogForm.blogTitle = data.value.blogTitle;
                            that.submitBlogForm.titleIcon = data.value.titleIcon;
                            that.submitBlogForm.baseBlog = data.value.baseBlog;
                            that.submitBlogForm.blog = data.value.blog;
                            that.submitBlogForm.classify = data.value.classify;
                            that.submitBlogForm.blogType = data.value.blogType;
                            that.submitBlogForm.public = data.value.privacySet==1 ? true : false;
                            that.submitBlogForm.reward = data.value.reward==1 ? true : false;
                            //将博客文本添加到富文本中
                            that.editor.ready(function() {
                                that.editor.setContent(that.submitBlogForm.blog);
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
        mounted(){
            console.log('打开add，收到参数'+ this.editId);
           
            let that = this;
            that.submitBlogForm.blogId = that.editId;   //接受父组件传来的博客id，并赋值给博客
            if(that.submitBlogForm.blogId){     //如果博客id不为空，说明是编辑原文章，按照id查询博客
                that.selectBlogById();
            }
            that.editor = UE.getEditor('editor');   //实例化富文本
            that.getDraftBlog();
            that.editor.addListener("contentChange",function(){ //监听富文本内容变化，将保存到草稿按钮加上小圆点
                that.submitBlogForm.blog = that.editor.getContent();
            });
        },
        destroyed() {
            this.editor.destroy();
        }
    }
</script>