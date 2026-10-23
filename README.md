# 文档

https://git.xios.club/xios/public/src/branch/master/%e5%bc%80%e5%8f%91/electron-vue/electron%e5%bf%ab%e9%80%9f%e5%bc%80%e5%a7%8b.md

## 国产 Linux 语音支持

GitHub Actions 会同时生成 AppImage 和 DEB 安装包。统信 UOS、银河麒麟等
Debian 系国产系统建议安装 DEB 包，它会自动声明 `espeak-ng` 语音引擎依赖：

```bash
sudo apt install ./安全标识_4.4.0_amd64.deb
```

如果使用 AppImage，需要先安装系统语音引擎：

```bash
sudo apt install espeak-ng
```
