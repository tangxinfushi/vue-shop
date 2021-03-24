<template>
    <div>
            <!-- 面包屑-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品分类</el-breadcrumb-item>
            </el-breadcrumb>

            <!-- 卡片 -->
            <el-card>
                    <el-row>
                        <el-col>
                            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                        </el-col>
                    </el-row>

                    <!-- 表格 -->
                    <tree-table class="treeTable" :data="simCateList" :columns="columns"
                    :selection-type="false" :expand-type="false"
                    :show-index="true" index-text="#" border>
                        <!-- 是否有效 -->
                        <template slot="isok" slot-scope="scope">
                          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                          <i class="el-icon-error" v-else style="color: lightgreen"></i>
                        </template>
                        <!-- 排序 -->
                        <template slot="order" slot-scope="scope">
                          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                          <el-tag size="mini" type="warning" v-else>三级</el-tag>
                        </template>
                        <!-- 操作 -->
                        <template slot="opt" slot-scope="scope">
                          <el-button  size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                          <el-button size="mini" type="danger" icon="el-icon-delete" @click='removeCatId(scope.row.cat_id)'>删除</el-button>

                        </template>
                    </tree-table>

                    <!-- 分页 -->
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="queryInfo.pagenum"
                      :page-sizes="[1, 2, 3, 4]"
                      :page-size="queryInfo.pagesize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
                    </el-pagination>
            </el-card>

            <!-- 添加 -->
            <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
              <!-- 表单 -->
              <el-form :rules="addCateFormRules" :model="addCateForm" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                  <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                  <!-- options 用来指定数据源 -->
                  <!-- props 用来指定数据对象 -->
                  <el-cascader
                    v-model="selectedKeys"
                    :options="parentCateList"
                    :props="{ expandTrigger: 'hover', cascaderProps }"
                    @change="parentCateChanged" :clearable="true" :change-on-select="true"></el-cascader>
                </el-form-item>
              </el-form>
              <!-- 底部 -->
              <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
              </span>
            </el-dialog>

            <!-- 编辑 -->
            <el-dialog
              title="编辑分类"
              :visible.sync="editDialogVisible"
              width="30%"
              @close="editDialogClosed"
              >
              <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="cat_level">
                  <el-input v-model="editForm.cat_level"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editInfo">确 定</el-button>
              </span>
            </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 1,
        pagenum: 1,
        pagsize: 5
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      simCateList: [
        {
          cat_id: 1,
          cat_name: '大家电',
          cat_pid: 0,
          cat_level: 0,
          cat_deleted: true,
          children: [
            {
              cat_id: 3,
              cat_name: '电视',
              cat_pid: 1,
              cat_level: 1,
              cat_deleted: true,
              children: [
                {
                  cat_id: 6,
                  cat_name: '曲面电视',
                  cat_pid: 3,
                  cat_level: 2,
                  cat_deleted: false
                },
                {
                  cat_id: 7,
                  cat_name: '海信',
                  cat_pid: 3,
                  cat_level: 2,
                  cat_deleted: false
                }
              ]
            }
          ]
        }
      ],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 表示 将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用的模板名称
        template: 'isok'
      }, {
        label: '排序',
        // 表示 将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用的模板名称
        template: 'order'
      }, {
        label: '排序',
        // 表示 将当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用的模板名称
        template: 'opt'
      }],

      // 控制分类对话框的显示与隐藏
      addCateDialogVisible: false,

      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级 分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      editDialogVisible: false,
      editForm: {
        cat_id: '',
        cat_name: '',
        cat_level: ''
      },
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })

      if (res.meta.status !== 200) { return this.$message.error('获取商品分类失败！') }
      this.$message.success('成功！')
      // 把数据列表，赋值给 catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum 的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })

      if (res.meta.status !== 200) { return this.$message.error('获取失败！') }

      this.parentCateList = res.data
      this.$message.success('获取成功！')
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // 如果 selectedKeys 数组中的length 大于0 ，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        // return
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框关闭的事件，重置表单数据
    addCateDialogClosed() {
      // 重置表单第一项
      this.$refs.addCateFormRef.resetFields()
      // 重置表单第二项
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 编辑
    async showEditDialog(catid) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('categories/' + catid)
      if (res.meta.status !== 200) { return this.$message.error('查询角色失败') }
      this.editForm = res.data
      // this.editDialogVisble = true
    },
    // 关闭重置
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id)
        if (res.meta.status !== 200) { return this.$message.error('查询角色失败') }
        this.editDialogVisible = false
        this.getCateList()
        this.$message.success('成功')
      })
    },
    // 删除
    async removeCatId(catid) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => { return err })
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + catid)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getCateList()
    }
  }
}
</script>

<style lang="postcss" scoped>
.treeTable{
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
