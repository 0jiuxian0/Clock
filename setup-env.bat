@echo off
chcp 65001 >nul
echo ========================================
echo React Native 环境快速配置工具
echo ========================================
echo.
echo 此脚本将帮助您配置 Android 开发环境变量
echo （仅对当前命令提示符会话有效）
echo.
echo.

:: 尝试自动检测 ANDROID_HOME
set DEFAULT_ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set CUSTOM_ANDROID_HOME=

if exist "%DEFAULT_ANDROID_HOME%" (
    echo 检测到 Android SDK 位于: %DEFAULT_ANDROID_HOME%
    echo.
    set /p USE_DEFAULT="是否使用此路径？(Y/n): "
    if /i "%USE_DEFAULT%"=="n" (
        set /p CUSTOM_ANDROID_HOME="请输入 Android SDK 路径: "
        set ANDROID_HOME=%CUSTOM_ANDROID_HOME%
    ) else (
        set ANDROID_HOME=%DEFAULT_ANDROID_HOME%
    )
) else (
    echo 未在默认位置找到 Android SDK
    echo 默认位置: %DEFAULT_ANDROID_HOME%
    echo.
    set /p CUSTOM_ANDROID_HOME="请输入 Android SDK 路径: "
    if "%CUSTOM_ANDROID_HOME%"=="" (
        echo.
        echo 错误: 未提供 Android SDK 路径
        echo 请先安装 Android Studio 或 Android SDK
        echo 下载地址: https://developer.android.com/studio
        echo.
        pause
        exit /b 1
    )
    set ANDROID_HOME=%CUSTOM_ANDROID_HOME%
)

if not exist "%ANDROID_HOME%" (
    echo.
    echo 错误: 路径不存在: %ANDROID_HOME%
    echo.
    pause
    exit /b 1
)

echo.
echo 正在配置环境变量...
echo.

:: 设置 ANDROID_HOME
set ANDROID_HOME=%ANDROID_HOME%
echo ✓ 已设置 ANDROID_HOME=%ANDROID_HOME%

:: 添加到 PATH
if exist "%ANDROID_HOME%\platform-tools" (
    set "PATH=%PATH%;%ANDROID_HOME%\platform-tools"
    echo ✓ 已添加 platform-tools 到 PATH
)

if exist "%ANDROID_HOME%\tools" (
    set "PATH=%PATH%;%ANDROID_HOME%\tools"
    echo ✓ 已添加 tools 到 PATH
)

if exist "%ANDROID_HOME%\tools\bin" (
    set "PATH=%PATH%;%ANDROID_HOME%\tools\bin"
    echo ✓ 已添加 tools\bin 到 PATH
)

echo.
echo ========================================
echo 环境变量配置完成！
echo ========================================
echo.
echo 注意：这些设置仅对当前命令提示符窗口有效。
echo 如需永久设置，请：
echo 1. 打开"系统属性" → "高级" → "环境变量"
echo 2. 添加系统变量 ANDROID_HOME = %ANDROID_HOME%
echo 3. 在 PATH 中添加：
echo    %%ANDROID_HOME%%\platform-tools
echo    %%ANDROID_HOME%%\tools
echo    %%ANDROID_HOME%%\tools\bin
echo.
echo 现在您可以运行: npm run android
echo.

:: 检查 adb
echo 正在验证配置...
where adb >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ adb 命令已可用
    echo.
    echo 正在检查连接的设备...
    adb devices
    echo.
    echo 如果看到设备列表，说明配置成功！
) else (
    echo ⚠  警告: adb 命令仍然不可用
    echo 请检查 Android SDK Platform Tools 是否已安装
)

echo.
pause

