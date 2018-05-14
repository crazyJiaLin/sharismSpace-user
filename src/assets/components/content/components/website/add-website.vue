<template>
    <div>
        <el-dialog  title="添加网站" :visible.sync="showAddWebsiteDialog" width="500px" :before-close="returnClose">
            <el-form :model="addWebsiteForm" label-position="right" class="create-alum-dialog">
                <el-form-item label="网站名称：" :label-width="'90px'" >
                    <el-input v-model="addWebsiteForm.websiteName" auto-complete="off" width="300" placeholder="请输入网站名称"></el-input>
                </el-form-item>
                <el-form-item label="网址：" :label-width="'90px'" >
                    <el-input v-model="addWebsiteForm.websiteUrl" auto-complete="off" width="300" placeholder="请输入网站地址"></el-input>
                </el-form-item>
                <el-form-item label="添加到：" :label-width="'90px'">
                        <div class="block">
                            <el-cascader
                                :options="folderList"
                                :props="props"
                                clearable
                                change-on-select
                                @change="handleChange">
                            </el-cascader>
                        </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="returnClose">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default{
        props : {
           
        },
        data(){
            return{
                folderList: [
                    { id: 'root', folderName: '全部书签', children: [] }
                ],          
                props : {
                    value : 'id',
                    label : 'folderName'
                },     
                showAddWebsiteDialog : true,    //是否显示 添加网站 对话框
                addWebsiteReqFolderInfo : {
                    parentId : 'root'
                },
                addWebsiteForm : {  //添加网站表单字段
                    websiteName : '',
                    websiteUrl : '',
                },
                addWebsiteFormRules : {  //添加网站表单验证规则
                    
                }
                
            }
        },
        methods : {
            returnClose(done){
                this.$emit('closeAddWebsiteDialog','close');
            },
            handleChange(value){
                console.log(value);
                let that = this;
                that.addWebsiteReqFolderInfo.parentId = value[value.length-1];
                that.getWebsiteFolderList(function(results){
                    console.log(that.folderList);
                    if(results.length == 0){
                        that.folderList = null;
                    }
                    for(let i=0; i<results.length;i++){
                        results[i].children = [];
                    }
                    that.folderList = results;
                });
            },
            getWebsiteFolderList(callback){
                let that = this;
                var map = {
                //当前页号
                'pageNum':1,
                //每页显示的数据条数
                'pageSize':0,
                //父级目录id  如果是没有父级目录，而是刚进入文件模块的列表，就空着。
                //如果是进入某个文件夹，则填写该文件夹的id
                'parentId': that.addWebsiteReqFolderInfo.parentId,
                //是否是文件夹    1:新建文件夹   0：网站收藏
                //一般是文件夹和网站都查询，则空着，如果只查询文件夹或者只查询网站，就设置0或1
                'folder' : 1,
                //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
                'arrange':"DESC",
                // //arrangeRule等于0 则按最近点击时间排序，如果等于1，则按点击次数排序，如果不填，则按添加时间排序
                // 'arrangeRule':0		
                };		
                var formData=new FormData();
                formData.append("collectPageMap",JSON.stringify(map));
                $.ajax({
                    type: "post",        
                    url: window.websiteReqUrl + "/websitecollect/WebSiteCollectList",
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

            }
        }
    }
</script>