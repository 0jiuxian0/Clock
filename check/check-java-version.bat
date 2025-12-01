@echo off
chcp 65001 >nul
echo ========================================
echo Java 版本检查工具
echo ========================================
echo.

where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未找到 Java
    echo.
    echo 请安装 JDK 17 或更高版本
    echo 下载地址: https://adoptium.net/
    echo.
    pause
    exit /b 1
)

echo 正在检查 Java 版本...
echo.

:: 获取 Java 版本
java -version > temp_java_version.txt 2>&1
type temp_java_version.txt

:: 检查版本号
findstr /C:"1.8" temp_java_version.txt >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ❌ 检测到 Java 8 (1.8)
    echo ========================================
    echo.
    echo 当前使用的 Java 版本过低！
    echo.
    echo Gradle 7.4.2 和 React Native 0.72 需要：
    echo   - 最低要求: Java 11
    echo   - 推荐版本: Java 17 LTS
    echo.
    echo 您需要升级到 Java 17 或更高版本。
    echo.
    echo 解决方案：
    echo 1. 下载并安装 JDK 17:
    echo    https://adoptium.net/temurin/releases/?version=17
    echo.
    echo 2. 设置 JAVA_HOME 环境变量指向新的 JDK 17 安装目录
    echo.
    echo 3. 确保 PATH 环境变量中包含 %%JAVA_HOME%%\bin
    echo.
    echo 4. 重启命令提示符后重新检查
    echo.
    del temp_java_version.txt >nul 2>&1
    pause
    exit /b 1
)

findstr /C:"11" temp_java_version.txt >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Java 11 已安装（符合最低要求）
    echo 推荐升级到 Java 17 LTS 以获得更好的兼容性
    goto :check_java_home
)

findstr /C:"17" temp_java_version.txt >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Java 17 已安装（推荐版本）
    goto :check_java_home
)

findstr /C:"18" temp_java_version.txt >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Java 18 已安装（可以使用）
    goto :check_java_home
)

findstr /C:"19" temp_java_version.txt >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Java 19 已安装（可以使用）
    goto :check_java_home
)

findstr /C:"20" temp_java_version.txt >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Java 20 已安装（可以使用）
    goto :check_java_home
)

findstr /C:"21" temp_java_version.txt >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Java 21 已安装（可以使用）
    goto :check_java_home
)

echo.
echo ⚠ 无法确定 Java 版本，但 Java 已安装
echo 请手动检查 Java 版本是否为 11 或更高

:check_java_home
echo.
echo ========================================
echo 检查 JAVA_HOME 环境变量
echo ========================================
echo.

if "%JAVA_HOME%"=="" (
    echo ⚠ JAVA_HOME 环境变量未设置
    echo.
    echo 建议设置 JAVA_HOME 环境变量：
    echo 1. 找到 Java 安装目录（例如: C:\Program Files\Java\jdk-17）
    echo 2. 设置系统环境变量 JAVA_HOME 指向该目录
    echo 3. 在 PATH 中添加 %%JAVA_HOME%%\bin
    echo.
) else (
    echo ✓ JAVA_HOME 已设置: %JAVA_HOME%
    if exist "%JAVA_HOME%\bin\java.exe" (
        echo ✓ JAVA_HOME 路径有效
    ) else (
        echo ❌ JAVA_HOME 路径无效: %JAVA_HOME%
        echo 请检查 JAVA_HOME 环境变量是否正确指向 JDK 安装目录
    )
)

echo.
del temp_java_version.txt >nul 2>&1

echo ========================================
echo 检查完成
echo ========================================
echo.
pause

