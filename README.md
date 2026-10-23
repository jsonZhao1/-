# 文档

https://git.xios.club/xios/public/src/branch/master/%e5%bc%80%e5%8f%91/electron-vue/electron%e5%bf%ab%e9%80%9f%e5%bc%80%e5%a7%8b.md

## 国产 Linux 离线中文朗读（4.4.1）

Linux x86_64 安装包内置 sherpa-onnx 1.12.14 和 Kokoro v1.1 中文量化模型，
默认中文女声 zf_001。AppImage、DEB 均包含引擎、模型和字典，无需联网、
API 密钥或另行安装 espeak-ng。已有 espeak-ng 不影响使用。
文字修改后自动合成新语音；重复朗读同一内容使用内存缓存。
首次合成需要等待，界面显示生成提示；离开页面会取消任务。
单次最多2000字，生成超时180秒。模型会增加安装包大小及运行内存占用。

在使用 apt 的系统上，可安装下载的4.4.1 DEB（文件名以下载结果为准）；
离线安装时系统自身的 Electron 图形/音频依赖仍需已具备。

构建前执行 `bash build/prepare-tts.sh`，下载固定版本并验证 SHA-256。
GitHub Actions 自动准备资源，打包后在禁网的 Debian Bullseye（glibc 2.31）
容器中用实际随包文件测试中文合成、取消、缓存及文字变更，再上传安装包。
`offline-speech-sample` 产物提供测试生成的 WAV，可先试听。
仍需在目标国产系统验证声音输出、首次等待时间和具体术语读音。

第三方说明随包位于 `resources/tts/NOTICE.txt`，模型许可在 `model/LICENSE`。
