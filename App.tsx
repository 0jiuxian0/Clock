import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StatusBar,
  Platform,
  NativeModules,
  useWindowDimensions,
  GestureResponderEvent,
} from 'react-native';

type OrientationMode = 'landscape' | 'portrait';
type Language = 'zh' | 'en';

type OrientationNativeModule = {
  rotateToLandscape: () => void;
  rotateToPortrait: () => void;
  enableAuto: () => void;
  lockOrientation: () => void;
  unlockOrientation: () => void;
  rotateToLandscapeLocked: () => void;
  rotateToPortraitLocked: () => void;
};

const OrientationModule = NativeModules
  .OrientationModule as OrientationNativeModule | undefined;

// 语言文本映射
const translations = {
  zh: {
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dateFormat: (year: number, month: string, day: string, weekday: string) =>
      `${year}年${month}月${day}日 ${weekday}`,
    portrait: '竖屏',
    landscape: '横屏',
    showDate: '显示日期',
    hideDate: '隐藏日期',
    lock: '锁定',
    unlock: '解锁',
    switchLanguage: '切换语言',
  },
  en: {
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dateFormat: (year: number, month: string, day: string, weekday: string) =>
      `${weekday}, ${month}/${day}/${year}`,
    portrait: 'Portrait',
    landscape: 'Landscape',
    showDate: 'Show Date',
    hideDate: 'Hide Date',
    lock: 'Lock',
    unlock: 'Unlock',
    switchLanguage: 'Switch Language',
  },
};

