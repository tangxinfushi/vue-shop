<template>
  <div>

      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区 -->
      <el-card>

          <!-- 搜索与添加区域 -->
          <el-row :gutter="20">
              <el-col :span="7">
                  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                      <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                  </el-input>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" @click="addDialogVisible = true ">添加用户</el-button>
              </el-col>
          </el-row>

          <!-- 用户列表区域 -->
          <el-table :data="tableData" border stripe>
              <!-- 通过接口动态获取数据则改成userlist -->
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="姓名" prop="username"></el-table-column>
              <el-table-column label="邮箱" prop="password"></el-table-column>
              <el-table-column label="电话" prop="modile"></el-table-column>
              <el-table-column label="角色" prop="role"></el-table-column>
              <el-table-column label="状态" >
                  <template slot-scope="scope">
                      <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                  <template slot-scope="scope">
                      <!-- 修改按钮 -->
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                      <!-- 删除按钮 -->
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                      <!-- 分配角色按钮 -->
                      <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                      </el-tooltip>
                      <el-switch v-model="scope.row.mg_state" class="el-button-switch"></el-switch>
                  </template>
              </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>

      </el-card>

      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">

        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改用户的对话框  -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisble" width="50%" @close="editDialogClosed">
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
            <!-- ref属于表单的引用 -->
              <el-form-item label="用户名" >
                  <el-input v-model="editForm.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.username" ></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                  <el-input v-model="editForm.username" ></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisble = false">取 消</el-button>
              <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
      </el-dialog>

      <!-- 分配角色的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDiaologVisible"
        width="50%"
        @close="setRoleDiaologClosed">
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>分配新角色：
              <el-select v-model="selectRoleId" placeholder="请选择">
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDiaologVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

  </div>
</template>

<script>
export default {
  // 动态获取用户列表数据 API接口
  data() {
    // 验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
    // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
    // 验证手机号的正则表达式
      const regMobile = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])d{8}$/
      if (regMobile.test(value)) {
      // 合法手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 1
        // 没有正确接口，此处未实现动态数据
      },

      userlist: [],
      // 所有的用户数量，可以根据这个实现分页
      total: 0,

      // 模拟的数据库的菜单
      tableData: [
        {
          username: '王小虎',
          password: '上海市普陀区金沙江路 1518 弄',
          modile: '110',
          role: '超级管理员',
          mg_state: true // 当前用户状态
        },
        {
          username: '王小威',
          password: '上海市普陀区金沙江路 1518 弄',
          modile: '110',
          role: '超级管理员',
          mg_state: false // 当前用户状态
        },
        {
          username: '王小虎',
          password: '上海市普陀区金沙江路 1518 弄',
          modile: '110',
          role: '超级管理员',
          mg_state: true // 当前用户状态
        },
        {
          username: '王小虎',
          password: '上海市普陀区金沙江路 1518 弄',
          modile: '110',
          role: '超级管理员',
          mg_state: true // 当前用户状态
        }
      ],

      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        usernmae: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        // 可设置为代码段
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '请用户名长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请密码长度在6~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 控制修改用户对话框的显示与隐藏
      editDialogVisble: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 分配角色的对话框的显示与隐藏
      setRoleDiaologVisible: false,
      // 需要被分配角色的用户信息
      userInfo: [],
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectRoleId: ''

    }
  },

  //   生命周期函数中发起当前组件的数据请求
  created() {
    this.getUserList()
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      //   get会返回一个对象，async  await来优化本次异步操作简化操作,然得到一个数据对象，从数据对象身上结构赋值一个data属性然后重命名为res
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
    //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
      // 获取数据
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    // 监听switch 开关状态的改变 （未实现）
    async userStateChanged(userinfo) {
      console.log(1)
      // 调用接口 （未实现）
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      // this.$refs.addFormRef表单的预校验
    },

    // 点击按钮 添加新用户（预校验）
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },

    // 展示编辑用户的对话框
    // async showEditDialog (id) {
    //   const { data: res } = await this.$http.get('user/' + id)
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('查询用户信息失败！')
    //   }
    //   this.editForm = res.data
    //   this.editDialogVisble = true
    // }
    // 模拟对服务器的请求并返回值
    showEditDialog () {
      this.editDialogVisble = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    // 修改用户信息并提交(预校验)
    // editUserInfo () {
    //   this.$refs.editFormRef.validate(async valid => {
    //     if (!valid) return
    //     // 发起修改用户信息的数据请求
    //     const { data: res } = await this.$http.put('users/' + this.sditForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
    //   })
    //   if (res.meta.status !== 200) {
    //     this.$message.error('更新用户信息失败！')
    //   }
    //   this.$message.success('更新用户信息成功！')

    //   // 关闭对话框
    //   this.editDialogVisble = false
    //   // 刷新数据表
    //   this.getUserList()
    //   // 提示修改成功
    //   this.$message.success('更新用户信息成功！')
    // }

    // 根据id删除对应的用户信息
    async removeUserById (id) {
      // 弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 无数据时的展示效果
      this.setRoleDiaologVisible = true

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.post('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }

      this.rolesList = res.data
      this.$message.success('获取角色列表成功！')
      this.setRoleDiaologVisible = true
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择分配的角色！')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })

      if (res.data.status !== 200) { return this.$message.error('更新角色失败！') }
      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setRoleDiaologVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDiaologClosed() {
      this.selectRoleId = ''
      this.userInfo = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
