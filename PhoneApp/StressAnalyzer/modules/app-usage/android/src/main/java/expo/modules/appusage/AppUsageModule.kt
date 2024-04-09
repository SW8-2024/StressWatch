package expo.modules.appusage

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.app.usage.UsageStatsManager
import android.app.usage.UsageStats
import android.app.AppOpsManager
import android.content.pm.PackageManager
import android.content.Context
import android.app.usage.UsageEvents

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


    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("getUsageStatsAsync") { start: Long, end: Long ->
      val hasPermission = hasUsageStatsPermission()
      val retStats = mutableListOf<Pair<String,Long>>()
      if (hasPermission){
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val stats = usageStatsManager.queryAndAggregateUsageStats(start, end)
        stats.forEach {entry ->
          retStats.add(Pair(entry.key,entry.value.getTotalTimeInForeground()))
        }
      }
  
      sendEvent("usageDataEvent",mapOf(
          "success" to hasPermission,
          "data" to retStats,
          "start" to start,
          "end" to end
        ))
    }
    // Maybe also get queryconfigurations
    Function("getUsageStatsAsync2") { start: Long, end: Long -> 
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

    /**
   * Returns the stats for the [date] (defaults to today) 
   */
    Function("getEventStats") {
      if (!hasUsageStatsPermission()){
        return@Function mapOf("success" to false)
      } 
      // The timezones we'll need 
      val date = LocalDate.now()
      val utc = ZoneId.of("UTC")
      val defaultZone = ZoneId.systemDefault()

      // Set the starting and ending times to be midnight in UTC time
      val startDate = date.atStartOfDay(defaultZone).withZoneSameInstant(utc)
      val start = startDate.toInstant().toEpochMilli()
      val end = startDate.plusDays(1).toInstant().toEpochMilli()

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
}