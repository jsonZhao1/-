import Dexie from 'dexie'

const { remote, ipcRenderer } = window.require('electron')
const path = window.require('path')
const { app } = remote
const electronPath = app.getPath('exe')
let installRootPath
if (process.env.NODE_ENV === 'development') {
  // Load the url of the dev server if in development mode
  installRootPath = 'F:\\xiangmu\\zhihuiyun\\electron-example\\electron-example\\'
} else {
  installRootPath = window.process && window.process.resourcesPath
    ? path.resolve(window.process.resourcesPath, '..')
    : path.dirname(electronPath)
}

const resourcePathFields = ['imgUrl', 'identifierUrl', 'identifierPic', 'sceneUrl']

export function resolveResourcePath(value) {
  if (!value || typeof value !== 'string') {
    return value
  }

  const normalizedValue = value.replace(/\\/g, '/')
  const lowerValue = normalizedValue.toLowerCase()
  let relativePath = null

  if (lowerValue.startsWith('video/')) {
    relativePath = normalizedValue
  } else {
    const videoIndex = lowerValue.indexOf('/video/')
    if (videoIndex !== -1) {
      relativePath = normalizedValue.slice(videoIndex + 1)
    }
  }

  if (!relativePath) {
    return value
  }

  return path.join(installRootPath, ...relativePath.split('/'))
}

function resolveRecordResourcePaths(record) {
  if (!record) {
    return record
  }

  resourcePathFields.forEach(field => {
    if (record[field]) {
      record[field] = resolveResourcePath(record[field])
    }
  })
  return record
}

console.log('Electron 安装路径:', installRootPath)
ipcRenderer.on('before-quit', (event, message) => {
  console.log(message) // 打印收到的消息
  // 在这里执行渲染进程需要的操作，比如数据保存等
  db.close()
})
export const db = new Dexie('myDatabase')// 数据库名称：myDatabase

db.version(1).stores({
  markClass: '++id, name, imgUrl,enableFlag,status,starTimer', // Primary key and indexed props 对象仓库（objectStore）：friends，唯一的id作为键路径（key path）
  markStudy: '++id, name, className,identifierDesc,identifierUrl,identifierPic,starTimer',
  scoreData: '++id, name,className,score,starTimer',
  sceneData: '++id,classList,className,sceneUrl,starTimer',
  topicData: '++id, name,className,identifierDesc,identifierName,identifierUrl,correctTrue,optionSelA,optionSelB,optionSelC,optionSelD,starTimer',
  psd: 'password'
})
db.markClass.hook('reading', resolveRecordResourcePaths)
db.markStudy.hook('reading', resolveRecordResourcePaths)
db.sceneData.hook('reading', resolveRecordResourcePaths)
db.topicData.hook('reading', resolveRecordResourcePaths)

db.open()
  .then(() => {
    console.log('数据库已打开')
    // 进行其他数据库操作
  })
  .catch(error => {
    console.error('打开数据库时出错:', error)
  })
