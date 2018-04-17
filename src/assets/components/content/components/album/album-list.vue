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
            <div v-for="(item,key) in albumList" :albumid="item.id" :key="key" class="album-box albums-tab-thumb sim-anim-1 animated pulse">
                <div class="img-list-wrapper"><img src="./images/studio_0001.jpg" /></div>
                <div class="img-list-wrapper"><img src="./images/studio_0002.jpg" /></div>
                <div class="img-list-wrapper"><img src="./images/studio_0003.jpg" /></div>
                <div class="img-list-wrapper"><img src="./images/studio_0004.jpg" /></div>
                <div class="img-list-wrapper"><img :src="item.iconPath" /></div>
                <div class="album-title-wrapper animated fadeIn">
                    <div class="album-setting">
                        <el-dropdown trigger="click">
                            <span class="el-dropdown-link">
                                <i class="fa fa-cog"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>隐私设置</el-dropdown-item>
                                <el-dropdown-item>重命名</el-dropdown-item>
                                <el-dropdown-item>删除相册</el-dropdown-item>
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
            <el-form :model="createAlbumForm" class="create-alum-dialog">
                <el-form-item label="相册名称" :label-width="formLabelWidth">
                    <el-input v-model="createAlbumForm.albumName" auto-complete="off" placeholder="请输入相册名称"></el-input>
                </el-form-item>
                <el-form-item label="相册标签" :label-width="formLabelWidth">
                    <el-tag
                        :key="tag"
                        v-for="tag in dynamicTags"
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
                                    <el-input :disabled="!createAlbumForm.setPassword" v-model="createAlbumForm.password" auto-complete="off" placeholder="请输入相册密码"></el-input>
                            </el-col> 
                        </el-form-item>
                    </el-col>
                </el-row>               
                <el-form-item label="相册描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="createAlbumForm.description"></el-input>
                </el-form-item>
                <el-form-item label="上传封皮" :label-width="formLabelWidth">
                    <el-col :span="12">
                        <el-input @change="selectAlbumIcon($event)" type="file" v-model="createAlbumForm.albumIconFile"></el-input>
                    </el-col> 
                    <el-col :span="10" :offset="2">
                        <div class="preview-album-icon-wrapper"><span>封皮最佳尺寸 300x200px</span></div>
                        <!-- <div class="preview-album-icon-wrapper">
                            <img src="http://118.25.48.91:8000/group2/M00/00/01/CpqBPFrNY8eARTXnAAFO_mKpm5I052.jpg" alt="">
                        </div> -->
                    </el-col> 
                   
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                dynamicTags: [],
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
                    albumIconFile : null
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
                    {
                        id : "",
                        albumIcon : "default",
                        albumName : "相册名称",
                        albumPassword : "",
                        albumSort : "相册分类",
                        createDate : "2018-04-13",
                        description : "相册描述",
                        iconPath : '',
                        privacySet : 1
                    }
                ]
            }
        },
        methods : {
            selectAlbumIcon($event){        //选择相册封皮
                console.log('选择相册封皮');
            },
            showInput() {       //点击添加标签按钮，显示input
                this.inputVisible = true;
                this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {      //确认添加标签
                let inputValue = this.inputValue;
                if (inputValue) {
                this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
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
        },
        mounted(){
            this.getAlbumList();    //获取相册列表
            this.bindAlbumListScrollEvent();    //绑定相册列表滚动事件，实现按需加载
        }
    }
</script>
