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

type OrientationNativeModule = {
  rotateToLandscape: () => void;
  rotateToPortrait: () => void;
  enableAuto: () => void;
};

const OrientationModule = NativeModules
  .OrientationModule as OrientationNativeModule | undefined;

const App = () => {
  const [time, setTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [orientationMode, setOrientationMode] = useState<OrientationMode>('landscape');
  const { width, height } = useWindowDimensions();
  const isPortraitLayout = height >= width;

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
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日 ${weekday}`;
  };

  const backgroundColor = isDarkMode ? '#000000' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';

  const toggleOrientationMode = () => {
    if (orientationMode === 'landscape') {
      OrientationModule?.rotateToPortrait?.();
      setOrientationMode('portrait');
    } else {
      OrientationModule?.rotateToLandscape?.();
      setOrientationMode('landscape');
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
        <TouchableOpacity
          onPress={handleOrientationButtonPress}
          style={[styles.orientationButton, { borderColor: textColor }]}
          activeOpacity={0.7}>
          <Text style={[styles.buttonText, { color: textColor }]}>
            {orientationMode === 'landscape' ? '切换竖屏' : '切换横屏'}
          </Text>
        </TouchableOpacity>
        {renderTime()}
        <Text style={[styles.dateText, { color: textColor }]}>
          {formatDate(time)}
        </Text>
        <View style={styles.hintWrapper}>
          <Text style={[styles.hintText, { color: textColor }]}>
            点击屏幕切换主题
          </Text>
          <Text style={[styles.hintText, { color: textColor }]}>
            按按钮切换横竖屏，也可随手机旋转自动调整
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  hintText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: 'center',
  },
  hintWrapper: {
    marginTop: 32,
    gap: 8,
  },
  orientationButton: {
    position: 'absolute',
    top: 40,
    right: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 999,
  },
  buttonText: {
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default App;

