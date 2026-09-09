<script>
import { parseTime, DExcel } from '@/utils/yyh'
import * as XLSX from 'xlsx'
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
        name: '',
        identifierUrl: '',
        identifierDesc: '',
        className: '',
        correctTrue: '',
        optionSelA: '',
        optionSelB: '',
        optionSelC: '',
        optionSelD: ''
      },
      rules: {
        name: [{ required: true, message: '标识名称不能为空', trigger: 'blur' }],
        // className: [{required: true, message: '标识分类不能为空', trigger: 'blur'}],
        identifierDesc: [{ required: true, message: '标识详情不能为空', trigger: 'blur' }],
        identifierUrl: [{ required: true, message: '标识图片不能为空', trigger: 'blur' }]
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
      correctTrueOption: [
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'C', label: 'C' },
        { value: 'D', label: 'D' }
      ],
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
    async queryClass() {
      this.db.markClass.reverse().toArray().then(res => {
        console.log(res)
        this.idenClassOptions = res
        if (this.idenClassOptions.length > 0) {
          this.handleNodeClick(this.idenClassOptions[0].name);
        }
      })
    },
    seqFormat: function(row, column, cellValue, index) {
      return (this.queryParams.pageSize * (this.queryParams.pageNum - 1)) + index + 1
    },
    queryAndPaginate(fieldValue, pageNum, pageSize) {
      console.log(this.queryParams, fieldValue)
      let query = this.db.topicData.toCollection().filter(record => record.className.includes(this.queryParams.className))
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
        name: undefined,
        identifierUrl: undefined,
        identifierDesc: undefined,
        starTimer: undefined,
        correctTrue: undefined,
        optionSelA: undefined,
        optionSelB: undefined,
        optionSelC: undefined,
        optionSelD: undefined
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
      this.db.topicData.delete(row.id).then(res => {
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
      this.db.topicData.bulkDelete(this.ids).then(res => {
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
      this.form = JSON.parse(JSON.stringify(row))
      this.open = true
      this.title = '修改'
    },
    handleInfo(row) {
      this.reset()
      console.log(this.form)
      this.form = JSON.parse(JSON.stringify(row))
      this.disableFlag = true
      this.title = '查看'
    },
    handleUpdateFlag(row) {
      row.enableFlag = row.enableFlag == 1 ? 0 : 1
      this.db.topicData.update(row.id, row).then(res => {
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
            this.db.topicData.update(this.form.id, this.form).then(res => {
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
            this.db.topicData.add(this.form).then(() => {
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
      this.form.identifierUrl = path
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
      DExcel([], this.listHandler, '认知考试导入')
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
      // 使用新的解析方法
      this.loading = this.$loading({
        lock: true,
        text: '导入数据解析中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      console.log('开始解析Excel文件...')
      // 直接解析数据和图片
      this.getExcelData(file.raw)
    },
    async getExcelData(file) {
      const fileContent = await this.readFile(file)
      let workbook = XLSX.read(fileContent, { type: 'array' }) // 使用array类型读取
      const worksheet = workbook.Sheets[workbook.SheetNames[0]] // 获取第一个工作表
      console.log('第一张工作表', worksheet)
      
      // 使用新的解析方法
      await this.parseExcelWithImages(file, worksheet)
    },
    formatDate(sheetlist) {
      try {
        if (sheetlist.length < 1) return
        
        console.log('开始格式化数据，数据行数:', sheetlist.length)
        console.log('原始Excel数据:', sheetlist)

        this.importDataList = sheetlist.map((obj, index) => {
          console.log(`处理第${index + 1}行数据:`, obj)
          const mappedObj = {}
          
          // 映射字段
          for (const prop in obj) {
            if (this.listHandler[prop]) {
              mappedObj[this.listHandler[prop]] = obj[prop]
              console.log(`映射字段 ${prop} -> ${this.listHandler[prop]}:`, obj[prop])
            }
          }
          
          // 确保导入数据的className与当前选中的分类一致
          mappedObj.className = this.queryParams.className
          mappedObj.starTimer = parseTime(new Date(), '{y}-{m}-{d}')
          console.log('映射后的对象:', mappedObj)
          return mappedObj
        })

        console.log('最终导入数据:', this.importDataList)
        this.$message.success('数据解析成功')
        this.loading.close()
      } catch (error) {
        this.loading.close()
        this.$message.error('数据解析失败')
        console.log(error)
        return
      }
    },
    // 新的Excel图片解析方法 - 基于单元格位置
    async parseExcelWithImages(file, worksheet) {
      try {
        const zip = new JSZip()
        const zipData = await zip.loadAsync(file)
        
        // 解析数据行
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        console.log('原始表格数据:', sheetData)
        
        // 获取表头行
        const headers = sheetData[0] || []
        console.log('表头:', headers)
        
        // 解析绘图关系文件
        const drawingRels = await this.parseDrawingRelationships(zipData)
        console.log('绘图关系:', drawingRels)
        
        // 解析工作表绘图文件
        const imagePositions = await this.parseWorksheetDrawings(zipData, drawingRels)
        console.log('图片位置信息:', imagePositions)
        
        // 构建最终数据
        const processedData = []
        for (let rowIndex = 1; rowIndex < sheetData.length; rowIndex++) {
          const rowData = sheetData[rowIndex]
          if (!rowData || rowData.length === 0) continue
          
          const dataObj = {}
          
          // 映射基础数据
          headers.forEach((header, colIndex) => {
            if (header && rowData[colIndex] !== undefined) {
              dataObj[header] = rowData[colIndex]
            }
          })
          
          // 分配对应行的图片
          const rowImages = imagePositions.filter(img => img.row === rowIndex + 1) // Excel行号从1开始
          console.log(`第${rowIndex + 1}行找到图片:`, rowImages)
          
          // 根据列位置分配图片
          rowImages.forEach(img => {
            const columnHeader = headers[img.col - 1] // 转换为0基索引
            if (columnHeader && img.imageData) {
              dataObj[columnHeader] = `data:image/png;base64,${img.imageData}`
              console.log(`为第${rowIndex + 1}行第${img.col}列分配图片`)
            }
          })
          
          processedData.push(dataObj)
        }
        
        console.log('处理后的数据:', processedData)
        this.formatDate(processedData)
        
      } catch (error) {
        console.error('解析Excel图片时出错:', error)
        this.loading.close()
        this.$message.error('解析Excel文件失败，请检查文件格式')
      }
    },
    
    // 解析绘图关系文件
    async parseDrawingRelationships(zipData) {
      const relationships = []
      try {
        // 查找绘图关系文件
        const drawingRelsFile = zipData.file('xl/drawings/_rels/drawing1.xml.rels')
        if (drawingRelsFile) {
          const relsContent = await drawingRelsFile.async('text')
          console.log('绘图关系文件内容:', relsContent)
          
          // 解析XML获取图片文件映射
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(relsContent, 'text/xml')
          const relationshipNodes = xmlDoc.getElementsByTagName('Relationship')
          
          for (let i = 0; i < relationshipNodes.length; i++) {
            const rel = relationshipNodes[i]
            const id = rel.getAttribute('Id')
            const target = rel.getAttribute('Target')
            if (target && target.includes('image')) {
              relationships.push({ id, target: target.replace('../', '') })
            }
          }
        }
      } catch (error) {
        console.log('解析绘图关系文件失败:', error)
      }
      return relationships
    },
    
    // 解析工作表绘图文件
    async parseWorksheetDrawings(zipData, drawingRels) {
      const imagePositions = []
      try {
        // 查找工作表绘图文件
        const drawingFile = zipData.file('xl/drawings/drawing1.xml')
        if (drawingFile) {
          const drawingContent = await drawingFile.async('text')
          console.log('绘图文件内容:', drawingContent)
          
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(drawingContent, 'text/xml')
          
          // 查找所有图片锚点
          const anchors = xmlDoc.getElementsByTagName('xdr:twoCellAnchor')
          
          for (let i = 0; i < anchors.length; i++) {
            const anchor = anchors[i]
            
            // 获取起始单元格位置
            const fromCell = anchor.getElementsByTagName('xdr:from')[0]
            if (fromCell) {
              const col = parseInt(fromCell.getElementsByTagName('xdr:col')[0]?.textContent || '0') + 1
              const row = parseInt(fromCell.getElementsByTagName('xdr:row')[0]?.textContent || '0') + 1
              
              // 获取图片引用ID
              const pic = anchor.getElementsByTagName('a:blip')[0]
              if (pic) {
                const embedId = pic.getAttribute('r:embed')
                const relInfo = drawingRels.find(rel => rel.id === embedId)
                
                if (relInfo) {
                  // 读取图片数据
                  const imageFile = zipData.file(`xl/${relInfo.target}`)
                  if (imageFile) {
                    const imageData = await imageFile.async('base64')
                    imagePositions.push({ row, col, imageData, embedId })
                    console.log(`找到图片位置: 行${row}, 列${col}`)
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.log('解析工作表绘图文件失败:', error)
      }
      return imagePositions
    },
    
    // 保留原有的getExcelImage方法作为备用
    async getExcelImage(file) {
      let imageList = [] // 用来存放图片
      const zip = new JSZip() // 创建jszip实例
      try {
        let zipLoadResult = await zip.loadAsync(file) // 将xlsx文件转zip文件
        const sortedKeys = Object.keys(zipLoadResult['files']).sort((a, b) => {
          // 改进数字提取正则表达式
          const aMatch = a.match(/image(\d+)\./)
          const bMatch = b.match(/image(\d+)\./)
          const numA = aMatch ? parseInt(aMatch[1], 10) : 0
          const numB = bMatch ? parseInt(bMatch[1], 10) : 0
          // 比较数字以确定排序顺序
          return numA - numB
        })

// 遍历排序后的键
        for (const key of sortedKeys) {
          // 扩展路径匹配规则，支持更多Excel格式
          const fileName = zipLoadResult['files'][key].name
          const isImageFile = (fileName.indexOf('media/image') != -1 || fileName.indexOf('xl/media/image') != -1) &&
                             !zipLoadResult['files'][key].dir &&
                             (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg'))

          if (isImageFile) {
            await zip
              .file(fileName)
              .async('base64')
              .then((res) => {
                imageList.push(res)
              })
          }
        }

        // 检查图片数量
        if (imageList.length === 0) {
          console.warn('未找到图片文件，请确保Excel文件包含图片')
        }

      } catch (error) {
        console.log(error)
      }
      return imageList
    },
    submitFileForm() {
      this.db.topicData.bulkPut(this.importDataList).then(() => {
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
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              @click="handleImport"
            >导入
            </el-button>
          </el-col>
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

        <el-table :data="list" @selection-change="handleSelectionChange" height="70vh">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="标识名称" align="center" key="name" prop="name" :show-overflow-tooltip="true"/>
          <!-- <el-table-column label="标识详情" align="center" key="identifierDesc" prop="identifierDesc" v-if="columns[2].visible" :show-overflow-tooltip="true" /> -->
          <el-table-column label="标识分类" align="center" key="className" prop="className"
                           :show-overflow-tooltip="true"
          />
          <el-table-column label="标识图片" align="center" key="starTimer" prop="starTimer" width="180">
            <template #default="scope">
              <img :src="scope.row.identifierUrl" alt="" style="width: 100px;height: 100px">
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
        <el-form-item label="标识名称" prop="name">
          <el-input v-model="form.name" placeholder="标识请输入名称" maxlength="15" show-word-limit/>
        </el-form-item>
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
        <el-form-item label="标识详情" prop="identifierDesc">
          <el-input v-model="form.identifierDesc" placeholder="请输入标识详情" type="textarea"
                    :rows="3" show-word-limit
          />
        </el-form-item>
        <el-form-item label="标识图片" prop="identifierUrl">
          <el-input style="width: 300px; display: inline-block;" :disabled="true"
                    v-model="form.identifierUrl" placeholder="请选择标识图片"
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
        <el-form-item label="选项A" prop="optionSelA">
          <el-input v-model="form.optionSelA" placeholder="请输入选项A" maxlength="15" show-word-limit/>
        </el-form-item>
        <el-form-item label="选项B" prop="optionSelB">
          <el-input v-model="form.optionSelB" placeholder="请输入选项B" maxlength="15" show-word-limit/>
        </el-form-item>
        <el-form-item label="选项C" prop="optionSelC">
          <el-input v-model="form.optionSelC" placeholder="请输入选项C" maxlength="15" show-word-limit/>
        </el-form-item>
        <el-form-item label="选项D" prop="optionSelD">
          <el-input v-model="form.optionSelD" placeholder="请输入选项D" maxlength="15" show-word-limit/>
        </el-form-item>
        <el-form-item label="正确选项" prop="correctTrue">
          <el-select v-model="form.correctTrue" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in correctTrueOption"
              :key="item.value"
              :label="item.value"
              :value="item.value"
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" maxlength="15" show-word-limit disabled/>
          </el-form-item>
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
        <el-form-item label="标识详情" prop="identifierDesc">
          <el-input v-model="form.identifierDesc" placeholder="请输入标识详情" type="textarea"
                    :rows="3" show-word-limit disabled
          />
        </el-form-item>
        <el-form-item label="标识图片" prop="identifierUrl">
          <img :src="form.identifierUrl" alt="" style="width: 100px;height: 100px">
          <!--          <ImagePreview width="100px" height="100px" :src="form.identifierUrl"></ImagePreview>-->
        </el-form-item>
        <el-form-item label="选项A" prop="optionSelA">
          <el-input v-model="form.optionSelA" placeholder="请输入选项A" maxlength="15" show-word-limit disabled/>
        </el-form-item>
        <el-form-item label="选项B" prop="optionSelB">
          <el-input v-model="form.optionSelB" placeholder="请输入选项A" maxlength="15" show-word-limit disabled/>
        </el-form-item>
        <el-form-item label="选项C" prop="optionSelC">
          <el-input v-model="form.optionSelC" placeholder="请输入选项A" maxlength="15" show-word-limit disabled/>
        </el-form-item>
        <el-form-item label="选项D" prop="optionSelD">
          <el-input v-model="form.optionSelD" placeholder="请输入选项A" maxlength="15" show-word-limit disabled/>
        </el-form-item>
        <el-form-item label="正确选项" prop="correctTrue">
          <el-input v-model="form.correctTrue" placeholder="请输入正确选项" maxlength="15" show-word-limit disabled/>
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