const App = () => {
  const [time, setTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [orientationMode, setOrientationMode] = useState<OrientationMode>('landscape');
  const [showDateInfo, setShowDateInfo] = useState(false);
  const [isOrientationLocked, setIsOrientationLocked] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');
  const { width, height } = useWindowDimensions();
  const isPortraitLayout = height >= width;

  // 根据实际屏幕方向更新 orientationMode 状态
  useEffect(() => {
    setOrientationMode(isPortraitLayout ? 'portrait' : 'landscape');
  }, [isPortraitLayout]);

  useEffect(() => {
    // 设置全屏和沉浸式模式
    if (Platform.OS === 'android') {
      StatusBar.setHidden(true);
    }

    // 默认横屏
    OrientationModule?.rotateToLandscape?.();

    // 更新时间
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000); // 每秒更新一次

    return () => clearInterval(timer);
  }, []);

  // 切换主题
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const { hours, minutes, seconds } = useMemo(() => {
    return {
      hours: time.getHours().toString().padStart(2, '0'),
      minutes: time.getMinutes().toString().padStart(2, '0'),
      seconds: time.getSeconds().toString().padStart(2, '0'),
    };
  }, [time]);

  // 格式化日期
  const formatDate = (date: Date): string => {
    const t = translations[language];
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekday = t.weekdays[date.getDay()];
    return t.dateFormat(year, month, day, weekday);
  };

  const backgroundColor = isDarkMode ? '#000000' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const buttonBackground = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const buttonBorder = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)';

  const toggleLockOrientation = () => {
    if (isOrientationLocked) {
      OrientationModule?.unlockOrientation?.();
      setIsOrientationLocked(false);
    } else {
      OrientationModule?.lockOrientation?.();
      setIsOrientationLocked(true);
    }
  };

  const toggleOrientationMode = () => {
    if (isOrientationLocked) {
      // 锁定状态下，直接切换并保持锁定
      if (orientationMode === 'landscape') {
        OrientationModule?.rotateToPortraitLocked?.();
        setOrientationMode('portrait');
      } else {
        OrientationModule?.rotateToLandscapeLocked?.();
        setOrientationMode('landscape');
      }
    } else {
      // 未锁定状态，切换后会自动恢复重力感应
      if (orientationMode === 'landscape') {
        OrientationModule?.rotateToPortrait?.();
        setOrientationMode('portrait');
      } else {
        OrientationModule?.rotateToLandscape?.();
        setOrientationMode('landscape');
      }
    }
  };
  const handleOrientationButtonPress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    toggleOrientationMode();
  };

  const renderTime = () => {
    if (isPortraitLayout) {
      return (
        <View style={styles.portraitTimeContainer}>
          <Text style={[styles.verticalTimeText, { color: textColor }]}>{hours}</Text>
          <Text style={[styles.verticalTimeText, { color: textColor }]}>{minutes}</Text>
          <Text style={[styles.verticalTimeText, { color: textColor }]}>{seconds}</Text>
        </View>
      );
    }

    return (
      <Text style={[styles.horizontalTimeText, { color: textColor }]}>
        {`${hours}:${minutes}:${seconds}`}
      </Text>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={toggleTheme}>
      <View style={[styles.container, { backgroundColor }]}>
        <StatusBar hidden={true} />
        <View style={[styles.contentContainer, isPortraitLayout && styles.contentContainerPortrait]}>
          {renderTime()}
          {showDateInfo ? (
            <Text style={[styles.dateText, { color: textColor }]}>
              {formatDate(time)}
            </Text>
          ) : null}
        </View>
        <View style={[styles.toolbar, isPortraitLayout && styles.toolbarPortrait]}>
          <TouchableOpacity
            onPress={event => {
              event.stopPropagation();
              toggleLockOrientation();
            }}
            style={[
              styles.textButton,
              isPortraitLayout && styles.textButtonPortrait,
              {
                backgroundColor: buttonBackground,
                borderColor: buttonBorder,
              },
            ]}
            activeOpacity={0.7}>
            <Text 
              numberOfLines={1}
              style={[styles.buttonText, isPortraitLayout && styles.buttonTextPortrait, { color: textColor }]}>
              {isOrientationLocked ? translations[language].unlock : translations[language].lock}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOrientationButtonPress}
            style={[
              styles.textButton,
              isPortraitLayout && styles.textButtonPortrait,
              {
                backgroundColor: buttonBackground,
                borderColor: buttonBorder,
              },
            ]}
            activeOpacity={0.7}>
            <Text 
              numberOfLines={1}
              style={[styles.buttonText, isPortraitLayout && styles.buttonTextPortrait, { color: textColor }]}>
              {orientationMode === 'landscape' ? translations[language].portrait : translations[language].landscape}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={event => {
              event.stopPropagation();
              setShowDateInfo(prev => !prev);
            }}
            style={[
              styles.textButton,
              isPortraitLayout && styles.textButtonPortrait,
              {
                backgroundColor: buttonBackground,
                borderColor: buttonBorder,
              },
            ]}
            activeOpacity={0.7}>
            <Text 
              numberOfLines={1}
              style={[styles.buttonText, isPortraitLayout && styles.buttonTextPortrait, { color: textColor }]}>
              {showDateInfo ? translations[language].hideDate : translations[language].showDate}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={event => {
              event.stopPropagation();
              setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
            }}
            style={[
              styles.textButton,
              isPortraitLayout && styles.textButtonPortrait,
              {
                backgroundColor: buttonBackground,
                borderColor: buttonBorder,
              },
            ]}
            activeOpacity={0.7}>
            <Text 
              numberOfLines={1}
              style={[styles.buttonText, isPortraitLayout && styles.buttonTextPortrait, { color: textColor }]}>
              {translations[language].switchLanguage}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 120, // 为底部按钮留出空间
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainerPortrait: {
    bottom: 150, // 竖屏模式下为两行按钮留出更多空间
  },
  horizontalTimeText: {
    fontSize: 120,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
    textAlign: 'center',
    letterSpacing: 5,
  },
  portraitTimeContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  verticalTimeText: {
    fontSize: 100,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
    textAlign: 'center',
    letterSpacing: 8,
  },
  dateText: {
    fontSize: 28,
    marginTop: 32,
    fontFamily: Platform.OS === 'android' ? 'sans-serif' : 'System',
    textAlign: 'center',
  },
  toolbar: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    flexWrap: 'nowrap',
  },
  toolbarPortrait: {
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 12,
    bottom: 30,
    justifyContent: 'space-between',
  },
  textButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    minWidth: 100,
  },
  textButtonPortrait: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: '47%',
    minWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : 'System',
  },
  buttonTextPortrait: {
    fontSize: 13,
  },
});

export default App;

