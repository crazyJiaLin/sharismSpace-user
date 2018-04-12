<template>
    <div class="sec-router-wrapper">
        <div class="second-chilren-router-wrapper">
            <div class="second-chilren-router-left-wrapper">
                <div class="edit-blog-wrapper-wrapper">
                    <div class="edit-blog-wrapper">
                        
                        <div class="blog-title-wrapper">
                            <el-form class="blog-title-form" label-width="80px" :model="blogTitleForm">
                                <el-form-item label="博客标题">
                                    <el-input v-model="blogTitleForm.blogTitle" placeholder="请输入博客标题"></el-input>
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
                <div class="select-add-option-wrapper">
                    <el-form ref="submitBlogForm" :model="submitBlogForm" label-width="80px">
                        <el-form-item label="公开">
                            <el-col :span="4">
                                <el-switch v-model="submitBlogForm.public"></el-switch>
                            </el-col>    
                            <el-col :span="4" :offset="8">
                                
                                <el-button size="small"><el-badge :hidden="hiddenSaveDraftBadge" is-dot class="item">保存到草稿</el-badge></el-button>
                            </el-col>                            
                        </el-form-item>
                        <el-form-item label="分类选择">
                            <el-row :gutter="20">
                                <el-col :span="10">
                                    <el-select v-model="submitBlogForm.classify" placeholder="请选择文集名称">
                                        <el-option label="一级分类1" value="一级分类1"></el-option>
                                        <el-option label="一级分类1" value="一级分类1"></el-option>
                                    </el-select>
                                </el-col>    
                                <el-col :span="10">
                                    <el-select v-model="submitBlogForm.blogType" placeholder="请选择分类名称">
                                        <el-option label="二级分类1" value="二级分类1"><div>123</div></el-option>
                                        <el-option label="二级分类1" value="二级分类1"></el-option>
                                    </el-select>
                                </el-col>       
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-row :gutter="20">
                                <el-col :span="10">
                                    <el-button>预览</el-button>
                                </el-col>    
                                <el-col :span="10">
                                        <el-button type="primary" @click="createBlog">发布博客</el-button>
                                </el-col>       
                            </el-row>
                        </el-form-item>
                    </el-form>
                    <el-collapse>
                        <el-collapse-item title="草稿箱" name="1" class="draft-wrapper">
                            <ul class="draft-list">
                                <li>
                                    <span>博客标题标题博客标题标题博客标题标题</span>
                                    <i class="fa fa-trash-o"></i>
                                </li>
                                <li>
                                    <span>博客标题标题博客标题标题博客标题标题</span>
                                    <i class="fa fa-trash-o"></i>
                                </li>
                                <li>
                                    <span>博客标题标题博客标题标题博客标题标题</span>
                                    <i class="fa fa-trash-o"></i>
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
    // import UploadImg from '../../../../upload/upload-img.vue'
    export default{
        components : {
            // UploadImg
        },
        data(){
            return {
                fileList: [],
                showUploadImg : false,
                hiddenSaveDraftBadge : false,   //是否隐藏保存草稿箱的小圆点
            　  editor: null,
                // id: Math.random().toString(16).substring(2) + 'ueditorId',
                blogTitleForm : {
                    blogTitle : ''
                },
                submitBlogForm: {
                    isInline : true,
                    public: true,
                    classify : '',
                    blogType : ''
                }
            } 
        },
        methods : {
            createBlog() {
                console.log('发布博客!');
            },
            gettext() {         //获取博客主体内容
            　　console.log(this.editor.getContent())
        　　 }
        },
        destroyed() {
            this.editor.destroy();
        },
        mounted(){
            this.editor = UE.getEditor('editor');   //实例化富文本
           
        }
    }
</script>