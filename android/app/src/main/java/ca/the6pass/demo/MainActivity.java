package ca.the6pass.demo;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

/*
 * The app's one screen: Capacitor's web view, with the page router
 * (StaticExportRouter.java) that maps /app/owner to app/owner.html.
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (bridge == null) return; // No WebView on this phone; Capacitor shows its own message.

        bridge.setWebViewClient(new StaticExportRouter(bridge));
        // Capacitor already started loading /app before the router was in
        // place, so start it again through the router (it's a local file).
        bridge.getWebView().stopLoading();
        bridge.getWebView().loadUrl(bridge.getAppUrl());
    }
}
