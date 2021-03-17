/* eslint-disable no-useless-escape */
// 级联选择框选定后，验证规则判断错误的问题！未解决
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
                <el-row>
                    <el-col :span="8">
                        <el-input placeholder="请输入内容">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                </el-row>

                <!-- 表格 -->
                <!-- border stripe 边框 隔行变色 -->
                <el-table :data="orderlist" border stripe>
                    <el-table-column type="index" ></el-table-column>
                    <el-table-column label="订单编号" prop="order_number"></el-table-column>
                    <el-table-column label="订单价格" prop="order_price"></el-table-column>
                    <el-table-column label="是否付款" prop="pay_status">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                            <el-tag type="danger" v-else>未付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否发货" prop="is_send"></el-table-column>
                    <el-table-column label="下单时间" prop="create_time">
                        <template slot-scope="scope">
                            {{scope.row.create_time | dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                            <el-button type="success" icon="el-icon-share" size="mini" @click="showProgressBox"></el-button>
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
                :total="total">
            </el-pagination>

        </el-card>

        <!-- 修改地址 -->
        <el-dialog
            title="修改地址"
            :visible.sync="addressVisible"
            width="50%" @close="addressDialogClosed"
            >
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 物流进度 -->
        <el-dialog
            title="物流进度"
            :visible.sync="progressVisible"
            width="50%"
            >
            <!-- 时间线 -->
            <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
          </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [
        {
          order_id: 47,
          user_id: 133,
          order_number: 'itcast-59e7502d7993d',
          order_price: 322,
          order_pay: '1',
          is_send: '是',
          trade_no: '',
          order_fapiao_title: '个人',
          order_fapiao_company: '',
          order_fapiao_content: '办公用品',
          //   consignee_addr: 'a:7:{s:6:\"cgn_id\";i:1;s:7:\"user_id\";i:133;s:8:\"cgn_name\";s:9:\"王二柱\";s:11:\"cgn_address\";s:51:\"北京市海淀区苏州街长远天地大厦305室\";s:7:\"cgn_tel\";s:11:\"13566771298\";s:8:\"cgn_code\";s:6:\"306810\";s:11:\"delete_time\";N;}',
          pay_status: '0',
          create_time: 1508331565,
          update_time: 1508331565
        }
      ],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', tigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', tigger: 'blur' }
        ]
      },
      //   cityData: cityData 如果属性名和属性值重名，可以简写，如下
      cityData,
      progressVisible: false,
      progressInfo: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          ti: '2018-05-10 02:03:00',
          fti: '2018-05-10 02:03:00',
          contex: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          locatio: ''
        },
        {
          tim: '2018-05-09 23:05:00',
          ftim: '2018-05-09 23:05:00',
          contex: '快件到达 [北京顺义集散中心]',
          locatio: ''
        },
        {
          tim: '2018-05-09 21:21:00',
          ftim: '2018-05-09 21:21:00',
          contex: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          locatio: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
    }
  },
  created() {
    this.getOrderLisit()
  },
  methods: {
    async getOrderLisit() {
      const { data: res } = await this.$http.get('orders', {
        params:
          this.queryInfo
      })

      if (res.meta.status !== 200) { return this.$message.error('失败') }

      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 分页页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getorderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 物流
    async showProgressBox() {
      this.progressVisible = true
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
      }
      this.$message.success('成功')
      this.progressInfo = res.data
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
// @import '../../plugins/timeline/timeline-item.css';
// @import '../../plugins/timeline-item/timeline-item.css';
.el-cascader{
    widows: 100%;
}
</style>
