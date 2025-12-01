@echo off
chcp 65001 >nul
echo ========================================
echo React Native 环境检查工具
echo ========================================
echo.

set ERRORS=0

:: 检查 Node.js
echo [1/5] 检查 Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo    ❌ 未找到 Node.js
    echo    请安装 Node.js: https://nodejs.org/
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo    ✓ Node.js 已安装: %NODE_VERSION%
)
echo.

:: 检查 Java
echo [2/6] 检查 Java 版本...
where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo    ❌ 未找到 Java
    echo    请安装 JDK 17+: https://adoptium.net/
    set /a ERRORS+=1
) else (
    java -version > temp_java_check.txt 2>&1
    findstr /C:"1.8" temp_java_check.txt >nul
    if %ERRORLEVEL% EQU 0 (
        echo    ❌ 检测到 Java 8 (版本过低)
        echo    React Native 0.72 需要 Java 11+ (推荐 Java 17)
        echo    请运行 check-java-version.bat 查看详细说明
        echo    或查看 UPGRADE-JAVA.md 升级指南
        set /a ERRORS+=1
    ) else (
        findstr /C:"11" temp_java_check.txt >nul
        if %ERRORLEVEL% EQU 0 (
            echo    ✓ Java 11 已安装 (符合最低要求)
        ) else (
            findstr /C:"17" temp_java_check.txt >nul
            if %ERRORLEVEL% EQU 0 (
                echo    ✓ Java 17 已安装 (推荐版本)
            ) else (
                echo    ✓ Java 已安装
                type temp_java_check.txt | findstr /C:"version"
            )
        )
    )
    del temp_java_check.txt >nul 2>&1
)
echo.

:: 检查 ANDROID_HOME
echo [3/6] 检查 ANDROID_HOME...
if "%ANDROID_HOME%"=="" (
    echo    ❌ ANDROID_HOME 环境变量未设置
    echo.
    echo    请设置 ANDROID_HOME 环境变量：
    echo    1. 打开"系统属性" → "高级" → "环境变量"
    echo    2. 在"系统变量"中新建：
    echo       变量名: ANDROID_HOME
    echo       变量值: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo    3. 如果 Android SDK 在其他位置，请使用实际路径
    echo.
    echo    或临时设置（仅当前会话有效）：
    echo    set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    echo.
    set /a ERRORS+=1
) else (
    if exist "%ANDROID_HOME%" (
        echo    ✓ ANDROID_HOME 已设置: %ANDROID_HOME%
    ) else (
        echo    ❌ ANDROID_HOME 路径不存在: %ANDROID_HOME%
        set /a ERRORS+=1
    )
)
echo.

:: 检查 adb
echo [4/6] 检查 ADB (Android Debug Bridge)...
where adb >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo    ❌ adb 命令未找到
    if "%ANDROID_HOME%"=="" (
        echo    请先设置 ANDROID_HOME 环境变量
    ) else (
        if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
            echo    ⚠  adb 存在于 %ANDROID_HOME%\platform-tools\adb.exe
            echo    但未添加到 PATH 环境变量
            echo.
            echo    请将以下路径添加到 PATH：
            echo    %ANDROID_HOME%\platform-tools
            echo.
            echo    或临时设置（仅当前会话有效）：
            echo    set PATH=%%PATH%%;%ANDROID_HOME%\platform-tools
        ) else (
            echo    请安装 Android SDK Platform Tools
            echo    或检查 ANDROID_HOME 路径是否正确
        )
    )
    set /a ERRORS+=1
) else (
    echo    ✓ adb 已找到
)
echo.

:: 检查连接的设备
echo [5/6] 检查连接的 Android 设备...
where adb >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    正在检查设备...
    adb devices > temp_devices.txt 2>&1
    findstr /C:"device" temp_devices.txt >nul
    if %ERRORLEVEL% EQU 0 (
        echo    ✓ 检测到已连接的设备：
        type temp_devices.txt | findstr /C:"device"
    ) else (
        echo    ⚠  未检测到已连接的设备
        echo.
        echo    请确保：
        echo    1. 手机已通过 USB 连接到电脑
        echo    2. USB 调试已启用（设置 → 开发者选项 → USB 调试）
        echo    3. 手机已授权此电脑进行 USB 调试（查看手机屏幕提示）
        echo.
        echo    如果设备已连接但仍未显示，尝试：
        echo    adb kill-server
        echo    adb start-server
        echo    adb devices
    )
    del temp_devices.txt >nul 2>&1
) else (
    echo    ⚠  无法检查设备（adb 未找到）
)
echo.

:: 检查 Gradle wrapper
echo [6/6] 检查 Gradle wrapper...
if exist "android\gradlew.bat" (
    echo    ✓ gradlew.bat 已存在
) else (
    echo    ⚠  gradlew.bat 未找到
    echo    请确保在项目根目录运行此脚本
)
echo.

:: 总结
echo ========================================
if %ERRORS% EQU 0 (
    echo ✓ 环境检查完成！所有必要组件都已配置。
    echo.
    echo 现在可以运行: npm run android
) else (
    echo ❌ 发现 %ERRORS% 个问题，请先解决这些问题。
    echo.
    echo 快速修复建议：
    echo 1. 安装 Android Studio（最简单的方法）
    echo    https://developer.android.com/studio
    echo.
    echo 2. 手动配置环境变量：
    echo    - 设置 ANDROID_HOME（通常为 C:\Users\%USERNAME%\AppData\Local\Android\Sdk）
    echo    - 将 %%ANDROID_HOME%%\platform-tools 添加到 PATH
    echo    - 将 %%ANDROID_HOME%%\tools 添加到 PATH
    echo    - 将 %%ANDROID_HOME%%\tools\bin 添加到 PATH
    echo.
    echo 3. 重启命令提示符或电脑使环境变量生效
)
echo ========================================
echo.
pause

