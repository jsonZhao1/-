<script>
import { parseTime, DExcel } from '@/utils/yyh'
import * as XLSX from 'xlsx'

const fs = window.require('fs')
const path = window.require('path')
export default {
  name: 'videoDemo',
  data() {
    return {
      parseTime,
      queryParams: { theoryName: '', pageNum: 1, pageSize: 20, className: '' },
      idenClassOptions: [],
      loading: false,
      list: [],
      total: 0,
      open: false,
      actionUrl: '',
      disableFlag: false
    }
  },
  computed: {},
  created() {
    this.queryClass()
    this.getList()
  },
  methods: {
    async getList() {
      await this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
    },
    async queryClass() {
      this.db.markClass.reverse().toArray().then(res => {
        this.idenClassOptions = res
        if (this.idenClassOptions.length > 0) {
          this.handleNodeClick(this.idenClassOptions[0].name)
        }
      })
    },
    seqFormat: function(row, column, cellValue, index) {
      return (this.queryParams.pageSize * (this.queryParams.pageNum - 1)) + index + 1
    },
    queryAndPaginate(fieldValue, pageNum, pageSize) {
      let query = this.db.scoreData.toCollection().filter(record => record.className.includes(this.queryParams.className))
      // query = query.sort((a, b) => b.score - a.score)
      if (fieldValue) {
        query = query.filter(record => record.name.includes(fieldValue))
      }
      query.count().then(res => {
        this.total = res

        query.toArray().then(records => {
          const sortedRecords = records.sort((a, b) => b.score - a.score)
          const startIndex = (pageNum - 1) * pageSize
          const endIndex = startIndex + pageSize
          const paginatedRecords = sortedRecords.slice(startIndex, endIndex)
          this.list = paginatedRecords
          if (this.list.length === 0) {
            const startIndex = 0 * pageSize
            const endIndex = startIndex + pageSize
            const paginatedRecords = sortedRecords.slice(startIndex, endIndex)
            this.list = paginatedRecords
          }
        })
      })
    },
    handleQuery() {
      this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
    },
    handleNodeClick(name) {
      this.queryParams.className = name
      this.handleQuery()
    },
    handleDelete(row) {
      // 执行删除操作
      this.db.scoreData.delete(row.id).then(res => {
        this.showMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
      }).catch(function(error) {
        console.error('Error deleting record: ' + error)
      })
    },
    handleExport() {
      const data = ['排名', '姓名', '类型', '分数','计入时间']

      let query = this.db.scoreData.toCollection().filter(record => record.className.includes(this.queryParams.className))
      query.toArray().then(records => {
        const sortedRecords = records.sort((a, b) => b.score - a.score)
        const result = [data]
        sortedRecords.forEach((item, index) => {
          const row = [
            index + 1,
            item.name,
            item.className,
            item.score,
            item.starTimer,
          ]
          result.push(row)
        })
        const workbook = XLSX.utils.book_new()
        const sheet = XLSX.utils.aoa_to_sheet(result)
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1')
        XLSX.writeFile(workbook, '成绩.xlsx')
      })
    }
  }
}
</script>

<template>
  <div style="height:calc(100vh - 80px) ">
    <el-row :gutter="24" style="height: 100%">
      <!--标识分类数据-->
      <!--类型数据-->
      <el-col :span="4" :xs="24" style="height: 100%">
        <div class="head-container">
          <span style="font-size: 22px;  margin-left: 20px;"><font color="#645f5f "><strong>标识分类</strong></font><hr/></span>
        </div>
        <div class="head-container" style=" height: calc(100% - 100px);overflow: scroll;">
          <ul>
            <template v-for="(item, index) in idenClassOptions">
              <li @click="handleNodeClick(item.name)" :class="queryParams.className==item.name?'li-active':''"
                  :data="item.id"
              >
                <span>{{ item.name }}</span>
              </li>
            </template>
          </ul>
        </div>
      </el-col>
      <!--标识数据-->
      <el-col :span="20" :xs="24">
        <!--        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">-->
        <!--          <el-form-item label="标识名称" prop="identifierName">-->
        <!--            <el-input-->
        <!--              v-model="queryParams.theoryName"-->
        <!--              placeholder="请输入标识名称"-->
        <!--              clearable-->
        <!--              style="width: 240px"-->
        <!--              @keyup.enter="handleQuery"-->
        <!--            />-->
        <!--          </el-form-item>-->
        <!--          <el-form-item>-->
        <!--            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
        <!--          </el-form-item>-->
        <!--        </el-form>-->

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
            >打印成绩
            </el-button>
          </el-col>
        </el-row>

        <el-table :data="list" height="70vh">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="seq" label="排名" :formatter="seqFormat" width="100"></el-table-column>
          <el-table-column label="姓名" align="center" key="name" prop="name" :show-overflow-tooltip="true"/>
          <!-- <el-table-column label="标识详情" align="center" key="identifierDesc" prop="identifierDesc" v-if="columns[2].visible" :show-overflow-tooltip="true" /> -->
          <el-table-column label="类型" align="center" key="className" prop="className"
                           :show-overflow-tooltip="true"
          />
          <el-table-column label="成绩" align="center" key="score" prop="score" :show-overflow-tooltip="true"/>
          <el-table-column label="计入时间" align="center" key="starTimer" prop="starTimer" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.starTimer, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page-sizes="[20, 50, 100, 200]"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.li-active {
  background-color: #E8F1F6;
  font-weight: bold;
}

li {
  line-height: 40px;
  background: white;
  font-weight: normal;
  cursor: pointer;
  padding-left: 10px;
}

</style>
