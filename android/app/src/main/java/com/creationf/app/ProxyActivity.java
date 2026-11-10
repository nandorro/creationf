package com.creationf.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

/** Destino de los alias del cajon: abre la URL guardada para el icono (alias) usado. */
public class ProxyActivity extends Activity {
    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        try {
            String cls = getIntent().getComponent().getClassName();           // com.creationf.app.Alias3
            String n = cls.substring(cls.lastIndexOf("Alias") + 5);
            String url = getSharedPreferences("cajon", MODE_PRIVATE).getString("u" + n, null);
            if (url != null) startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
            else Toast.makeText(this, "Acceso sin URL: ábrelo desde Creationf", Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            Toast.makeText(this, "No se pudo abrir el acceso", Toast.LENGTH_LONG).show();
        }
        finish();
    }
}
