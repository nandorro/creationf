package com.creationf.app;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.drawable.Icon;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONObject;

public class MainActivity extends Activity {
    static final int N_ICONOS = 10;
    private WebView web;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        web.setWebViewClient(new WebViewClient());
        web.addJavascriptInterface(new Puente(), "Android");
        web.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }

    /** Puente JS <-> Android. La web detecta window.Android y lo usa en lugar del flujo PWA. */
    class Puente {
        private SharedPreferences prefs() { return getSharedPreferences("cajon", MODE_PRIVATE); }

        /** Crea el acceso. Devuelve un texto con lo ocurrido para mostrarlo al usuario. */
        @JavascriptInterface
        public String crear(String url, String nombre, int icono, boolean inicio, boolean cajon) {
            if (icono < 0 || icono >= N_ICONOS) return "Icono no válido";
            StringBuilder r = new StringBuilder();
            if (inicio) r.append(pinInicio(url, nombre, icono)).append(' ');
            if (cajon) {
                prefs().edit().putString("u" + icono, url).apply();
                getPackageManager().setComponentEnabledSetting(
                        new ComponentName(MainActivity.this, "com.creationf.app.Alias" + icono),
                        PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
                r.append("Añadido al cajón de aplicaciones (como «").append(nombreIcono(icono)).append("»).");
            }
            return r.toString().trim();
        }

        private String pinInicio(String url, String nombre, int icono) {
            ShortcutManager sm = getSystemService(ShortcutManager.class);
            if (sm == null || !sm.isRequestPinShortcutSupported())
                return "Tu launcher no permite crear accesos en la pantalla de inicio.";
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            int res = getResources().getIdentifier("ic_" + icono, "mipmap", getPackageName());
            ShortcutInfo info = new ShortcutInfo.Builder(MainActivity.this, "u" + System.currentTimeMillis())
                    .setShortLabel(nombre.isEmpty() ? url : nombre)
                    .setIcon(Icon.createWithResource(MainActivity.this, res))
                    .setIntent(i)
                    .build();
            sm.requestPinShortcut(info, null);
            return "Confirma el acceso en la pantalla de inicio.";
        }

        /** JSON {"0":"https://...", ...} con los iconos activos en el cajon. */
        @JavascriptInterface
        public String cajonActivos() {
            try {
                JSONObject o = new JSONObject();
                for (int n = 0; n < N_ICONOS; n++) {
                    String u = prefs().getString("u" + n, null);
                    if (u != null) o.put(String.valueOf(n), u);
                }
                return o.toString();
            } catch (Exception e) { return "{}"; }
        }

        @JavascriptInterface
        public void quitarCajon(int icono) {
            prefs().edit().remove("u" + icono).apply();
            getPackageManager().setComponentEnabledSetting(
                    new ComponentName(MainActivity.this, "com.creationf.app.Alias" + icono),
                    PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
        }

        @JavascriptInterface
        public void abrir(String url) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        }

        @JavascriptInterface
        public void aviso(String t) { Toast.makeText(MainActivity.this, t, Toast.LENGTH_LONG).show(); }
    }

    static String nombreIcono(int n) {
        String[] x = {"Servidor", "Correo", "Nube", "Base de datos", "Seguridad", "Terminal", "Red / WiFi", "Monitorización", "Archivos", "Código / Git"};
        return x[n];
    }
}
