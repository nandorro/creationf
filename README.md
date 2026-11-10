# Creationf

Pregunta una **URL**, te deja elegir uno de **10 iconos** (Servidor, Correo, Nube, Base de datos, Seguridad, Terminal, Red/WiFi, Monitorización, Archivos, Código/Git) y crea un acceso a esa URL.

- **Web (PWA):** https://nandorro.github.io/creationf/ — crea una página-acceso instalable (Android: Instalar; iOS: Compartir → Añadir a inicio).
- **APK Android:** [`docs/creationf.apk`](docs/creationf.apk) — misma interfaz (empaqueta `docs/`), crea el acceso en la **pantalla de inicio** (pinned shortcut) y/o en el **cajón de aplicaciones** (un alias por icono).

## Estructura
- `docs/` – la app web (se publica con GitHub Pages) y los assets del APK. Una única interfaz para ambas.
- `tools/gen.js` – genera `docs/icons.js`, los iconos adaptativos de Android y el `AndroidManifest.xml`.
- `android/` – proyecto Android (Java, sin dependencias).
- `build.sh` – regenera y compila el APK.

Cada cambio se aplica a web y APK a la vez: editar `docs/`, ejecutar `./build.sh`, commit y push.
