<template>
    <div>
        <el-dialog  title="添加网站" :visible.sync="showAddWebsiteDialog" width="500px" :before-close="returnClose">
            <el-form :model="addWebsiteForm" ref="addWebsiteForm" :rules="addWebsiteFormRules" label-position="right" class="create-alum-dialog">
                <el-form-item label="网站名称："  prop="websiteName" :label-width="'100px'" >
                    <el-input v-model="addWebsiteForm.websiteName" auto-complete="off" width="300" placeholder="请输入网站名称"></el-input>
                </el-form-item>
                <el-form-item label="网址：" prop="websiteUrl" :label-width="'100px'">
                    <el-input v-model="addWebsiteForm.websiteUrl" auto-complete="off" width="300" placeholder="请输入网站地址"></el-input>
                </el-form-item>
                <el-form-item label="图标：" prop="websiteIcon" :label-width="'100px'">
                    <el-row>
                        <el-col :span="10" class="website-icon-selector">
                            <el-button @click="clickChangeIcon($event)">更换图标</el-button>
                            <input @change="showWebsiteIcon" type="file" accept="image/*" class="website-icon-selector-file-input"/>
                        </el-col>
                        <!-- 显示网站图标 -->
                        <el-col :span="14" class="show-icon-wrapper">
                            <div class="show-icon" v-html="addWebsiteForm.showIconHtml"></div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="添加到：" :label-width="'100px'">
                        <div class="block">
                            <el-cascader
                                :options="folderList"
                                :props="props"
                                v-model="addWebsiteForm.cascaderOption"
                                clearable
                                change-on-select
                                @change="handleChange">
                            </el-cascader>
                        </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="returnClose">取 消</el-button>
                <el-button type="primary" @click="confirmAddWebsite">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default{
        data(){
            let validatorUrl = (rules,value,callback)=>{
                let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)/;
                if(!reg.test(value)){
                    callback(new Error('这网址不是以http://https://开头，或者不是网址！'));
                }else{
                    let valueArr = value.split('/');
                    let tempArr = [];
                    for(let i=0; i<3; i++){
                        tempArr.push(valueArr[i]);
                    }
                    let websiteIconUrl = tempArr.join('/') + '/favicon.ico';
                    this.addWebsiteForm.showIconHtml = '<img src="'+ websiteIconUrl +'">';
                    this.addWebsiteForm.websiteIcon = websiteIconUrl;
                }
                
            }
            return{
                folderList: [
                    { id: 'root', folderName: '全部书签', children: [] }
                ],          
                props : {
                    value : 'id',
                    label : 'folderName'
                },     
                showAddWebsiteDialog : true,    //是否显示 添加网站 对话框
                addWebsiteForm : {  //添加网站表单字段
                    websiteName : '',
                    websiteUrl : '',
                    websiteIcon : '',
                    parentId : 'root',
                    cascaderOption : [],
                    showIconHtml : '1:1'
                },
                addWebsiteFormRules : {  //添加网站表单验证规则
                    websiteName: [
                        { required: true, message: '请输入网站名称', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    websiteUrl: [
                        { required: true, message: '请输入网站名称', trigger: 'blur' },
                        { validator: validatorUrl , trigger: 'blur' },
                    ],
                }
                
            }
        },
        methods : {
            clickChangeIcon($event){    //点击更换图标按钮,转移点击事件到input
                // console.log($($event.target).parents('.website-icon-selector').find('.website-icon-selector-file-input'));
                $($event.target).parents('.website-icon-selector').find('.website-icon-selector-file-input').click(); 
            },  
            showWebsiteIcon(){  //当修改的时候，进行图片的上传和显示
                let that = this;
                that.addWebsiteForm.showIconHtml = '<i class="fa fa-spinner fa-spin"></i>';
                console.log($('.website-icon-selector .website-icon-selector-file-input')[0].files[0]);
                var file = $('.website-icon-selector .website-icon-selector-file-input')[0].files[0];
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
                            that.addWebsiteForm.showIconHtml = '<img src="'+ data.value +'">';
                            that.addWebsiteForm.websiteIcon = data.value;
                        }else{
                            that.$message.error(data.message);
                        }
                    }, 				 
                    error:function(){  
                        that.$message.error("服务器开小差了~稍后重试 ^8^");  
                    }  
                });

            },
            returnClose(done){
                this.$emit('closeAddWebsiteDialog',false);
            },
            confirmAddWebsite(){
                if(!this.addWebsiteForm.websiteName || !this.addWebsiteForm.websiteUrl || this.addWebsiteForm.cascaderOption.length == 0){
                    return this.$message({
                        type : 'warning',
                        message : '请填写网站信息再进行提交'
                    });
                }
                this.$emit('closeAddWebsiteDialog',this.addWebsiteForm);
            },
            handleChange(value){
                console.log(value);
                this.addWebsiteForm.parentId = value[value.length-1];
            },
            getWebsiteFolderList(){     //获取文件夹列表
                let that = this;
                $.ajax({
                    type: "post",        
                    url: window.websiteReqUrl + "/websitecollect/selectFolderList",
                    contentType: false, 
                    processData: false, 
                    dataType: 'json',
                    data : null,
                    xhrFields: {  
                        withCredentials: true  
                    },
                    success:function(data){
                        console.log(data)
                        if(data.code == 1){
                            that.folderList[0].children = data.value;
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
            this.getWebsiteFolderList();    //获取文件夹列表
        }
    }
</script>