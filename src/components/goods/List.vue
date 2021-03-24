<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- tab表格 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="110px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        <!-- 调用过滤器 -->
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.goods_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 3, 4]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" background>
            </el-pagination>
        </el-card>

        <!-- 编辑 -->
        <el-dialog
          title="编辑商品"
          :visible.sync="editDialogVisible"
          width="30%"
          @close="editDialogClosed"
          >
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="editForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品介绍" prop="goods_introduce">
              <el-input v-model="editForm.goods_introduce"></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="pic">
              <el-input v-model="editForm.pic.pic"></el-input>
            </el-form-item>
            <el-form-item label="商品参数" prop="attrs">
              <el-input v-model="editForm.attrs"></el-input>
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
      //   查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //   商品列表
      goodslist: [
        {
          goods_id: 144,
          goods_name: 'asfdsd',
          goods_price: 1,
          goods_number: 1,
          goods_weight: 1,
          goods_state: null,
          add_time: 1512954923,
          upd_time: 1512954923,
          hot_mumber: 0,
          is_promote: false
        }
      ],
      //   总数据条数
      total: 0,
      // 编辑
      editForm: {
        goods_id: '',
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pic: {
          pic: ''
        },
        attrs: []
      },
      editDialogVisible: false,
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        goods_introduce: [
          { message: '请输入角色名称', trigger: 'blur' }
        ],
        pic: [
          { message: '请输入角色名称', trigger: 'blur' }
        ],
        attrs: [
          { message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //   获取数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
      }

      this.$message.success('成功')
      this.goodslist = res.data.goods
      this.total = res.data.total
    },

    // 关于分页的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 编辑
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 201) { return this.$message.error('获取商品信息失败') }
      this.editForm = res.data
      this.$message.success('成功')
      // this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editDialogRef.resetFields()
    },
    editInfo() {
      this.$refs.editDialogRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id, {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_number: this.editForm.goods_number,
          goods_weight: this.editForm.goods_weight,
          goods_introduce: this.editForm.goods_introduce,
          pic: this.editForm.pic,
          attrs: this.editForm.attrs
        })

        if (res.meta.status !== 201) { return this.$message.error('失败！') }
        this.editDialogVisible = false
        this.getGoodsList()
        this.$message.success('成功')
      })
    },
    // 删除
    async removeById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('删除失败') }
      this.$message.success('删除成功！')
      this.getGoodslist()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
