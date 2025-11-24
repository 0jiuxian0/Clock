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
  const [showDateInfo, setShowDateInfo] = useState(true);
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
  const buttonBackground = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const buttonBorder = isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)';

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
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={handleOrientationButtonPress}
            style={[
              styles.iconButton,
              {
                backgroundColor: buttonBackground,
                borderColor: buttonBorder,
              },
            ]}
            activeOpacity={0.7}>
            <Text style={[styles.iconButtonText, { color: textColor }]}>⟳</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={event => {
              event.stopPropagation();
              setShowDateInfo(prev => !prev);
            }}
            style={[
              styles.iconButton,
              {
                backgroundColor: buttonBackground,
                borderColor: buttonBorder,
              },
            ]}
            activeOpacity={0.7}>
            <Text style={[styles.iconButtonText, { color: textColor }]}>
              {showDateInfo ? '📅' : '🙈'}
            </Text>
          </TouchableOpacity>
        </View>
        {renderTime()}
        {showDateInfo ? (
          <Text style={[styles.dateText, { color: textColor }]}>
            {formatDate(time)}
          </Text>
        ) : null}
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
  toolbar: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
  },
  iconButtonText: {
    fontSize: 26,
  },
});

export default App;

