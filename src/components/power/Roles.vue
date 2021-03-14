/* eslint-disable vue/no-unused-vars */
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="simRolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', il === 0 ? 'bdtop' : '', 'vcentr']"
              v-for="item1 in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcentr']"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      class="pink"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre></pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDiaolog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="simAddForm"
        :rules="simAddFormRules"
        ref="simAddFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="simAddForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="simAddForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDiaologVisible"
      width="50%"
      @close="setRightDiaologClosed"
    >
    <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDiaologVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      simRolelist: [
        {
          id: 30,
          roleName: '主管',
          roleDesc: '技术负责人',
          children: [
            {
              id: 101,
              authName: '商品管理',
              path: null,
              children: [
                {
                  id: 104,
                  authName: '商品列表',
                  path: null,
                  children: [
                    {
                      id: 105,
                      authName: '添加商品',
                      path: null
                    },
                    {
                      id: 106,
                      authName: '添商品',
                      path: null
                    },
                    {
                      id: 107,
                      authName: '商品',
                      path: null
                    }
                  ]
                },
                {
                  id: 104,
                  authName: '商品列表',
                  path: null,
                  children: [
                    {
                      id: 105,
                      authName: '添加商品',
                      path: null
                    }
                  ]
                },
                {
                  id: 104,
                  authName: '商品列表',
                  path: null,
                  children: [
                    {
                      id: 105,
                      authName: '添加商品',
                      path: null
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      // 添加角色的表单数据
      simAddForm: {
        roleName: '',
        roleDesc: ''
      },
      //   控制添加角色对话框的显示与隐藏
      addDialogVisible: false,
      // 添加角色的验证规则对象
      simAddFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '请用户名长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },

      // 控制分配权限对话框的显示与隐藏
      setRightDiaologVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'autName',
        children: 'children'
      },
      // 默认选中的节点ID值数组
      defKeys: [105, 116],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //   获取所有角色的列表
    async getRoleList() {
      const { data: res } = await this.$http.post('roles')

      if (res.meta.status !== 200) {
        return this.$message.errror('获取角色列表失败！')
      }
      this.rolelist = res.data
    },
    // 监听添加角色对话框关闭事件
    addDialogClosed() {
      this.$refs.simAddFormRef.resetFields()
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightid) {
      // 弹窗提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightid}`
      )
      if (res.meta.status !== 200) {
        return this.$message.errror('删除权限失败！')
      }
      // 刷新数据列表,但是会发生页面的完整渲染（不建议使用）会导致展开列再次闭合,整个列表的刷新
      // this.getRoleList()
      role.children = res.data
      this.$message.info('已删除!')
    },

    // 展示分配权限的对话框
    async showSetRightDiaolog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      // const { data: res } = await this.$http.get('rights/tree')
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取权限数据失败！')
      // }

      // // 把获取到的权限数据保存到data中
      // this.rightslist = res.data

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDiaologVisible = true
    },
    // 通过递归的形式获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 判断是否为三级节点
      // 如果当前node节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDiaologClosed() { this.defKeys = [] },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckdeKeys(),
        ...this.$refs.treeRef.getHalfCheckdeKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      // 刷新数据列表
      this.getRoleList()
      this.setRightDiaologVisible = false
    }
  }
}
</script>

<style lang="postcss" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.pink {
  background-color: rgb(255, 237, 240);
  color: rgb(255, 100, 126);
  border: 1px solid rgb(250, 216, 221);
}
.vcentr {
  display: flex;
  align-items: center;
}
</style>
