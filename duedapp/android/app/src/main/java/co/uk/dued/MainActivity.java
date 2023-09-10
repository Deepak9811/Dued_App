package co.uk.dued;





// import android.app.NotificationChannel;
// import android.app.NotificationManager;
// import android.content.ContentResolver;
// import android.media.AudioAttributes;
// import android.net.Uri;
// import android.os.Build;
import android.os.Bundle;

// import androidx.core.app.NotificationCompat;



import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
// import com.imagepicker.permissions.OnImagePickerPermissionsCallback; // <- add this import
// import com.facebook.react.modules.core.PermissionListener; // <- add this import

public class MainActivity extends ReactActivity  {

  // private PermissionListener listener; // <- add this attribute

   @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        
      //  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      //      NotificationChannel notificationChannel = new NotificationChannel("myChannel", "Dued", NotificationManager.IMPORTANCE_HIGH);
      //      notificationChannel.setShowBadge(true);
      //      notificationChannel.setDescription("");
      //      AudioAttributes att = new AudioAttributes.Builder()
      //              .setUsage(AudioAttributes.USAGE_NOTIFICATION)
      //              .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
      //              .build();
      //      notificationChannel.setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getPackageName() + "/raw/my_sound"), att);
      //      notificationChannel.enableVibration(true);
      //      notificationChannel.setVibrationPattern(new long[]{400, 400});
      //      notificationChannel.setLockscreenVisibility(NotificationCompat.VISIBILITY_PUBLIC);
      //      NotificationManager manager = getSystemService(NotificationManager.class);
      //      manager.createNotificationChannel(notificationChannel);
      //  }


       super.onCreate(savedInstanceState);
    }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Dued";
  }


  // @Override
  // public void setPermissionListener(PermissionListener listener)
  // {
  //   this.listener = listener;
  // }

  // @Override
  // public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
  // {
  //   if (listener != null)
  //   {
  //     listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
  //   }
  //   super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  // }

}
