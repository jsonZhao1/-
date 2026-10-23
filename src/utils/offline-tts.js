// Shared by Electron and the Linux package smoke check. No network or shell.
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawn } = require('child_process')

function createOfflineTts(root) {
  let active = null
  // Keep only the latest result; changing the text always synthesizes new audio.
  let cached = null
  const stop = () => {
    if (active) active.cancel()
  }
  const synthesize = async sourceText => {
    const text = typeof sourceText === 'string' ? sourceText.trim() : ''
    if (!text || text.length > 2000 || text.includes('\0')) {
      throw new Error('朗读内容为空或超过2000字，请缩短后重试')
    }
    stop()
    if (cached && cached.text === text) return cached.audio
    const executable = path.join(root, 'runtime/bin/sherpa-onnx-offline-tts')
    if (!fs.existsSync(executable) || !fs.existsSync(path.join(root, 'model/model.int8.onnx'))) {
      throw new Error('离线语音文件缺失，请重新安装完整的4.4.1或更新版本')
    }
    // Set active synchronously so a stop immediately after invoke is not lost.
    const job = { cancelled: false, child: null, cancel() {
      this.cancelled = true
      if (this.child) this.child.kill('SIGKILL')
    } }
    active = job
    let dir
    let timer
    try {
      dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'anquan-tts-'))
      if (job.cancelled) throw new Error('朗读已取消')
      const output = path.join(dir, 'speech.wav')
      const model = path.join(root, 'model')
      const args = [
        '--kokoro-model=' + path.join(model, 'model.int8.onnx'),
        '--kokoro-voices=' + path.join(model, 'voices.bin'),
        '--kokoro-tokens=' + path.join(model, 'tokens.txt'),
        '--kokoro-data-dir=' + path.join(model, 'espeak-ng-data'),
        '--kokoro-dict-dir=' + path.join(model, 'dict'),
        '--kokoro-lexicon=' + ['lexicon-us-en.txt', 'lexicon-zh.txt'].map(f => path.join(model, f)).join(','),
        '--tts-rule-fsts=' + ['date-zh.fst', 'phone-zh.fst', 'number-zh.fst'].map(f => path.join(model, f)).join(','),
        '--num-threads=2', '--sid=3', '--speed=1', '--debug=0',
        '--output-filename=' + output,
        // Leading whitespace prevents text beginning with '-' being parsed as a flag.
        ' ' + text
      ]
      await new Promise((resolve, reject) => {
        let detail = ''
        let timedOut = false
        const child = spawn(executable, args, {
          cwd: root, windowsHide: true,
          env: { ...process.env, LD_LIBRARY_PATH: path.join(root, 'runtime/lib') },
          stdio: ['ignore', 'ignore', 'pipe']
        })
        job.child = child
        timer = setTimeout(() => {
          timedOut = true
          child.kill('SIGKILL')
        }, 180000)
        child.stderr.on('data', chunk => { detail = (detail + chunk.toString()).slice(-8192) })
        child.once('error', error => reject(new Error('离线语音引擎无法启动：' + error.message)))
        child.once('close', code => {
          if (job.cancelled) return reject(new Error('朗读已取消'))
          if (timedOut) return reject(new Error('语音生成超时，请缩短文字后重试'))
          if (code !== 0) {
            console.error('Offline TTS engine:', code, detail)
            return reject(new Error('离线语音生成失败，请提供终端日志以检查系统兼容性'))
          }
          resolve()
        })
      })
      if (job.cancelled) throw new Error('朗读已取消')
      const stat = await fs.promises.stat(output)
      if (stat.size < 44 || stat.size > 32 * 1024 * 1024) throw new Error('生成的语音文件大小异常')
      const audio = await fs.promises.readFile(output)
      if (audio.toString('ascii', 0, 4) !== 'RIFF' || audio.toString('ascii', 8, 12) !== 'WAVE') {
        throw new Error('生成的语音文件格式异常')
      }
      if (job.cancelled) throw new Error('朗读已取消')
      cached = { text, audio }
      return audio
    } finally {
      clearTimeout(timer)
      if (active === job) active = null
      if (dir) await fs.promises.rm(dir, { recursive: true, force: true }).catch(console.error)
    }
  }
  return { synthesize, stop }
}

module.exports = { createOfflineTts }
