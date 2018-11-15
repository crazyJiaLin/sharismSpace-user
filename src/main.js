import Vue from 'vue'
import VueRouter from 'vue-router'
// import ElementUI from 'element-ui'
import './assets/js/jquery-3.3.1.js'
import App from './App.vue'

Vue.use(VueRouter);
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  // DatePicker,
  // TimeSelect,
  // TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  // Slider,
  Icon,
  Row,
  Col,
  // Upload,      //上传
  Progress,      //进度条
  Badge,          //标记
  // Card,        //卡片
  // Rate,        //评分
  // Steps,
  // Step,
  // Carousel,
  // CarouselItem,
  Collapse,
  CollapseItem,
  // Cascader,  //级联选择器
  // ColorPicker,
  // Transfer,  //穿梭层
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
// Vue.use(DatePicker);
// Vue.use(TimeSelect);
// Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Alert);
// Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
// Vue.use(Upload);
Vue.use(Progress);
Vue.use(Badge);
// Vue.use(Card);
// Vue.use(Rate);
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(Carousel);
// Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
// Vue.use(Cascader);
// Vue.use(ColorPicker);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;



// CSS
import './assets/css/reset.css'                 //全局css
// import 'element-ui/lib/theme-chalk/index.css'   
import './assets/css/animation.css'
import './assets/css/font-awesome.min.css'
// import './assets/css/public.css'    //公共样式
//组件样式
import './assets/components/header/header.css'
import './assets/components/nav/nav.css'
import './assets/components/content/components/blog/blog-list.css'
import './assets/components/content/components/album/album-list.css'



//组件引用
const Blog = () => import('./assets/components/content/components/blog/blog.vue')
const BlogList = () => import('./assets/components/content/components/blog/components/blog-list.vue')
const AddBlog = () => import('./assets/components/content/components/blog/components/add-blog.vue')

const Album = () => import('./assets/components/content/components/album/album.vue')
const AlbumList = () => import('./assets/components/content/components/album/album-list.vue')
const AlbumDetail = () => import('./assets/components/content/components/album/album-detail.vue')

const File = () => import('./assets/components/content/components/file/file.vue')
const Website = () => import('./assets/components/content/components/website/website.vue')
const Recyclebin = () => import('./assets/components/content/components/recyclebin/recyclebin.vue')

import { resolve } from 'path';


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
    { path: '/recyclebin', component: Recyclebin },
    {path:'*',redirect:'/blog/list'}
  ]
})

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
    return value.toFixed(2) + 'K';
  }else if(value>=1024 && value <1048576){
    return (value/1024).toFixed(2) + 'M';
  }else if(value>=1048576){
    return (value/1048576).toFixed(2) + 'G';
  }
});

// 文件类型过滤器，传入文件名，返回图标class
Vue.filter('fileTypeFilter', function(value) {
  value = JSON.parse(value); 
  // console.log(value);
  if(value.isFolder == 1){
    return 'fa fa-folder';  //文件夹类型
  }

  if(value.name.lastIndexOf('.') >= 0){  //说明有后缀，不是文件夹
    var suffix = value.name.toString().slice(value.name.lastIndexOf('.'));
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

Vue.filter('websiteIconFilter', function(value) {
  console.log(value);
  if(value.folder == 1){  //说明是文件夹，返回文件夹图标
    return 'fa fa-folder'
  }
  return '';
});


// 全局地址请求
window.blogReqUrl = 'http://www.sharismspace.com/blog_server-0.0.1-SNAPSHOT';   //博客系统服务器地址
window.userReqUrl = 'http://www.sharismspace.com/user_server-0.0.1-SNAPSHOT';   //用户系统服务器地址
window.albumReqUrl = 'http://www.sharismspace.com/album_server-0.0.1-SNAPSHOT';  //相册系统服务器地址
window.fileReqUrl = 'http://www.sharismspace.com/file_server-0.0.1-SNAPSHOT';   //文件上传系统服务器地址
window.resourceReqUrl = 'http://www.sharismspace.com/resource_server-0.0.1-SNAPSHOT' ;  //文件管理系统服务器地址
window.websiteReqUrl = 'http://www.sharismspace.com/collect_server-0.0.1-SNAPSHOT';  //网站收藏系统服务器地址

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
