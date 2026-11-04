package ca.the6pass.demo;

import android.content.res.AssetManager;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/*
 * The demo is a static export: every page is its own .html file
 * (/app/owner -> app/owner.html), like on Netlify. Capacitor's default
 * Android server sends every extensionless path to index.html (the website
 * home), so this maps each page path to its own file first. Same rules as
 * ios/App/App/AppDelegate.swift (StaticExportRouter):
 *
 *   /              -> /app.html         (the member app, like on iOS)
 *   /app/place/x/  -> /app/place/x.html (trailing slashes dropped)
 *   /app/place/x   -> /app/place/x.html
 *   /blog          -> /blog/index.html  (only if there is no blog.html)
 *   /no-such-page  -> /404.html
 *   anything with an extension (.js, .txt, .png) is left alone.
 *
 * The rewritten request goes back through Capacitor's own local server, so
 * Capacitor still injects its bridge into the page and plugins keep working.
 */
public class StaticExportRouter extends BridgeWebViewClient {

    private final Bridge bridge;
    private final AssetManager assets;
    // Which bundle files exist, so each path is looked up only once.
    private final Map<String, Boolean> exists = new ConcurrentHashMap<>();

    public StaticExportRouter(Bridge bridge) {
        super(bridge);
        this.bridge = bridge;
        this.assets = bridge.getContext().getAssets();
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        Uri url = request.getUrl();
        if (bridge.getHost().equalsIgnoreCase(url.getHost())) {
            String page = route(url.getPath());
            if (page != null) {
                return bridge.getLocalServer().shouldInterceptRequest(new Rewritten(request, url.buildUpon().path(page).build()));
            }
        }
        return super.shouldInterceptRequest(view, request);
    }

    /** The .html file for a page path, or null to let Capacitor handle it as usual. */
    String route(String path) {
        String clean = path == null ? "" : path;
        while (clean.length() > 1 && clean.endsWith("/")) clean = clean.substring(0, clean.length() - 1);
        if (clean.isEmpty() || clean.equals("/")) return "/app.html";
        String last = clean.substring(clean.lastIndexOf('/') + 1);
        if (last.contains(".")) return null;
        if (inBundle(clean + ".html")) return clean + ".html";
        if (inBundle(clean + "/index.html")) return clean + "/index.html";
        // No such page: the export's "not found" page, as Netlify would show.
        return inBundle("/404.html") ? "/404.html" : null;
    }

    private boolean inBundle(String path) {
        return exists.computeIfAbsent(path, p -> {
            try (InputStream in = assets.open(Bridge.DEFAULT_WEB_ASSET_DIR + p)) {
                return true;
            } catch (IOException e) {
                return false;
            }
        });
    }

    /** The same request, pointed at the .html file. */
    private static final class Rewritten implements WebResourceRequest {

        private final WebResourceRequest original;
        private final Uri url;

        Rewritten(WebResourceRequest original, Uri url) {
            this.original = original;
            this.url = url;
        }

        @Override
        public Uri getUrl() {
            return url;
        }

        @Override
        public boolean isForMainFrame() {
            return original.isForMainFrame();
        }

        @Override
        public boolean isRedirect() {
            return original.isRedirect();
        }

        @Override
        public boolean hasGesture() {
            return original.hasGesture();
        }

        @Override
        public String getMethod() {
            return original.getMethod();
        }

        @Override
        public Map<String, String> getRequestHeaders() {
            return original.getRequestHeaders();
        }
    }
}
