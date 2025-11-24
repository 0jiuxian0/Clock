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
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
  }

  @ReactMethod
  public void rotateToPortrait() {
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
  }

  @ReactMethod
  public void enableAuto() {
    setOrientation(ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR);
  }

  private void setOrientation(final int orientation) {
    final Activity activity = getCurrentActivity();
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(
        () -> {
          activity.setRequestedOrientation(orientation);
          if (orientation == ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
              || orientation == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT) {
            // After forcing an orientation once, release back to sensor so gravity still works.
            handler.postDelayed(
                () ->
                    activity.setRequestedOrientation(
                        ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR),
                1000);
          }
        });
  }
}

