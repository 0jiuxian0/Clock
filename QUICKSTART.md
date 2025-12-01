# 快速开始指南

## 前置要求

1. **Node.js** (版本 >= 16)
   - 下载: https://nodejs.org/

2. **Android 开发环境**
   - 方式一: 安装 Android Studio (推荐)
     - 下载: https://developer.android.com/studio
     - 安装 Android SDK、Android SDK Platform、Android Virtual Device
   
   - 方式二: 仅安装 Android SDK Command Line Tools
     - 下载: https://developer.android.com/studio#command-tools
     - 设置环境变量 `ANDROID_HOME`

3. **Java Development Kit (JDK)** 17+
   - 下载: https://adoptium.net/

## 安装步骤

### 1. 安装依赖

在项目根目录运行：

```bash
npm install
```

或使用 yarn：

```bash
yarn install
```

### 2. 准备 Android 设备或模拟器

**选项 A: 使用物理 Android 设备**
- 启用开发者选项: 设置 → 关于手机 → 连续点击"版本号"7次
- 启用 USB 调试: 设置 → 开发者选项 → USB 调试
- 用 USB 连接手机到电脑

**选项 B: 使用 Android 模拟器**
- 打开 Android Studio
- 创建并启动一个 Android 虚拟设备 (AVD)

### 3. 运行应用

#### 方法一: 使用 npm/yarn 命令（推荐）

```bash
npm run android
```

或

```bash
yarn android
```

这将会：
- 自动启动 Metro 打包器
- 构建 Android 应用
- 安装并运行到连接的设备/模拟器

#### 方法二: 分步运行

**步骤 1:** 启动 Metro 打包器（在一个终端）

```bash
npm start
```

**步骤 2:** 在另一个终端运行 Android 应用

```bash
npm run android
```

### 4. 验证安装

应用应该会：
- 全屏显示当前时间（格式: HH:MM:SS）
- 显示当前日期和星期
- 默认使用深色主题（黑色背景，白色文字）
- 点击屏幕可以切换深色/浅色主题

### 5.离线安装
生成 JS bundle 和资源
```bash
   npx react-native bundle ^
     --platform android ^
     --dev false ^
     --entry-file index.js ^
     --bundle-output android/app/src/main/assets/index.android.bundle ^
     --assets-dest android/app/src/main/res
```
重新安装 Debug APK
```bash
   cd android
   gradlew installDebug
   cd ..
```

## 常见问题

### 问题: "SDK location not found"

**解决方案:**
设置 `ANDROID_HOME` 环境变量

**Windows:**
```cmd
set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

**Mac/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
```

永久设置：将上述命令添加到你的 shell 配置文件（`.bashrc`, `.zshrc` 等）

### 问题: "adb: command not found"

**解决方案:**
将 `$ANDROID_HOME/platform-tools` 添加到 PATH 环境变量

**Windows:**
```cmd
set PATH=%PATH%;%ANDROID_HOME%\platform-tools
```

**Mac/Linux:**
```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 问题: Metro 打包器无法启动

**解决方案:**
清理缓存并重启：

```bash
npm start -- --reset-cache
```

### 问题: 应用无法安装到设备

**解决方案:**
1. 检查设备是否连接: `adb devices`
2. 确保 USB 调试已启用
3. 如果是物理设备，确认已授权 USB 调试
4. 尝试重启 adb: `adb kill-server && adb start-server`

### 问题: 构建失败

**解决方案:**
1. 清理构建缓存:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. 删除 node_modules 并重新安装:
   ```bash
   rm -rf node_modules
   npm install
   ```

## 开发提示

- **热重载**: 应用运行后，修改代码并保存，应用会自动重新加载
- **调试**: 在设备上摇一摇，会打开开发者菜单
- **查看日志**: 运行 `npx react-native log-android` 查看 Android 日志

## 下一步

- 查看 `README.md` 了解项目详细说明
- 修改 `App.tsx` 来自定义应用外观和行为
- 查看 React Native 文档: https://reactnative.dev/docs/getting-started

