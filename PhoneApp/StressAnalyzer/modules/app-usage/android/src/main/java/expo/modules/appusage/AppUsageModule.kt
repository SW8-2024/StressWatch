package expo.modules.appusage

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.app.usage.UsageStatsManager
import android.app.usage.UsageStats
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

    // queryAndAggregateUsageStats

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("getUsageStats") {
    //Function("getUsageStats") { context: Context ->
      val currentTime: Long = System.currentTimeMillis()
      val prevTime: Long = currentTime - 345600000
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val stats = usageStatsManager.queryAndAggregateUsageStats(currentTime - 345600000, currentTime)

      val keys = stats.keys
      val num = stats.size
      val huh = usageStatsManager.getAppStandbyBucket() //returns 10, manager does some work

      val permission = android.Manifest.permission.PACKAGE_USAGE_STATS;
      // val permission = android.Manifest.permission.CAMERA;
      val res = context.checkCallingOrSelfPermission(permission);
      //
      //UsageStatsManager mUsageStatsManager = (UsageStatsManager) this.getSystemService(Context.USAGE_STATS_SERVICE);    
      // List<UsageStats> queryUsageStats = usageStatsManager.queryUsageStats(usageStatsManager.INTERVAL_DAILY, (System.currentTimeMillis() - 345600000), System.currentTimeMillis());
      // //
      // val num2 = queryUsageStats.size()
      //Lav array med keys / foreground time
      return@Function res
    }

    Function("hello") {
      "stats"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(AppUsageView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: AppUsageView, prop: String ->
        println(prop)
      }
    }
  }

  private val context
      get() = requireNotNull(appContext.reactContext)
  
  
}

// class ExpoRadialChartView(context: Context) {
//   internal val context = context
//   fun setChartData() : MutableMap<String, UsageStats> {
//     val currentTime: Long = System.currentTimeMillis()
//     val prevTime: Long = currentTime - 5000
//     val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
//     val stats = usageStatsManager.queryAndAggregateUsageStats(prevTime, currentTime)
//     return stats
//   }
// }
// fun Context.getUsageStatsManager() = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager