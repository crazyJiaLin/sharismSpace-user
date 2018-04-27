import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import './assets/js/jquery-3.3.1.js'
import App from './App.vue'

// 全局地址请求
window.blogReqUrl = 'http://www.sharismspace.com/blog_server-0.0.1-SNAPSHOT';   //博客系统服务器地址
window.userReqUrl = 'http://www.sharismspace.com/user_server-0.0.1-SNAPSHOT';   //用户系统服务器地址
window.albumReqUrl = 'http://www.sharismspace.com/album_server-0.0.1-SNAPSHOT';  //相册系统服务器地址
window.fileReqUrl = 'http://www.sharismspace.com/file_server-0.0.1-SNAPSHOT';   //文件系统服务器地址

// CSS
import './assets/css/reset.css'                 //全局css
import 'element-ui/lib/theme-chalk/index.css'   
import './assets/css/animation.css'
import './assets/css/font-awesome.min.css'
//组件样式
import './assets/components/header/header.css'
import './assets/components/nav/nav.css'
import './assets/components/content/components/blog/blog-list.css'
import './assets/components/content/components/blog/add-blog.css'


//JS
//富文本
import './assets/Ueditor/ueditor.config.js'
import './assets/Ueditor/ueditor.all.js'
import './assets/Ueditor/lang/zh-cn/zh-cn.js'
import './assets/Ueditor/ueditor.parse.min.js'

Vue.use(ElementUI);
Vue.use(VueRouter);


import Blog from './assets/components/content/components/blog/blog.vue'
import BlogList from './assets/components/content/components/blog/components/blog-list.vue'
import AddBlog from './assets/components/content/components/blog/components/add-blog.vue'
import Album from './assets/components/content/components/album/album.vue'
import AlbumList from './assets/components/content/components/album/album-list.vue'
import AlbumDetail from './assets/components/content/components/album/album-detail.vue'
import File from './assets/components/content/components/file/file.vue'
import Website from './assets/components/content/components/website/website.vue'

//自定义过滤器，取得字符串前10位
Vue.filter('sliceStr10', function(value) {
  value = value.toString()
  if(value.length >= 10){
    console.log('字符串大于十个过滤'+value);
    return value.substring(0,10) + '...';
  }
  return value;
});

Vue.filter('filterTime', function(value) {
  value = value.toString()
  if(value.length >= 10){
    return value.substring(0,10);
  }
  return value;
})


const router = new VueRouter({
  routes: [
    { path: '/blog', component: Blog,children:[
      {path:'/blog/list',component:BlogList},
      {path:'/blog/add',component:AddBlog}
    ] },
    // { path: '/journal', component: Journal },
    { path: '/album', component: Album ,children:[
      {path:'/album/list',component:AlbumList},
      {path:'/album/detail/:albumName',component:AlbumDetail}
    ] },
    { path: '/file', component: File },
    { path: '/website', component: Website },
    {path:'*',redirect:'/blog/list'}
  ]
})
// router.beforeEach(function(to,from ,next){
//   console.log(to);
//   console.log(from);
//   console.log(next);
// })
new Vue({
  el: '#app',
  router,
  watch : {
		$route : function(to,from){
      // console.log(to);
      // console.log(from);
      if(to.path == '/blog'){
        window.location.hash = '/blog/list';
      }
      if(to.path == '/album'){
        window.location.hash = '/album/list';
      }
      // if()
    }
	},
  render: h => h(App)
 
})
