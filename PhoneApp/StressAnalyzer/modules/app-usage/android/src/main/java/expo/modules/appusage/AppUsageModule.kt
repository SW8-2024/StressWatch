package expo.modules.appusage

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.app.usage.UsageStatsManager
import android.app.usage.UsageStats
import android.app.AppOpsManager
import android.content.pm.PackageManager
import android.content.Context
import android.app.usage.UsageEvents
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.graphics.drawable.BitmapDrawable
import java.io.ByteArrayOutputStream
import android.util.Base64

import java.time.ZonedDateTime
import java.time.LocalDate
import java.time.ZoneId 
import java.time.Instant

class AppUsageModule : Module() {

  // Helper class to keep track of all of the stats 
  // class Stat(val packageName: String, val totalTime: Long, val startTimes: List<ZonedDateTime>, val endTimes: List<ZonedDateTime>)

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('AppUsage')` in JavaScript.
    Name("AppUsage")

    // Defines event names that the module can send to JavaScript.
    Events("usageDataEvent")

    // Returns usagestats in interval and both asyncronously returns the result and sends a usageDataEvent with the data.
    Function("getUsageStatsAsync") { start: Long, end: Long -> 
      val hasPermission = hasUsageStatsPermission()
      val retStats = mutableListOf<Pair<String,Long>>()
      if (hasPermission){
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val stats = usageStatsManager.queryAndAggregateUsageStats(start, end)
        stats.forEach {entry ->
          val time = entry.value.getTotalTimeInForeground()
          if (time != 0L){
            retStats.add(Pair(entry.key,time))
          }
        }
      }

      val ret = mapOf(
          "success" to hasPermission,
          "data" to retStats,
          "start" to start,
          "end" to end
        )
      sendEvent("usageDataEvent", ret)
      return@Function ret
    }


    Function("getAppIcon") {packageName : String ->
      val packageManager = context.getPackageManager();
      try{
        val drawableIcon = packageManager.getApplicationIcon(packageName);
        val bitmapIcon =  drawableToBitmap(drawableIcon);
        val base64Icon = convertToBase64(bitmapIcon);      
        return@Function base64Icon;
      }catch(e : Exception){
        return@Function "";
      }    
    }
    /**
   * Returns the relevant events in the given time interval
   */
    Function("getEventStatsInInterval") { startTime : Long, endTime : Long ->
      if (!hasUsageStatsPermission()){
        return@Function mapOf("success" to false)
      }
      
      //If query end is in the future set the end to now.
      val start = startTime
      var end = endTime
      val now : Long = Instant.now().toEpochMilli()
      if (end > now){ 
        end = now
      }

      // This will keep a map of all of the events per package name 
      val sortedEvents = mutableMapOf<String, MutableList<UsageEvents.Event>>()

      // Query the list of events that has happened within that time frame
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val systemEvents = usageStatsManager.queryEvents(start, end)
      while (systemEvents.hasNextEvent()) {
          val event = UsageEvents.Event()
          systemEvents.getNextEvent(event)

          // Get the list of events for the package name, create one if it doesn't exist
          val packageEvents = sortedEvents[event.packageName] ?: mutableListOf()
          packageEvents.add(event)
          sortedEvents[event.packageName] = packageEvents
      }

      // This will keep a list of our final stats
      val stats = mutableListOf<Any>()

      // Go through the events by package name
      sortedEvents.forEach { packageName, events ->
        // Keep track of the current start and end times
        var startTime = 0L
        var endTime = 0L
        // Keep track of the total usage time for this app
        var totalTime = 0L
        // Keep track of the start times for this app
        val startTimes = mutableListOf<Long>()
        val endTimes = mutableListOf<Long>()
        events.forEach {
            var currentEvent = it.eventType
            //No useful switch structures in Kotlin
            if (
              currentEvent == UsageEvents.Event.ACTIVITY_STOPPED ||
              currentEvent == UsageEvents.Event.ACTIVITY_PAUSED ||
              currentEvent == UsageEvents.Event.DEVICE_SHUTDOWN ||
              currentEvent == UsageEvents.Event.FOREGROUND_SERVICE_STOP
            ){
              endTime = it.timeStamp
              endTimes.add(endTime)
            } else if (
              currentEvent == UsageEvents.Event.ACTIVITY_RESUMED ||
              currentEvent == UsageEvents.Event.FOREGROUND_SERVICE_START
            ){
              startTime = it.timeStamp
              startTimes.add(startTime)
            }
        }
      
        val elem =
        stats.add(mapOf(          
          "packageName" to packageName,
          "startTimes" to startTimes,
          "endTimes" to endTimes,          
        ))
    }
    val ret = mapOf(
          "success" to true, 
          "packageTimes" to stats,          
          "queryStart" to start,
          "queryEnd" to end
        )
    return@Function ret
    }
  }

  private val context
      get() = requireNotNull(appContext.reactContext)
  
  private fun drawableToBitmap(drawable : Drawable) : Bitmap {
    var bitmap : Bitmap;

    if (drawable is BitmapDrawable) {
        val bitmapDrawable = drawable;
        if(bitmapDrawable.getBitmap() != null) {
            return bitmapDrawable.getBitmap();
        }
    }

    if(drawable.getIntrinsicWidth() <= 0 || drawable.getIntrinsicHeight() <= 0) {
        bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888); // Single color bitmap will be created of 1x1 pixel
    } else {
        bitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
    }

    var canvas = Canvas(bitmap);
    drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
    drawable.draw(canvas);
    return bitmap;
  }
  
  //Checks whether we have usagestats permission
  private fun hasUsageStatsPermission() : Boolean{    
    var granted = false
    val appOps = context
            .getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = appOps.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, 
             android.os.Process.myUid(), context.getPackageName())    
    if (mode == AppOpsManager.MODE_DEFAULT) {
        granted = (context.checkCallingOrSelfPermission(android.Manifest.permission.PACKAGE_USAGE_STATS) == PackageManager.PERMISSION_GRANTED)
    } else {
        granted = (mode == AppOpsManager.MODE_ALLOWED)
    }
    return granted
  }

  private fun convertToBase64(bm: Bitmap): String? {
        val baos = ByteArrayOutputStream()
        bm.compress(Bitmap.CompressFormat.JPEG, 100, baos)
        val b = baos.toByteArray()
        return Base64.encodeToString(b, Base64.DEFAULT)
    }
}