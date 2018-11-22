import Vue from 'vue'
import VueRouter from 'vue-router'
import './assets/js/jquery-3.3.1.js'
import App from './App.vue'

Vue.use(VueRouter);
// Element 组件按需引入
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
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Alert,
  Row,
  Col,
  Progress,      //进度条
  Badge,          //标记
  Collapse,
  CollapseItem,
  Container,
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
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Row);
Vue.use(Col);
Vue.use(Progress);
Vue.use(Badge);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Container);
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
//组件样式,因涉及到全局样式，无法分离
import './assets/components/content/components/blog/blog-list.css'
import './assets/components/content/components/album/album-list.css'



//组件异步引用
const Blog = () => import('./assets/components/content/components/blog/blog.vue')
const BlogList = () => import('./assets/components/content/components/blog/components/blog-list.vue')
const AddBlog = () => import('./assets/components/content/components/blog/components/add-blog.vue')

const Album = () => import('./assets/components/content/components/album/album.vue')
const AlbumList = () => import('./assets/components/content/components/album/album-list.vue')
const AlbumDetail = () => import('./assets/components/content/components/album/album-detail.vue')

const File = () => import('./assets/components/content/components/file/file.vue')
const Website = () => import('./assets/components/content/components/website/website.vue')
const Recyclebin = () => import('./assets/components/content/components/recyclebin/recyclebin.vue')

const router = new VueRouter({
  routes: [
    { path: '/blog', component: Blog,children:[
      {path:'/blog/list',component:BlogList},
      {path:'/blog/add',component:AddBlog}
    ] },
    // { path: '/journal', component: Journal },
    { path: '/album', component: Album ,children:[
      {path:'/album/list',component:AlbumList},
      {path:'/album/detail/:albumName/:albumId',component:AlbumDetail}
    ] },
    { path: '/file', component: File },
    { path: '/website', component: Website },
    { path: '/recyclebin', component: Recyclebin },
    {path:'*',redirect:'/blog/list'}
  ]
})



Vue.filter('filterTime', function(value) {
  value = value.toString()
  if(value.length >= 10){
    return value.substring(0,10);
  }
  return value;
});



// 全局地址请求
window.blogReqUrl = 'http://www.sharismspace.com/blog_server-0.0.1-SNAPSHOT';   //博客系统服务器地址
window.userReqUrl = 'http://www.sharismspace.com/user_server-0.0.1-SNAPSHOT';   //用户系统服务器地址
window.albumReqUrl = 'http://www.sharismspace.com/album_server-0.0.1-SNAPSHOT';  //相册系统服务器地址
window.fileReqUrl = 'http://118.25.50.160:8080/file_server-0.0.1-SNAPSHOT';   //文件上传系统服务器地址
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
