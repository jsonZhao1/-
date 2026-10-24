// Exercise the production admin-window lifecycle without starting Electron.
const assert = require('assert')
const fs = require('fs')
const vm = require('vm')
const source = fs.readFileSync(require.resolve('../src/background.js'), 'utf8')
const start = source.indexOf('function createChildWindow()')
const end = source.indexOf('function createSecondaryWindow()', start)
assert(start !== -1 && end > start)

for (const [platform, mainX, mainY] of [
  ['linux', 0, 0], ['linux', 1920, 0], ['linux', -1920, 0],
  ['linux', 0, -1080], ['win32', 0, 0]
]) {
  const windows = []
  class FakeWindow {
    constructor(options) {
      this.options = options
      this.kiosk = options.kiosk
      this.fullscreen = options.fullscreen
      this.top = options.alwaysOnTop
      this.visible = false
      windows.push(this)
    }
    removeMenu() {}
    setMenuBarVisibility() {}
    loadURL() {}
    on() {}
    isDestroyed() { return false }
    getBounds() { return this.bounds }
    setBounds(bounds) { this.bounds = bounds }
    setAlwaysOnTop(value) { this.top = value }
    setKiosk(value) { this.kiosk = value }
    isKiosk() { return this.kiosk }
    setFullScreen(value) { this.fullscreen = value }
    isFullScreen() { return this.fullscreen }
    isMinimized() { return this.minimized }
    restore() { this.minimized = false }
    maximize() { this.maximized = true }
    show() { this.visible = true }
    hide() { this.visible = false }
    isVisible() { return this.visible }
    focus() { this.focused = true }
  }
  const mainWindow = new FakeWindow({})
  mainWindow.bounds = { x: mainX, y: mainY, width: 1920, height: 1080 }
  const context = vm.createContext({
    process: { platform, env: {} }, BrowserWindow: FakeWindow,
    win: mainWindow, __dirname: '/app',
    screen: {
      getPrimaryDisplay: () => ({
        bounds: { x: 0, y: 0, width: 1920, height: 1080 },
        workArea: { x: 0, y: 0, width: 1920, height: 1040 }
      }),
      getDisplayMatching: bounds => {
        assert.strictEqual(bounds, mainWindow.bounds)
        return {
          bounds: mainWindow.bounds,
          workArea: { x: mainX, y: mainY, width: 1920, height: 1040 }
        }
      }
    }
  })
  vm.runInContext('let childWindow;\n' + source.slice(start, end), context)
  context.showChildWindow()
  const admin = windows[1]
  if (platform === 'linux') {
    assert.strictEqual(admin.options.x, mainX)
    assert.strictEqual(admin.options.y, mainY)
    assert.strictEqual(admin.options.parent, mainWindow)
    assert.strictEqual(admin.options.skipTaskbar, false)
    assert.strictEqual(admin.options.frame, false)
    assert.strictEqual(admin.maximized, true)
    assert.strictEqual(admin.top, false)
    assert.strictEqual(admin.kiosk, false)
    assert.strictEqual(admin.fullscreen, false)
    // Reopening a minimized window must not reintroduce the focus lock.
    context.toggleChildWindow()
    assert.strictEqual(admin.visible, false)
    admin.minimized = true
    context.toggleChildWindow()
    assert.strictEqual(windows.length, 2)
    assert.strictEqual(admin.visible, true)
    assert.strictEqual(admin.minimized, false)
    assert.strictEqual(admin.top, false)
    assert.strictEqual(admin.kiosk, false)
    assert.strictEqual(admin.fullscreen, false)
  } else {
    assert.strictEqual(admin.top, true)
    assert.strictEqual(admin.kiosk, true)
    assert.strictEqual(admin.fullscreen, true)
    assert.strictEqual(admin.options.frame, false)
  }
  console.log(`${platform} main display (${mainX}, ${mainY}): admin creation and reopen checks passed`)
}
