<template>
    <div class="website-all-wrapper">
        <div class="website-operate-btns-wrapper">
            <!-- 上传组件富文本，隐藏状态 -->
            <el-button size="medium" type="primary" plain icon="fa fa-plus fa-lg">添加网站</el-button>
            <el-button size="medium" type="primary" plain icon="fa fa-folder-open-o">新建书签集</el-button>
            <transition name="el-fade-in">
                <el-button-group v-show="showBatchBtns" class="website-operate-btns">
                    <!-- <el-button size="medium" plain icon="fa fa-share-alt fa-lg fa-lg">分享</el-button> -->
                    <el-button size="medium" plain icon="fa fa-arrows fa-lg">移动到</el-button>
                    <el-button size="medium" plain icon="fa fa-trash fa-lg">删除</el-button>
                </el-button-group>
            </transition>
        </div>
        <div class="wbesite-all-list-wrapper">
            <el-tree
                :props="props"
                :load="loadNode"
                lazy
                ref="tree"
                :empty-text="websiteListReqInfo.emptyText"
                node-key="id"
                :default-expanded-keys="['root']"
                accordion
                highlight-current
               
                @node-click="handleNodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="website-icon-wrapper">
                        <i v-if="data.folder == 1 ? true : false" :class="data | websiteIconFilter"></i>
                        <span class="website-icon" v-if="data.folder == 1 ? false : true">
                            <img :src="data.websiteIcon" alt="data.folderName">
                        </span>
                    </span>
                    <span>{{ node.label }}</span>                     
                </span>
            </el-tree>
        </div>
        
    </div>
</template>

<script>
    export default{
        data(){
            return {
                showBatchBtns : true,
                props: {
                    label: 'folderName',
                    children: 'zones'
                },
                websiteListReqInfo : {
                    isChoosed : false,  //默认没有选择
                    pageNum : 1,
                    pageSize : 0,
                    parentId : 'root',
                    emptyText : '正在加载。。。'
                },
                count: 1
            }
        },
        methods : {
            handleNodeClick(data) {     //点击tree节点函数，将查询id变为当前点击的id
                console.log(data);
                this.websiteListReqInfo.isChoosed = true;
                this.websiteListReqInfo.parentId = data.id;
            },
            renderContent(h, { node, data, store }) {   //tree的渲染节点返回数据
                console.log(node);
                return (
                <span>
                    <span class="webiste-icon">{node.id}</span>
                    <span>{node.label}</span>
                </span>);
            },
            loadNode(node, resolve) {   //Tree懒加载函数
                let that = this;
                if (node.level === 0) { 
                    return resolve([{folderName : '全部书签', id:'root', folder:1}]);
                    that.websiteListReqInfo.parentId = 'root';
                }else{
                    that.websiteListReqInfo.parentId = node.data.id;
                }
                that.getWebsiteList(function(results){
                    console.log(results);
                    that.websiteListReqInfo.emptyText = '暂无数据';
                    resolve(results);
                });
            },
            getWebsiteList(callback){       //获取收藏网站列表信息，回调函数参数results代表查询返回的数组
                let that = this;
                var map = {
                //当前页号
                'pageNum': that.websiteListReqInfo.pageNum,
                //每页显示的数据条数
                'pageSize': that.websiteListReqInfo.pageSize,
                //父级目录id  如果是没有父级目录，而是刚进入文件模块的列表，就空着。
                //如果是进入某个文件夹，则填写该文件夹的id
                'parentId': that.websiteListReqInfo.parentId,
                //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
                'arrange':"DESC",
                //arrangeRule等于0 则按最近点击时间排序，如果等于1，则按点击次数排序，如果不填，则按添加时间排序
                // 'arrangeRule':0		
                };		
                var formData=new FormData();
                formData.append("collectPageMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url: window.websiteReqUrl +  "/websitecollect/WebSiteCollectList",
                    contentType: false, //必须false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理 
                    processData: false, //必须false才会自动加上正确的Content-Type
                    dataType: 'json',
                    data : formData,
                    xhrFields: {  
                        withCredentials: true  
                    },
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
        },
        mounted(){
            this.getWebsiteList();
        }
    }
</script>