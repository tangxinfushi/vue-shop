/* eslint-disable indent */
<template>
    <div>

        <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图 -->
      <el-card>
            <el-table :data="simRightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                      <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                      <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: [],
      // 模拟的
      simRightsList: [
        {
          id: 101,
          authName: '商品管理',
          level: '0',
          pid: 0,
          path: 'goods'
        },
        {
          id: 102,
          authName: '订单管理',
          level: '1',
          pid: 0,
          path: 'orders'
        },
        {
          id: 103,
          authName: '订单管理',
          level: '2',
          pid: 0,
          path: 'orders'
        },
        {
          id: 104,
          authName: '订单管理',
          level: '0',
          pid: 0,
          path: 'users'
        }
      ]
    }
  },

  created() {
    // 获取所有的权限
    this.getRightsList()
  },

  methods: {
    //   获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/:type')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rightsList = res.data
    }
  }

}
</script>

<style lang="postcss" scoped>

</style>
