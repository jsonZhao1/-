#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p build/tts-downloads
# Recreate only generated speech assets, preventing old Kokoro files from shipping.
rm -rf build/tts-assets
mkdir -p build/tts-assets/runtime/bin build/tts-assets/model
runtime=sherpa-onnx-v1.12.14-linux-x64-static
model=vits-icefall-zh-aishell3
curl -fL --retry 3 "https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.12.14/$runtime.tar.bz2" -o "build/tts-downloads/$runtime.tar.bz2"
curl -fL --retry 3 "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/$model.tar.bz2" -o "build/tts-downloads/$model.tar.bz2"
echo "ae9a290b153934e69fa7e6b36387b17339438b441d1d25df7ab43f2787a5f32e  build/tts-downloads/$runtime.tar.bz2" | sha256sum -c -
echo "ab468db3a3308cdd861495e0db2f25d79418a0c00639f74944c7cdf5dd8c6ec1  build/tts-downloads/$model.tar.bz2" | sha256sum -c -
tar xf "build/tts-downloads/$runtime.tar.bz2" -C build/tts-downloads
cp "build/tts-downloads/$runtime/bin/sherpa-onnx-offline-tts" build/tts-assets/runtime/bin/
if [ -d "build/tts-downloads/$runtime/lib" ]; then
  cp -a "build/tts-downloads/$runtime/lib" build/tts-assets/runtime/
fi
# The large optional rule.far and unused models/tools are deliberately excluded.
tar xf "build/tts-downloads/$model.tar.bz2" -C build/tts-assets/model --strip-components=1 \
  "$model/model.onnx" "$model/lexicon.txt" "$model/tokens.txt" \
  "$model/phone.fst" "$model/date.fst" "$model/number.fst"
chmod +x build/tts-assets/runtime/bin/sherpa-onnx-offline-tts
cp build/tts-NOTICE.txt build/tts-assets/NOTICE.txt
# Preserve upstream license text alongside the prebuilt runtime and model.
curl -fL --retry 3 https://raw.githubusercontent.com/k2-fsa/sherpa-onnx/v1.12.14/LICENSE -o build/tts-assets/runtime/LICENSE
cp build/tts-assets/runtime/LICENSE build/tts-assets/model/APACHE-2.0.txt
mkdir -p build/tts-assets/sources
curl -fL --retry 3 https://github.com/csukuangfj/espeak-ng/archive/f6fed6c58b5e0998b8e68c6610125e2d07d595a7.zip -o build/tts-assets/sources/espeak-ng.zip
echo "70cbf4050e7a014aae19140b05e57249da4720f56128459fbe3a93beaf971ae6  build/tts-assets/sources/espeak-ng.zip" | sha256sum -c -
curl -fL --retry 3 https://raw.githubusercontent.com/csukuangfj/espeak-ng/f6fed6c58b5e0998b8e68c6610125e2d07d595a7/COPYING -o build/tts-assets/sources/espeak-ng-COPYING
curl -fL --retry 3 https://github.com/k2-fsa/sherpa-onnx/archive/refs/tags/v1.12.14.tar.gz -o build/tts-assets/sources/sherpa-onnx-v1.12.14.tar.gz
node build/prepare-tts-audio.js
