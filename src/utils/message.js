import { Message } from 'element-ui'

const showMessage = function(options) {
  const messageDom = document.getElementsByClassName('el-message')[0]
  if (messageDom === undefined) {
    Message(options)
  }
}
const arr = ['success', 'warning', 'info', 'error']
arr.forEach(type => {
  showMessage[type] = options => {
    const messageDom = document.getElementsByClassName('el-message')[0]
    if (messageDom === undefined) {
      Message[type](options)
    }
  }
})
export default showMessage
