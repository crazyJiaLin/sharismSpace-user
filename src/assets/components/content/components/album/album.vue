<template>
    <div class="sec-router-wrapper">
        <div class="second-chilren-router-wrapper">
            <div class="second-chilren-router-left-wrapper">
                <div class="blog-list-wrapper album-list-wrapper">
                    <div class="album-breadcrumb-wrapper">
                        <el-breadcrumb separator="/" separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item v-for="(item,key) in breadcrumbList" :to="item.path">{{item.breadcrumb}}</el-breadcrumb-item>
                        </el-breadcrumb>
                        <!-- <div class="sort-photo-wrapper">
                            sort-photo
                        </div> -->
                    </div>
                    <div class="album-second-router-wrapper">
                        <transition name="album-children-router-view" class="animated">
                            <router-view ></router-view>
                        </transition>
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
                                <div class="blog-info-label">照片</div>
                                <div class="blog-info-number">{{blogUserInfo.attentonCount}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">视频</div>
                                <div class="blog-info-number">{{blogUserInfo.attentonedCount}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">最爱</div>
                                <div class="blog-info-number">999</div>
                            </div>
                        </div>
                        <div class="blog-info-wrapper">
                            <div class="blog-user-info">
                                <div class="blog-info-label">被收藏</div>
                                <div class="blog-info-number">{{blogUserInfo.blogOriginal}}</div>
                            </div>
                            <div class="blog-user-info">
                                <div class="blog-info-label">访问量</div>
                                <div class="blog-info-number">{{blogUserInfo.blogTransshipment}}</div>
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
    import './album-list.css'
    export default{
        watch : {
            $route(to,from){
                console.log('路由改变了');
                console.log(to);
              this.setBreadByParams(to.path);
            }
        },
        computed : {
            userSexIcon(){
               return this.blogUserInfo.userSex == '女' ? '<i class="fa fa-venus"></i>' : '<i class="fa fa-mars"></i>';
            }
        },
        data(){
            return {
                breadcrumbList : [
                    // {path:{},breadcrumb:'相册管理'},
                    {path:{path:'/album/list'},breadcrumb:'相册列表'}
                ],
                blogUserInfo : {
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
            setBreadByUrl(){
                // console.log(window.location.hash);
                this.setBreadByParams(window.location.hash);
            },
            setBreadByParams(to){
                if(to.indexOf('/album/detail/') != -1){ //说明进入相片详情组件
                    let arr =  to.split('/')
                    let albumName = decodeURIComponent(arr[arr.length-1]);
                    console.log(albumName);
                    let breadObj = {path:{},breadcrumb:albumName};
                    this.breadcrumbList.push(breadObj);
               }else if(to.indexOf('/album/list') != -1){
                   this.breadcrumbList=[
                    // {path:{},breadcrumb:'相册管理'},
                    {path:{path:'/album/list'},breadcrumb:'相册列表'}
                ];
               }
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
            this.setBreadByUrl();       //加载到相册列表是，通过哈希值获取设置面包屑
        }
    }
</script>