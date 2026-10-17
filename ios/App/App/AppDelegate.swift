import UIKit
import Capacitor

/*
 * The demo is a static export: every page is its own .html file
 * (/app/owner -> app/owner.html), like on Netlify. Capacitor's default
 * router sends every such path to index.html, so this one maps them.
 */
struct StaticExportRouter: Router {
    var basePath: String = ""
    func route(for path: String) -> String {
        var clean = path
        while clean.count > 1 && clean.hasSuffix("/") { clean.removeLast() }
        if clean.isEmpty || clean == "/" { return basePath + "/app.html" }
        if URL(fileURLWithPath: clean).pathExtension.isEmpty { return basePath + clean + ".html" }
        return basePath + clean
    }
}

/// The app's one screen: Capacitor's web view, with the router above.
class ViewController: CAPBridgeViewController {
    override func router() -> Router {
        return StaticExportRouter()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Swipe from the left edge to go back, like any iPhone app.
        webView?.allowsBackForwardNavigationGestures = true
    }
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}
