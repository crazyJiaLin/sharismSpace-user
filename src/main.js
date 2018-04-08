import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import './assets/js/jquery-3.3.1.js'
import App from './App.vue'

import './assets/css/reset.css'                 //全局css
import 'element-ui/lib/theme-chalk/index.css'   
import './assets/css/animation.css'
import './assets/css/font-awesome.min.css'
//组件样式
import './assets/components/header/header.css'
import './assets/components/nav/nav.css'
import './assets/components/content/components/blog/blog-list.css'

Vue.use(ElementUI);
Vue.use(VueRouter);

import Blog from './assets/components/content/components/blog/blog.vue'
import BlogList from './assets/components/content/components/blog/components/blog-list.vue'
import Journal from './assets/components/content/components/journal/journal.vue'
import Album from './assets/components/content/components/album/album.vue'
import File from './assets/components/content/components/file/file.vue'
import Website from './assets/components/content/components/website/website.vue'

window.blogReqUrl = 'http://118.25.48.91:8080/blog_server-0.0.1-SNAPSHOT';   //博客系统服务器地址
window.userReqUrl = 'http://118.25.47.192:8080/user_server-0.0.1-SNAPSHOT';   //用户系统服务器地址


const router = new VueRouter({
  routes: [
    { path: '/blog', component: Blog,children:[
      {path:'/blog/list',component:BlogList}
    ] },
    { path: '/journal', component: Journal },
    { path: '/album', component: Album },
    { path: '/file', component: File },
    { path: '/website', component: Website },
    {path:'*',redirect:'/blog/list'}
  ]
})
new Vue({
  el: '#app',
  router,
  watch : {
		$route : function(to,from){
      if(to.path == '/blog'){
        window.location.hash = '/blog/list';
      }
    }
	},
  render: h => h(App)
 
})
