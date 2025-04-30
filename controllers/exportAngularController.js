import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const GEMINI_API_KEY = "AIzaSyCQrQY31fv_uFKhhqqRFQzF9UTh3du_Apg";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const FILE_PATTERN = /\/\/\s*archivo:\s*(.+?)\n/gi;

export const exportAngularProject = async (req, res) => {
  try {
    const data = req.body;

    const prompt = `
  Eres un generador de proyectos Angular altamente experto.

Tarea:
Generar un proyecto Angular completo, funcional y moderno que funcione directamente con:
- npm install
- npm run start (ng serve)
sin necesidad de modificaciones manuales.

Estructura mínima requerida:
- package.json (debe incluir @angular/core, @angular/cli, @angular/compiler, @angular/router, rxjs, zone.js versión ~0.14.0, y typescript versión ~5.2.2).
- angular.json (sin propiedad "defaultProject", usando "buildTarget" en lugar de "browserTarget").
- tsconfig.json (debe contener "references" a "./tsconfig.app.json" y "./tsconfig.spec.json").
- tsconfig.app.json (debe excluir "src/test.ts" y "/.spec.ts", e incluir solo "src//.ts").
- tsconfig.spec.json (para pruebas unitarias).
- src/main.ts
- src/index.html
- src/styles.css
- src/polyfills.ts (debe importar explícitamente 'zone.js').
- src/test.ts
- src/app/app.module.ts
- src/app/app.component.ts
- src/app/app.component.html (debe contener solo <router-outlet></router-outlet>).
- src/app/app.component.css
- src/app/app-routing.module.ts
- src/app/components/[nombre-pagina]/* (cada página del JSON).
Para cada página del JSON:
- Crear obligatoriamente:
  - [nombre].component.ts
  - [nombre].component.html (aunque esté vacío si no hay HTML)
  - [nombre].component.css (aunque esté vacío si no hay CSS)
- Insertar en el .html solo el contenido dentro de la etiqueta <body> del HTML proporcionado.
- Insertar en el .css el contenido CSS proporcionado.
- Ignorar cualquier contenido dentro de etiquetas <script>.

Detalles obligatorios:
- package.json:
  - "zone.js": "~0.14.0"
  - "typescript": "~5.2.2"
  - "@angular/*": "~17.0.0"
  - Scripts incluyendo: "start": "ng serve"
- angular.json:
  - No debe tener "defaultProject".
  - En "serve" y "extract-i18n" debe usar "buildTarget" en lugar de "browserTarget".
  - Referenciar "tsconfig.app.json" correctamente.
- tsconfig.json:
  - Debe extender las configuraciones y referenciar a "tsconfig.app.json" y "tsconfig.spec.json".
- tsconfig.app.json:
  - Excluir "src/test.ts" y todos los "*.spec.ts".
- polyfills.ts:
  - Debe contener:
    import 'zone.js';
- main.ts:
  - Solo debe importar y bootstrapear AppModule, no debe importar test.ts.
- index.html:
  - Debe contener:
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>AngularProject</title>
        <base href="/">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <app-root></app-root>
      </body>
    </html>
- app.component.html:
  - Debe contener solamente:
    <router-outlet></router-outlet>
- app-routing.module.ts:
  - Debe definir rutas para cada componente de página creado.

Formato de salida:
- Cada archivo debe comenzar exactamente con:
// archivo: ruta/completa/archivo.ext
- No envolver los archivos con bloques typescript o json.
- No agregar texto adicional antes o después de los archivos.

Importante:
- No agregar ningún comentario, explicación ni separación entre archivos.
- No inventar dependencias o estructuras adicionales.
- Cumplir estrictamente con las versiones, estructura y convenciones especificadas.

JSON de entrada (Define las páginas/componentes a crear):


${JSON.stringify(data, null, 2)}
    `;

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, payload, {
      headers: { "Content-Type": "application/json" }
    });

    if (!response.data.candidates) {
      return res.status(500).json({ error: 'Respuesta inválida de Gemini' });
    }

    const code = response.data.candidates[0].content.parts[0].text;

    const tempFolder = path.join('/tmp', `angular_${uuidv4()}`);
    fs.mkdirSync(tempFolder, { recursive: true });

    const matches = [...code.matchAll(FILE_PATTERN)];

    if (!matches.length) {
      return res.status(500).json({ error: 'No se encontraron archivos generados' });
    }

    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + matches[i][0].length;
      const end = matches[i + 1] ? matches[i + 1].index : code.length;
      const filename = matches[i][1].trim();
      const content = code.substring(start, end).trim();

      const fullPath = path.join(tempFolder, filename);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content, 'utf-8');
    }

    const zipPath = `${tempFolder}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.directory(tempFolder, false);
    archive.pipe(output);
    await archive.finalize();

    output.on('close', () => {
      res.download(zipPath, 'angular_project.zip', () => {
        // Borra los archivos temporales después de enviar
        fs.rmSync(tempFolder, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      });
    });

  } catch (error) {
    console.error('Error generando proyecto:', error);
    res.status(500).json({ error: 'Error generando proyecto' });
  }
};
