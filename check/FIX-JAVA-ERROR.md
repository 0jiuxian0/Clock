# 修复 Java 版本错误

## 错误信息

```
No matching variant of com.android.tools.build:gradle:7.4.2 was found.
Incompatible because this component declares a component, compatible with Java 11 
and the consumer needed a component, compatible with Java 8
```

## 问题原因

您当前使用的是 **Java 8**，但：
- **Gradle 7.4.2** 需要 **Java 11 或更高版本**
- **React Native 0.72** 推荐使用 **Java 17 LTS**

## 快速解决方案

### 步骤 1: 检查当前 Java 版本

运行：
```cmd
check-java-version.bat
```

这会显示您当前的 Java 版本。

### 步骤 2: 升级到 Java 17

**推荐方式：下载并安装 JDK 17**

1. **下载 JDK 17**
   - 访问：https://adoptium.net/temurin/releases/?version=17
   - 选择 "Windows x64" → ".msi" 格式
   - 下载并安装

2. **配置环境变量**
   - 按 `Win + R`，输入 `sysdm.cpl`
   - 高级 → 环境变量
   - 系统变量中：
     - 设置 `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`
     - 在 `Path` 中添加 `%JAVA_HOME%\bin`（确保在 Java 8 路径之前）

3. **验证安装**
   ```cmd
   java -version
   ```
   应该显示 `openjdk version "17"` 或类似信息

4. **重启命令提示符**
   - 关闭所有命令提示符窗口
   - 重新打开一个新的命令提示符

### 步骤 3: 重新运行

```cmd
npm run android
```

## 详细升级指南

请查看 `UPGRADE-JAVA.md` 获取详细的升级步骤和常见问题解答。

## 如果不想升级 Java（不推荐）

理论上可以通过降级 Gradle 版本来支持 Java 8，但会带来兼容性问题，**强烈不推荐**。

如果您必须这样做，需要：

1. 降级 Gradle 版本到 7.0 或更低
2. 可能需要降级其他依赖
3. 可能无法使用 React Native 的最新特性

**建议：直接升级到 Java 17，这是最简单、最可靠的解决方案。**

## 使用 Android Studio 的 JDK

如果您已经安装了 Android Studio，可以使用它自带的 JDK：

1. 找到 Android Studio 的 JDK 路径：
   - `C:\Program Files\Android\Android Studio\jbr`
   - 或 `C:\Users\<用户名>\AppData\Local\Android\Android Studio\jbr`

2. 设置 `JAVA_HOME` 环境变量指向该目录

3. 验证：
   ```cmd
   java -version
   ```

## 验证修复

升级完成后，运行：

```cmd
check-java-version.bat
```

应该显示：
- ✓ Java 17 已安装（推荐版本）
- ✓ JAVA_HOME 已设置

然后运行：

```cmd
npm run android
```

应该可以成功构建了！

