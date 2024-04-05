package expo.modules.appusage

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.app.usage.UsageStatsManager
import android.app.usage.UsageStats
import android.app.AppOpsManager
import android.content.pm.PackageManager
import android.content.Context

class AppUsageModule : Module() {
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
      val retStats = mutableListOf<Any>()
      if (hasPermission){
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val stats = usageStatsManager.queryAndAggregateUsageStats(start, end)
        stats.forEach {entry ->
          retStats.add(mutableListOf(entry.key,entry.value.getTotalTimeInForeground()))
        } 
      }
      sendEvent("usageDataEvent",mapOf(
          "success" to hasPermission,
          "val" to retStats,
          "start" to start,
          "end" to end
        ))
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