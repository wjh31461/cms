<template>
  <div class="app">
    <div class="header">
      <div class="title el-icon-info">&nbsp&nbsp&nbsp新闻发布信息管理</div>
      <div class="info">
        <img :src="user.userface">
        <div class="user">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item command='logout'>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left_nav">
        <!-- <ul>
          <li :class='{current:currentRoute=="/"}'>
            <i class="fa fa-star"></i>
            <router-link to='/'>欢迎页面</router-link>
            <i class="fa fa-angle-right"></i>
          </li>
          <li :class='{current:currentRoute=="/category"}'>
            <i class="fa fa-tv"></i>
            <router-link to='/category'>栏目管理</router-link>
            <i class="fa fa-angle-right"></i>
          </li>
          <li :class='{current:currentRoute=="/article"}'>
            <i class="fa fa-book"></i>
            <router-link to='/article'>文章管理</router-link>
            <a href="javascript:void(0)" @click='jump("/article")'>文章管理</a>
            <i class="fa fa-angle-right"></i>
          </li>
          <li :class='{current:currentRoute=="/user"}'>
            <i class="fa fa-user"></i>
            <router-link to='/user'>用户管理</router-link>
            <i class="fa fa-angle-right"></i>
          </li>
          <li :class='{current:currentRoute=="/exam"}'>
            <i class="fa fa-pencil"></i>
            <router-link to='/exam'>考试管理</router-link>
            <i class="fa fa-angle-right"></i>
          </li>
          <li :class='{current:currentRoute=="/customer"}'>
            <router-link to='/customer/1'>顾客管理1</router-link>
            <router-link to='/customer/2'>顾客管理2</router-link>
          </li>
        </ul> -->
        
        <el-col :span="12" style='width: 200px' >
          <el-menu
            router
            :default-active="currentRoute"
            class="el-menu-vertical-demo">
            <el-menu-item index="/">
              <i class="el-icon-news"></i>
              <span slot="title">欢迎页面</span>
            </el-menu-item>
            <el-menu-item index="/category">
              <i class="el-icon-menu"></i>
              <span slot="title">栏目管理</span>
            </el-menu-item>
            <el-menu-item index="/article">
              <i class="el-icon-document"></i>
              <span slot="title">文章管理</span>
            </el-menu-item>
            <el-menu-item index="/user">
              <i class="el-icon-view"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <!-- <el-menu-item index="/exam">
              <i class="el-icon-setting"></i>
              <span slot="title">考试管理</span>
            </el-menu-item> -->
          </el-menu>
        </el-col>
      </div>

      <div class="right_content">
        <div class="wrapper">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from '@/http/axios'
  export default {
    methods:{
      jump(url){
        this.$router.push(url)
      },
      handleCommand(command){
        if(command=='logout'){
          axios.get('/logout')
          .then(()=>{
            localStorage.removeItem('user');
          })
        }
      }
    },
    created(){
      // 处理路由默认显示
      this.currentRoute=this.$route.path;
      

      // 处理用户登录
      let user=JSON.parse(localStorage.getItem('user'));
      if(user){
        this.user=user;
      }else{
        window.vm.currentComponent='Login'
      }
    },
    mounted(){
      this.$router.push('/');
    },
    watch:{
      '$route':function(to,from){
        this.currentRoute=to.path;
      }
    },
    data(){
      return {
        msg:'App.vue',
        currentRoute:'/',
        user:{},
      }
    }
  }
</script>

<style>
  html {
    font:normal normal 15px '微软雅黑','Microsoft YaHei';
    color: #666;
  }
  body,ul,ol,dl,p,h1,h2,h3 {
    margin: 0;
    padding: 0;
  }
  ul,ol {
    list-style: none;
  }
  a{
    color: #666;
    text-decoration: none;
  }
  div {
    box-sizing: border-box;
  }
  .header {
    position: absolute;
    width: 100%;
    height: 60px;
    top: 0;
    background-color: #2b0d49;
    padding: 0 2em;
  }
  .header .title {
    color: #ffffff;
    line-height: 60px;
    font-size: 24px;
  }
  .header .info {
    float: right;
    margin-top: 6px;
    color: #ffffff;
    position: relative;
  }
  .header .info > img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 100px;
  }
  .header .info > .user {
    position: absolute;
    right: 0;
    top: 13px;
  }
  .header .info > .user .el-dropdown {
    color: white;
  }
  .content {
    position: absolute;
    width: 100%;
    top: 60px;
    bottom: 0;
  }
  .content > .left_nav {
    width: 200px;
    height: 100%;
    float: left;
    background: white;
  }
  .content > .right_content {
    box-sizing: border-box;
    margin-left: 200px;
    height: 100%;
    background-color: #f0f0f0;
    padding: 1em;
  }
  .content > .right_content > .wrapper {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: #ffffff;
    padding: .5em;
    overflow-y: auto;
  }
  

  /* .left_nav ul {
  
  }
  .left_nav ul li {
    line-height: 38px;
    text-align: center;
    border-bottom: 1px solid #ededed;
    position: relative;
  }
  .left_nav ul li.current {
    background-color: #f0f0f0;
  }
  .left_nav ul li > i:first-child {
    font-size: 14px;
    position: absolute;
    left: 45px;
    top: 12px;
    margin: 0;
  }
  .left_nav ul li > i:last-child {
    font-size: 14px;
    position: absolute;
    right: 20px;
    top: 12px;
    margin: 0;
  } */
</style>