db.on('populate', function() {
  db.sceneData.bulkPut([
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['98', '111', '105', '112'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景1.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['103', '105', '106', '115'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景2.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['97', '98', '106', '115'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景3.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['112', '105', '104', '98'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景4.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['99', '100', '101', '107', '109'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景5.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['115', '106', '105', '103'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景6.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['97', '103', '105', '106'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景7.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['98', '101', '108', '112'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景8.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['114', '107'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景9.png`
    },
    {
      className: '施工类',
      starTimer: '2024-02-19',
      classList: ['116', '102'],
      sceneUrl: `${installRootPath}\\video\\施工\\场景10.png`
    }
  ])
  db.topicData.bulkPut([
    {
      name: '必须使用安全带',
      className: '电力类',
      correctTrue: 'B',
      optionSelA: '必须穿工作服',
      optionSelB: '必须使用安全带',
      optionSelC: '必须佩戴安全帽',
      optionSelD: '必须穿防护鞋',
      identifierUrl: `${installRootPath}\\video\\电力\\必须使用安全带1.png`,
      identifierDesc: '该标志一般安装在有高空坠落风险的地方，在这些地方作业操作不当极易发生坠落，因此需要通过使用安全带来避免坠落风险。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须佩戴安全帽',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\必须佩戴安全帽1.png`,
      correctTrue: 'C',
      optionSelA: '必须穿工作服',
      optionSelB: '必须使用安全带',
      optionSelC: '必须佩戴安全帽',
      optionSelD: '必须穿防护鞋',
      identifierDesc: '该标志一般安装在施工现场施工现场内各个作业点，提醒人员佩戴安全帽，进行头部保护。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止用水灭火',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止用水灭火1.png`,
      correctTrue: 'C',
      optionSelA: '必须用水灭火',
      optionSelB: '可以用水灭火',
      optionSelC: '禁止用水灭火',
      optionSelD: '小心有水倾倒',
      identifierDesc: '该标志一般悬挂在配电室门口，因配电室内存放带电设备，配电室发生火灾后用水会进一步加剧火灾，或者造成其他损失。',
      starTimer: '2024-02-19'
    },
    {
      name: '严禁烟火',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\严禁烟火1.png`,
      correctTrue: 'D',
      optionSelA: '禁止吸烟',
      optionSelB: '禁止明火',
      optionSelC: '不得烧柴',
      optionSelD: '严禁烟火',
      identifierDesc: '该标志安装在配电室等易发生火灾处，这些地点一般都存放有电气设备，告诫工作人员在此区域不得使用烟火，防止安全事故的发生。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止翻越',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止翻越1.png`,
      correctTrue: 'A',
      optionSelA: '禁止翻越',
      optionSelB: '禁止攀爬',
      optionSelC: '小心防护',
      optionSelD: '禁止入内',
      identifierDesc: '该标志安装在有安全风险处，这些地点使用护栏或其他临时性、警戒保护性的保护措施，将危险区域进行保护隔离。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止攀爬',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止攀爬1.png`,
      correctTrue: 'B',
      optionSelA: '禁止翻越',
      optionSelB: '禁止攀爬',
      optionSelC: '小心防护',
      optionSelD: '禁止入内',
      identifierDesc: '该标志安装在带电设备的梯子上，例如架空电力线路杆塔的爬梯和配电变压器的杆架和台架上，告诫人们设备带电不得攀登和进入。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意安全',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\注意安全1.png`,
      correctTrue: 'C',
      optionSelA: '禁止前进',
      optionSelB: '严禁停留',
      optionSelC: '注意安全',
      optionSelD: '快速通过',
      identifierDesc: '该标志安装在有伤害风险的位置，目的是警告人员附近有某种风险，需要提高注意力或进行安全防护。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心坠落',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\当心坠落1.png`,
      correctTrue: 'D',
      optionSelA: '小心防护',
      optionSelB: '前有坠物',
      optionSelC: '深坑危险',
      optionSelD: '当心坠落',
      identifierDesc: '该标志安装在有坠落风险的地方，这些地点地理位置特殊，利用该标志提醒人员观察周围情况，提高注意力，防止意外发生。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心触电',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\当心触电1.png`,
      correctTrue: 'A',
      optionSelA: '当心触电',
      optionSelB: '雷击风险',
      optionSelC: '静电释放',
      optionSelD: '电源开关',
      identifierDesc: '该标志安装在有电流且容易被人员或机械触碰到的地方，这些地方存在的带电设备或电线一般都是放置位置存在一定的不安全因素，或者本身的外观不易让人察觉带电，一旦人、机械触碰，或使用不当，则会发生触电事故。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心吊物',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\当心吊物1.png`,
      correctTrue: 'C',
      optionSelA: '当心坠落',
      optionSelB: '前有塔吊',
      optionSelC: '当心吊物',
      optionSelD: '当心堆积物坍塌',
      identifierDesc: '该标志安装在起重设备工作的地方，这些地方周围会进行高空吊运作业，高空中会不时有重物来回移动，一旦发生物体坠落，对下方的人或其他财务会存在及其严重的危害。',
      starTimer: '2024-02-19'
    },
    {
      name: '小心高空落物',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\小心高空落物1.png`,
      correctTrue: 'B',
      optionSelA: '前有落水',
      optionSelB: '小心高空落物',
      optionSelC: '不得停留',
      optionSelD: '严禁通过',
      identifierDesc: '该标志安装在高处作业的下方位置，这些位置的上方一般都有高处作业或材料堆积，为防止作业工器具或材料等因各种因素坠落伤人，使用该标志警示人员，最好远离此处，或时刻注意规避风险。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止触摸',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止触摸1.png`,
      correctTrue: 'A',
      optionSelA: '禁止触摸',
      optionSelB: '有电危险',
      optionSelC: '高温危险',
      optionSelD: '不得开启',
      identifierDesc: '该标志的作用是警告人员，使其不要触摸某样物品，这样物品一般具有直接伤害性或者其他不能触摸的性质，或高温，或带电，或物品本身不能被触摸。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止堆放',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止堆放1.png`,
      correctTrue: 'D',
      optionSelA: '不得放置木箱',
      optionSelB: '禁止超重',
      optionSelC: '禁止堵塞',
      optionSelD: '禁止堆放',
      identifierDesc: '该标志的作用是告知人员某些位置不能堆放材料，这些位置虽然空间足够，但已经另作他用，或者位置本身存在某种隐患，如果违规堆放，可能会酿成事故。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止吸烟',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止吸烟1.png`,
      correctTrue: 'A',
      optionSelA: '禁止吸烟',
      optionSelB: '禁止明火',
      optionSelC: '禁止烟火',
      optionSelD: '不得乱扔烟头',
      identifierDesc: '该标志安装在配电室等易发生火灾处，这些地点一般都存放有电气设备，告诫工作人员在此区域禁止吸烟，防止安全事故的发生。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止入内',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止入内1.png`,
      correctTrue: 'D',
      optionSelA: '禁止开启',
      optionSelB: '禁止关闭',
      optionSelC: '禁止触摸',
      optionSelD: '禁止入内',
      identifierDesc: '该标志的意义是警告人员不得进入某些地方，这些地方的类型不一，但都是具有专业作用不对外的场所，一旦进入可能会造成伤害或者物品损坏等后果。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止合闸,线路有人工作',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止合闸,线路有人工作1.png`,
      correctTrue: 'D',
      optionSelA: '不得手动开闸',
      optionSelB: '不得手动合闸',
      optionSelC: '禁止开闸,线路有人工作',
      optionSelD: '禁止合闸,线路有人工作',
      identifierDesc: '该标志应悬挂在已停电检修（施工）的电力线路的断路器和隔离开关的操作把手上，为防止误操作而造成检修人员伤害。',
      starTimer: '2024-02-19'
    },
    {
      name: '佩戴防护手套',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\佩戴防护手套1.png`,
      correctTrue: 'D',
      optionSelA: '不得开启',
      optionSelB: '高温危险',
      optionSelC: '禁止戴手套',
      optionSelD: '佩戴防护手套',
      identifierDesc: '该标志的意义是提醒作业人员在进行带电作业或更换保险器等危险作业时，应佩戴防护手套，一般安装在易伤害手部的作业场所，',
      starTimer: '2024-02-19'
    },
    {
      name: '有电危险',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\有电危险1.png`,
      correctTrue: 'A',
      optionSelA: '有电危险',
      optionSelB: '高压场所',
      optionSelC: '避雷装置',
      optionSelD: '电源开关',
      identifierDesc: '该标志安装在临时电源配电箱上或作业现场可能发生触电的危险地点，用来防止生产现场人身触电事故的发生。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意通风',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\注意通风1.png`,
      correctTrue: 'B',
      optionSelA: '设备运行',
      optionSelB: '注意通风',
      optionSelC: '注意齿轮',
      optionSelD: '齿轮锁死',
      identifierDesc: '该标志安装在密闭工作场所入口，例如电缆井入口，为防止在作业现场发生缺氧、中毒等意外事故。',
      starTimer: '2024-02-19'
    },
    {
      name: '已接地',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\已接地1.png`,
      correctTrue: 'C',
      optionSelA: '水深危险',
      optionSelB: '必须接地',
      optionSelC: '已接地',
      optionSelD: '未接地',
      identifierDesc: '该标志安装在已经接地，但是看不到接地线的设备旁，提醒作业人员此设备已接地线。',
      starTimer: '2024-02-19'
    },
    {
      name: '从此上下',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\从此上下1.png`,
      correctTrue: 'A',
      optionSelA: '从此上下',
      optionSelB: '禁止入内',
      optionSelC: '禁止开启',
      optionSelD: '不得开启',
      identifierDesc: '该标志应悬挂在现场工作人员可以上下的爬梯上。如变电所某条母线检修时，通常在通往该条母线的铁架上悬挂“从此上下”标志牌。',
      starTimer: '2024-02-19'
    },
    {
      name: '在此工作',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\在此工作1.png`,
      correctTrue: 'D',
      optionSelA: '从此上下',
      optionSelB: '禁止入内',
      optionSelC: '禁止触摸',
      optionSelD: '在此工作',
      identifierDesc: '该标志应悬挂在设备检修或施工的工作地点附近，悬挂“在此工作”标志牌的数量应在工作票中填写，同时工作许可人应向工作负责人交代清楚。',
      starTimer: '2024-02-19'
    },
    {
      name: '从此进出',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\从此进出1.png`,
      correctTrue: 'C',
      optionSelA: '从此上下',
      optionSelB: '禁止入内',
      optionSelC: '从此进出',
      optionSelD: '在此工作',
      identifierDesc: '该标志应悬挂在室外工作地点围栏的出入口，提醒现场工作人员从此进入作业现场。',
      starTimer: '2024-02-19'
    },
    {
      name: '配电重地闲人莫进',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\配电重地闲人莫进1.png`,
      correctTrue: 'B',
      optionSelA: '从此上下',
      optionSelB: '配电重地闲人莫进',
      optionSelC: '从此进出',
      optionSelD: '在此工作',
      identifierDesc: '该标志悬挂在配电房门口挂上此警示牌，用来提醒人们注意安全。让闲杂人等不要随便进入，以免影响电力的正常使用，或者给他人的生命安全造成危害。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止吸烟',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止吸烟1.png`,
      correctTrue: 'A',
      optionSelA: '禁止吸烟',
      optionSelB: '禁止明火',
      optionSelC: '禁止烟火',
      optionSelD: '不得乱扔烟头',
      identifierDesc: '此标志放置于可燃易燃物品存放处，防止有明火引发火灾或爆炸等后果，一般放置于库房区、加油站、消防安全重点位置、其他禁止吸烟位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止烟火',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止烟火1.png`,
      correctTrue: 'C',
      optionSelA: '禁止吸烟',
      optionSelB: '禁止明火',
      optionSelC: '禁止烟火',
      optionSelD: '不得烧柴',
      identifierDesc: '此标志放置于可燃易燃物品存放处，防止有明火引发火灾或爆炸等后果，一般放置于库房区、加油站、消防安全重点位置、其他禁止烟火位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止带火种',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止带火种1.png`,
      correctTrue: 'A',
      optionSelA: '禁止带火种',
      optionSelB: '禁止明火',
      optionSelC: '禁止吸烟',
      optionSelD: '禁止阻塞',
      identifierDesc: '此标志放置于可燃易燃物品存放处，防止有明火引发火灾或爆炸等后果，一般放置于库房区、加油站、消防安全重点位置、其他禁止烟火位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止用水灭火',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止用水灭火1.png`,
      correctTrue: 'C',
      optionSelA: '必须用水灭火',
      optionSelB: '可以用水灭火',
      optionSelC: '禁止用水灭火',
      optionSelD: '小心有水倾倒',
      identifierDesc: '此标志一般放置于遇水损坏、产生化学反应或加剧火灾后果的物质存放处，比如：油类可燃液体存放处；钾、钠、电石等遇水急剧反应的物资存放处；带电设备、精密仪器、档案、古籍等位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止穿化纤服装',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止穿化纤服装1.png`,
      correctTrue: 'D',
      optionSelA: '不得穿长袖衣服',
      optionSelB: '必须穿工作服',
      optionSelC: '必须穿防护服',
      optionSelD: '禁止穿化纤服装',
      identifierDesc: '禁止穿化纤服装用在在易燃易爆场所。一般指进行生产、使用、储存、保管等在一定条件下能引起燃烧、爆炸，导致人身伤亡和财产损失等事故的场所。主要场所有：加油站、油库、煤气站、油漆库房、烟花车间和库房、炸药仓库、煤矿坑道、煤炭堆放区域、易燃粉尘的区域、化学品仓库、燃料仓库等。',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃固体',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\易燃固体1.png`,
      correctTrue: 'B',
      optionSelA: '易燃气体',
      optionSelB: '易燃固体',
      optionSelC: '易燃液体',
      optionSelD: '当心火灾',
      identifierDesc: '易燃固体一般为燃点低，遇火、受热、撞击、摩擦或与氧化剂接触后，极易引起剧烈燃烧、爆炸或放出有毒气体的固体物资，多为化工品，此标志一般放置于磷、镁粉等化工品的储存地点。',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃气体',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\易燃气体1.png`,
      correctTrue: 'A',
      optionSelA: '易燃气体',
      optionSelB: '易燃固体',
      optionSelC: '易燃液体',
      optionSelD: '当心火灾',
      identifierDesc: '易燃气体一般指泄露时，遇明火、高温或光照，会发生燃烧或爆炸的气体，此标志一般放置于氢气、甲烷、乙烷等气体储存处。',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃液体',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\易燃液体1.png`,
      correctTrue: 'C',
      optionSelA: '易燃气体',
      optionSelB: '易燃固体',
      optionSelC: '易燃液体',
      optionSelD: '当心火灾',
      identifierDesc: '易燃液体指易于挥发和燃烧的液态物资，其液体及其所挥发的可燃气体，遇火迅速燃烧，空气中的可燃气体浓度达到爆炸极限后，遇火星即发生爆炸，此标志一般放置于汽油、煤油、松节油等物资存放点。',
      starTimer: '2024-02-19'
    },
    {
      name: '不燃气体',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\不燃气体1.png`,
      correctTrue: 'D',
      optionSelA: '安全气体',
      optionSelB: '易燃气体',
      optionSelC: '可燃气体',
      optionSelD: '不燃气体',
      identifierDesc: '不燃气体系指无毒、不燃气体、包括助燃气体。但高浓度时，有窒息作用。助燃气体有强烈的氧化作用，遇油脂能发生燃烧或爆炸。此标志放置于不燃气体储存处，一般包括氮气、氙气、氦气、氖气、氩气，以及助燃气体氧气、压缩空气等。',
      starTimer: '2024-02-19'
    },
    {
      name: '自燃物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\自燃物品1.png`,
      correctTrue: 'D',
      optionSelA: '易燃气体',
      optionSelB: '易燃固体',
      optionSelC: '易燃液体',
      optionSelD: '自燃物品',
      identifierDesc: '自燃物品是在常温下可燃物质将缓慢地氧化，但在某些条件的作用下，则可加速氧化达到燃点温度而燃烧的自然物品。其中有些化学物品的自燃应特别引起注意。①遇空气能自燃的物质，如黄磷、磷化氢、铝粉等。②与水作用能自燃的物质，如钾、钠、钙、电石等。③相互混合或接触能自燃的物质：有的气体、液体、固体的强氧化剂，如氧、氯、溴、浓硝酸、氯酸钾、硝酸钾、漂白粉等与可燃物质接触或混合，都有引起自燃的可能性，有时还以爆炸的形式出现。',
      starTimer: '2024-02-19'
    },
    {
      name: '遇湿易燃物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\遇湿易燃物品1.png`,
      correctTrue: 'A',
      optionSelA: '遇湿易燃物品',
      optionSelB: '易燃固体',
      optionSelC: '易燃液体',
      optionSelD: '易燃气体',
      identifierDesc: '易燃气体一般指泄露时，遇明火、高温或光照，会发生燃烧或爆炸的气体，此标志一般放置于氢气、甲烷、乙烷等气体储存处。',
      starTimer: '2024-02-19'
    },
    {
      name: '爆炸品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\爆炸品1.png`,
      correctTrue: 'D',
      optionSelA: '当心火焰',
      optionSelB: '当心辐射',
      optionSelC: '当心飞溅物',
      optionSelD: '爆炸品',
      identifierDesc: '该标志表示包装内有爆炸品，收到高热、摩擦、冲击或其他物质接触后，即发生剧烈反应，产生大量的气体和热量，从而引起爆炸。例如炸药、雷管、导火线、三硝基甲苯等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心中毒',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\当心中毒1.png`,
      correctTrue: 'B',
      optionSelA: '注意安全',
      optionSelB: '当心中毒',
      optionSelC: '注意化学品',
      optionSelD: '注意病毒',
      identifierDesc: '该标志属于警告标志，主要用于提醒人员该环境存在中毒风险，说明该环境空间可能存在有毒物品储存处、有毒物品处理、化工品生产以及生产废物的排放。目的是让人员提高警惕，注意个人防护，无必要不长久停留。',
      starTimer: '2024-02-19'
    },
    {
      name: '氧化剂',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\氧化剂1.png`,
      correctTrue: 'C',
      optionSelA: '可燃物',
      optionSelB: '易燃物',
      optionSelC: '氧化剂',
      optionSelD: '自燃物',
      identifierDesc: '氧化剂是在氧化还原反应中，获得电子的物质。氧化剂具有氧化性，得到电子化合价降低，发生还原反应，得到还原产物。常见的氧化剂有氧气、氯气、高锰酸钾、硝酸、过氧化氢等。',
      starTimer: '2024-02-19'
    },
    {
      name: '有机过氧化物',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\有机过氧化物1.png`,
      correctTrue: 'B',
      optionSelA: '氧化物',
      optionSelB: '有机过氧化物',
      optionSelC: '易燃物',
      optionSelD: '自燃物',
      identifierDesc: '过氧化氢中的氢原子被烷基、酰基、芳香基等有机基团置换而形成的含有-O-O-过氧官能团的有机化合物为有机过氧化物。特征是受热超过一定温度后，会分解产生含氧自由基，不稳定、易分解。对皮肤、眼睛、粘膜有强烈的刺激性，是大气中的重要污染物。此类物质属于易燃易爆危险品，使用中应注意安全性。',
      starTimer: '2024-02-19'
    },
    {
      name: '化学品储存处',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\化学品储存处1.png`,
      correctTrue: 'B',
      optionSelA: '氧化物',
      optionSelB: '有机过氧化物',
      optionSelC: '易燃物',
      optionSelD: '自燃物',
      identifierDesc: '该标志属于警告标志，表示标志的所在地为化学品的储存地点，可能是化学品仓库、临时储存点或者其他存放有大量化学品的建筑。目的是提醒人员注意安全，不要进行可能导致化学品损坏、泄露、爆炸或者其他意外情况的行为。',
      starTimer: '2024-02-19'
    },
    {
      name: '一级放射性物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\一级放射性物品1.png`,
      correctTrue: 'A',
      optionSelA: '一级放射性物品',
      optionSelB: '二级放射性物品',
      optionSelC: '三级放射性物品',
      optionSelD: '当心辐射',
      identifierDesc: '放射性物品是指含有放射性核素，并且其活度和比活度均高于国家规定的豁免值的物品。人和动物如果受到这些射线的过量照射，会引发放射性疾病，严重的甚至死亡。一级放射性物品指I类放射源、高水平放射性废物、乏燃料等释放到环境后对人体健康和环境产生重大辐射影响的放射性物品。',
      starTimer: '2024-02-19'
    },
    {
      name: '二级放射性物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\二级放射性物品1.png`,
      correctTrue: 'B',
      optionSelA: '一级放射性物品',
      optionSelB: '二级放射性物品',
      optionSelC: '三级放射性物品',
      optionSelD: '当心辐射',
      identifierDesc: '放射性物品是指含有放射性核素，并且其活度和比活度均高于国家规定的豁免值的物品。人和动物如果受到这些射线的过量照射，会引发放射性疾病，严重的甚至死亡。二级放射性物品指Ⅱ类和Ⅲ类放射源、中等水平放射性废物等释放到环境后对人体健康和环境产生一般辐射影响的放射性物品。',
      starTimer: '2024-02-19'
    },
    {
      name: '三级放射性物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\三级放射性物品1.png`,
      correctTrue: 'C',
      optionSelA: '一级放射性物品',
      optionSelB: '二级放射性物品',
      optionSelC: '三级放射性物品',
      optionSelD: '当心辐射',
      identifierDesc: '放射性物品是指含有放射性核素，并且其活度和比活度均高于国家规定的豁免值的物品。人和动物如果受到这些射线的过量照射，会引发放射性疾病，严重的甚至死亡。三级放射性物品指Ⅳ类和V类放射源、低水平放射性废物、放射性药品等释放到环境后对人体健康和环境产生较小辐射影响的放射性物品。',
      starTimer: '2024-02-19'
    },
    {
      name: '腐蚀品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\腐蚀品1.png`,
      correctTrue: 'D',
      optionSelA: '有毒有害',
      optionSelB: '强酸物品',
      optionSelC: '强碱物品',
      optionSelD: '腐蚀品',
      identifierDesc: '腐蚀品是指能灼伤人体组织，并对金属等物品造成损坏的固体或液体。与皮肤接触，在4小时内出现可见坏死现象，或温度在55℃时，对20号钢的表面均匀年腐蚀率超过6.25mm/年的固体或液体。腐蚀品对人体有一定危害，可通过皮肤接触使人体形成化学灼伤。腐蚀品有些本身能着火，有的本身并不着火，但与其他可燃物品接触后能着火。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须穿防护服',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\必须穿防护服1.png`,
      correctTrue: 'A',
      optionSelA: '必须穿防护服',
      optionSelB: '必须穿工装',
      optionSelC: '注意仪表',
      optionSelD: '医疗区',
      identifierDesc: '该标志属于指令性标志，一般放置于需要进行全身防护的作业地点或环境，提示该地点周围可能存在病毒感染、化学品感染、空气污染侵害、细微飞溅物伤害等。也会放置于无菌工作环境，为了隔绝人员体表可能携带的微生物以及细菌，保证环境的无菌要求。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须戴防毒面具',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\必须戴防毒面具1.png`,
      correctTrue: 'A',
      optionSelA: '注意烟尘',
      optionSelB: '必须戴防毒面具',
      optionSelC: '必须戴防护眼罩',
      optionSelD: '不得大声喧哗',
      identifierDesc: '该标志属于指令性标志，一般放置于周围环境有有毒有害气体、不燃气体、或者超标烟尘的位置，例如特殊气体储存间、化学反应会产生特殊气体的位置、空气烟尘含量超标的位置，佩戴规定的防毒面具，可放置气体中毒、窒息、尘肺等危害。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须带防护手套',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\必须带防护手套1.png`,
      correctTrue: 'C',
      optionSelA: '高温烫手',
      optionSelB: '低温冻手',
      optionSelC: '必须戴防护手套',
      optionSelD: '严禁触碰',
      identifierDesc: '该标志属于指令性标志，一般放置于对手部有伤害风险的位置，例如高温、低温、腐蚀、不宜清洁的物品或包装处，不佩戴规定的防护手套会导致高温烫伤、低温冻伤、化学腐蚀或者皮肤污染等后果。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须穿防护鞋',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\必须穿防护鞋1.png`,
      correctTrue: 'D',
      optionSelA: '严禁入内',
      optionSelB: '注意脚部砸伤',
      optionSelC: '注意污染鞋面',
      optionSelD: '必须穿防护鞋',
      identifierDesc: '该标志属于指令性标志，一般放置于地面有坚硬物体、对脚部有化学腐蚀伤害或者其他伤害的地点，这些地点的地面上可能存在锋利物品，或地面有化学物品遗洒、排放等，易对脚步皮肤造成危害。',
      starTimer: '2024-02-19'
    },
    {
      name: '最高限速',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\最高限速1.png`,
      correctTrue: 'A',
      optionSelA: '最高限速',
      optionSelB: '最低限速',
      optionSelC: '解除限速',
      optionSelD: '限制重量',
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字、外有红圈，形状为圆形。表示机动车驶入前方道路的最高时速限制。此标志设在需要限制车辆速度的路段的起点演示图标，表示前方路段最高时速不得超过40公里每小时，超出限制会受到处罚。',
      starTimer: '2024-02-19'
    },
    {
      name: '最低限速',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\最低限速1.png`,
      correctTrue: 'B',
      optionSelA: '最高限速',
      optionSelB: '最低限速',
      optionSelC: '解除限速',
      optionSelD: '限制重量',
      identifierDesc: '属于交通禁令标志，颜色为蓝底、白数字，形状为圆形。表示机动车驶入前方道路的最低时速限制。此标志设在高速公路或其他道路限速路段的起点及各立交入口后的适当位置。演示图标，表示此路段的最低限速为50公里每小时，车速过慢会有追尾危险。',
      starTimer: '2024-02-19'
    },
    {
      name: '解除限速',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\解除限速1.png`,
      correctTrue: 'C',
      optionSelA: '最高限速',
      optionSelB: '最低限速',
      optionSelC: '解除限速',
      optionSelD: '限制重量',
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字、黑细斜杠、黑圈，形状为圆形。此标志属于交通标志中的禁令标志，表示限制速度路段结束。此标志设在限制车辆速度路段的终点。演示图标，表示前方路段解除最高限速40公里每小时的规定，可以将车速升至40以上。',
      starTimer: '2024-02-19'
    },
    {
      name: '限制高度',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\限制高度1.png`,
      correctTrue: 'A',
      optionSelA: '限制高度',
      optionSelB: '限制宽度',
      optionSelC: '限制长度',
      optionSelD: '限制重量',
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字（带m）、外有红圈、上下有黑色三角，形状为圆形。表示机动车驶入前方道路的最高高度限制。此标志设在需要限制车辆高度的路段的起点，一般表示前方有高度限制物，比如高架桥、涵洞等等。演示图标，表示此路段最高高度不得超过4.5米，超高就无法通过。',
      starTimer: '2024-02-19'
    },
    {
      name: '限制宽度',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\限制宽度1.png`,
      correctTrue: 'B',
      optionSelA: '限制高度',
      optionSelB: '限制宽度',
      optionSelC: '限制长度',
      optionSelD: '限制重量',
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字（带m）、外有红圈、左右有黑色三角，形状为圆形。表示机动车驶入前方道路的最大宽度限制。此标志设在需要限制车辆宽度的路段的起点，一般表示前方有宽度限制物，比如窄桥、涵洞等等。演示图标，表示此路段最大宽度不得超过3米，超宽就无法通过。',
      starTimer: '2024-02-19'
    },
    {
      name: '限制重量',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\限制重量1.png`,
      correctTrue: 'D',
      optionSelA: '限制高度',
      optionSelB: '限制宽度',
      optionSelC: '限制长度',
      optionSelD: '限制重量',
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字（带t）、外有红圈，形状为圆形。表示机动车驶入前方道路的最大重量限制。此标志设在需要限制车辆重量的路段的起点，一般表示前方有重量限制物，比如软基路段、桥梁等等。演示图标，表示此路段最大重量不得超过5吨，超重通过会对道路产生损伤，甚至发生危险。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止鸣笛',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止鸣笛1.png`,
      correctTrue: 'A',
      optionSelA: '禁止鸣笛',
      optionSelB: '禁止播放音乐',
      optionSelC: '解除禁止鸣笛',
      optionSelD: '禁止长时间鸣笛',
      identifierDesc: '属于交通禁令标志，颜色为白底、黑色喇叭、红色斜杠、外有红圈，形状为圆形。表示机动车驶入前方道路后，不得使用喇叭。此标志设在需要限制噪声的路段的起点，表示前方为噪声限制区域，不得鸣笛，比如医院、学校、居民区等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止长时间停车',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止长时间停车1.png`,
      correctTrue: 'C',
      optionSelA: '禁止通行',
      optionSelB: '禁止驶入',
      optionSelC: '禁止长时间停车',
      optionSelD: '禁止临时或长时停车',
      identifierDesc: '属于交通禁令标志，颜色为蓝底、一条红色斜杠、外有红圈，无图案和数字，形状为圆形。表示此处道路不得长时间停放机动车辆。此标志设在限制停车的地点，表示此处为停车限制区域，不得长时间停放车辆，否则会影响交通，受到处罚，但允许短时间停放，比如车流量较大的医院出入口、学校门口等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止临时或长时停车',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止临时或长时停车1.png`,
      correctTrue: 'D',
      optionSelA: '禁止通行',
      optionSelB: '禁止驶入',
      optionSelC: '禁止长时间停车',
      optionSelD: '禁止临时或长时停车',
      identifierDesc: '属于交通禁令标志，颜色为蓝底、两条呈X形交叉的红色斜杠、外有红圈，无图案和数字，形状为圆形。表示此处道路不得停放机动车辆。此标志设在限制停车的地点，表示此处为停车限制区域，无论长时间还是短时间停放都不允许，否则会影响交通，受到处罚，比如车流量较大的主干道旁、上下坡道上等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止超车',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止超车1.png`,
      correctTrue: 'B',
      optionSelA: '禁止绕行',
      optionSelB: '禁止超车',
      optionSelC: '解除禁止超车',
      optionSelD: '解除禁止绕行',
      identifierDesc: '属于交通禁令标志，颜色为白底、有两个黑色箭头图案，一条短而直，一条长而折、一条红色斜杠、外有红圈，无图案和数字，形状为圆形。表示前方道路不得超车。此标志设在限制超车的地点，表示前方道路不得进行超车，一般设置在狭窄、光线较暗等特殊路段的入口，比如匝道、隧道、道路变窄处等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '解除禁止超车',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\解除禁止超车1.png`,
      correctTrue: 'C',
      optionSelA: '禁止绕行',
      optionSelB: '禁止超车',
      optionSelC: '解除禁止超车',
      optionSelD: '解除禁止绕行',
      identifierDesc: '属于交通禁令标志，颜色为白底、有两个黑色箭头图案，一条短而直，一条长而折、五条黑细斜杠、外有黑圈，无图案和数字，形状为圆形。表示限制超车路段结束。此标志设在限制超车管制路段的结束点，表示前方道路解除禁止超车的限制，可以进项正常的超车驾驶，一般设置在狭窄、光线较暗等特殊路段的出口，比如匝道出口、隧道出口等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止掉头',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止掉头1.png`,
      correctTrue: 'C',
      optionSelA: '禁止转弯',
      optionSelB: '禁止逆行',
      optionSelC: '禁止掉头',
      optionSelD: '禁止前行',
      identifierDesc: '属于交通禁令标志，颜色为全红底，中间有一道白色横线，无图案和数字，形状为圆形。表示前方路段禁止一切车辆驶入。此标志设在禁止车辆进入的路段入口，表示前方路段禁止一切车辆驶入，一般设置在有特殊通行要求或者不具备通行条件的路段，比如单行路的出口处、尚未施工完成的路段等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止驶入',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止驶入1.png`,
      correctTrue: 'B',
      optionSelA: '停车检查',
      optionSelB: '禁止驶入',
      optionSelC: '禁止长时间停车',
      optionSelD: '禁止临时或长时停车',
      identifierDesc: '属于交通禁令标志，颜色为全红底，中间有一道白色横线，无图案和数字，形状为圆形。表示前方路段禁止一切车辆驶入。此标志设在禁止车辆进入的路段入口，表示前方路段禁止一切车辆驶入，一般设置在有特殊通行要求或者不具备通行条件的路段，比如单行路的出口处、尚未施工完成的路段等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止行人通行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止行人通行1.png`,
      correctTrue: 'D',
      optionSelA: '注意儿童',
      optionSelB: '注意行人',
      optionSelC: '前方无人',
      optionSelD: '禁止行人通行',
      identifierDesc: '属于交通禁令标志，颜色为白底、有一个黑色人形、一条红色斜杠、外有红圈，无数字，形状为圆形。表示前方路段禁止行人通行。此标志设在限制行人通行的位置，表示前方路段禁止行人通行，一般设置在施工道路、专用道路等特殊路段位置，比如高速公路、铁路、飞机道等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止转弯',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止转弯或直行1.png`,
      correctTrue: 'A',
      optionSelA: '禁止左转',
      optionSelB: '按指示左转',
      optionSelC: '左侧来车',
      optionSelD: '左侧不通',
      identifierDesc: '属于交通禁令标志，颜色为白底、黑箭头、一条红色斜杠、外有红圈，形状为圆形。\n' +
        '若黑色箭头为向上直箭头，表示此处位置禁止直行，可选择左转或右转；若黑色箭头为向左或向右的弯曲箭头，表示此处位置禁止左转或右转。此标志设在限制车辆前行方向的位置。演示图标，表示此位置禁止左转，可直行或右转。',
      starTimer: '2024-02-19'
    },
    {
      name: '停车让行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\停车让行1.png`,
      correctTrue: 'B',
      optionSelA: '停车检查',
      optionSelB: '停车让行',
      optionSelC: '禁止停车',
      optionSelD: '短时停车',
      identifierDesc: '属于交通禁令标志，颜色为红底、中间有白色汉字“停”、外有白边，标牌形状为正八边形。表示机动车在此处时，需停在停车线停车观望，确认安全后方可通过。此标志一般设置在车流量过大、人流量过大、有视野盲区的路口等通行有风险的位置，比如与交通流量较大的干路相交的支路路口、无人看管的铁道路口、学校门口等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意危险',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\注意危险1.png`,
      correctTrue: 'D',
      optionSelA: '不得进入',
      optionSelB: '前方不通',
      optionSelC: '道路施工',
      optionSelD: '注意危险',
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有一个感叹号、外有黑边，标牌形状为正三角形。此标志主要用来提醒行人和车辆前方有危险，要注意安全，减少事故发生。此标志一般设置在其他警示标志不能包括的其他道路危险位置，用来提醒行人和驾驶员观察路况，谨慎通过，最常见的就是用作临时停车警告标识，当车辆半路损坏，无法行驶到安全位置时，需在车辆后方一定距离放置该标识，提醒来车注意安全。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意儿童',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\注意儿童1.png`,
      correctTrue: 'A',
      optionSelA: '注意儿童',
      optionSelB: '注意行人',
      optionSelC: '禁止儿童出入',
      optionSelD: '前方有儿童，不得通过',
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有两个儿童形状、外有黑边，标牌形状为正三角形。此标志表示前方有儿童出没，提醒司机集中注意力，减速慢行。此标志一般设置在有儿童频繁出入的场所或通道处，比如小学、幼儿园、少年宫、儿童游乐场等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '公交线路专用车道',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\公交线路专用车道1.png`,
      correctTrue: 'B',
      optionSelA: '大巴车专用车道',
      optionSelB: '公交线路专用车道',
      optionSelC: '公交停车处',
      optionSelD: '公交出入，注意安全',
      identifierDesc: '属于指示标志，颜色为蓝底、有白色客车图案、白色向下箭头、外有白边、两侧有白色虚线，标牌形状为横向长方形。此标志表示箭头所指的车道为公交车专用的车道，在规定时间内，其他车辆不得在内行驶。此标志放置在公交车道的起点及交叉入口处。',
      starTimer: '2024-02-19'
    },
    {
      name: '会车让行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\会车让行1.png`,
      correctTrue: 'A',
      optionSelA: '会车让行',
      optionSelB: '会车先行',
      optionSelC: '注意会车',
      optionSelD: '双向车道',
      identifierDesc: '属于交通禁令标志，颜色为白底、两条竖向箭头，左侧为向下粗黑箭头，右侧为向上细红箭头、外有红边，标牌形状为圆形。此标志表示该路段若遇到对面来车，本方向的车辆需要停车让对面的车辆先行通过。此标志放置在道路变窄处，比如窄桥、窄路、急转弯处等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '会车先行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\会车先行1.png`,
      correctTrue: 'B',
      optionSelA: '会车让行',
      optionSelB: '会车先行',
      optionSelC: '注意会车',
      optionSelD: '双向车道',
      identifierDesc: '属于指示标志，颜色为蓝底、两条竖向箭头，左侧为向下细红箭头，右侧为向上粗白箭头、外有白边，标牌形状为正方形。此标志表示该路段若遇到对面来车，本方向的车辆可以先行通过，无需停车等待。此标志放置在道路变窄处，比如窄桥、窄路、急转弯处等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '易滑',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\易滑1.png`,
      correctTrue: 'A',
      optionSelA: '易滑',
      optionSelB: '道路倾斜',
      optionSelC: '道路多弯',
      optionSelD: '注意刹车',
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有倾斜的车辆图案，图案车轮下有两条折线、外有黑边，标牌形状为正三角形。此标志表示该段路面比较滑，不利于行车安全，需要驾驶人注意慢行。此标志一般放置在路面摩擦系数较低、路面湿滑、结冰等路段的入口处。',
      starTimer: '2024-02-19'
    },
    {
      name: '道路变窄',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\道路变窄1.png`,
      correctTrue: 'C',
      optionSelA: '两侧道路变窄',
      optionSelB: '左侧道路变窄',
      optionSelC: '右侧道路变窄',
      optionSelD: '前方单行道',
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有两条竖向平行的黑线，有一条或两条为折线、外有黑边，标牌形状为正三角形。此标志表示前方路段宽度变窄，若两条线均为折线，则意味着前方道路两侧均变窄；若只有一条折线，另一条为直线，则折现一侧的道路即将变窄，驾驶人需要注意减速、变道，演示图标表示前方道路右侧变窄。此标志一般放置在路面宽度即将变化处，比如窄桥、变窄隧道、车道减少路段等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '交叉路口',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\交叉路口1.png`,
      correctTrue: 'D',
      optionSelA: '前方医院',
      optionSelB: '前方减速',
      optionSelC: '注意安全',
      optionSelD: '十字交叉路口',
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有两条相交黑线、外有黑边，标牌形状为正三角形。此标志表示前方有黑线形状相对应的交叉路口，种类有十字路口、“T”型路口、“Y”型路口、“X”型路口、错位路口，演示图标表示前方道路有十字路口。此标志一般放置在两条或两条道路相交处。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心火灾',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\当心火灾1.png`,
      correctTrue: 'B',
      optionSelA: '高温危险',
      optionSelB: '当心火灾',
      optionSelC: '易燃气体',
      optionSelD: '易燃易爆物品',
      identifierDesc: '此标志主要是提醒此处有易燃物质，要当心火灾，一般常见于有可燃物、助燃物的地方，如加油站、各类商场、易燃易爆物品存放处等。',
      starTimer: '2024-02-19'
    },
    {
      name: '紧急出口',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\紧急出口1.png`,
      correctTrue: 'C',
      optionSelA: '人行通道',
      optionSelB: '楼梯方向',
      optionSelC: '紧急出口',
      optionSelD: '欢迎入内',
      identifierDesc: '人员密集场所的安全出口、疏散通道中的门或疏散通道出口',
      starTimer: '2024-02-19'
    },
    {
      name: '滑动开门（左、右）',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\滑动开门1.png`,
      correctTrue: 'B',
      optionSelA: '向左开窗',
      optionSelB: '滑动开门',
      optionSelC: '向左行走',
      optionSelD: '疏散通道方向',
      identifierDesc: '安全出口或疏散通道中的滑动门',
      starTimer: '2024-02-19'
    },
    {
      name: '疏散通道方向',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\疏散通道方向1.png`,
      correctTrue: 'D',
      optionSelA: '滑动开门',
      optionSelB: '禁止向左',
      optionSelC: '向左拉开',
      optionSelD: '疏散通道方向',
      identifierDesc: '人员密集场所的疏散通道附近',
      starTimer: '2024-02-19'
    },
    {
      name: '推开、拉开',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\推开、拉开1.png`,
      correctTrue: 'B',
      optionSelA: '安全出口',
      optionSelB: '推开、拉开',
      optionSelC: '向左拉开',
      optionSelD: '疏散通道方向',
      identifierDesc: '安全出口或疏散通道中的单向门',
      starTimer: '2024-02-19'
    },
    {
      name: '地上消火栓',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\地上消火栓1.png`,
      correctTrue: 'B',
      optionSelA: '地下消火栓',
      optionSelB: '地上消火栓',
      optionSelC: '消防报警器',
      optionSelD: '垃圾桶',
      identifierDesc: '地上消火栓设施地点或附近',
      starTimer: '2024-02-19'
    },
    {
      name: '地下消火栓',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\地下消火栓1.png`,
      correctTrue: 'A',
      optionSelA: '地下消火栓',
      optionSelB: '地上消火栓',
      optionSelC: '消防报警器',
      optionSelD: '垃圾桶',
      identifierDesc: '地下消火栓设施地点或附近',
      starTimer: '2024-02-19'
    },
    {
      name: '火警电话',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\火警电话1.png`,
      correctTrue: 'D',
      optionSelA: '急救电话',
      optionSelB: '报警电话',
      optionSelC: '火警电话',
      optionSelD: '禁止拨打119',
      identifierDesc: '火警报警电话附近',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止带火种',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止带火种1.png`,
      correctTrue: 'A',
      optionSelA: '禁止带火种',
      optionSelB: '禁止明火',
      optionSelC: '禁止吸烟',
      optionSelD: '禁止阻塞',
      identifierDesc: '仓库、可燃或助燃气体储存区等需禁止携带火种入内的消防安全重点部位',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止放鞭炮',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\火警电话1.png`,
      correctTrue: 'D',
      optionSelA: '禁止明火',
      optionSelB: '禁止烟火',
      optionSelC: '禁止堆放',
      optionSelD: '禁止放鞭炮',
      identifierDesc: '库区周围100m范围内、城市居民区',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止放置易燃物',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止放置易燃物1.png`,
      correctTrue: 'C',
      optionSelA: '禁止锁闭',
      optionSelB: '禁止乱扔垃圾',
      optionSelC: '禁止放置易燃物',
      optionSelD: '禁止乱动消防器材',
      identifierDesc: '高温位置、有明火位置、通风不畅的封闭场所、人员密集的建筑物内',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止乱动消防器材',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止乱动消防器材1.png`,
      correctTrue: 'D',
      optionSelA: '禁止用水灭火',
      optionSelB: '此处没有消防器材',
      optionSelC: '禁止放置消防器材',
      optionSelD: '禁止乱动消防器材',
      identifierDesc: '消防器材设置处',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止锁闭',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止锁闭1.png`,
      correctTrue: 'C',
      optionSelA: '此处已封闭',
      optionSelB: '禁止通行',
      optionSelC: '禁止锁闭',
      optionSelD: '禁止打开',
      identifierDesc: '安全出口和疏散通道的门面上',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止吸烟',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止吸烟1.png`,
      correctTrue: 'A',
      optionSelA: '禁止吸烟',
      optionSelB: '禁止明火',
      optionSelC: '禁止烟火',
      optionSelD: '不得乱扔烟头',
      identifierDesc: '库房区、加油站、消防安全重点位置、其他禁止吸烟位置',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止烟火',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止烟火1.png`,
      correctTrue: 'D',
      optionSelA: '禁止吸烟',
      optionSelB: '禁止明火',
      optionSelC: '不得烧柴',
      optionSelD: '禁止烟火',
      identifierDesc: '库房区、加油站、消防安全重点位置、其他禁止烟火位置',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止用水灭火',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止用水灭火1.png`,
      correctTrue: 'C',
      optionSelA: '必须用水灭火',
      optionSelB: '可以用水灭火',
      optionSelC: '禁止用水灭火',
      optionSelD: '小心有水倾倒',
      identifierDesc: '油类可燃液体存放处；钾、钠、电石等遇水急剧反应的物资存放处；带电设备、精密仪器、档案、古籍等位置',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止堵塞',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止堵塞1.png`,
      correctTrue: 'A',
      optionSelA: '禁止堵塞',
      optionSelB: '禁止超重',
      optionSelC: '不得放置木箱',
      optionSelD: '禁止堆高存放',
      identifierDesc: '消防通道、疏散通道的醒目位置、消防设施设备的前方、配电箱柜的前方',
      starTimer: '2024-02-19'
    },
    {
      name: '灭火器',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\灭火器1.png`,
      correctTrue: 'A',
      optionSelA: '灭火器',
      optionSelB: '小心火灾',
      optionSelC: '高温危险',
      optionSelD: '不得使用灭火器',
      identifierDesc: '灭火器设置地点',
      starTimer: '2024-02-19'
    },
    {
      name: '消防手动启动器',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\消防手动启动器1.png`,
      correctTrue: 'C',
      optionSelA: '消防集结点',
      optionSelB: '消防紧急电话',
      optionSelC: '消防手动启动器',
      optionSelD: '消防器材存放处',
      identifierDesc: '手动火灾报警按钮、固定灭火系统手动启动器附近',
      starTimer: '2024-02-19'
    },
    {
      name: '消防水带',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\消防水带1.png`,
      correctTrue: 'B',
      optionSelA: '高温危险',
      optionSelB: '消防水带',
      optionSelC: '禁止用水灭火',
      optionSelD: '此处有消防绳索',
      identifierDesc: '消防水带设置地点或附近',
      starTimer: '2024-02-19'
    },
    {
      name: '消防梯',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\消防梯1.png`,
      correctTrue: 'A',
      optionSelA: '消防梯',
      optionSelB: '楼梯所在',
      optionSelC: '安全出口',
      optionSelD: '救援通道',
      identifierDesc: '消防梯设置地点或附近',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃固体',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\易燃固体1.png`,
      correctTrue: 'B',
      optionSelA: '易燃气体',
      optionSelB: '易燃固体',
      optionSelC: '易燃液体',
      optionSelD: '当心火灾',
      identifierDesc: '易燃固体一般为燃点低，遇火、受热、撞击、摩擦或与氧化剂接触后，极易引起剧烈燃烧、爆炸或放出有毒气体的固体物资，多为化工品，此标志一般放置于磷、镁粉等化工品的储存地点',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃气体',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\易燃气体1.png`,
      correctTrue: 'A',
      optionSelA: '易燃气体',
      optionSelB: '易燃固体',
      optionSelC: '易燃液体',
      optionSelD: '当心火灾',
      identifierDesc: '易燃气体一般指泄露时，遇明火、高温或光照，会发生燃烧或爆炸的气体，此标志一般放置于氢气、甲烷、乙烷等气体储存处',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃液体',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\易燃液体1.png`,
      correctTrue: 'C',
      optionSelA: '易燃气体',
      optionSelB: '易燃固体',
      optionSelC: '易燃液体',
      optionSelD: '当心火灾',
      identifierDesc: '易燃液体指易于挥发和燃烧的液态物资，其液体及其所挥发的可燃气体，遇火迅速燃烧，空气中的可燃气体浓度达到爆炸极限后，遇火星即发生爆炸，此标志一般放置于汽油、煤油、松节油等物资存放点',
      starTimer: '2024-02-19'
    },
    {
      name: '必须使用安全带',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须使用安全带1.png`,
      correctTrue: 'B',
      optionSelA: '必须穿工作服',
      optionSelB: '必须使用安全带',
      optionSelC: '必须佩戴安全帽',
      optionSelD: '必须穿防护鞋',
      identifierDesc: '该标志一般安装在有高空坠落风险的地方，在这些地方作业操作不当极易发生坠落，因此需要通过使用安全带来避免坠落风险。一般放置在脚手架上、吊篮上，以及其他高于地面1.5m处。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须佩戴安全帽',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须佩戴安全帽1.png`,
      correctTrue: 'C',
      optionSelA: '必须穿工作服',
      optionSelB: '必须使用安全带',
      optionSelC: '必须佩戴安全帽',
      optionSelD: '必须穿防护鞋',
      identifierDesc: '该标志一般安装在施工现场施工现场内各个作业点，提醒人员佩戴安全帽，进行头部保护。安全帽在施工现场范围内都需要佩戴，但该标志一般放置在脚手架下、物体吊运处、有上方交叉作业的地方等，进行加强提醒。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须佩戴口罩',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须佩戴口罩1.png`,
      correctTrue: 'A',
      optionSelA: '必须佩戴口罩',
      optionSelB: '必须戴防毒面具',
      optionSelC: '保护面部',
      optionSelD: '必须佩戴安全帽',
      identifierDesc: '该标志以前安装在有污染气体或粉尘严重的地方，自疫情爆发以前，按国家防疫要求，所有人群聚集处都应该佩戴口罩，施工现场人员流动性大，人数较多，所以在施工现场出入口、工作人员密集处、办公区以及空气污染处都应该放置。一般放置在施工现场出入口、电焊作业点、土方作业点、办公区等地方。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须穿防护鞋',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须穿防护鞋1.png`,
      correctTrue: 'D',
      optionSelA: '严禁入内',
      optionSelB: '注意脚部砸伤',
      optionSelC: '注意污染鞋面',
      optionSelD: '必须穿防护鞋',
      identifierDesc: '该标志属于指令性标志，一般放置于地面有坚硬物体、对脚部有化学腐蚀伤害或者其他伤害的地点，这些地点的地面上可能存在锋利物品，或地面有化学物品遗洒、排放等，易对脚步皮肤造成危害。一般放置在钢筋加工棚、钢筋绑扎地点、模板施工处、地面有电线处、浇筑混凝土的地方等。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须持证上岗',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须持证上岗1.png`,
      correctTrue: 'C',
      optionSelA: '小心高空落物',
      optionSelB: '注意脚部砸伤',
      optionSelC: '必须持证上岗',
      optionSelD: '必须穿防护鞋',
      identifierDesc: '该标志安装在特种设备所在位置，表示操作该设备有特殊技能要求，需要有相关的专业技能证书，否则很有可能因技术不达标造成事故。一般放置在塔吊、挖掘机、叉车、电焊机、吊车等设备旁。',
      starTimer: '2024-02-19'
    },
    {
      name: '严禁烟火',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\严禁烟火1.png`,
      correctTrue: 'D',
      optionSelA: '禁止吸烟',
      optionSelB: '禁止明火',
      optionSelC: '不得烧柴',
      optionSelD: '严禁烟火',
      identifierDesc: '该标志安装在易发生火灾处，这些地点一般都存放有易燃易爆物品，或者空气中可能存在易燃易爆气体。比如木制品堆放处、易燃物品存放处、油料储存处、氧气乙炔存放处、密闭空间作业处等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止翻越',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止翻越1.png`,
      correctTrue: 'A',
      optionSelA: '禁止翻越',
      optionSelB: '禁止攀爬',
      optionSelC: '小心防护',
      optionSelD: '禁止入内',
      identifierDesc: '该标志安装在有坠落风险处，这些地点使用护栏或其他临时性、警戒保护性的保护措施，将洞口、高处临边或危险品进行保护隔离。一般放置在吊篮护栏、基坑临边护栏、高处临时通道、电梯井以预留洞口护栏等',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止攀爬',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止攀爬1.png`,
      correctTrue: 'B',
      optionSelA: '禁止翻越',
      optionSelB: '禁止攀爬',
      optionSelC: '小心防护',
      optionSelD: '禁止入内',
      identifierDesc: '该标志安装在具有攀爬条件、但有坠落风险的地方，这些地方一般都存在类似于爬梯、但并不是用来攀爬的装置，强行攀爬会导致某些风险发生。比如脚手架下、各类封闭护栏、幕墙支架等。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意安全',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\注意安全1.png`,
      correctTrue: 'C',
      optionSelA: '禁止前进',
      optionSelB: '严禁停留',
      optionSelC: '注意安全',
      optionSelD: '快速通过',
      identifierDesc: '该标志安装在施工现场入口处，或者有其他伤害风险的位置，目的是警告人员附近有某种风险，需要提高注意力或进行安全防护。比如有坠落风险处、高处坠物风险处、地形变化明显位置等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心坠落',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心坠落1.png`,
      correctTrue: 'D',
      optionSelA: '小心防护',
      optionSelB: '前有坠物',
      optionSelC: '深坑危险',
      optionSelD: '当心坠落',
      identifierDesc: '该标志安装在有坠落风险的地方，这些地点地理位置特殊，或在高处，或周围存在较深坑洞、断崖等特殊地形，利用该标志提醒人员观察周围情况，提高注意力，防止意外发生。一般放置在脚手架上、预留洞口处、电梯井、基坑边、吊篮上等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心触电',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心触电1.png`,
      correctTrue: 'A',
      optionSelA: '当心触电',
      optionSelB: '雷击风险',
      optionSelC: '静电释放',
      optionSelD: '电源开关',
      identifierDesc: '该标志安装在有电流且容易被人员或机械触碰到的地方，这些地方存在的带电设备或电线一般都是放置位置存在一定的不安全因素，或者本身的外观不易让人察觉带电，一旦人、机械触碰，或使用不当，则会发生触电事故。一般放置在配电箱、地面或低空的电线、各类用电设备使用处。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心吊物',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心吊物1.png`,
      correctTrue: 'C',
      optionSelA: '当心坠落',
      optionSelB: '前有塔吊',
      optionSelC: '当心吊物',
      optionSelD: '当心堆积物坍塌',
      identifierDesc: '该标志安装在起重设备工作的地方，这些地方周围会进行高空吊运作业，高空中会不时有重物来回移动，一旦发生物体坠落，对下方的人或其他财务会存在及其严重的危害。一般放置在塔吊、吊车、龙门吊等作业地点。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心弧光',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心弧光1.png`,
      correctTrue: 'B',
      optionSelA: '光源开关',
      optionSelB: '当心弧光',
      optionSelC: '保护眼睛',
      optionSelD: '眼睛清洗处',
      identifierDesc: '该标志安装在有弧光产生的地方，最常见就是各类电焊以及切割的作业地点，这些地点的作业工序会产生强烈的弧光，若人员的眼睛没有任何的防护，会产生严重的伤害。一般放置在电焊机作业点、氧气乙炔作业点等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心坑洞',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心坑洞1.png`,
      correctTrue: 'D',
      optionSelA: '小心摔倒',
      optionSelB: '不得跨越',
      optionSelC: '不得开挖',
      optionSelD: '当心坑洞',
      identifierDesc: '该标志安装在坑洞处，这些地方的坑洞一般较大，人员不注意的话，容易跌落其中，所以用该标志来提醒人员，免于跌落等风险。一般放置在临时集水井、地下管道未封闭口等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心塌方',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心塌方1.png`,
      correctTrue: 'B',
      optionSelA: '小心落物',
      optionSelB: '当心塌方',
      optionSelC: '避免砸伤',
      optionSelD: '高空抛物',
      identifierDesc: '该标志安装在有塌落风险处，这些地方一般都有较高较陡的开挖面或材料堆积，利用该标志警示人员，远离标志所在位置。一般放置在基坑坑壁、挖方段、高堆积土方等。',
      starTimer: '2024-02-19'
    },
    {
      name: '小心高空落物',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\小心高空落物1.png`,
      correctTrue: 'B',
      optionSelA: '当心塌方',
      optionSelB: '不得停留',
      optionSelC: '高空落物',
      optionSelD: '物体打击',
      identifierDesc: '该标志安装在高处作业的下方位置，这些位置的上方一般都有高处作业或材料堆积，为防止作业工器具或材料等因各种因素坠落伤人，使用该标志警示人员，最好远离此处，或时刻注意规避风险。一般放置在脚手架下、预留洞口下、楼体外墙作业点下等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心机械伤人',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心机械伤人1.png`,
      correctTrue: 'D',
      optionSelA: '不得触摸',
      optionSelB: '设备运转',
      optionSelC: '禁止停机',
      optionSelD: '机械伤人',
      identifierDesc: '该标志安装在各种施工机械作业点，这类机械类型并不单单指大型机械，一些小中型机械同样具有伤人风险，这里说的伤人风险包括各种原因导致的风险，例如机械运行范围大、人员操作技能有要求、机械运转存在盲点位置等，使用该标志警示人员，注意周围机械运行情况，或提高注意力正确操作设备等。一般放置位置有：挖机作业点、叉车作业点、电锯旁、钢筋弯曲机旁等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止触摸',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止触摸1.png`,
      correctTrue: 'A',
      optionSelA: '禁止触摸',
      optionSelB: '有电危险',
      optionSelC: '高温危险',
      optionSelD: '不得开启',
      identifierDesc: '该标志的作用是警告人员，使其不要触摸某样物品，这样物品一般具有直接伤害性或者其他不能触摸的性质，或高温，或带电，或有毒，或物品本身不能被触摸。一般放置在带电设备、高温设备、未干的油漆等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止堆放',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止堆放1.png`,
      correctTrue: 'C',
      optionSelA: '不得放置木箱',
      optionSelB: '禁止超重',
      optionSelC: '禁止堆放',
      optionSelD: '禁止堆高存放',
      identifierDesc: '该标志的作用是告知人员某些位置不能堆放材料，这些位置虽然空间足够，但已经另作他用，或者位置本身存在某种隐患，不能称重，如果违规堆放，可能会酿成事故。一般放置位置有：施工道路汇车处、基坑顶部、脚手架上等',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止吸烟',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止吸烟1.png`,
      correctTrue: 'A',
      optionSelA: '禁止吸烟',
      optionSelB: '禁止明火',
      optionSelC: '禁止烟火',
      optionSelD: '不得乱扔烟头',
      identifierDesc: '该标志类似于严禁烟火，一般安装在易发生火灾处，这些地点一般都存放有易燃易爆物品，或者空气中可能存在易燃易爆气体。除此之外，该标志一般还安装在公共区域，作为文明标语。比如木制品堆放处、易燃易爆物品存放处、办公区等。',
      starTimer: '2024-02-19'
    },
    {
      name: '限速',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\限速1.png`,
      correctTrue: 'A',
      optionSelA: '最高限速',
      optionSelB: '最低限速',
      optionSelC: '解除限速',
      optionSelD: '限制重量',
      identifierDesc: '该标志的意义是限制车辆机械的行走速度，标牌上的数字不统一，根据不同的条件，可设置不同的数字，车辆通过该地点时的速度不能超过标牌数字，这些地点一般是因为人流较多，或路况不好，或处于多条道路交叉处。一般放置于宿舍区门口道路、道路交叉处、路况较差的地方等。',
      starTimer: '2024-02-19'
    },
    {
      name: '限高',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\限高1.png`,
      correctTrue: 'B',
      optionSelA: '限制宽度',
      optionSelB: '限制高度',
      optionSelC: '限制重量',
      optionSelD: '限制长度',
      identifierDesc: '该标志的意义是限制通过车辆或其他物品的高度，标牌上的数字不统一，根据现场的条件，可设置不同的数字，车辆或物品通过该地点时的高度不能超过标牌数字，这些地点一般是支架、模板、电线或者其他结构的下方。一般放置于涵洞口、桥梁下或横跨道路的某些结构等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止入内',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止入内1.png`,
      correctTrue: 'D',
      optionSelA: '不得开门',
      optionSelB: '不得靠近',
      optionSelC: '不得离开',
      optionSelD: '禁止入内',
      identifierDesc: '该标志的意义是警告人员不得进入某些地方，这些地方的类型不一，或是某些机密场所，或是某些中枢系统所在地，或是具有专业作用不对外的场所，一旦进入可能会造成伤害、机密外泄或者物品损坏等后果。一般放置在配电房门口、监控系统门口、物资库房等位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心车辆',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心车辆1.png`,
      correctTrue: 'C',
      optionSelA: '注意行人',
      optionSelB: '减速驾驶',
      optionSelC: '当心车辆',
      optionSelD: '小心追尾',
      identifierDesc: '该标志的意义在于提醒人员该位置有车辆来往，需要提高注意力，防止有交通事故发生，这些地方一般来往的车辆较多，或者有不明显的交叉路口，若不注意可能会发生交通事故。一般放置的地方有：基坑出口处、隧道出口处、道路交叉处、仓库出口处等。',
      starTimer: '2024-02-19'
    }
  ])
  db.markClass.bulkPut([
    {
      name: '化工类',
      imgUrl: `${installRootPath}\\video\\化工类.png`,
      enableFlag: 1,
      status: '1',
      starTimer: '2024-02-19'
    },
    {
      name: '矿业类',
      enableFlag: 1,
      status: '2',
      imgUrl: `${installRootPath}\\video\\矿业类.png`,
      starTimer: '2024-02-19'
    },
    {
      name: '交通类',
      enableFlag: 1,
      status: '1',
      imgUrl: `${installRootPath}\\video\\交通类.png`,
      starTimer: '2024-02-19'
    },
    {
      name: '施工类',
      enableFlag: 1,
      status: '2',
      imgUrl: `${installRootPath}\\video\\施工类.png`,
      starTimer: '2024-02-19'
    },
    {
      name: '消防类',
      enableFlag: 1,
      status: '1',
      imgUrl: `${installRootPath}\\video\\消防类.png`,
      starTimer: '2024-02-19'
    },
    {
      name: '电力类',
      enableFlag: 1,
      status: '1',
      imgUrl: `${installRootPath}\\video\\电力类.png`,
      starTimer: '2024-02-19'
    }
  ])
  db.markStudy.bulkPut([
    {
      name: '必须使用安全带',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\必须使用安全带1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\必须使用安全带2.png`,
      identifierDesc: '该标志一般安装在有高空坠落风险的地方，在这些地方作业操作不当极易发生坠落，因此需要通过使用安全带来避免坠落风险。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须佩戴安全帽',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\必须佩戴安全帽1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\必须佩戴安全帽2.png`,
      identifierDesc: '该标志一般安装在施工现场施工现场内各个作业点，提醒人员佩戴安全帽，进行头部保护。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止用水灭火',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止用水灭火1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\禁止用水灭火2.png`,
      identifierDesc: '该标志一般悬挂在配电室门口，因配电室内存放带电设备，配电室发生火灾后用水会进一步加剧火灾，或者造成其他损失。',
      starTimer: '2024-02-19'
    },
    {
      name: '严禁烟火',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\严禁烟火1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\严禁烟火2.png`,
      identifierDesc: '该标志安装在配电室等易发生火灾处，这些地点一般都存放有电气设备，告诫工作人员在此区域不得使用烟火，防止安全事故的发生。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止翻越',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止翻越1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\禁止翻越2.png`,
      identifierDesc: '该标志安装在有安全风险处，这些地点使用护栏或其他临时性、警戒保护性的保护措施，将危险区域进行保护隔离。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止攀爬',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止攀爬1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\禁止攀爬2.png`,
      identifierDesc: '该标志安装在带电设备的梯子上，例如架空电力线路杆塔的爬梯和配电变压器的杆架和台架上，告诫人们设备带电不得攀登和进入。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意安全',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\注意安全1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\注意安全2.png`,
      identifierDesc: '该标志安装在有伤害风险的位置，目的是警告人员附近有某种风险，需要提高注意力或进行安全防护。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心坠落',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\当心坠落1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\当心坠落2.png`,
      identifierDesc: '该标志安装在有坠落风险的地方，这些地点地理位置特殊，利用该标志提醒人员观察周围情况，提高注意力，防止意外发生。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心触电',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\当心触电1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\当心触电2.png`,
      identifierDesc: '该标志安装在有电流且容易被人员或机械触碰到的地方，这些地方存在的带电设备或电线一般都是放置位置存在一定的不安全因素，或者本身的外观不易让人察觉带电，一旦人、机械触碰，或使用不当，则会发生触电事故。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心吊物',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\当心吊物1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\当心吊物2.png`,
      identifierDesc: '该标志安装在起重设备工作的地方，这些地方周围会进行高空吊运作业，高空中会不时有重物来回移动，一旦发生物体坠落，对下方的人或其他财务会存在及其严重的危害。',
      starTimer: '2024-02-19'
    },
    {
      name: '小心高空落物',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\小心高空落物1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\小心高空落物2.png`,
      identifierDesc: '该标志安装在高处作业的下方位置，这些位置的上方一般都有高处作业或材料堆积，为防止作业工器具或材料等因各种因素坠落伤人，使用该标志警示人员，最好远离此处，或时刻注意规避风险。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止触摸',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止触摸1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\禁止触摸2.png`,
      identifierDesc: '该标志的作用是警告人员，使其不要触摸某样物品，这样物品一般具有直接伤害性或者其他不能触摸的性质，或高温，或带电，或物品本身不能被触摸。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止堆放',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止堆放1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\禁止堆放2.png`,
      identifierDesc: '该标志的作用是告知人员某些位置不能堆放材料，这些位置虽然空间足够，但已经另作他用，或者位置本身存在某种隐患，如果违规堆放，可能会酿成事故。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止吸烟',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止吸烟1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\禁止吸烟2.png`,
      identifierDesc: '该标志安装在配电室等易发生火灾处，这些地点一般都存放有电气设备，告诫工作人员在此区域禁止吸烟，防止安全事故的发生。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止入内',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止入内1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\禁止入内2.png`,
      identifierDesc: '该标志的意义是警告人员不得进入某些地方，这些地方的类型不一，但都是具有专业作用不对外的场所，一旦进入可能会造成伤害或者物品损坏等后果。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止合闸,线路有人工作',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\禁止合闸,线路有人工作1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\禁止合闸,线路有人工作2.png`,
      identifierDesc: '该标志应悬挂在已停电检修（施工）的电力线路的断路器和隔离开关的操作把手上，为防止误操作而造成检修人员伤害。',
      starTimer: '2024-02-19'
    },
    {
      name: '佩戴防护手套',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\佩戴防护手套1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\佩戴防护手套2.png`,
      identifierDesc: '该标志的意义是提醒作业人员在进行带电作业或更换保险器等危险作业时，应佩戴防护手套，一般安装在易伤害手部的作业场所，',
      starTimer: '2024-02-19'
    },
    {
      name: '有电危险',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\有电危险1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\有电危险2.png`,
      identifierDesc: '该标志安装在临时电源配电箱上或作业现场可能发生触电的危险地点，用来防止生产现场人身触电事故的发生。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意通风',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\注意通风1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\注意通风2.png`,
      identifierDesc: '该标志安装在密闭工作场所入口，例如电缆井入口，为防止在作业现场发生缺氧、中毒等意外事故。',
      starTimer: '2024-02-19'
    },
    {
      name: '已接地',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\已接地1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\已接地2.png`,
      identifierDesc: '该标志安装在已经接地，但是看不到接地线的设备旁，提醒作业人员此设备已接地线。',
      starTimer: '2024-02-19'
    },
    {
      name: '从此上下',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\从此上下1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\从此上下2.png`,
      identifierDesc: '该标志应悬挂在现场工作人员可以上下的爬梯上。如变电所某条母线检修时，通常在通往该条母线的铁架上悬挂“从此上下”标志牌。',
      starTimer: '2024-02-19'
    },
    {
      name: '在此工作',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\在此工作1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\在此工作2.png`,
      identifierDesc: '该标志应悬挂在设备检修或施工的工作地点附近，悬挂“在此工作”标志牌的数量应在工作票中填写，同时工作许可人应向工作负责人交代清楚。',
      starTimer: '2024-02-19'
    },
    {
      name: '从此进出',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\从此进出1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\从此进出2.png`,
      identifierDesc: '该标志应悬挂在室外工作地点围栏的出入口，提醒现场工作人员从此进入作业现场。',
      starTimer: '2024-02-19'
    },
    {
      name: '配电重地闲人莫进',
      className: '电力类',
      identifierUrl: `${installRootPath}\\video\\电力\\配电重地闲人莫进1.png`,
      identifierPic: `${installRootPath}\\video\\电力\\配电重地闲人莫进2.png`,
      identifierDesc: '该标志悬挂在配电房门口挂上此警示牌，用来提醒人们注意安全。让闲杂人等不要随便进入，以免影响电力的正常使用，或者给他人的生命安全造成危害。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止吸烟',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止吸烟1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\禁止吸烟2.png`,
      identifierDesc: '此标志放置于可燃易燃物品存放处，防止有明火引发火灾或爆炸等后果，一般放置于库房区、加油站、消防安全重点位置、其他禁止吸烟位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止烟火',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止烟火1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\禁止烟火2.png`,
      identifierDesc: '此标志放置于可燃易燃物品存放处，防止有明火引发火灾或爆炸等后果，一般放置于库房区、加油站、消防安全重点位置、其他禁止烟火位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止带火种',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止带火种1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\禁止带火种2.png`,
      identifierDesc: '此标志放置于可燃易燃物品存放处，防止有明火引发火灾或爆炸等后果，一般放置于库房区、加油站、消防安全重点位置、其他禁止烟火位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止用水灭火',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止用水灭火1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\禁止用水灭火2.png`,
      identifierDesc: '此标志一般放置于遇水损坏、产生化学反应或加剧火灾后果的物质存放处，比如：油类可燃液体存放处；钾、钠、电石等遇水急剧反应的物资存放处；带电设备、精密仪器、档案、古籍等位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止穿化纤服装',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\禁止穿化纤服装1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\禁止穿化纤服装2.png`,
      identifierDesc: '禁止穿化纤服装用在在易燃易爆场所。一般指进行生产、使用、储存、保管等在一定条件下能引起燃烧、爆炸，导致人身伤亡和财产损失等事故的场所。主要场所有：加油站、油库、煤气站、油漆库房、烟花车间和库房、炸药仓库、煤矿坑道、煤炭堆放区域、易燃粉尘的区域、化学品仓库、燃料仓库等。',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃固体',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\易燃固体1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\易燃固体2.png`,
      identifierDesc: '易燃固体一般为燃点低，遇火、受热、撞击、摩擦或与氧化剂接触后，极易引起剧烈燃烧、爆炸或放出有毒气体的固体物资，多为化工品，此标志一般放置于磷、镁粉等化工品的储存地点。',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃气体',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\易燃气体1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\易燃气体2.png`,
      identifierDesc: '易燃气体一般指泄露时，遇明火、高温或光照，会发生燃烧或爆炸的气体，此标志一般放置于氢气、甲烷、乙烷等气体储存处。',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃液体',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\易燃液体1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\易燃液体2.png`,
      identifierDesc: '易燃液体指易于挥发和燃烧的液态物资，其液体及其所挥发的可燃气体，遇火迅速燃烧，空气中的可燃气体浓度达到爆炸极限后，遇火星即发生爆炸，此标志一般放置于汽油、煤油、松节油等物资存放点。',
      starTimer: '2024-02-19'
    },
    {
      name: '不燃气体',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\不燃气体1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\不燃气体2.png`,
      identifierDesc: '不燃气体系指无毒、不燃气体、包括助燃气体。但高浓度时，有窒息作用。助燃气体有强烈的氧化作用，遇油脂能发生燃烧或爆炸。此标志放置于不燃气体储存处，一般包括氮气、氙气、氦气、氖气、氩气，以及助燃气体氧气、压缩空气等。',
      starTimer: '2024-02-19'
    },
    {
      name: '自燃物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\自燃物品1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\自燃物品2.png`,
      identifierDesc: '自燃物品是在常温下可燃物质将缓慢地氧化，但在某些条件的作用下，则可加速氧化达到燃点温度而燃烧的自然物品。其中有些化学物品的自燃应特别引起注意。①遇空气能自燃的物质，如黄磷、磷化氢、铝粉等。②与水作用能自燃的物质，如钾、钠、钙、电石等。③相互混合或接触能自燃的物质：有的气体、液体、固体的强氧化剂，如氧、氯、溴、浓硝酸、氯酸钾、硝酸钾、漂白粉等与可燃物质接触或混合，都有引起自燃的可能性，有时还以爆炸的形式出现。',
      starTimer: '2024-02-19'
    },
    {
      name: '遇湿易燃物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\遇湿易燃物品1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\遇湿易燃物品2.png`,
      identifierDesc: '易燃气体一般指泄露时，遇明火、高温或光照，会发生燃烧或爆炸的气体，此标志一般放置于氢气、甲烷、乙烷等气体储存处。',
      starTimer: '2024-02-19'
    },
    {
      name: '爆炸品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\爆炸品1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\爆炸品2.png`,
      identifierDesc: '该标志表示包装内有爆炸品，收到高热、摩擦、冲击或其他物质接触后，即发生剧烈反应，产生大量的气体和热量，从而引起爆炸。例如炸药、雷管、导火线、三硝基甲苯等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心中毒',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\当心中毒1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\当心中毒2.png`,
      identifierDesc: '该标志属于警告标志，主要用于提醒人员该环境存在中毒风险，说明该环境空间可能存在有毒物品储存处、有毒物品处理、化工品生产以及生产废物的排放。目的是让人员提高警惕，注意个人防护，无必要不长久停留。',
      starTimer: '2024-02-19'
    },
    {
      name: '氧化剂',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\氧化剂1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\氧化剂2.png`,
      identifierDesc: '氧化剂是在氧化还原反应中，获得电子的物质。氧化剂具有氧化性，得到电子化合价降低，发生还原反应，得到还原产物。常见的氧化剂有氧气、氯气、高锰酸钾、硝酸、过氧化氢等。',
      starTimer: '2024-02-19'
    },
    {
      name: '有机过氧化物',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\有机过氧化物1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\有机过氧化物2.png`,
      identifierDesc: '过氧化氢中的氢原子被烷基、酰基、芳香基等有机基团置换而形成的含有-O-O-过氧官能团的有机化合物为有机过氧化物。特征是受热超过一定温度后，会分解产生含氧自由基，不稳定、易分解。对皮肤、眼睛、粘膜有强烈的刺激性，是大气中的重要污染物。此类物质属于易燃易爆危险品，使用中应注意安全性。',
      starTimer: '2024-02-19'
    },
    {
      name: '化学品储存处',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\化学品储存处1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\化学品储存处2.png`,
      identifierDesc: '该标志属于警告标志，表示标志的所在地为化学品的储存地点，可能是化学品仓库、临时储存点或者其他存放有大量化学品的建筑。目的是提醒人员注意安全，不要进行可能导致化学品损坏、泄露、爆炸或者其他意外情况的行为。',
      starTimer: '2024-02-19'
    },
    {
      name: '一级放射性物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\一级放射性物品1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\一级放射性物品2.png`,
      identifierDesc: '放射性物品是指含有放射性核素，并且其活度和比活度均高于国家规定的豁免值的物品。人和动物如果受到这些射线的过量照射，会引发放射性疾病，严重的甚至死亡。一级放射性物品指I类放射源、高水平放射性废物、乏燃料等释放到环境后对人体健康和环境产生重大辐射影响的放射性物品。',
      starTimer: '2024-02-19'
    },
    {
      name: '二级放射性物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\二级放射性物品1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\二级放射性物品2.png`,
      identifierDesc: '放射性物品是指含有放射性核素，并且其活度和比活度均高于国家规定的豁免值的物品。人和动物如果受到这些射线的过量照射，会引发放射性疾病，严重的甚至死亡。二级放射性物品指Ⅱ类和Ⅲ类放射源、中等水平放射性废物等释放到环境后对人体健康和环境产生一般辐射影响的放射性物品。',
      starTimer: '2024-02-19'
    },
    {
      name: '三级放射性物品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\三级放射性物品1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\三级放射性物品2.png`,
      identifierDesc: '放射性物品是指含有放射性核素，并且其活度和比活度均高于国家规定的豁免值的物品。人和动物如果受到这些射线的过量照射，会引发放射性疾病，严重的甚至死亡。三级放射性物品指Ⅳ类和V类放射源、低水平放射性废物、放射性药品等释放到环境后对人体健康和环境产生较小辐射影响的放射性物品。',
      starTimer: '2024-02-19'
    },
    {
      name: '腐蚀品',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\腐蚀品1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\腐蚀品2.png`,
      identifierDesc: '腐蚀品是指能灼伤人体组织，并对金属等物品造成损坏的固体或液体。与皮肤接触，在4小时内出现可见坏死现象，或温度在55℃时，对20号钢的表面均匀年腐蚀率超过6.25mm/年的固体或液体。腐蚀品对人体有一定危害，可通过皮肤接触使人体形成化学灼伤。腐蚀品有些本身能着火，有的本身并不着火，但与其他可燃物品接触后能着火。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须穿防护服',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\必须穿防护服1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\必须穿防护服2.png`,
      identifierDesc: '该标志属于指令性标志，一般放置于需要进行全身防护的作业地点或环境，提示该地点周围可能存在病毒感染、化学品感染、空气污染侵害、细微飞溅物伤害等。也会放置于无菌工作环境，为了隔绝人员体表可能携带的微生物以及细菌，保证环境的无菌要求。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须戴防毒面具',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\必须戴防毒面具1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\必须戴防毒面具2.png`,
      identifierDesc: '该标志属于指令性标志，一般放置于周围环境有有毒有害气体、不燃气体、或者超标烟尘的位置，例如特殊气体储存间、化学反应会产生特殊气体的位置、空气烟尘含量超标的位置，佩戴规定的防毒面具，可放置气体中毒、窒息、尘肺等危害。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须带防护手套',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\必须带防护手套1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\必须带防护手套2.png`,
      identifierDesc: '该标志属于指令性标志，一般放置于对手部有伤害风险的位置，例如高温、低温、腐蚀、不宜清洁的物品或包装处，不佩戴规定的防护手套会导致高温烫伤、低温冻伤、化学腐蚀或者皮肤污染等后果。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须穿防护鞋',
      className: '化工类',
      identifierUrl: `${installRootPath}\\video\\化工\\必须穿防护鞋1.png`,
      identifierPic: `${installRootPath}\\video\\化工\\必须穿防护鞋2.png`,
      identifierDesc: '该标志属于指令性标志，一般放置于地面有坚硬物体、对脚部有化学腐蚀伤害或者其他伤害的地点，这些地点的地面上可能存在锋利物品，或地面有化学物品遗洒、排放等，易对脚步皮肤造成危害。',
      starTimer: '2024-02-19'
    },
    {
      name: '最高限速',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\最高限速1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\最高限速2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字、外有红圈，形状为圆形。表示机动车驶入前方道路的最高时速限制。此标志设在需要限制车辆速度的路段的起点演示图标，表示前方路段最高时速不得超过40公里每小时，超出限制会受到处罚。',
      starTimer: '2024-02-19'
    },
    {
      name: '最低限速',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\最低限速1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\最低限速2.png`,
      identifierDesc: '属于交通禁令标志，颜色为蓝底、白数字，形状为圆形。表示机动车驶入前方道路的最低时速限制。此标志设在高速公路或其他道路限速路段的起点及各立交入口后的适当位置。演示图标，表示此路段的最低限速为50公里每小时，车速过慢会有追尾危险。',
      starTimer: '2024-02-19'
    },
    {
      name: '解除限速',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\解除限速1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\解除限速2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字、黑细斜杠、黑圈，形状为圆形。此标志属于交通标志中的禁令标志，表示限制速度路段结束。此标志设在限制车辆速度路段的终点。演示图标，表示前方路段解除最高限速40公里每小时的规定，可以将车速升至40以上。',
      starTimer: '2024-02-19'
    },
    {
      name: '限制高度',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\限制高度1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\限制高度2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字（带m）、外有红圈、上下有黑色三角，形状为圆形。表示机动车驶入前方道路的最高高度限制。此标志设在需要限制车辆高度的路段的起点，一般表示前方有高度限制物，比如高架桥、涵洞等等。演示图标，表示此路段最高高度不得超过4.5米，超高就无法通过。',
      starTimer: '2024-02-19'
    },
    {
      name: '限制宽度',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\限制宽度1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\限制宽度2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字（带m）、外有红圈、左右有黑色三角，形状为圆形。表示机动车驶入前方道路的最大宽度限制。此标志设在需要限制车辆宽度的路段的起点，一般表示前方有宽度限制物，比如窄桥、涵洞等等。演示图标，表示此路段最大宽度不得超过3米，超宽就无法通过。',
      starTimer: '2024-02-19'
    },
    {
      name: '限制重量',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\限制重量1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\限制重量2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、黑数字（带t）、外有红圈，形状为圆形。表示机动车驶入前方道路的最大重量限制。此标志设在需要限制车辆重量的路段的起点，一般表示前方有重量限制物，比如软基路段、桥梁等等。演示图标，表示此路段最大重量不得超过5吨，超重通过会对道路产生损伤，甚至发生危险。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止鸣笛',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止鸣笛1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\禁止鸣笛2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、黑色喇叭、红色斜杠、外有红圈，形状为圆形。表示机动车驶入前方道路后，不得使用喇叭。此标志设在需要限制噪声的路段的起点，表示前方为噪声限制区域，不得鸣笛，比如医院、学校、居民区等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止长时间停车',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止长时间停车1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\禁止长时间停车2.png`,
      identifierDesc: '属于交通禁令标志，颜色为蓝底、一条红色斜杠、外有红圈，无图案和数字，形状为圆形。表示此处道路不得长时间停放机动车辆。此标志设在限制停车的地点，表示此处为停车限制区域，不得长时间停放车辆，否则会影响交通，受到处罚，但允许短时间停放，比如车流量较大的医院出入口、学校门口等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止临时或长时停车',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止临时或长时停车1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\禁止临时或长时停车2.png`,
      identifierDesc: '属于交通禁令标志，颜色为蓝底、两条呈X形交叉的红色斜杠、外有红圈，无图案和数字，形状为圆形。表示此处道路不得停放机动车辆。此标志设在限制停车的地点，表示此处为停车限制区域，无论长时间还是短时间停放都不允许，否则会影响交通，受到处罚，比如车流量较大的主干道旁、上下坡道上等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止超车',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止超车1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\禁止超车2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、有两个黑色箭头图案，一条短而直，一条长而折、一条红色斜杠、外有红圈，无图案和数字，形状为圆形。表示前方道路不得超车。此标志设在限制超车的地点，表示前方道路不得进行超车，一般设置在狭窄、光线较暗等特殊路段的入口，比如匝道、隧道、道路变窄处等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '解除禁止超车',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\解除禁止超车1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\解除禁止超车2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、有两个黑色箭头图案，一条短而直，一条长而折、五条黑细斜杠、外有黑圈，无图案和数字，形状为圆形。表示限制超车路段结束。此标志设在限制超车管制路段的结束点，表示前方道路解除禁止超车的限制，可以进项正常的超车驾驶，一般设置在狭窄、光线较暗等特殊路段的出口，比如匝道出口、隧道出口等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止掉头',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止掉头1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\禁止掉头2.png`,
      identifierDesc: '属于交通禁令标志，颜色为全红底，中间有一道白色横线，无图案和数字，形状为圆形。表示前方路段禁止一切车辆驶入。此标志设在禁止车辆进入的路段入口，表示前方路段禁止一切车辆驶入，一般设置在有特殊通行要求或者不具备通行条件的路段，比如单行路的出口处、尚未施工完成的路段等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止驶入',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止驶入1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\禁止驶入2.png`,
      identifierDesc: '属于交通禁令标志，颜色为全红底，中间有一道白色横线，无图案和数字，形状为圆形。表示前方路段禁止一切车辆驶入。此标志设在禁止车辆进入的路段入口，表示前方路段禁止一切车辆驶入，一般设置在有特殊通行要求或者不具备通行条件的路段，比如单行路的出口处、尚未施工完成的路段等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止行人通行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止行人通行1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\禁止行人通行2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、有一个黑色人形、一条红色斜杠、外有红圈，无数字，形状为圆形。表示前方路段禁止行人通行。此标志设在限制行人通行的位置，表示前方路段禁止行人通行，一般设置在施工道路、专用道路等特殊路段位置，比如高速公路、铁路、飞机道等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止转弯或直行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\禁止转弯或直行1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\禁止转弯或直行2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、黑箭头、一条红色斜杠、外有红圈，形状为圆形。\n' +
        '若黑色箭头为向上直箭头，表示此处位置禁止直行，可选择左转或右转；若黑色箭头为向左或向右的弯曲箭头，表示此处位置禁止左转或右转。此标志设在限制车辆前行方向的位置。演示图标，表示此位置禁止左转，可直行或右转。',
      starTimer: '2024-02-19'
    },
    {
      name: '停车让行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\停车让行1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\停车让行2.png`,
      identifierDesc: '属于交通禁令标志，颜色为红底、中间有白色汉字“停”、外有白边，标牌形状为正八边形。表示机动车在此处时，需停在停车线停车观望，确认安全后方可通过。此标志一般设置在车流量过大、人流量过大、有视野盲区的路口等通行有风险的位置，比如与交通流量较大的干路相交的支路路口、无人看管的铁道路口、学校门口等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意危险',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\注意危险1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\注意危险2.png`,
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有一个感叹号、外有黑边，标牌形状为正三角形。此标志主要用来提醒行人和车辆前方有危险，要注意安全，减少事故发生。此标志一般设置在其他警示标志不能包括的其他道路危险位置，用来提醒行人和驾驶员观察路况，谨慎通过，最常见的就是用作临时停车警告标识，当车辆半路损坏，无法行驶到安全位置时，需在车辆后方一定距离放置该标识，提醒来车注意安全。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意儿童',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\注意儿童1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\注意儿童2.png`,
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有两个儿童形状、外有黑边，标牌形状为正三角形。此标志表示前方有儿童出没，提醒司机集中注意力，减速慢行。此标志一般设置在有儿童频繁出入的场所或通道处，比如小学、幼儿园、少年宫、儿童游乐场等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '公交线路专用车道',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\公交线路专用车道1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\公交线路专用车道2.png`,
      identifierDesc: '属于指示标志，颜色为蓝底、有白色客车图案、白色向下箭头、外有白边、两侧有白色虚线，标牌形状为横向长方形。此标志表示箭头所指的车道为公交车专用的车道，在规定时间内，其他车辆不得在内行驶。此标志放置在公交车道的起点及交叉入口处。',
      starTimer: '2024-02-19'
    },
    {
      name: '会车让行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\会车让行1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\会车让行2.png`,
      identifierDesc: '属于交通禁令标志，颜色为白底、两条竖向箭头，左侧为向下粗黑箭头，右侧为向上细红箭头、外有红边，标牌形状为圆形。此标志表示该路段若遇到对面来车，本方向的车辆需要停车让对面的车辆先行通过。此标志放置在道路变窄处，比如窄桥、窄路、急转弯处等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '会车先行',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\会车先行1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\会车先行2.png`,
      identifierDesc: '属于指示标志，颜色为蓝底、两条竖向箭头，左侧为向下细红箭头，右侧为向上粗白箭头、外有白边，标牌形状为正方形。此标志表示该路段若遇到对面来车，本方向的车辆可以先行通过，无需停车等待。此标志放置在道路变窄处，比如窄桥、窄路、急转弯处等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '易滑',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\易滑1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\易滑2.png`,
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有倾斜的车辆图案，图案车轮下有两条折线、外有黑边，标牌形状为正三角形。此标志表示该段路面比较滑，不利于行车安全，需要驾驶人注意慢行。此标志一般放置在路面摩擦系数较低、路面湿滑、结冰等路段的入口处。',
      starTimer: '2024-02-19'
    },
    {
      name: '道路变窄',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\道路变窄1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\道路变窄2.png`,
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有两条竖向平行的黑线，有一条或两条为折线、外有黑边，标牌形状为正三角形。此标志表示前方路段宽度变窄，若两条线均为折线，则意味着前方道路两侧均变窄；若只有一条折线，另一条为直线，则折现一侧的道路即将变窄，驾驶人需要注意减速、变道，演示图标表示前方道路右侧变窄。此标志一般放置在路面宽度即将变化处，比如窄桥、变窄隧道、车道减少路段等等。',
      starTimer: '2024-02-19'
    },
    {
      name: '交叉路口',
      className: '交通类',
      identifierUrl: `${installRootPath}\\video\\交通\\交叉路口1.png`,
      identifierPic: `${installRootPath}\\video\\交通\\交叉路口2.png`,
      identifierDesc: '属于交通警告标志，颜色为黄底、中间有两条相交黑线、外有黑边，标牌形状为正三角形。此标志表示前方有黑线形状相对应的交叉路口，种类有十字路口、“T”型路口、“Y”型路口、“X”型路口、错位路口，演示图标表示前方道路有十字路口。此标志一般放置在两条或两条道路相交处。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心火灾',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\当心火灾1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\当心火灾2.png`,
      identifierDesc: '此标志主要是提醒此处有易燃物质，要当心火灾，一般常见于有可燃物、助燃物的地方，如加油站、各类商场、易燃易爆物品存放处等。',
      starTimer: '2024-02-19'
    },
    {
      name: '紧急出口',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\紧急出口1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\紧急出口2.png`,
      identifierDesc: '人员密集场所的安全出口、疏散通道中的门或疏散通道出口',
      starTimer: '2024-02-19'
    },
    {
      name: '滑动开门（左、右）',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\滑动开门1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\滑动开门2.png`,
      identifierDesc: '安全出口或疏散通道中的滑动门',
      starTimer: '2024-02-19'
    },
    {
      name: '疏散通道方向',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\疏散通道方向1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\疏散通道方向2.png`,
      identifierDesc: '人员密集场所的疏散通道附近',
      starTimer: '2024-02-19'
    },
    {
      name: '推开、拉开',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\推开、拉开1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\推开、拉开2.png`,
      identifierDesc: '安全出口或疏散通道中的单向门',
      starTimer: '2024-02-19'
    },
    {
      name: '地上消火栓',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\地上消火栓1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\地上消火栓2.png`,
      identifierDesc: '地上消火栓设施地点或附近',
      starTimer: '2024-02-19'
    },
    {
      name: '地下消火栓',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\地下消火栓1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\地下消火栓2.png`,
      identifierDesc: '地下消火栓设施地点或附近',
      starTimer: '2024-02-19'
    },
    {
      name: '火警电话',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\火警电话1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\火警电话2.png`,
      identifierDesc: '火警报警电话附近',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止带火种',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止带火种1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\禁止带火种2.png`,
      identifierDesc: '仓库、可燃或助燃气体储存区等需禁止携带火种入内的消防安全重点部位',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止放鞭炮',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\火警电话1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\火警电话2.png`,
      identifierDesc: '库区周围100m范围内、城市居民区',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止放置易燃物',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止放置易燃物1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\禁止放置易燃物2.png`,
      identifierDesc: '高温位置、有明火位置、通风不畅的封闭场所、人员密集的建筑物内',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止乱动消防器材',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止乱动消防器材1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\禁止乱动消防器材2.png`,
      identifierDesc: '消防器材设置处',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止锁闭',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止锁闭1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\禁止锁闭2.png`,
      identifierDesc: '安全出口和疏散通道的门面上',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止吸烟',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止吸烟1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\禁止吸烟2.png`,
      identifierDesc: '库房区、加油站、消防安全重点位置、其他禁止吸烟位置',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止烟火',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止烟火1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\禁止烟火2.png`,
      identifierDesc: '库房区、加油站、消防安全重点位置、其他禁止烟火位置',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止用水灭火',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止用水灭火1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\禁止用水灭火2.png`,
      identifierDesc: '油类可燃液体存放处；钾、钠、电石等遇水急剧反应的物资存放处；带电设备、精密仪器、档案、古籍等位置',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止堵塞',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\禁止堵塞1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\禁止堵塞2.png`,
      identifierDesc: '消防通道、疏散通道的醒目位置、消防设施设备的前方、配电箱柜的前方',
      starTimer: '2024-02-19'
    },
    {
      name: '灭火器',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\灭火器1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\灭火器2.png`,
      identifierDesc: '灭火器设置地点',
      starTimer: '2024-02-19'
    },
    {
      name: '消防手动启动器',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\消防手动启动器1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\消防手动启动器2.png`,
      identifierDesc: '手动火灾报警按钮、固定灭火系统手动启动器附近',
      starTimer: '2024-02-19'
    },
    {
      name: '消防水带',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\消防水带1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\消防水带2.png`,
      identifierDesc: '消防水带设置地点或附近',
      starTimer: '2024-02-19'
    },
    {
      name: '消防梯',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\消防梯1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\消防梯2.png`,
      identifierDesc: '消防梯设置地点或附近',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃固体',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\易燃固体1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\易燃固体2.png`,
      identifierDesc: '易燃固体一般为燃点低，遇火、受热、撞击、摩擦或与氧化剂接触后，极易引起剧烈燃烧、爆炸或放出有毒气体的固体物资，多为化工品，此标志一般放置于磷、镁粉等化工品的储存地点',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃气体',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\易燃气体1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\易燃气体2.png`,
      identifierDesc: '火警报警电话附近',
      starTimer: '2024-02-19'
    },
    {
      name: '易燃液体',
      className: '消防类',
      identifierUrl: `${installRootPath}\\video\\消防\\易燃液体1.png`,
      identifierPic: `${installRootPath}\\video\\消防\\易燃液体2.png`,
      identifierDesc: '易燃液体指易于挥发和燃烧的液态物资，其液体及其所挥发的可燃气体，遇火迅速燃烧，空气中的可燃气体浓度达到爆炸极限后，遇火星即发生爆炸，此标志一般放置于汽油、煤油、松节油等物资存放点',
      starTimer: '2024-02-19'
    },
    {
      name: '必须使用安全带',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须使用安全带1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\必须使用安全带2.png`,
      identifierDesc: '该标志一般安装在有高空坠落风险的地方，在这些地方作业操作不当极易发生坠落，因此需要通过使用安全带来避免坠落风险。一般放置在脚手架上、吊篮上，以及其他高于地面1.5m处。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须佩戴安全帽',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须佩戴安全帽1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\必须佩戴安全帽2.png`,
      identifierDesc: '该标志一般安装在施工现场施工现场内各个作业点，提醒人员佩戴安全帽，进行头部保护。安全帽在施工现场范围内都需要佩戴，但该标志一般放置在脚手架下、物体吊运处、有上方交叉作业的地方等，进行加强提醒。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须佩戴口罩',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须佩戴口罩1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\必须佩戴口罩2.png`,
      identifierDesc: '该标志以前安装在有污染气体或粉尘严重的地方，自疫情爆发以前，按国家防疫要求，所有人群聚集处都应该佩戴口罩，施工现场人员流动性大，人数较多，所以在施工现场出入口、工作人员密集处、办公区以及空气污染处都应该放置。一般放置在施工现场出入口、电焊作业点、土方作业点、办公区等地方。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须穿防护鞋',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须穿防护鞋1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\必须穿防护鞋2.png`,
      identifierDesc: '该标志属于指令性标志，一般放置于地面有坚硬物体、对脚部有化学腐蚀伤害或者其他伤害的地点，这些地点的地面上可能存在锋利物品，或地面有化学物品遗洒、排放等，易对脚步皮肤造成危害。一般放置在钢筋加工棚、钢筋绑扎地点、模板施工处、地面有电线处、浇筑混凝土的地方等。',
      starTimer: '2024-02-19'
    },
    {
      name: '必须持证上岗',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\必须持证上岗1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\必须持证上岗2.png`,
      identifierDesc: '该标志安装在特种设备所在位置，表示操作该设备有特殊技能要求，需要有相关的专业技能证书，否则很有可能因技术不达标造成事故。一般放置在塔吊、挖掘机、叉车、电焊机、吊车等设备旁。',
      starTimer: '2024-02-19'
    },
    {
      name: '严禁烟火',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\严禁烟火1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\严禁烟火2.png`,
      identifierDesc: '该标志安装在易发生火灾处，这些地点一般都存放有易燃易爆物品，或者空气中可能存在易燃易爆气体。比如木制品堆放处、易燃物品存放处、油料储存处、氧气乙炔存放处、密闭空间作业处等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止翻越',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止翻越1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\禁止翻越2.png`,
      identifierDesc: '该标志安装在有坠落风险处，这些地点使用护栏或其他临时性、警戒保护性的保护措施，将洞口、高处临边或危险品进行保护隔离。一般放置在吊篮护栏、基坑临边护栏、高处临时通道、电梯井以预留洞口护栏等',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止攀爬',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止攀爬1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\禁止攀爬2.png`,
      identifierDesc: '该标志安装在具有攀爬条件、但有坠落风险的地方，这些地方一般都存在类似于爬梯、但并不是用来攀爬的装置，强行攀爬会导致某些风险发生。比如脚手架下、各类封闭护栏、幕墙支架等。',
      starTimer: '2024-02-19'
    },
    {
      name: '注意安全',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\注意安全1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\注意安全2.png`,
      identifierDesc: '该标志安装在施工现场入口处，或者有其他伤害风险的位置，目的是警告人员附近有某种风险，需要提高注意力或进行安全防护。比如有坠落风险处、高处坠物风险处、地形变化明显位置等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心坠落',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心坠落1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\当心坠落2.png`,
      identifierDesc: '该标志安装在有坠落风险的地方，这些地点地理位置特殊，或在高处，或周围存在较深坑洞、断崖等特殊地形，利用该标志提醒人员观察周围情况，提高注意力，防止意外发生。一般放置在脚手架上、预留洞口处、电梯井、基坑边、吊篮上等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心触电',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心触电1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\当心触电2.png`,
      identifierDesc: '该标志安装在有电流且容易被人员或机械触碰到的地方，这些地方存在的带电设备或电线一般都是放置位置存在一定的不安全因素，或者本身的外观不易让人察觉带电，一旦人、机械触碰，或使用不当，则会发生触电事故。一般放置在配电箱、地面或低空的电线、各类用电设备使用处。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心吊物',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心吊物1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\当心吊物2.png`,
      identifierDesc: '该标志安装在起重设备工作的地方，这些地方周围会进行高空吊运作业，高空中会不时有重物来回移动，一旦发生物体坠落，对下方的人或其他财务会存在及其严重的危害。一般放置在塔吊、吊车、龙门吊等作业地点。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心弧光',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心弧光1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\当心弧光2.png`,
      identifierDesc: '该标志安装在有弧光产生的地方，最常见就是各类电焊以及切割的作业地点，这些地点的作业工序会产生强烈的弧光，若人员的眼睛没有任何的防护，会产生严重的伤害。一般放置在电焊机作业点、氧气乙炔作业点等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心坑洞',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心坑洞1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\当心坑洞2.png`,
      identifierDesc: '该标志安装在坑洞处，这些地方的坑洞一般较大，人员不注意的话，容易跌落其中，所以用该标志来提醒人员，免于跌落等风险。一般放置在临时集水井、地下管道未封闭口等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心塌方',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心塌方1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\当心塌方2.png`,
      identifierDesc: '该标志安装在有塌落风险处，这些地方一般都有较高较陡的开挖面或材料堆积，利用该标志警示人员，远离标志所在位置。一般放置在基坑坑壁、挖方段、高堆积土方等。',
      starTimer: '2024-02-19'
    },
    {
      name: '小心高空落物',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\小心高空落物1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\小心高空落物2.png`,
      identifierDesc: '该标志安装在高处作业的下方位置，这些位置的上方一般都有高处作业或材料堆积，为防止作业工器具或材料等因各种因素坠落伤人，使用该标志警示人员，最好远离此处，或时刻注意规避风险。一般放置在脚手架下、预留洞口下、楼体外墙作业点下等。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心机械伤人',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心机械伤人1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\当心机械伤人2.png`,
      identifierDesc: '该标志安装在各种施工机械作业点，这类机械类型并不单单指大型机械，一些小中型机械同样具有伤人风险，这里说的伤人风险包括各种原因导致的风险，例如机械运行范围大、人员操作技能有要求、机械运转存在盲点位置等，使用该标志警示人员，注意周围机械运行情况，或提高注意力正确操作设备等。一般放置位置有：挖机作业点、叉车作业点、电锯旁、钢筋弯曲机旁等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止触摸',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止触摸1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\禁止触摸2.png`,
      identifierDesc: '该标志的作用是警告人员，使其不要触摸某样物品，这样物品一般具有直接伤害性或者其他不能触摸的性质，或高温，或带电，或有毒，或物品本身不能被触摸。一般放置在带电设备、高温设备、未干的油漆等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止堆放',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止堆放1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\禁止堆放2.png`,
      identifierDesc: '该标志的作用是告知人员某些位置不能堆放材料，这些位置虽然空间足够，但已经另作他用，或者位置本身存在某种隐患，不能称重，如果违规堆放，可能会酿成事故。一般放置位置有：施工道路汇车处、基坑顶部、脚手架上等',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止吸烟',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止吸烟1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\禁止吸烟2.png`,
      identifierDesc: '该标志类似于严禁烟火，一般安装在易发生火灾处，这些地点一般都存放有易燃易爆物品，或者空气中可能存在易燃易爆气体。除此之外，该标志一般还安装在公共区域，作为文明标语。比如木制品堆放处、易燃易爆物品存放处、办公区等。',
      starTimer: '2024-02-19'
    },
    {
      name: '限速',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\限速1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\限速2.png`,
      identifierDesc: '该标志的意义是限制车辆机械的行走速度，标牌上的数字不统一，根据不同的条件，可设置不同的数字，车辆通过该地点时的速度不能超过标牌数字，这些地点一般是因为人流较多，或路况不好，或处于多条道路交叉处。一般放置于宿舍区门口道路、道路交叉处、路况较差的地方等。',
      starTimer: '2024-02-19'
    },
    {
      name: '限高',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\限高1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\限高2.png`,
      identifierDesc: '该标志的意义是限制通过车辆或其他物品的高度，标牌上的数字不统一，根据现场的条件，可设置不同的数字，车辆或物品通过该地点时的高度不能超过标牌数字，这些地点一般是支架、模板、电线或者其他结构的下方。一般放置于涵洞口、桥梁下或横跨道路的某些结构等。',
      starTimer: '2024-02-19'
    },
    {
      name: '禁止入内',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\禁止入内1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\禁止入内2.png`,
      identifierDesc: '该标志的意义是警告人员不得进入某些地方，这些地方的类型不一，或是某些机密场所，或是某些中枢系统所在地，或是具有专业作用不对外的场所，一旦进入可能会造成伤害、机密外泄或者物品损坏等后果。一般放置在配电房门口、监控系统门口、物资库房等位置。',
      starTimer: '2024-02-19'
    },
    {
      name: '当心车辆',
      className: '施工类',
      identifierUrl: `${installRootPath}\\video\\施工\\当心车辆1.png`,
      identifierPic: `${installRootPath}\\video\\施工\\当心车辆2.png`,
      identifierDesc: '该标志的意义在于提醒人员该位置有车辆来往，需要提高注意力，防止有交通事故发生，这些地方一般来往的车辆较多，或者有不明显的交叉路口，若不注意可能会发生交通事故。一般放置的地方有：基坑出口处、隧道出口处、道路交叉处、仓库出口处等。',
      starTimer: '2024-02-19'
    }
  ])
  db.psd.add(
    { password: '123456' }
  )
})
