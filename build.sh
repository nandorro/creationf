#!/usr/bin/env bash
# Regenera iconos, compila el APK y lo copia junto a la web (docs/creationf.apk). Uso: ./build.sh
set -euo pipefail
cd "$(dirname "$0")"
export JAVA_HOME="C:/Users/ashok/android-toolchain/jdk-17.0.21+9" ANDROID_HOME="C:/Users/ashok/android-toolchain/sdk"
node tools/gen.js
(cd android && ./gradlew.bat assembleDebug --no-daemon > /tmp/cf-build.log 2>&1) || { tail -30 /tmp/cf-build.log; exit 1; }
grep -q "BUILD SUCCESSFUL" /tmp/cf-build.log
cp android/app/build/outputs/apk/debug/app-debug.apk docs/creationf.apk
cp docs/creationf.apk creationf.apk
echo "OK: docs/creationf.apk"
