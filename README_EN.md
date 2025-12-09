# Clock - Full Screen Clock App

[English](README_EN.md) | [中文](README.md)

A full-screen real-time clock Android application developed with React Native.

## Features

- ⏰ **Real-time Clock Display** - Automatically updates every second
- 📅 **Date Display** - Shows current date and weekday
- 🌓 **Theme Toggle** - Supports dark/light theme, tap screen to switch
- 📱 **Full Screen Immersive** - Hides status bar and navigation bar for full-screen display
- 💡 **Keep Screen On** - Automatically keeps screen awake
- 🎨 **Clean Design** - Large fonts, centered layout, beautiful and readable
- 🔄 **Orientation Control** - Lock/unlock screen orientation, switch between landscape and portrait
- 🌐 **Multi-language** - Supports Chinese and English

## Tech Stack

- React Native 0.72.6
- TypeScript
- Android SDK

## Requirements

- Node.js >= 16
- React Native CLI
- Android Studio (for Android SDK and emulator) or physical Android device
- JDK 17+

## Installation and Running

### 1. Install Dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 2. Run the App

#### Run on Android device/emulator:

```bash
npm run android
```

Or

```bash
yarn android
```

#### Start Metro Bundler:

Run in another terminal:

```bash
npm start
```

Or

```bash
yarn start
```

## Usage

1. **View Time** - The app will display the current time in full screen after launch
2. **Toggle Theme** - Tap anywhere on the screen to switch between dark and light themes
3. **View Date** - The current date and weekday are displayed below the time
4. **Lock Orientation** - Tap the lock button to prevent automatic screen rotation
5. **Switch Orientation** - Tap the orientation button to manually switch between landscape and portrait
6. **Toggle Date** - Tap the date button to show/hide date information
7. **Switch Language** - Tap the language button to switch between Chinese and English

## Project Structure

```
Clock/
├── App.tsx                 # Main application component
├── index.js               # Application entry point
├── package.json           # Project dependencies configuration
├── android/               # Android native code and configuration
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/clock/
│   │   │   │   ├── MainActivity.java    # Android Activity (full screen configuration)
│   │   │   │   ├── MainApplication.java # Application class
│   │   │   │   └── orientation/
│   │   │   │       └── OrientationModule.java # Custom orientation control module
│   │   │   ├── res/
│   │   │   │   └── values/
│   │   │   │       ├── styles.xml       # Full screen theme configuration
│   │   │   │       └── strings.xml      # String resources
│   │   │   └── AndroidManifest.xml      # Android manifest file
│   │   └── build.gradle
│   └── build.gradle
└── README.md
```

## Development

### Modify Time Format

Edit the `formatTime` function in `App.tsx` to modify the time display format.

### Modify Font Size

Edit the `styles` object in `App.tsx` to adjust font sizes.

### Customize Theme Colors

Modify the `backgroundColor` and `textColor` variables in `App.tsx` to set custom colors.

## Building Release Version

### Generate APK

Clean and build Release version:

**Windows:**
```bash
cd android
gradlew clean
gradlew assembleRelease
```

**Mac/Linux:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

The generated APK file is located at: `android/app/build/outputs/apk/release/app-release.apk`

### Install Release Version

After building, you can install it to a connected device using the following command:

```bash
cd ..
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

The `-r` parameter means replace the installation if the app is already installed.

### Generate Signed APK

1. Generate a keystore (if you don't have one):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure signing: Edit `android/app/build.gradle` and add signing configuration

3. Build signed APK:

**Windows:**
```bash
cd android
gradlew clean
gradlew assembleRelease
```

**Mac/Linux:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

## Troubleshooting

### Quick Environment Check

Windows users can use the provided script to quickly check the environment:

```cmd
check-env.bat
```

This will check if all necessary components are properly configured.

### If you encounter "adb is not recognized as an internal or external command" error

**Use the quick setup script (recommended):**
```cmd
setup-env.bat
```

**Or manually configure environment variables:**
1. Find the Android SDK path (usually at `C:\Users\<Username>\AppData\Local\Android\Sdk`)
2. Set the system environment variable `ANDROID_HOME` to the SDK path
3. Add to PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
4. Restart the command prompt

For detailed instructions, see `FIX-ENV.md`

### If you encounter Java version error (Java 8 incompatibility)

**Error message example:**
```
Incompatible because this component declares a component, compatible with Java 11 
and the consumer needed a component, compatible with Java 8
```

**Reason:** Gradle 7.4.2 requires Java 11+, but you are using Java 8

**Solution:**
1. Run `check-java-version.bat` to check the current Java version
2. Upgrade to Java 17 (recommended):
   - Download: https://adoptium.net/temurin/releases/?version=17
   - Set the `JAVA_HOME` environment variable to point to the newly installed JDK 17
   - Add `%JAVA_HOME%\bin` to PATH
   - Restart the command prompt

For detailed instructions, see:
- `FIX-JAVA-ERROR.md` - Quick fix guide
- `UPGRADE-JAVA.md` - Detailed upgrade steps

### If you encounter "SDK location not found" error

Set the `ANDROID_HOME` environment variable:
- Windows: `set ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk`
- Mac/Linux: `export ANDROID_HOME=$HOME/Library/Android/sdk`

### If connected device is not found

1. **Check USB Debugging:** Ensure USB debugging is enabled on your phone
2. **Authorize Computer:** When connecting the phone, tap "Allow USB debugging" on the phone and check "Always allow"
3. **Verify Connection:** Run `adb devices` to see the device list
4. **Restart adb:** If the device is not shown, run `adb kill-server && adb start-server`

### If Metro bundler cannot start

Clear cache:
```bash
npm start -- --reset-cache
```

### If the app cannot be installed on device

Ensure:
1. Developer options and USB debugging are enabled
2. Device is connected via USB or emulator is running
3. Run `adb devices` to confirm device is connected
4. Phone has authorized this computer for USB debugging

## License

MIT License

## Contributing

Issues and Pull Requests are welcome!

