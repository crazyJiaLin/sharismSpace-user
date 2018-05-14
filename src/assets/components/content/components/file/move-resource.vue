<template>
    <div class="upload-img-wrapper-wrapper"> 
        <!-- 外部调用方式 -->
        <!-- <UploadImg v-if="showUploadImg" @closeUploadWrapper="closeUploadImg($event)"></UploadImg> -->
        <div class="upload-img-wrapper">
            <div class="upload-img-wrapper-title">
                <span class="model-title">移动到</span>
                <button @click.stop="closeUploadWrapper" type="button" aria-label="Close" class="el-message-box__headerbtn">
                    <i class="el-message-box__close el-icon-close"></i>
                </button>
            </div>
            <div class="folder-list-wrapper">
                <el-tree
                    :props="folderList"
                    :load="loadNode"
                    lazy
                    ref="tree"
                    :empty-text="folderListReqInfo.emptyText"
                    node-key="id"
                    :default-expanded-keys="['root']"
                    accordion
                    highlight-current
                    :render-content="renderContent"
                    @node-click="handleNodeClick">
                </el-tree>
            </div> 
            <div class="move-resource-footer">
                <div class="folder-btn-left-wrapper">
                    <el-button @click.stop="createNewFolder" size="small" plain >新建文件夹</el-button>
                </div>
                <div class="folder-btn-right-wrapper">
                    <el-button @click.stop="startMove" :loading="confirmButtonLoading" size="small" type="primary">&nbsp;&nbsp;&nbsp;确认&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button @click.stop="closeUploadWrapper" size="small" plain>&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import './move-resource.css'
    import Vue from 'vue'
    import {Tree} from 'element-ui'
    Vue.use(Tree);
    
    // import Tree from 'element-ui'
    export default{
        props : {
            ids : Array
        },
        data(){
            return{
                folderList: {
                    label: 'fileName',
                    children: 'zones'
                },
                confirmButtonLoading : false,   //确认按钮的loading
                folderListReqInfo : {
                    isChoosed : false,  //刚进入组件时，默认是没有选中文件的，需要通过这个字段提示
                    emptyText : '数据正在加载中...',
                    pageSize : 0,
                    parentId : 'root',
                }
            }
        },
        methods : { 
            startMove(){    //开始移动资源
                let that = this;
                // if(!that.folderListReqInfo.isChoosed){
                //     return that.$message({
                //         type : 'warning',
                //         message : '请选择文件夹'
                //     });
                // }
                that.confirmButtonLoading = true;
                console.log(that.folderListReqInfo.parentId);
                console.log(that.ids.toString());
                var map = {
                    //要移动到的地方
                    "parentId": that.folderListReqInfo.parentId,
                    //要移动的文件，多个用逗号隔开
                    "ids": that.ids.toString(),			
                };
                var formData=new FormData();
                formData.append("moveFileMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url: window.resourceReqUrl + "/resource/moveFile",
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    xhrFields: {  
                        withCredentials: true  
                    },
                    success:function(data){	    
                        console.log(data);
                        that.confirmButtonLoading = false;  //关闭确认按钮loading
                        if(data.code == 1){
                            that.$message({
                                type : 'success',
                                message : '移动成功'
                            });
                            that.$emit('closeMoveResource','success');   //向父组件传递信息，告诉他成功了
                        }else{
                            that.$message.error(data.message);
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });

            },
            createNewFolder(){  //新建文件夹
                // console.log(this.$refs);
                // Tree.append();
                let that = this;
                this.$prompt('新建文件夹', '提示', {
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
                    console.log(value);
                    
                    var map = {};
                    //父级目录id   如果没有父级目录，而是在一级列表创建，则空着，不填
                    map['parentId']= that.folderListReqInfo.parentId;
                    //是否是文件夹    1:新建文件夹  2：上传的文件
                    map['folder']= 1;
                    //文件夹名称  如果用户未输入 ，可以给一个默认的名称，如果上传的是文件，则这里是文件名称
                    map['fileName']= value;
                    //文件描述    如果是创建文件夹，则不填
                    map['fileDes']= '';
                    //文件大小 单位（kb）  如果是创建文件夹，则不填
                    map['fileSize']= -1;
                    //从文件服务器获取的 文件路径 格式如下。 如果是创建文件夹，则不填
                    map['filePath']= '';	
                    var formData=new FormData();
                    formData.append("resourceInfoMap",JSON.stringify(map));
                    $.ajax({
                        type: "post",        
                        url: window.resourceReqUrl + "/resource/saveResource",
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        data : formData,
                        success:function(data){	    
                            console.log(data);
                            if(data.code == 1){
                                that.$message({
                                    type : 'success',
                                    message : '新建文件夹成功'
                                });
                                that.getFolderList(function(results){
                                    console.log('查询完成,更新节点');
                                    that.$refs.tree.updateKeyChildren(that.folderListReqInfo.parentId,results);
                                });
                            }
                        }, 				 
                        error:function(){  
                            that.$message.error("服务器开小差了~稍后重试 ^8^");  
                        }  
                    });

                }).catch(() => {});
            },
            handleNodeClick(data) {    //选中文件树回调
               
                this.folderListReqInfo.isChoosed = true;
                console.log(data);
                this.folderListReqInfo.parentId = data.id;
            },
            renderContent(h, { node, data, store }) {   //自定义渲染文件树
                return (
                <span>
                    <i class="fa fa-folder" style="margin-right : 6px; color: rgb(255, 214, 85);"></i>
                    <span >{node.label}</span>
                </span>);
            },
            loadNode(node, resolve) {   //文件树懒加载
                let that = this;
                // console.log(node.data);
                
                // console.log(that.folderListReqInfo.parentId);
                if (node.level === 0) { 
                    return resolve([{fileName : '全部文件夹', id:'root'}]);
                    that.folderListReqInfo.parentId = 'root';
                }else{
                    that.folderListReqInfo.parentId = node.data.id;
                }
               this.getFolderList(function(results){   //查询文件夹列表，参数为查询结束的回调函数
                    // console.log(results);
                    // if(results.length == 0){
                        that.folderListReqInfo.emptyText = '暂无数据';
                    // }
                    resolve(results);
               });
              
            },
            getFolderList(callback){
                let that = this;
                var map = {};		
                //当前页号
                map['pageNum']=1;
                //每页显示的数据条数
                map['pageSize']=0;			
                //父级目录id  如果是没有父级目录，而是刚进入文件模块的列表，就空着。
                //如果是进入某个文件夹，则填写该文件夹的id
                map['parentId']= that.folderListReqInfo.parentId;
                //要移动的文件id  必填  ，多个用逗号隔开
                map['ids']= that.ids.toString();
                var formData=new FormData();
                formData.append("resourceMovePageMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url: window.resourceReqUrl + "/resource/getMoveResourceList",
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    data : formData,
                    success:function(data){
                        console.log(data)
                        if(data.code == 1){
                            callback && callback(data.value.list);
                        }else{
                            that.$message.error(data.message);
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });
            },
            closeUploadWrapper(){   //向父级提交信息，关闭窗口
                this.$emit('closeMoveResource','cancel');
            },
        },
        mounted(){
            console.log(this.ids.toString());
        }
    }
</script>