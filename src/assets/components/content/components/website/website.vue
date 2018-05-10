<template>
        <div class="sec-router-wrapper">
        <div class="second-chilren-router-wrapper">
            <div class="second-chilren-router-left-wrapper">
                <div class="blog-list-wrapper album-list-wrapper">
                    <div class="website-tab-wrapper">
                        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                            <el-tab-pane label="全部网站" name="first">
                                <WebsiteAll></WebsiteAll>
                            </el-tab-pane>
                            <el-tab-pane label="最近访问" name="second">最近访问</el-tab-pane>
                        </el-tabs>
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
                                <div class="blog-info-label">总网站数量</div>
                                <div class="blog-info-number">{{fileUserInfo.attentonCount}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">星标</div>
                                <div class="blog-info-number">{{fileUserInfo.attentonedCount}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">最近访问</div>
                                <div class="blog-info-number">999</div>
                            </div>
                        </div>
                       
                    </div>
                    <div @click="foldUserInfo" class="hide-user-info-btn"><i class="fa fa-angle-double-right"></i></div>
                </div>                
            </div>
        </div>
    </div>
</template>

<script>
    import './website.css'
    const WebsiteAll = () => import('./website-all.vue')
    export default{
        components : {
            WebsiteAll
        },
        computed : {
            userSexIcon(){  //计算属性，将性别数据变为图标
               return this.fileUserInfo.userSex == '女' ? '<i class="fa fa-venus"></i>' : '<i class="fa fa-mars"></i>';
            }
        },
        data(){
            return {
                activeName : 'first',
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
                }
            }
        },
        methods : {
            
            handleClick(){  //点击选项卡

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
        },
        mounted(){
            
        }
    }
</script>