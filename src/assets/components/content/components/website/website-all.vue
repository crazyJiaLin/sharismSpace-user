<template>
    <div class="website-all-wrapper">
        <div class="website-operate-btns-wrapper">
            <!-- 上传组件富文本，隐藏状态 -->
            <el-button @click.stop="addWebsite" size="medium" type="primary" plain icon="fa fa-plus fa-lg">添加网站</el-button>
            <el-button size="medium" type="primary" plain icon="fa fa-folder-open-o">新建书签集</el-button>
            <transition name="el-fade-in">
                <el-button-group v-show="showBatchBtns" class="website-operate-btns">
                    <!-- <el-button size="medium" plain icon="fa fa-share-alt fa-lg fa-lg">分享</el-button> -->
                    <el-button size="medium" plain icon="fa fa-arrows fa-lg">移动到</el-button>
                    <el-button size="medium" plain icon="fa fa-trash fa-lg">删除</el-button>
                </el-button-group>
            </transition>
        </div>
        <div class="website-all-list-wrapper">
            <el-tree
                :props="props"
                :load="loadNode"
                lazy
                ref="tree"
                :empty-text="websiteListReqInfo.emptyText"
                node-key="id"
                show-checkbox
                :default-expanded-keys="['root']"
                accordion
                highlight-current
                @check-change="handleCheckChange"
                @node-click="handleNodeClick">
                    <span class="website-tree-node" 
                        slot-scope="{ node, data }" 
                        v-html="websiteDOMHTML(data)">
                    </span>
            </el-tree>
        </div>
        <!-- 添加网站对话框 -->
        <addWebsite v-if="showAddWebsite" @closeAddWebsiteDialog="closeAddWebsiteDialog"></addWebsite>
          
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Tree,Cascader,Icon} from 'element-ui'
    Vue.use(Tree);
    Vue.use(Cascader);
    Vue.use(Icon);
    const addWebsite = () => import('./add-website.vue');
    export default{
        components : {
            addWebsite
        },
        data(){
            return {
                showAddWebsite : false, //是否显示添加网站组件
                showBatchBtns : true,
                props: {       //全部网站组价tree props
                    label: 'folderName',
                    children: 'zones',
                    isLeaf : 'leaf'
                },
                websiteListReqInfo : {      //书签集+网站列表信息请求字段
                    isChoosed : false,  //默认没有选择
                    pageNum : 1,
                    pageSize : 0,
                    parentId : 'root',
                    emptyText : '正在加载。。。'
                },
                
            }
        },
        methods : {
            closeAddWebsiteDialog(){
                this.showAddWebsite = false;
            },
            addWebsite(){   //显示添加网站组件
                this.showAddWebsite = true;
            },
            websiteDOMHTML(data){   //用于渲染tree中的dom节点函数
                if(data.folder == 1){  //说明是文件夹，返回文件夹DOM显示
                    return `
                        <i class="fa fa-folder"></i>
                        ${data.folderName}
                    `
                }
                //如果不是文件夹，就返回相应的网站dom结构
                return `
                    <a class="website-link-wrapper clearfix" href="http://${data.websiteUrl}" target="_blank">
                        <div class="website-link">
                            <span class="website-icon-wrapper">
                                <img src="${data.websiteIcon}" alt="${data.folderName}">
                            </span>
                            ${data.websiteName} (${data.websiteUrl})
                        </div>
                    </a>
                `;
                //后期功能，如果需要添加单个网站修改，则加入到website-link-wrapper中
                // <div class="operate-wrapper">
                //     <i class="fa fa-arrows"></i>
                //     <i class="fa fa-edit"></i>
                //     <i class="fa fa-trash-o"></i>
                // </div>
            },
            clickNode(){
                console.log('点击节点');
            },
            handleCheckChange(data, checked, indeterminate) {   //选中tree中的复选框
                // console.log(data, checked, indeterminate);
            },
            handleNodeClick(data) {     //点击tree节点函数，将查询id变为当前点击的id
                // console.log(data);
                this.websiteListReqInfo.isChoosed = true;
                this.websiteListReqInfo.parentId = data.id;
            },
            loadNode(node, resolve) {   //Tree懒加载函数
                let that = this;
                if (node.level === 0) { 
                    return resolve([{folderName : '全部书签', id:'root', folder:1 }]);
                    that.websiteListReqInfo.parentId = 'root';
                }else{
                    that.websiteListReqInfo.parentId = node.data.id;
                }
                that.getWebsiteList(function(results){
                    for(let i=0; i<results.length; i++){
                        if(results[i].folder == 0){ //说明是网站，设置为叶子节点
                            results[i].leaf = true;
                        }
                    }
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
            this.getWebsiteList();  //获取收藏网站列表信息
        }
    }
</script>