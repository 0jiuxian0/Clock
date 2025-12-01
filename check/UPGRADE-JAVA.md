# Java 版本升级指南

## 问题说明

您当前使用的是 **Java 8 (1.8)**，但 React Native 0.72 和 Gradle 7.4.2 需要：

- **最低要求**: Java 11
- **推荐版本**: Java 17 LTS（长期支持版本）

## 为什么需要升级？

Gradle 7.4.2 需要 Java 11 或更高版本才能运行。错误信息显示：
```
Incompatible because this component declares a component, compatible with Java 11 
and the consumer needed a component, compatible with Java 8
```

## 升级步骤

### 方法一：下载并安装 JDK 17（推荐）

1. **下载 JDK 17**
   - 访问：https://adoptium.net/temurin/releases/?version=17
   - 选择 Windows x64 版本（.msi 安装程序）
   - 下载并运行安装程序

2. **安装时注意**
   - 勾选 "Set JAVA_HOME variable"（如果安装程序有此选项）
   - 记录安装路径（通常是 `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`）

3. **配置环境变量**

   **步骤 A: 设置 JAVA_HOME**
   - 按 `Win + R`，输入 `sysdm.cpl`，回车
   - 点击"高级"标签页 → "环境变量"
   - 在"系统变量"区域：
     - 如果已有 `JAVA_HOME`，点击"编辑"
     - 如果没有，点击"新建"
     - 变量名：`JAVA_HOME`
     - 变量值：`C:\Program Files\Eclipse Adoptium\jdk-17.x.x`（使用实际安装路径）

   **步骤 B: 更新 PATH**
   - 在"系统变量"中找到 `Path`，点击"编辑"
   - 确保包含：`%JAVA_HOME%\bin`
   - 如果没有，点击"新建"添加
   - 如果有旧的 Java 8 路径，可以删除或将其移到后面（Java 17 的路径应该优先）

4. **验证安装**
   - 关闭所有命令提示符窗口
   - 打开新的命令提示符
   - 运行：
     ```cmd
     java -version
     ```
   - 应该显示 `openjdk version "17"` 或类似信息
   - 运行：
     ```cmd
     echo %JAVA_HOME%
     ```
   - 应该显示 JDK 17 的安装路径

5. **运行项目检查脚本**
   ```cmd
   check-java-version.bat
   ```

### 方法二：使用 Android Studio 内置的 JDK

如果您已经安装了 Android Studio，可以使用它内置的 JDK：

1. **找到 Android Studio 的 JDK**
   - 通常在：`C:\Program Files\Android\Android Studio\jbr`
   - 或：`C:\Users\<用户名>\AppData\Local\Android\Android Studio\jbr`

2. **设置 JAVA_HOME**
   - 按照方法一的步骤 3 设置 `JAVA_HOME` 环境变量
   - 指向 Android Studio 的 JDK 目录

3. **验证**
   ```cmd
   java -version
   ```

### 方法三：使用 Chocolatey（如果已安装）

```cmd
choco install temurin17
```

安装后会自动配置环境变量。

## 常见问题

### Q: 我可以保留 Java 8 吗？

A: 理论上可以，但不推荐。您需要：
- 降级 Gradle 版本（可能带来其他兼容性问题）
- 或者使用不同的 Java 版本管理工具（如 jEnv）

**推荐做法**: 升级到 Java 17，因为它是最新的 LTS 版本，兼容性好且稳定。

### Q: 安装了 Java 17 后，命令仍然显示 Java 8？

A: 这通常是因为：
1. **PATH 中 Java 8 的路径在 Java 17 之前**
   - 解决：调整 PATH 中 Java 路径的顺序，确保 `%JAVA_HOME%\bin` 在前面

2. **环境变量未生效**
   - 解决：关闭所有命令提示符，重新打开
   - 或重启电脑

3. **多个 Java 版本冲突**
   - 解决：检查系统中有哪些 Java 版本，统一使用 Java 17

### Q: 如何检查系统中有哪些 Java 版本？

```cmd
where java
```

这会显示所有 Java 可执行文件的位置。确保第一个是 Java 17。

### Q: JAVA_HOME 和 PATH 有什么区别？

- **JAVA_HOME**: 指向 JDK 的根目录（例如：`C:\Program Files\Java\jdk-17`）
- **PATH**: 包含可执行文件的目录（例如：`%JAVA_HOME%\bin`）

许多构建工具（如 Gradle）会使用 `JAVA_HOME` 来查找 Java。

## 验证升级成功

运行以下命令检查：

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

## 需要帮助？

如果升级后仍有问题，请：
1. 运行 `check-java-version.bat` 并查看输出
2. 运行 `java -version` 并查看输出
3. 运行 `echo %JAVA_HOME%` 并查看输出
4. 提供错误信息截图

