<template>
    <div class="sec-router-wrapper">
        <div class="second-chilren-router-wrapper">
            <div class="second-chilren-router-left-wrapper">
                <div class="blog-list-wrapper album-list-wrapper">
                    <div class="album-breadcrumb-wrapper">
                        <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item v-for="(item,key) in breadcrumbList" :to="item.path">{{item.breadcrumb}}</el-breadcrumb-item>
                        </el-breadcrumb>
                        <div class="change-view-btn">
                            <i class="fa fa-th-large"></i>
                        </div>
                    </div>
                    <div class="album-second-router-wrapper file-second-router-wrapper">
                        <div class="file-operate-btns-wrapper">
                            <el-button size="medium" type="primary" plain icon="fa fa-cloud-upload fa-lg">上传</el-button>
                            <el-button size="medium" type="primary" plain icon="fa fa-folder-open-o">新建文件夹</el-button>
                            <el-button-group class="file-operate-btns">
                                <el-button size="medium" plain icon="fa fa-share-alt fa-lg fa-lg">分享</el-button>
                                <el-button size="medium" plain icon="fa fa-cloud-download fa-lg">下载</el-button>
                                <el-button size="medium" plain >重命名</el-button>
                                <el-button size="medium" plain >移动到</el-button>
                                <el-button size="medium" plain icon="fa fa-trash-o fa-lg">删除</el-button>
                            </el-button-group>
                        </div>
                        <div class="file-list-wrapper">
                                <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark"
                                    style="width: 100%"
                                    @selection-change="handleSelectionChange">
                                    <el-table-column
                                    type="selection"
                                    width="60">
                                    </el-table-column>
                                    <el-table-column
                                    label="文件名"
                                    width="500"
                                    prop="name">
                                    </el-table-column>
                                    <el-table-column
                                    prop="size"
                                    label="大小"
                                    width="120">
                                    </el-table-column>
                                    <el-table-column
                                    prop="date"
                                    label="修改日期"
                                    show-overflow-tooltip>
                                    </el-table-column>
                              </el-table>
                        </div>
                    </div>
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
                                <div class="user-info user-nickname">{{fileUserInfo.userNickname}}</div>
                                <div class="user-info mail">{{fileUserInfo.mail}}</div>
                                <div class="user-info">
                                    <div class="user-info-item user-age">{{fileUserInfo.userAge}}</div>
                                    <div class="user-info-item user-sex" v-html="userSexIcon"></div>
                                    <div class="user-info-item constellation">{{fileUserInfo.constellation}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="blog-info-wrapper">
                            <div class="blog-user-info">
                                <div class="blog-info-label">总文件</div>
                                <div class="blog-info-number">{{fileUserInfo.attentonCount}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">下载</div>
                                <div class="blog-info-number">{{fileUserInfo.attentonedCount}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">积分</div>
                                <div class="blog-info-number">999</div>
                            </div>
                        </div>
                        <div class="show-file-capacity">
                            <div class="show-capacity-info">
                                <span>256.5G/500G</span> 
                                <el-button class="extend-capacity-btn" type="text">扩容</el-button>
                            </div>
                            <el-progress :text-inside="true" :stroke-width="18" :percentage="51.2"></el-progress>
                        </div>
                    </div>
                    <div @click="foldUserInfo" class="hide-user-info-btn"><i class="fa fa-angle-double-right"></i></div>
                </div>                
            </div>
        </div>
    </div>
</template>

<script>
    import './file.css'
    export default{
        computed : {
            userSexIcon(){
               return this.fileUserInfo.userSex == '女' ? '<i class="fa fa-venus"></i>' : '<i class="fa fa-mars"></i>';
            }
        },
        data(){
            return {
                tableData3: [{
                date: '2016-05-03',
                name: '新建文件夹',
                size: '-'
                }],
                breadcrumbList : [
                    // {path:{},breadcrumb:'相册管理'},
                    {path:{path:'/file'},breadcrumb:'全部文件'}
                ],
                fileUserInfo : {
                    userNickname : 'crazyjialin',
                    iconPath: 'http://photocdn.sohu.com/20110518/Img307890814.jpg',
                    mail : 'crazyjialin@foxmail.com',
                    userAge : 22,
                    userSex : '女',
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
            toggleSelection(rows) {
                if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
                } else {
                this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
        }
    }
</script>