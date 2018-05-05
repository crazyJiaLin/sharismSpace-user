import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import './assets/js/jquery-3.3.1.js'
import App from './App.vue'

// 全局地址请求
window.blogReqUrl = 'http://www.sharismspace.com/blog_server-0.0.1-SNAPSHOT';   //博客系统服务器地址
window.userReqUrl = 'http://www.sharismspace.com/user_server-0.0.1-SNAPSHOT';   //用户系统服务器地址
window.albumReqUrl = 'http://www.sharismspace.com/album_server-0.0.1-SNAPSHOT';  //相册系统服务器地址
window.fileReqUrl = 'http://www.sharismspace.com/file_server-0.0.1-SNAPSHOT';   //文件上传系统服务器地址
window.resourceReqUrl = 'http://www.sharismspace.com/resource_server-0.0.1-SNAPSHOT' ;  //文件管理系统服务器地址

window.debounce = function(action,idle){      //节流函数,挂在到window对象上
  var last
  return function(){
      var ctx = this, args = arguments
      clearTimeout(last)
      last = setTimeout(function(){
          action.apply(ctx, args)
      }, idle)
  }
};

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

// 博客系统
import Blog from './assets/components/content/components/blog/blog.vue'
import BlogList from './assets/components/content/components/blog/components/blog-list.vue'
import AddBlog from './assets/components/content/components/blog/components/add-blog.vue'
// 相册系统
import Album from './assets/components/content/components/album/album.vue'
import AlbumList from './assets/components/content/components/album/album-list.vue'
import AlbumDetail from './assets/components/content/components/album/album-detail.vue'
// 文件系统
import File from './assets/components/content/components/file/file.vue'
import Website from './assets/components/content/components/website/website.vue'

//自定义过滤器，取得字符串前10位
Vue.filter('filterPhotoName', function(value) {
  // console.log(value.lastIndexOf('.'));
  if(value.lastIndexOf('.') >= 0){
    value = value.toString().slice(0,value.lastIndexOf('.'));
  }
  if(value.length > 10){
    // console.log('字符串大于十个过滤'+value);
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
});
Vue.filter('fileSizeFilter', function(value) {
  value = parseFloat(value);
  // console.log(value);
  if(value<0){
    return '-';
  }else if(value>=0 && value <1024){
    return value.toFixed(2) + 'KB';
  }else if(value>=1024 && value <1048576){
    return (value/1024).toFixed(2) + 'MB';
  }else if(value>=1048576){
    return (value/1048576).toFixed(2) + 'GB';
  }
});

// 文件类型过滤器，传入文件名，返回图标class
Vue.filter('fileTypeFilter', function(value) {
  value = JSON.parse(value); 
  // console.log(value);
  if(value.isFolder == 1){
    return 'fa fa-folder';  //文件夹类型
  }

  if(value.type.lastIndexOf('.') >= 0){  //说明有后缀，不是文件夹
    var suffix = value.type.toString().slice(value.type.lastIndexOf('.'));
    // console.log(suffix);
    if(suffix == '.txt'){   //文本类型
      return 'fa fa-file-text-o';
    }else  if(/\.(js|html|css)/i.test(suffix)){  //代码类型
      return 'fa fa-file-code-o';
    }else  if(/\.(jpg|jpeg|png|svg|gif|bmp)/i.test(suffix)){  //图片类型
      return 'fa fa-file-image-o';
    }else  if(/\.(mp3|wma|wav|mod|ra|cd|md|asf)/i.test(suffix)){  //声音类型
      return 'fa fa-file-sound-o';
    }else  if(/\.(mp4|avi|mov|mpeg|mpg|qt|ram|viv)/i.test(suffix)){  //视频类型
      return 'fa fa-file-video-o';
    }else  if(/\.(zip|rar|tar|gzip|cab|uue|arj|iso)/i.test(suffix)){  //压缩类型
      return 'fa fa-file-zip-o';
    }else  if(/\.(pdf)/i.test(suffix)){  //word
      return 'fa fa-file-pdf-o';
    }else  if(/\.(doc|docx)/i.test(suffix)){  //pdf
      return 'fa fa-file-word-o';
    }else  if(/\.(xls|xlsx)/i.test(suffix)){  //excel
      return 'fa fa-file-excel-o';
    }else  if(/\.(ppt|pptx)/i.test(suffix)){  //ppt
      return 'fa fa-file-powerpoint-o';
    }else{  //其他文件类型
      return 'fa fa-file-o';
    }
  }else{  //其他文件类型
    return 'fa fa-file-o';
  }
  
});


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
      // if(to.path == '/file'){
      //   console.log('file');
      //   window.location.hash = '/file/all';
      // }
      // if()
    }
	},
  render: h => h(App)
 
})
