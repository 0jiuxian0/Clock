# APK 体积优化说明

## 问题原因

你发现修改 `reactNativeArchitectures=arm64-v8a` 后，APK 体积没有变化（还是 42.85MB）。

**原因：**
1. `reactNativeArchitectures` 只影响 React Native **自己编译**的原生代码
2. **不会过滤**第三方依赖库（如 `react-android`, `hermes-android`）中的原生库
3. 这些依赖库默认包含所有架构（armeabi-v7a, arm64-v8a, x86, x86_64）

## 解决方案

已在 `android/app/build.gradle` 中添加 `ndk.abiFilters`，这会**真正过滤** APK 中的所有原生库。

## 验证步骤

### 1. 清理构建缓存

```bash
cd android
gradlew clean
```

### 2. 重新构建 Release 版本

```bash
gradlew assembleRelease
```

### 3. 检查 APK 体积

```bash
# 查看 APK 文件大小
dir app\build\outputs\apk\release\app-release.apk
```

**预期结果：** 体积应该从 42.85MB 降到 **15-25MB**

### 4. 验证 APK 中的架构

如果想确认 APK 中只包含 arm64-v8a：

```bash
# 使用 aapt 工具（Android SDK 自带）
%ANDROID_HOME%\build-tools\33.0.0\aapt dump badging app\build\outputs\apk\release\app-release.apk | findstr "native-code"
```

应该只显示 `arm64-v8a`，不再有 `armeabi-v7a`, `x86`, `x86_64`。

## 配置说明

### `gradle.properties` 中的配置
```properties
reactNativeArchitectures=arm64-v8a
```
- 作用：告诉 React Native 只编译 arm64-v8a 架构
- 不影响：第三方依赖库

### `build.gradle` 中的配置（新增）
```gradle
ndk {
    abiFilters "arm64-v8a"
}
```
- 作用：**强制过滤** APK 中的所有原生库，只保留 arm64-v8a
- 影响：**所有**原生库（包括第三方依赖）

## 如果体积仍然很大

如果清理重建后体积还是 42MB，可能的原因：

1. **构建缓存未清理干净**
   - 删除 `android/app/build` 目录
   - 删除 `android/.gradle` 目录
   - 重新构建

2. **查看 APK 内容**
   ```bash
   # 解压 APK 查看 lib 目录
   cd android\app\build\outputs\apk\release
   # 使用 7-Zip 或 WinRAR 解压 app-release.apk
   # 查看 lib/ 目录，应该只有 lib/arm64-v8a/
   ```

3. **可能 React Native 本身占用就大**
   - React Native 框架本身约 20-30MB（这是正常的）
   - 加上应用代码和资源，20-30MB 是合理的最小体积

## 进一步优化

如果还想更小，可以：

1. **启用代码混淆**（可能减小 5-10MB）
   ```gradle
   def enableProguardInReleaseBuilds = true
   ```

2. **构建 AAB 格式**（发布到 Play Store 时自动按设备架构分发）
   ```bash
   gradlew bundleRelease
   ```

## 总结

- ✅ 已添加 `ndk.abiFilters` 配置
- ✅ 需要清理缓存并重新构建
- ✅ 预期体积：15-25MB（React Native 框架本身约 20MB 是正常的）

