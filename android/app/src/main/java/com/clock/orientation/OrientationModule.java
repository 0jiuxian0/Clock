package com.clock.orientation;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OrientationModule extends ReactContextBaseJavaModule {
  private static final String MODULE_NAME = "OrientationModule";
  private final Handler handler = new Handler(Looper.getMainLooper());
  private boolean isLocked = false;

  public OrientationModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return MODULE_NAME;
  }

  @ReactMethod
  public void rotateToLandscape() {
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE, false);
  }

  @ReactMethod
  public void rotateToPortrait() {
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT, false);
  }

  @ReactMethod
  public void enableAuto() {
    isLocked = false;
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR, false);
  }

  @ReactMethod
  public void lockOrientation() {
    isLocked = true;
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(
        () -> {
          // 锁定当前方向，不允许旋转
          int currentOrientation = activity.getRequestedOrientation();
          if (currentOrientation == ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR) {
            // 如果当前是自动模式，获取当前实际方向并锁定
            int rotation = activity.getWindowManager().getDefaultDisplay().getRotation();
            if (rotation == 0 || rotation == 2) {
              activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            } else {
              activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            }
          }
          // 如果已经是锁定状态，保持当前方向不变
        });
  }

  @ReactMethod
  public void unlockOrientation() {
    isLocked = false;
    enableAuto();
  }

  @ReactMethod
  public void rotateToLandscapeLocked() {
    isLocked = true;
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE, true);
  }

  @ReactMethod
  public void rotateToPortraitLocked() {
    isLocked = true;
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT, true);
  }

  private void setOrientation(final int orientation, final boolean keepLocked) {
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(
        () -> {
          activity.setRequestedOrientation(orientation);
          if (!keepLocked && !isLocked && 
              (orientation == ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
                  || orientation == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT)) {
            // After forcing an orientation once, release back to sensor so gravity still works.
            handler.postDelayed(
                () -> {
                  if (!isLocked) {
                    activity.setRequestedOrientation(
                        ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR);
                  }
                },
                1000);
          }
        });
  }
}

