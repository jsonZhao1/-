// Shared by Electron, build-time generation and the offline smoke check.
const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const { spawn } = require('child_process')
const { boostSpeech } = require('./speech-volume')

function speechKey(text) {
  return crypto.createHash('sha256').update('aishell3-v1-sid10-rate1\n' + text.trim()).digest('hex')
}
function validAudio(audio) {
  return audio.length > 44 && audio.length <= 32 * 1024 * 1024 &&
    audio.toString('ascii', 0, 4) === 'RIFF' && audio.toString('ascii', 8, 12) === 'WAVE'
}

function createOfflineTts(root, cacheDir = path.join(os.tmpdir(), 'anquan-speech-cache')) {
  const pending = new Map()
  const memory = new Map()
  let active = null
  let closed = false
  const cancelled = () => new Error('朗读已取消')
  const remember = (key, audio) => {
    audio = boostSpeech(audio)
    memory.set(key, audio)
    if (memory.size > 8) memory.delete(memory.keys().next().value)
    return audio
  }
  const readCached = async key => {
    if (memory.has(key)) return memory.get(key)
    for (const folder of [path.join(root, 'audio'), cacheDir]) {
      try {
        const file = path.join(folder, key + '.wav')
        const stat = await fs.promises.stat(file)
        if (stat.size > 32 * 1024 * 1024) continue
        const audio = await fs.promises.readFile(file)
        if (validAudio(audio)) return remember(key, audio)
      } catch (error) {
        if (error.code !== 'ENOENT') console.warn('Speech cache:', error.message)
      }
    }
    return null
  }
  const generate = async job => {
    const cached = await readCached(job.key)
    if (job.cancelled) throw cancelled()
    if (cached) return cached
    const executable = path.join(root, 'runtime/bin/sherpa-onnx-offline-tts' + (process.platform === 'win32' ? '.exe' : ''))
    const model = path.join(root, 'model')
    if (!fs.existsSync(executable) || !fs.existsSync(path.join(model, 'model.onnx'))) {
      throw new Error('离线语音文件缺失，请重新安装完整版本')
    }
    await fs.promises.mkdir(cacheDir, { recursive: true })
    const dir = await fs.promises.mkdtemp(path.join(cacheDir, '.speech-'))
    let timer
    try {
      if (job.cancelled) throw cancelled()
      const output = path.join(dir, 'speech.wav')
      const args = [
        '--vits-model=' + path.join(model, 'model.onnx'),
        '--vits-lexicon=' + path.join(model, 'lexicon.txt'),
        '--vits-tokens=' + path.join(model, 'tokens.txt'),
        '--tts-rule-fsts=' + ['phone.fst', 'date.fst', 'number.fst'].map(f => path.join(model, f)).join(','),
        '--num-threads=' + Math.min(4, os.cpus().length || 1),
        '--sid=10', '--vits-length-scale=1', '--debug=0',
        '--output-filename=' + output, ' ' + job.text
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
        timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL') }, 180000)
        child.stderr.on('data', chunk => { detail = (detail + chunk.toString()).slice(-8192) })
        child.once('error', error => reject(new Error('离线语音引擎无法启动：' + error.message)))
        child.once('close', code => {
          if (job.cancelled) return reject(cancelled())
          if (timedOut) return reject(new Error('语音生成超时，请缩短文字后重试'))
          if (code !== 0) {
            console.error('Offline TTS engine:', code, detail)
            return reject(new Error('离线语音生成失败，请检查系统兼容性'))
          }
          resolve()
        })
      })
      if (job.cancelled) throw cancelled()
      const stat = await fs.promises.stat(output)
      if (stat.size > 32 * 1024 * 1024) throw new Error('生成的语音文件过大')
      const audio = await fs.promises.readFile(output)
      if (!validAudio(audio)) throw new Error('生成的语音文件格式异常')
      await fs.promises.rename(output, path.join(cacheDir, job.key + '.wav'))
      return remember(job.key, audio)
    } finally {
      clearTimeout(timer)
      await fs.promises.rm(dir, { recursive: true, force: true }).catch(console.error)
    }
  }
  const pump = async() => {
    if (active || closed) return
    const jobs = [...pending.values()]
    const job = jobs.find(item => item.foreground) || jobs[0]
    if (!job) return
    active = job
    try {
      const audio = await generate(job)
      if (job.cancelled) throw cancelled()
      job.resolve(audio)
    } catch (error) {
      job.reject(error)
    } finally {
      if (pending.get(job.key) === job) pending.delete(job.key)
      active = null
      pump()
    }
  }
  const cancelJob = job => {
    job.cancelled = true
    if (pending.get(job.key) === job) pending.delete(job.key)
    if (job.child) job.child.kill('SIGKILL')
    job.reject(cancelled())
  }
  const request = (source, foreground) => {
    const text = typeof source === 'string' ? source.trim() : ''
    if (!text || text.length > 2000 || text.includes('\0')) {
      return Promise.reject(new Error('朗读内容为空或超过2000字，请缩短后重试'))
    }
    if (closed) return Promise.reject(cancelled())
    const key = speechKey(text)
    if (memory.has(key)) return Promise.resolve(memory.get(key))
    let job = pending.get(key)
    if (!job) {
      job = { key, text, foreground, cancelled: false }
      job.promise = new Promise((resolve, reject) => { job.resolve = resolve; job.reject = reject })
      pending.set(key, job)
    }
    if (foreground) {
      job.foreground = true
      if (active && active !== job && !active.foreground) cancelJob(active)
    }
    pump()
    return job.promise
  }
  return {
    synthesize: text => request(text, true),
    prepare: text => request(text, false),
    stop() { for (const job of pending.values()) if (job.foreground) cancelJob(job) },
    close() { closed = true; for (const job of pending.values()) cancelJob(job) }
  }
}

module.exports = { createOfflineTts, speechKey, validAudio }
