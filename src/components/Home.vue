<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">||||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 :default-active="activePath"点击高亮-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    //     return{
    //         // 左侧菜单数据
    //         menulist:[],
    //    iconsObj:{
    //      '125': 'iconfont icon-user',
    //      '103': 'iconfont icon-tijikongjian',
    //      '101': 'iconfont icon-shangpin',
    //      '102': 'iconfont icon-danju',
    //      '145': 'iconfont icon-baobiao'
    //    },
    // }
    return {
      // 模拟左侧菜单数据
      menulist: [
        {
          id: 125,
          authName: '用户管理',
          path: null,
          children: [
            {
              id: 101,
              authName: '用户列表',
              path: 'users',
              children: []
            }
          ]
        },
        {
          id: 103,
          authName: '权限管理',
          path: null,
          children: [
            {
              id: 104,
              authName: '角色列表',
              path: 'roles',
              children: []
            },
            {
              id: 134,
              authName: '权限列表',
              path: 'rights',
              children: []
            }
          ]
        },
        {
          id: 101,
          authName: '商品管理',
          path: null,
          children: [
            {
              id: 134,
              authName: '商品列表',
              path: 'goods',
              children: []
            },
            {
              id: 135,
              authName: '分类参数',
              path: 'params',
              children: []
            },
            {
              id: 136,
              authName: '商品分类',
              path: 'categories',
              children: []
            }
          ]
        },
        {
          id: 102,
          authName: '订单管理',
          path: null,
          children: [
            {
              id: 104,
              authName: '订单列表',
              path: 'orders',
              children: []
            }
          ]
        },
        {
          id: 145,
          authName: '数据统计',
          path: null,
          children: [
            {
              id: 104,
              authName: '数据报表',
              path: 'reports',
              children: []
            }
          ]
        }
      ],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getmenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    // async getmenuList() {
    //     const{data:res} = await this.$http.get('menus')
    //     if(res.meta.status !== 200)return this.$message.error(res.meta.msg)
    //     this.menulist = res.data
    //     console.log(res);
    // }
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      // 保存在sessionStorage中，定义一个新的键activePath，第二个为它的值
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex; //弹性盒
  justify-content: space-between; //项目位于行之间留有空白的容器内
  padding-left: 0;
  align-items: center; //垂直居中
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center; //文本居中
  letter-spacing: 0.2em; // 竖线之间的间距
  cursor: pointer; //光标的形态（小手）
}
</style>
