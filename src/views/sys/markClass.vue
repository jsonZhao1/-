<script>
import { parseTime } from '@/utils/yyh'

export default {
  name: 'videoDemo',
  data() {
    return {
      parseTime,
      queryParams: { theoryName: '', pageNum: 1, pageSize: 10 },
      multiple: true,
      loading: false,
      list: [],
      total: 0,
      title: '新增',
      form: {
        imgUrl: '',
        name: '',
        enableFlag: 1,
        status: '1'
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        imgUrl: [{ required: true, message: '封面图片不能为空', trigger: 'blur' }]
      },
      open: false,
      actionUrl: '',
      imgFileList: [],
      imgAccept: '.png,.jpg,.jpeg',
      dialogVisible: false,
      statusList: [
        { value: '1', label: '认知考试' },
        { value: '2', label: '场景考试' }
      ]
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
      // let offset = (this.queryParams.pageNum - 1) * this.queryParams.pageSize
      // // 执行分页查询
      // this.db.videoData.count().then(total => {
      //   console.log(total)
      //   this.total = total
      //   this.db.videoData.videoData.where('name').equals(this.queryParams.theoryName).orderBy('sort').offset(offset).limit(this.queryParams.pageSize).toArray().then(data => {
      //     console.log(data)
      //     this.list = data
      //   }).catch(function(error) {
      //     console.error('Error querying data: ' + error)
      //   })
      // }).catch(function(error) {
      //   console.error('Error querying data: ' + error)
      // })
    },
    seqFormat: function(row, column, cellValue, index) {
      return (this.queryParams.pageSize * (this.queryParams.pageNum - 1)) + index + 1
    },
    queryAndPaginate(fieldValue, pageNum, pageSize) {
      let query = this.db.markClass.toCollection()
      if (fieldValue) {
        query = query.filter(record => record.name.includes(fieldValue))
      }
      query.count().then(res => {
        query.reverse().toArray().then(records => {
          const sortedRecords = records
          const startIndex = (pageNum - 1) * pageSize
          const endIndex = startIndex + pageSize
          const paginatedRecords = sortedRecords.slice(startIndex, endIndex)
          this.total = res
          this.list = paginatedRecords
          if (this.list.length === 0) {
            const startIndex = 0 * pageSize
            const endIndex = startIndex + pageSize
            const paginatedRecords = sortedRecords.slice(startIndex, endIndex)
            console.log(paginatedRecords)
            this.list = paginatedRecords
          }
        })
        // query.offset((pageNum - 1) * pageSize).limit(pageSize).sortBy('sort').then(records => {
        //   this.total = res
        //   console.log(records)
        //   this.list = records
        // })
      })
    },
    handleQuery() {
      this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
    },
    reset() {
      this.form = {
        name: undefined,
        imgUrl: undefined,
        starTimer: undefined,
        enableFlag: 1,
        status: '1'
      }
      this.imgFileList = []
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '新增'
    },
    handleDelete(row) {
      // 执行删除操作
      this.db.markClass.delete(row.id).then(res => {
        this.showMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        this.getList()
      }).catch(function(error) {
        console.error('Error deleting record: ' + error)
      })
    },
    DownloadHandleDelete() {
      this.db.markClass.bulkDelete(this.ids).then(res => {
        this.showMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        this.getList()
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleUpdate(row) {
      this.reset()
      this.form = JSON.parse(JSON.stringify(row))
      this.open = true
      this.title = '修改'
    },
    handleUpdateFlag(row) {
      row.enableFlag = row.enableFlag == 1 ? 0 : 1
      this.db.markClass.update(row.id, row).then(res => {
        this.showMessage({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
        this.open = false
        this.getList()
      }).catch(function(error) {
        console.error('Error updating record: ' + error)
      })
    },
    submitForm() {
      this.$refs['identifierClassRef'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            this.db.markClass.update(this.form.id, this.form).then(res => {
              this.showMessage({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.open = false
              this.getList()
            }).catch(function(error) {
              console.error('Error updating record: ' + error)
            })
          } else {
            this.form.starTimer = parseTime(new Date(), '{y}-{m}-{d}')
            this.db.markClass.add(this.form).then(() => {
              this.showMessage({
                message: '新增成功',
                type: 'success',
                duration: 1000
              })
              this.open = false
              this.getList()
            }).catch(function(error) {
              console.error('Error adding data: ' + error)
            })
          }
        }
      })
    },
    uploadImgSuccess(response) {
      console.log(response)
      if (this.loading) {
        this.loading.close()
      }
      if (response.code == 200) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })

        // this.cancelCourseForm()
      } else {
        this.$message.error('上传失败')
      }
    },
    uploadImgError() {
      if (this.loading) {
        this.loading.close()
      }
      this.$message.error('上传失败')
    },
    imgfileChange(file, fileList) {
      console.log(file)
      this.imgFileList = fileList.slice(-1)
      let path = file.raw.path
      console.log(path)
      this.form.imgUrl = path
    },
    cancel() {
      this.open = false
      this.reset()
    }
  }
}
</script>

<template>
  <div>
    <el-row :gutter="24">
      <!--标识分类数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="100px">
          <el-form-item label="标识分类名称" prop="theoryName">
            <el-input
              v-model="queryParams.theoryName"
              placeholder="请输入标识分类名称"
              clearable
              style="width: 240px"
              size="medium"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" icon="Search" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              size="small"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              size="small"
              :disabled="multiple"
              @click="DownloadHandleDelete"
            >删除
            </el-button>
          </el-col>
          <!--          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>-->
        </el-row>

        <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" empty-text="暂无数据"
                  height="70vh"
        >
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="seq" label="序号" :formatter="seqFormat" width="50"></el-table-column>
          <el-table-column label="标识分类名称" align="center" key="name" prop="name"
                           :show-overflow-tooltip="true"
          />
          <el-table-column label="标识分类图片" align="center" key="imgUrl" prop="imgUrl" width="180">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" alt="" style="width: 100px;height: 100px">
              <!--              <ImagePreview-->
              <!--                :width="100" :height="100"-->
              <!--                :src="scope.row.imgUrl"-->
              <!--                :preview-src-list="[scope.row.imgUrl]"/>-->
            </template>
          </el-table-column>
          <el-table-column label="是否启用" align="center" key="enableFlag" prop="enableFlag" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.enableFlag == 1 ? '已启用' : '未启用' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" key="starTimer" prop="starTimer" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.starTimer, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button link type="primary" size="small" icon="Edit" @click="handleUpdateFlag(scope.row)">
                {{ scope.row.enableFlag == 1 ? '取消启用' : '启用' }}
              </el-button>
              <el-button link type="primary" size="small" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="primary" size="small" icon="Delete" @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改标识分类配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form :model="form" :rules="rules" ref="identifierClassRef" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" prop="name" width="200px">
              <el-input v-model="form.name" placeholder="请输入名称" size="small" maxlength="15" show-word-limit/>
            </el-form-item>
            <el-form-item label="封面图片" prop="imgUrl">
              <el-input style="width: 300px; display: inline-block;" :disabled="true"
                        v-model="form.imgUrl" size="small" placeholder="请选择封面图片"
              ></el-input>
              <el-upload
                style="display: inline-block;"
                :action="actionUrl"
                ref="courseFormImgUpload"
                :file-list="imgFileList"
                :accept="imgAccept"
                :auto-upload="false"
                :show-file-list="false"
                :on-success="uploadImgSuccess"
                :on-error="uploadImgError"
                :on-change="imgfileChange"
                :limit="1"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="考试类型">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusList"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
