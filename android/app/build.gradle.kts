plugins {
    id("com.android.application")
}

android {
    namespace = "com.creationf.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.creationf.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    // La interfaz es la MISMA que la web: se empaqueta la carpeta docs/ como assets
    sourceSets["main"].assets.srcDirs("../../docs")
    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
