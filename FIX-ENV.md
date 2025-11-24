# 环境配置修复指南

根据您遇到的错误，这里是详细的解决方案：

## 问题 1: 'adb' 不是内部或外部命令

**原因：** Android SDK 的 platform-tools 没有添加到系统 PATH 环境变量

**解决方案：**

### 方法一：使用快速配置脚本（推荐）

1. 运行 `setup-env.bat` 脚本：
   ```cmd
   setup-env.bat
   ```
   这会自动配置当前会话的环境变量

2. 然后重新运行：
   ```cmd
   npm run android
   ```

### 方法二：手动配置（永久生效）

1. **找到 Android SDK 路径**
   - 如果安装了 Android Studio，默认路径通常是：
     `C:\Users\<你的用户名>\AppData\Local\Android\Sdk`
   - 打开 Android Studio → File → Settings → Appearance & Behavior → System Settings → Android SDK
     查看 "Android SDK Location" 的值

2. **设置环境变量**
   - 按 `Win + R`，输入 `sysdm.cpl`，回车
   - 点击"高级"标签页 → "环境变量"
   - 在"系统变量"区域：
     - **新建** `ANDROID_HOME` 变量，值为 SDK 路径（例如：`C:\Users\<用户名>\AppData\Local\Android\Sdk`）
     - **编辑** `Path` 变量，添加以下路径：
       - `%ANDROID_HOME%\platform-tools`
       - `%ANDROID_HOME%\tools`
       - `%ANDROID_HOME%\tools\bin`

3. **重启命令提示符**
   - 关闭所有命令提示符窗口
   - 重新打开一个新的命令提示符
   - 运行 `adb version` 验证是否成功

## 问题 2: 'gradlew.bat' 不是内部或外部命令

**原因：** Gradle wrapper 文件缺失

**解决方案：**

✅ **已完成！** Gradle wrapper 文件已经复制到 `android` 目录。

如果仍然报错，请确认 `android` 目录下存在以下文件：
- `android\gradlew.bat` (Windows)
- `android\gradlew` (Unix/Mac)
- `android\gradle\wrapper\gradle-wrapper.jar`
- `android\gradle\wrapper\gradle-wrapper.properties`

## 问题 3: 找不到连接的设备

**原因：** adb 无法检测到您的 Redmi K60 手机

**解决方案：**

### 步骤 1: 确认 USB 调试已启用

在手机上：
1. 设置 → 关于手机 → 连续点击"MIUI 版本"7次（开启开发者选项）
2. 设置 → 更多设置 → 开发者选项 → 开启"USB 调试"
3. 开启"USB 安装"（如果有）
4. 开启"USB 调试（安全设置）"（如果有）

### 步骤 2: 连接手机并授权

1. 用 USB 数据线连接手机到电脑
2. 在手机上选择 USB 连接模式为"文件传输"或"MTP"
3. 手机屏幕上会出现"允许 USB 调试吗？"的提示
4. **勾选"一律允许使用这台计算机进行调试"**
5. 点击"确定"

### 步骤 3: 检查设备连接

配置好 adb 后，运行：

```cmd
adb devices
```

应该看到类似这样的输出：
```
List of devices attached
xxxxxxxx        device
```

如果显示 `unauthorized`，说明手机没有授权，需要在手机上点击"允许 USB 调试"。

如果没有任何设备，尝试：

1. **重启 adb 服务：**
   ```cmd
   adb kill-server
   adb start-server
   adb devices
   ```

2. **检查 USB 驱动：**
   - 如果手机显示为"未知设备"，需要安装驱动
   - 小米手机可以使用"小米手机助手"安装驱动
   - 或下载通用 Android USB 驱动

3. **更换 USB 端口或数据线：**
   - 某些 USB 端口可能只支持充电，不支持数据传输
   - 尝试使用电脑后置 USB 端口
   - 使用原装或高质量的数据线

## 完整配置检查清单

运行以下命令检查环境：

```cmd
check-env.bat
```

这会自动检查：
- ✅ Node.js 是否安装
- ✅ Java 是否安装
- ✅ ANDROID_HOME 是否设置
- ✅ adb 命令是否可用
- ✅ 是否有设备连接

## 快速开始步骤

1. **运行环境检查：**
   ```cmd
   check-env.bat
   ```

2. **如果发现问题，运行快速配置：**
   ```cmd
   setup-env.bat
   ```
   （注意：这个脚本只对当前会话有效）

3. **验证设备连接：**
   ```cmd
   adb devices
   ```

4. **运行应用：**
   ```cmd
   npm run android
   ```

## 常见错误解决

### "SDK location not found"
设置 `ANDROID_HOME` 环境变量（见问题 1）

### "No emulators found"
这是正常的，因为您使用的是物理设备而不是模拟器。只要 `adb devices` 能检测到设备就可以。

### "Build failed"
- 确保 JDK 17+ 已安装
- 运行 `cd android && gradlew clean && cd ..`
- 确保有足够的磁盘空间

### 手机连接后显示 "unauthorized"
- 在手机上撤销 USB 调试授权
- 重新连接，重新授权
- 确保勾选"一律允许使用这台计算机进行调试"

## 需要帮助？

如果问题仍然存在，请：
1. 运行 `check-env.bat` 并查看输出
2. 运行 `adb devices` 并查看输出
3. 提供错误信息截图

