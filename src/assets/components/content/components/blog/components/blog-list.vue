<template>
    <div class="second-chilren-router-wrapper">
        <div class="blog-nav-wrapper">
            <div class="blog-nav">blog-nav</div>
            <div @click="showBlogNav" class="show-blog-nav-btn"><i class="fa fa-angle-double-right"></i></div>
        </div>
        
        <div class="second-chilren-router-left-wrapper">
            <div class="blog-list-wrapper">
                <ul class="blog-list">
                    <li class="blog-item">
                        <a href="#">
                            <h3 class="blog-title">博客标题1</h3>
                            <p class="blog-abstract">博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述博客描述描述</p>
                            <div class="blog-info-wrapper">
                                <div class="blog-info blog-label">原创</div>
                                <div class="blog-info release-time">2018-04-04</div>
                                <div class="blog-info page-view"><i class="fa fa-eye"></i>207</div>
                                <div class="blog-info blog-star"><i class="fa fa-star"></i>20</div>
                                <div class="blog-info blog-commemt"><i class="fa fa-commenting"></i>3</div>
                                <div class="blog-management">
                                    <el-button type="text" class="edit-blog"><i class="fa fa-edit"></i></el-button>
                                    <el-button type="text" class="delete-blog"><i class="fa fa-trash-o"></i></el-button>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li class="blog-item">
                        blog-list
                    </li class="blog-item">
                    <li class="blog-item">blog-list</li>
                    <li class="blog-item">blog-list</li>
                    <li class="blog-item">blog-list</li>
                    <li class="blog-item">blog-list</li>
                </ul>
            </div>
            <div @click="foldUserInfo" class="hide-user-info-btn"><i class="fa fa-angle-double-right"></i></div>
        </div>
        <div class="second-chilren-router-right-wrapper">
            user-blog-info-wrapper
        </div>
    </div>
</template>

<script>
    export default{
        methods : {
            showBlogNav(){
                if($('.blog-nav-wrapper').hasClass('active')){
                    $('.blog-nav-wrapper').removeClass('active');
                    $('.second-chilren-router-wrapper').removeClass('show-blog-nav');
                    $('.show-blog-nav-btn i').removeClass('fa-rotate-180');
                }else{
                    $('.blog-nav-wrapper').addClass('active');
                    $('.second-chilren-router-wrapper').addClass('show-blog-nav');
                    $('.show-blog-nav-btn i').addClass('fa-rotate-180');
                }
            },
            foldUserInfo(){
                if($('.second-chilren-router-wrapper').hasClass('close-user')){
                    $('.second-chilren-router-wrapper').removeClass('close-user');
                    $('.hide-user-info-btn i').removeClass('fa-rotate-180');
                }else{
                    $('.second-chilren-router-wrapper').addClass('close-user');
                    $('.hide-user-info-btn i').addClass('fa-rotate-180');
                }
            }
        },
        mounted(){
            // $(window).resize(function(){
            //     var blogNavWrapperWidth = parseInt($('.blog-nav-wrapper').css('width'));
            //     if(blogNavWrapperWidth !=0 && blogNavWrapperWidth < 280){
            //         $('.blog-nav-wrapper').css('width','280px');
            //     }
            //     console.log();
            // });
        }
    }
</script>
