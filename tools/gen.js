// Genera, desde UNA sola definicion de iconos:
//  - docs/icons.js                      (web + assets del APK)
//  - android/app/src/main/res/...       (iconos adaptativos para cajon de apps y accesos)
//  - android/app/src/main/AndroidManifest.xml (con un alias de cajon por icono)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');

const rect = (x, y, w, h, r) => `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
const dot = (x, y) => `M${x} ${y}h.01`;

const ICONS = [
  { id: 'servidor', name: 'Servidor', c1: '#6D7DFF', c2: '#2B3694', paths: [rect(3, 3.5, 18, 7, 2), rect(3, 13.5, 18, 7, 2), dot(7, 7), dot(7, 17), 'M11 7h6', 'M11 17h6'] },
  { id: 'correo', name: 'Correo', c1: '#FF8A5C', c2: '#D12F3E', paths: [rect(3, 5.5, 18, 13, 2.5), 'M3.5 7.5l8.5 6 8.5-6'] },
  { id: 'nube', name: 'Nube', c1: '#56CCF8', c2: '#1458B8', paths: ['M7 18a4 4 0 0 1-.5-8a5.5 5.5 0 0 1 10.7 1.2A3.5 3.5 0 0 1 17 18z'] },
  { id: 'bd', name: 'Base de datos', c1: '#2BD3A8', c2: '#056E66', paths: ['M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z', 'M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6', 'M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'] },
  { id: 'seguridad', name: 'Seguridad', c1: '#4BDB82', c2: '#12763A', paths: ['M12 3l7.5 3v5.5c0 4.5-3.1 8-7.5 9.5-4.4-1.5-7.5-5-7.5-9.5V6z', 'M8.8 12l2.4 2.4 4.2-4.6'] },
  { id: 'terminal', name: 'Terminal', c1: '#444B5C', c2: '#080A10', paths: [rect(3, 4.5, 18, 15, 2.5), 'M7.5 9.5l3 2.5-3 2.5', 'M13 15h4'] },
  { id: 'red', name: 'Red / WiFi', c1: '#BC74FF', c2: '#64208F', paths: ['M2.5 9.5a14 14 0 0 1 19 0', 'M5.5 13a9.5 9.5 0 0 1 13 0', 'M8.7 16.4a5 5 0 0 1 6.6 0', dot(12, 19.5)] },
  { id: 'monitor', name: 'Monitorización', c1: '#FFBE4F', c2: '#DE4A00', paths: [rect(3, 4, 18, 12, 2), 'M9 20h6', 'M12 16v4', 'M6 11h3l1.5-3 3 6 1.5-3h3'] },
  { id: 'archivos', name: 'Archivos', c1: '#FFD95C', c2: '#EE8F00', paths: ['M3 7.5a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'] },
  { id: 'codigo', name: 'Código / Git', c1: '#FF6A9E', c2: '#A81268', paths: ['M8.5 7.5L4 12l4.5 4.5', 'M15.5 7.5L20 12l-4.5 4.5', 'M13.5 5l-3 14'] },
];
// Icono de la propia app (no se ofrece en la lista)
const APP = { id: 'app', name: 'Creationf', c1: '#7B6CFF', c2: '#00B8D9', paths: ['M7 17L17 7', 'M9 7h8v8', rect(3.5, 3.5, 17, 17, 4.5)] };

const G = 'translate(31.2 31.2) scale(1.9)';
const SW = 1.7;
const wr = (p, c) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c); };

// ---- web ----
const js = `// GENERADO por tools/gen.js - no editar a mano
window.ICONS = ${JSON.stringify(ICONS)};
window.APP_ICON = ${JSON.stringify(APP)};
var __svgN = 0;
// SVG completo del icono (fondo degradado + glifo). round: esquinas redondeadas (false = a sangre, para PNG/maskable)
window.iconSvg = function (ic, round) {
  var g = 'cg' + (__svgN++);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + ic.c1 + '"/><stop offset="1" stop-color="' + ic.c2 + '"/></linearGradient></defs>' +
    '<rect width="108" height="108" rx="' + (round === false ? 0 : 26) + '" fill="url(#' + g + ')"/>' +
    '<g transform="${G}" fill="none" stroke="#fff" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round">' +
    ic.paths.map(function (d) { return '<path d="' + d + '"/>'; }).join('') + '</g></svg>';
};
`;
wr(path.join(root, 'docs', 'icons.js'), js);

// ---- android ----
const res = path.join(root, 'android/app/src/main/res');
const all = [...ICONS, APP];
all.forEach((ic, n) => {
  const key = ic.id === 'app' ? 'app' : String(n);
  const paths = ic.paths.map(d => `            <path android:pathData="${d}" android:strokeColor="#FFFFFF" android:strokeWidth="${SW}" android:strokeLineCap="round" android:strokeLineJoin="round"/>`).join('\n');
  wr(path.join(res, `drawable/ic_fg_${key}.xml`), `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">
        <group android:translateX="31.2" android:translateY="31.2" android:scaleX="1.9" android:scaleY="1.9">
${paths}
        </group>
</vector>
`);
  wr(path.join(res, `drawable/ic_bg_${key}.xml`), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <gradient android:type="linear" android:angle="315" android:startColor="${ic.c1}" android:endColor="${ic.c2}"/>
</shape>
`);
  wr(path.join(res, `mipmap-anydpi-v26/ic_${key}.xml`), `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_bg_${key}"/>
    <foreground android:drawable="@drawable/ic_fg_${key}"/>
</adaptive-icon>
`);
});
wr(path.join(res, 'values/strings.xml'), `<resources>\n    <string name="app_name">Creationf</string>\n</resources>\n`);

const aliases = ICONS.map((ic, n) => `        <activity-alias
            android:name=".Alias${n}"
            android:targetActivity=".ProxyActivity"
            android:enabled="false"
            android:exported="true"
            android:icon="@mipmap/ic_${n}"
            android:label="${ic.name}">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity-alias>`).join('\n');
wr(path.join(root, 'android/app/src/main/AndroidManifest.xml'), `<?xml version="1.0" encoding="utf-8"?>
<!-- GENERADO por tools/gen.js - no editar a mano -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_app"
        android:label="@string/app_name"
        android:theme="@android:style/Theme.Material.NoActionBar"
        android:usesCleartextTraffic="false">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity
            android:name=".ProxyActivity"
            android:exported="false"
            android:excludeFromRecents="true"
            android:noHistory="true"
            android:theme="@android:style/Theme.Translucent.NoTitleBar" />
${aliases}
    </application>
</manifest>
`);
console.log('OK: iconos y manifest generados (' + ICONS.length + ' iconos)');
