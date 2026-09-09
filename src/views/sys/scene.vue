<script>
import { parseTime, DExcel } from '@/utils/yyh'
import * as XLSX from 'xlsx'

const fs = window.require('fs')
const path = window.require('path')
import JSZip from 'jszip'

export default {
  name: 'videoDemo',
  data() {
    return {
      parseTime,
      queryParams: { theoryName: '', pageNum: 1, pageSize: 10, className: '' },
      idenClassOptions: [],
      multiple: true,
      loading: false,
      list: [],
      total: 0,
      title: '新增',
      form: {
        className: '',
        classList: [],
        sceneUrl: ''
      },
      rules: {
        classList: [{ required: true, message: '答案标识不能为空', trigger: 'change' }],
        sceneUrl: [{ required: true, message: '标识图片不能为空', trigger: 'blur' }]
      },
      open: false,
      actionUrl: '',
      imgFileList: [],
      imgAccept: '.png,.jpg,.jpeg',
      dialogVisible: false,
      disableFlag: false,
      dialogFilVisible: false,
      accept: '',
      fileList: [],
      importDataList: [],
      listHander: {
        className: '标识类型名称 例：电力类',
        name: '标识名称 例：必须佩戴安全帽',
        identifierDesc: '标识介绍 例：测试介绍内容',
        identifierUrl: '标识图片(直接贴图(请用浮动图片)，图片不能超出单元格)',
        correctTrue: '正确选项(请填写A/B/C/D中一项) 例：C',
        optionSelA: '选项A,例:A.禁止入内',
        optionSelB: '选项B,例:B.禁止入内',
        optionSelC: '选项C,例:C.禁止入内',
        optionSelD: '选项D,例:D.禁止入内'
      },
      listHandler: {
        '标识类型名称 例：电力类': 'className',
        '标识名称 例：必须佩戴安全帽': 'name',
        '标识介绍 例：测试介绍内容': 'identifierDesc',
        '标识图片(直接贴图(请用浮动图片)，图片不能超出单元格)': 'identifierUrl',
        '正确选项(请填写A/B/C/D中一项) 例：C': 'correctTrue',
        '选项A,例:A.禁止入内': 'optionSelA',
        '选项B,例:B.禁止入内': 'optionSelB',
        '选项C,例:C.禁止入内': 'optionSelC',
        '选项D,例:D.禁止入内': 'optionSelD'
      },
      imageList: [],
      correctTrueOption: [],
      tableColumnLabel: []
    }
  },
  computed: {},
  created() {
    this.queryClass()
    // this.getList()
  },
  methods: {
    async getList() {
      await this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
    },
    async queryClass() {
      this.db.markClass.reverse().toArray().then(res => {
        console.log(res)
        this.idenClassOptions = res
        console.log(this.idenClassOptions)
        if (this.idenClassOptions.length > 0) {
          this.handleNodeClick(this.idenClassOptions[0].name)
        }
      })
    },
    seqFormat: function(row, column, cellValue, index) {
      return (this.queryParams.pageSize * (this.queryParams.pageNum - 1)) + index + 1
    },
    queryAndPaginate(fieldValue, pageNum, pageSize) {
      console.log(this.queryParams, fieldValue)
      let query = this.db.sceneData.toCollection().filter(record => record.className.includes(this.queryParams.className))
      if (fieldValue) {
        console.log(fieldValue)
        query = query.filter(record => record.name.includes(fieldValue))
      }
      query.count().then(res => {
        this.total = res
        const startIndex = (pageNum - 1) * pageSize
        query.offset(startIndex).limit(pageSize).toArray().then(records => {
          // const sortedRecords = records
          // const startIndex = (pageNum - 1) * pageSize
          // const endIndex = startIndex + pageSize
          // const paginatedRecords = sortedRecords.slice(startIndex, endIndex)
          // this.total = res
          this.list = records
          console.log(records)
          if (this.list.length === 0 && pageNum > 1) {
            query.offset(0).limit(pageSize).toArray().then(firstPageRecords => {
              this.list = firstPageRecords
              console.log(this.list)
            })
            // const startIndex = 0 * pageSize
            // const endIndex = startIndex + pageSize
            // const paginatedRecords = sortedRecords.slice(startIndex, endIndex)
            // console.log(paginatedRecords)
            // this.list = paginatedRecords
          }
        })
        console.log(this.list, '2')
      })
    },
    handleQuery() {
      this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
    },
    reset() {
      this.form = {
        classList: [],
        sceneUrl: undefined,
        starTimer: undefined
      }
      this.imgFileList = []
    },
    handleAdd() {
      this.reset()
      this.title = '新增'
      let query = this.db.markStudy.toCollection().filter(record => record.className.includes(this.queryParams.className))
      query.toArray().then(records => {
        this.correctTrueOption = records
        console.log(this.correctTrueOption)
        this.open = true
      })
      // this.getClass()
    },
    getClass() {
      // correctTrueOption

    },
    handleDelete(row) {
      // 执行删除操作
      this.db.sceneData.delete(row.id).then(res => {
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
    DownloadHandleDelete() {
      this.db.sceneData.bulkDelete(this.ids).then(res => {
        this.showMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleUpdate(row) {
      this.reset()
      let query = this.db.markStudy.toCollection().filter(record => record.className.includes(this.queryParams.className))
      query.toArray().then(records => {
        this.correctTrueOption = records
        console.log(this.correctTrueOption)
        this.form = JSON.parse(JSON.stringify(row))
        console.log(this.form)
        this.title = '修改'
        this.open = true
      })
    },
    handleInfo(row) {
      this.reset()
      console.log(this.form)
      let query = this.db.markStudy.toCollection().filter(record => record.className.includes(this.queryParams.className))
      query.toArray().then(records => {
        this.correctTrueOption = records
        this.form = JSON.parse(JSON.stringify(row))
        console.log(this.form)
        this.disableFlag = true
        this.title = '查看'
      })
    },
    handleUpdateFlag(row) {
      row.enableFlag = row.enableFlag == 1 ? 0 : 1
      this.db.sceneData.update(row.id, row).then(res => {
        this.showMessage({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
        this.open = false
        this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
      }).catch(function(error) {
        console.error('Error updating record: ' + error)
      })
    },
    submitForm() {
      console.log(this.$refs['identifierClassRef'])
      this.$refs['identifierClassRef'].validate(valid => {
        if (valid) {
          this.form.className = this.queryParams.className
          if (this.form.id != undefined) {
            this.db.sceneData.update(this.form.id, this.form).then(res => {
              this.showMessage({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.open = false
              this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
            }).catch(function(error) {
              console.error('Error updating record: ' + error)
            })
          } else {
            this.form.starTimer = parseTime(new Date(), '{y}-{m}-{d}')
            this.db.sceneData.add(this.form).then(() => {
              this.showMessage({
                message: '新增成功',
                type: 'success',
                duration: 1000
              })
              this.open = false
              this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
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
      this.form.sceneUrl = path
    },
    cancel() {
      this.reset()
      this.open = false
    },
    handleNodeClick(name) {
      this.queryParams.className = name
      this.handleQuery()
    },
    handleImport() {
      this.dialogFilVisible = true
    },
    importTemplate() {
      DExcel([], this.listHander, '认知考试导入')
    },
    readFile(file) {
      return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = ev => {
          resolve(ev.target.result)
        }
      })
    },
    async fileChange(file, fileList) {
      // // 解析图片
      this.loading = this.$loading({
        lock: true,
        text: '导入数据解析中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.imageList = await this.getExcelImage(file.raw)
      if (this.imageList.length % 2 !== 0) {
        this.loading.close()
        this.$message.error('请检查表格图片是否正确添加')
        this.fileList = []
        return
      }
      // // 解析数据
      this.getExcelData(file.raw)
    },
    async getExcelData(file) {
      const fileContent = await this.readFile(file)
      let workbook = XLSX.read(fileContent, { type: 'binary' }) // 将data转换成excel工作表数据
      const worksheet = workbook.Sheets[workbook.SheetNames[0]] // 获取第一个工作表
      console.log('第一张工作表', worksheet)
      const sheetlist = XLSX.utils.sheet_to_json(worksheet)
      this.formatDate(sheetlist)
    },
    formatDate(sheetlist) {
      let filesList = []
      // let headerList = [
      //   '标识类型名称 例：电力类',
      //   '标识名称 例：必须佩戴安全帽',
      //   '标识介绍 例：测试介绍内容',
      //   '标识图片(直接贴图(请用浮动图片)，图片不能超出单元格)',
      //   '展示图片(直接贴图(请用浮动图片)，图片不能超出单元格)'
      // ]
      try {
        if (sheetlist.length < 1) return
        for (let i = 0; i < this.imageList.length; i++) {
          // 直接赋值，无需预先设置为空字符串
          sheetlist[i]['标识图片(直接贴图(请用浮动图片)，图片不能超出单元格)'] = `data:image/png;base64,${this.imageList[i]}`
        }
        this.importDataList = sheetlist.map(obj => {
          const mappedObj = {}
          for (const prop in obj) {
            if (this.listHandler[prop]) {
              mappedObj[this.listHandler[prop]] = obj[prop]
              mappedObj.starTimer = parseTime(new Date(), '{y}-{m}-{d}')
            }
          }
          return mappedObj
        })
        this.$message.success('数据解析成功')
        this.loading.close()
      } catch (error) {
        this.loading.close()
        this.$message.error('数据解析失败')
        console.log(error)
        return
      }
    },
    async getExcelImage(file) {
      let imageList = [] // 用来存放图片
      const zip = new JSZip() // 创建jszip实例
      try {
        let zipLoadResult = await zip.loadAsync(file) // 将xlsx文件转zip文件
        const sortedKeys = Object.keys(zipLoadResult['files']).sort((a, b) => {
          // 提取文件名中的数字部分
          const numA = parseInt(a.match(/\d+/), 10)
          const numB = parseInt(b.match(/\d+/), 10)
          // 比较数字以确定排序顺序
          return numA - numB
        })

// 遍历排序后的键
        for (const key of sortedKeys) {
          // 现在可以按自然排序顺序处理每个键
          if (zipLoadResult['files'][key].name.indexOf('media/image') != -1 && !zipLoadResult['files'][key].dir) {
            await zip
              .file(zipLoadResult['files'][key].name)
              .async('base64')
              .then((res) => {
                imageList.push(res)
              })
          }
        }
      } catch (error) {
        console.log(error)
      }
      return imageList
    },
    submitFileForm() {
      this.db.sceneData.bulkPut(this.importDataList).then(() => {
        this.showMessage({
          message: '新增成功',
          type: 'success',
          duration: 1000
        })
        this.cancelFile()
        this.queryAndPaginate(this.queryParams.theoryName, this.queryParams.pageNum, this.queryParams.pageSize)
      }).catch(function(error) {
        console.error('Error adding data: ' + error)
      })
    },
    cancelFile() {
      this.dialogFilVisible = false
      this.imageList = []
      this.fileList = []
      this.importDataList = []
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
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="标识名称" prop="identifierName">
            <el-input
              v-model="queryParams.theoryName"
              placeholder="请输入标识名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="DownloadHandleDelete"
            >删除
            </el-button>
          </el-col>
          <!--          <el-col :span="1.5">-->
          <!--            <el-button-->
          <!--              type="info"-->
          <!--              plain-->
          <!--              @click="handleImport"-->
          <!--            >导入-->
          <!--            </el-button>-->
          <!--          </el-col>-->
          <!--            <el-col :span="1.5">-->
          <!--              <el-button-->
          <!--                type="info"-->
          <!--                plain-->
          <!--                icon="Upload"-->
          <!--                @click="handleImport"-->
          <!--              >导入</el-button>-->
          <!--            </el-col>-->
          <!--            <el-col :span="1.5">-->
          <!--              <el-button-->
          <!--                type="warning"-->
          <!--                plain-->
          <!--                icon="Download"-->
          <!--                @click="handleExport"-->
          <!--              >导出</el-button>-->
          <!--            </el-col>-->
        </el-row>

        <el-table :data="list" @selection-change="handleSelectionChange" height="70vh" width="100%">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="场景图片" align="center" key="starTimer" prop="starTimer">
            <template #default="scope">
              <img :src="scope.row.sceneUrl" alt="" style="width: 100px;height: 100px">
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" key="starTimer" prop="starTimer" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.starTimer, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button link type="primary" icon="View" @click="handleInfo(scope.row)">查看</el-button>
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
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
        <!--        <div style="display: flex;align-items: center;justify-content: space-between;">-->
        <!--          <el-form-item label="标识分类" prop="className">-->
        <!--            <el-select v-model="form.className" placeholder="请选择标识分类">-->
        <!--              <el-option-->
        <!--                v-for="idenClass in idenClassOptions"-->
        <!--                :key="idenClass.name"-->
        <!--                :label="idenClass.name"-->
        <!--                :value="idenClass.name"-->
        <!--              />-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </div>-->
        <el-form-item label="场景图片" prop="sceneUrl">
          <el-input style="width: 300px; display: inline-block;" :disabled="true"
                    v-model="form.sceneUrl" placeholder="请选择场景图片"
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
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="答案标识" prop="classList">
          <el-select v-model="form.classList" multiple :multiple-limit="10" placeholder="请选择,最多选择10个"
                     style="width: 100%"
          >
            <el-option
              v-for="item in correctTrueOption"
              :key="item.id + ''"
              :label="item.name"
              :value="item.id + ''"
            ></el-option>
          </el-select>
          <!--          <el-input v-model="form.correctTrue" placeholder="请输入正确选项" maxlength="15" show-word-limit />-->
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    查看对话框-->
    <el-dialog :title="title" :visible.sync="disableFlag" width="700px" append-to-body>
      <el-form :model="form" label-width="120px" v-if="disableFlag">
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <el-form-item label="标识分类" prop="className">
            <el-select v-model="form.className" placeholder="请选择标识分类" disabled>
              <el-option
                v-for="idenClass in idenClassOptions"
                :key="idenClass.name"
                :label="idenClass.name"
                :value="idenClass.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="标识图片" prop="sceneUrl">
          <img :src="form.sceneUrl" alt="" style="width: 100px;height: 100px">
          <!--          <ImagePreview width="100px" height="100px" :src="form.identifierUrl"></ImagePreview>-->
        </el-form-item>
        <el-form-item label="答案标识" prop="classList">
          <el-select v-model="form.classList" multiple disabled placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in correctTrueOption"
              :key="item.id + ''"
              :label="item.name"
              :value="item.id + ''"
            ></el-option>
          </el-select>
          <!--          <el-input v-model="form.correctTrue" placeholder="请输入正确选项" maxlength="15" show-word-limit />-->
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <!--          <el-button type="primary" @click="submitForm">确 定</el-button>-->
          <el-button @click="disableFlag=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="导入" :visible.sync="dialogFilVisible" width="400px" append-to-body>
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :action=accept
        :file-list="fileList"
        :on-change="fileChange"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate"
            >下载模板
            </el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="cancelFile">取 消</el-button>
        </div>
      </template>
    </el-dialog>
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
