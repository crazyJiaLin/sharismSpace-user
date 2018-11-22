<template>
    <div class="sec-router-wrapper">
        <div class="second-chilren-router-wrapper">
        <!-- 左侧博客列表 -->
        <BlogNav @blogTypeInfo="setClassify($event)" @changeBlogType="getBlogListWithChange($event)"></BlogNav>
        <div class="second-chilren-router-left-wrapper">
            <div class="blog-list-wrapper">
                <ul class="blog-list"  v-loading="blogListLoading">
                    <div v-if="!hasBlogList" class="no-blog-list-wrapper">您还没有创建博客，点击右边的创建博客按钮，开启你的博客之旅吧 (｡•̀ᴗ-)✧</div>
                    <li class="blog-item" v-for="(item,key) in blogList" :key="key" :id="item.id">
                        <a :href="'http://www.crazyjialin.com/小蜗牛#/blog/'+item.id" target="_blank">
                            <h3 class="blog-title">{{item.blogTitle}}</h3>
                            <p class="blog-abstract">{{item.baseBlog}}</p>
                            <div class="blog-info-wrapper">
                                <div class="blog-info">{{item.nature}}</div>
                                <div class="blog-info">{{item.blogType}}</div>
                                <div class="blog-info">{{item.publishDate}}</div>
                                <div class="blog-info"><i class="fa fa-eye"></i>{{item.readCount}}</div>
                                <div class="blog-info"><i class="fa fa-thumbs-up"></i>{{item.praiseAmount}}</div>
                                <div class="blog-info"><i class="fa fa fa-share-square"></i>{{item.transpondAmount}}</div>
                                <div class="blog-management">
                                    <el-button type="text" class="edit-blog"><i class="fa fa-edit"></i></el-button>
                                    <el-button type="text" class="delete-blog"><i class="fa fa-trash-o"></i></el-button>
                                </div>
                            </div>
                        </a>
                    </li>
                    <div v-if="showBlogListLoading" class="blog-list-loading" v-html="blogListInfo.loadingHTML"></div>
                </ul>
                
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
                            <div class="user-info user-nickname">{{blogUserInfo.userNickname}}</div>
                            <div class="user-info mail">{{blogUserInfo.mail}}</div>
                            <div class="user-info">
                                <div class="user-info-item user-age">{{blogUserInfo.userAge}}</div>
                                <div class="user-info-item user-sex" v-html="userSexIcon"></div>
                                <div class="user-info-item constellation">{{blogUserInfo.constellation}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="blog-info-wrapper">
                        <div class="blog-user-info">
                            <div class="blog-info-label">关注</div>
                            <div class="blog-info-number">{{blogUserInfo.attentonCount}}</div>
                        </div>
                        <div class="blog-user-info">
                            <div class="blog-info-label">粉丝</div>
                            <div class="blog-info-number">{{blogUserInfo.attentonedCount}}</div>
                        </div>
                        <div class="blog-user-info">
                            <div class="blog-info-label">访问量</div>
                            <div class="blog-info-number">999</div>
                        </div>
                    </div>
                    <div class="blog-info-wrapper">
                        <div class="blog-user-info">
                            <div class="blog-info-label">原创</div>
                            <div class="blog-info-number">{{blogUserInfo.blogOriginal}}</div>
                        </div>
                        <div class="blog-user-info">
                            <div class="blog-info-label">转载</div>
                            <div class="blog-info-number">{{blogUserInfo.blogTransshipment}}</div>
                        </div>
                        <div class="blog-user-info">
                            <div class="blog-info-label">翻译</div>
                            <div class="blog-info-number">{{blogUserInfo.blogTranslate}}</div>
                        </div>
                    </div>
                </div>
               
                <div @click="foldUserInfo" class="hide-user-info-btn"><i class="fa fa-angle-double-right"></i></div>
            </div>
            <div class="add-blog-btn-wrapper">
                <el-button @click.stop="createNewBlog" class="add-blog-btn" type="primary" round>发布博客</el-button>
                <el-button class="add-blog-btn" plain round icon="fa fa-trash-o">回收站</el-button>
            </div>
            <div class="add-blog-btn-wrapper">
                
            </div>
        </div>
        </div>
        
    </div>
</template>

<script>
    import BlogNav from './blog-nav.vue'
    // import '../blog-list.css'
    export default{
        components : {
            BlogNav
        },
        computed : {
            userSexIcon(){
               return this.blogUserInfo.userSex == '女' ? '<i class="fa fa-venus"></i>' : '<i class="fa fa-mars"></i>';
            }
        },
        data(){
            return {
                hasBlogList : false,
                blogListLoading : true,
                blogList : [],
                showBlogListLoading : false,
                getBlogListbool : true,
                blogListInfo:{
                    loadingHTML : '<i class="fa fa-circle-o-notch fa-spin"></i>',
                    endRow : 0,
                    pageNum : 1,                //当前页号
                    hasNextPage : true,
                    pageSize : 6,
                    remove : 0,                 //查询已经删除的博客（回收站）时  remove=1， 不加默认都查询
                    nature : '',                //根据博客性质查询
                    classify : '',               //一级分类
                    blogType : '',              //二级分类
                    draft : 0,                  //草稿箱列表 draft=1    不加时默认都查询
                    privacySet : 1,             //按照权限查询（公开/隐藏）  privacySet=1公开  0 隐藏  不加默认都查询
                    arrange : 'DESC'             //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
                },
                blogUserInfo : {
                    userNickname : 'crazyjialin',
                    iconPath: 'http://photocdn.sohu.com/20110518/Img307890814.jpg',
                    mail : 'crazyjialin@foxmail.com',
                    userAge : 22,
                    userSex : 'femail',
                    constellation: '处女座',
                    attentonCount : 0,          //关注量
                    attentonedCount : 0,        //被关注量
                    blogOriginal : 0,           //原创
                    blogTransshipment : 0,      //转载
                    blogTranslate : 0           //翻译
                },
            }
        },
        methods : {
            setClassify(msg){
                console.log(msg);
                this.blogListInfo.classify = msg.classify;
                this.blogListInfo.blogType = msg.blogType;
                this.getBlogList();
                // this.
            },
            getBlogListWithChange(msg){
                // 根据博客导航子组件的变化来重新获取博客列表信息
                console.log(msg);
                this.blogListInfo.classify = msg.classify;
                this.blogListInfo.blogType = msg.blogType;
                this.getBlogList();
            },
            setUserPortrait(){      //设置用户头像
                $('.user-portrait-wrapper').css('backgroundImage','url("'+ this.blogUserInfo.iconPath  +'")');
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
            getBlogList(){    //获取博客列表信息
                let that = this;
                 //加载动画
                that.blogListLoading = true;
                let blogPageMap = {
                    pageNum : that.blogListInfo.pageNum,               //当前页号
                    pageSize : that.blogListInfo.pageSize,             //每页显示的数据条数
                    remove : that.blogListInfo.remove,                 //查询已经删除的博客（回收站）时  remove=1， 不加默认都查询
                    nature : that.blogListInfo.nature,                 //博客性质
                    classify : that.blogListInfo.classify,             //一级分类
                    blogType : that.blogListInfo.blogType,             //二级分类
                    draft : that.blogListInfo.draft,                   //草稿箱列表 draft=1    不加时默认都查询
                    privacySet : that.blogListInfo.privacySet,         //按照权限查询（公开/隐藏）  privacySet=1公开  0 隐藏  不加默认都查询
                    arrange : that.blogListInfo.arrange                //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
                };
                let formData=new FormData();
                formData.append("blogPageMap",JSON.stringify(blogPageMap));
                $.ajax({
                    type: "post",           
                    url: window.blogReqUrl + "/blog/blogList",
                    contentType: false, 
                    processData: false,		  
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        console.log(data);
                        if(data.code == 1){
                            if(data.value.list.length <= 0){
                                that.hasBlogList = false;
                            }else{
                                that.hasBlogList = true;
                            }
                            that.blogList = data.value.list;        //设置博客列表数据
                            that.blogListInfo.hasNextPage = data.value.hasNextPage; //设置是否有下一页
                            that.blogListInfo.endRow = data.value.endRow; //本次请求总条数
                            that.getBlogListbool = true;    //打开请求开关
                            // console.log('打开开关：'+ that.getBlogListbool);
                            //如果一上来页数<5，就不显示loading图
                            if(that.blogListInfo.endRow <= 5){        
                                that.showBlogListLoading = false;
                            }else{
                                that.showBlogListLoading = true;
                            }
                            //如果有下一页，将显示个数加5
                            if(that.blogListInfo.hasNextPage == true){  
                                that.blogListInfo.pageSize = that.blogListInfo.pageSize + 5;
                            }else{
                                that.blogListInfo.loadingHTML = '您没有更多博客了~努力编写吧 ^8^';
                            }
                             //关闭加载动画
                            that.blogListLoading = false;
                        }else{
                            that.$message.error(data.message);
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error('服务器开小差了~稍后重试 ^8^');
                    }  
                });
            },
            bindBlogListClickEvent(){       //给博客列表信息绑定点击事件
                let that = this;
                //编辑按钮绑定
                $('.blog-list-wrapper .blog-list').on('click','.blog-item .edit-blog',function(ev){
                    ev = ev || window.event;
                    ev.preventDefault();
                    var queryId = $(this).parents('.blog-item').attr('id');
                    console.log(queryId);
                    that.$emit('editBlog' , queryId);
                });
                //删除按钮绑定
                $('.blog-list-wrapper .blog-list').on('click','.blog-item .delete-blog',function(ev){
                    ev = ev || window.event;
                    ev.preventDefault();
                    var queryId = $(this).parents('.blog-item').attr('id');
                    console.log(queryId);
                    that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //在这里进行删除操作
                        that.deleteBlog(queryId);
                    }).catch(() => {
                        that.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                });
            },
            createNewBlog(){
                this.$emit('editBlog' , '');   //向父组件传值，将博客id设置为空

            },
            deleteBlog(queryId){
                let that = this;
                //支持批量删除，id用逗号隔开，英文状态下的逗号。
                // var ids= queryId;
                var formData=new FormData();
                formData.append("blogArrayList",queryId);
                $.ajax({
                    type: "post",  
                    url: window.blogReqUrl + "/blog/deleteBlog",
                    contentType: false,            
                    processData: false, //必须false才会自动加上正确的Content-Type
                    dataType: 'json',
                    data : formData,
                    success:function(data){	
                        // console.log(data);
                        if(data.code == 1){
                            that.blogListInfo.pageSize = that.blogListInfo.pageSize - 5;
                            that.getBlogList();	
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else{
                            that.$message.error(data.message);
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error('服务器开小差了~稍后重试 ^8^');
                    }  
                });
            },
            bindBlogListScrollEvent(){  //博客列表绑定滚动事件，实现数据懒加载
                let that = this;
                $('.blog-list-wrapper').on('scroll',function(){
                    // console.log(that.getBlogListbool);
                    if(!that.getBlogListbool){ 
                        return;
                    }
                    let ScrollTop = $(this)[0].scrollTop,               //子元素相对父元素滚动的距离
                        parentHeight = $(this)[0].offsetHeight,         //父元素的高度
                        childHeight = $(this).find('.blog-list')[0].offsetHeight;   //子元素的高度
                    let dis = childHeight - ScrollTop - parentHeight + 30;  //30是子元素的margin，默认会少个上下margin
                    // console.log(dis);    
                    if(dis <= 10){
                        if(!that.blogListInfo.hasNextPage){
                            return;
                        }
                        that.getBlogListbool = false;
                        that.getBlogList();
                    }
                });
            },
            getUserInfo(){
                let that = this;
                $.ajax({
                    type: "post",        
                    url: window.userReqUrl + "/userInfo/userBasicInfo",
                    contentType: false, 
                    processData: false,	
                    dataType: 'json',
                    data : null,
                    success:function(data){	    
                        // console.log(data)
                        if(data.code == 1){
                            that.blogUserInfo = data.value;
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
            this.getBlogList();  //获取博客列表信息
            this.getUserInfo();     //获取用户信息
            this.bindBlogListClickEvent();  //给博客列表信息绑定点击事件
            this.bindBlogListScrollEvent(); //博客列表绑定滚动事件，实现数据懒加载
        },
        updated(){
            this.setUserPortrait();     //当组有更新后，刷新用户头像
        }
    }
</script>
