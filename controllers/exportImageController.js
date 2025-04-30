import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const GEMINI_API_KEY = "AIzaSyAo5Nl2Y3o2cxhiOgfyjhbTDgP_towXW_o";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const FILE_PATTERN = /\/\/\s*archivo:\s*(.+?)\n/gi;

export const exportAngularFromImage = async (req, res) => {
  let tempFolder = null;
  let zipPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen.' });
    }

    const imagePath = req.file.path;
    const imageMimeType = req.file.mimetype;
    const imageBase64 = fs.readFileSync(imagePath).toString('base64');

    const prompt = `
    Eres un generador de proyectos Angular altamente experto.
    Tu tarea principal es generar un proyecto que sea directamente compilable y ejecutable con \`npm install\` y \`npm start\`, utilizando Bootstrap 5 para el diseño basado en una imagen.
    
    Tarea:
    1. ANALIZA la imagen adjunta para identificar el layout, los
       componentes visuales (navegación, botones, formularios, texto, imágenes,
       tarjetas, listas, etc.) y el contenido textual.
    2. GENERA el código COMPLETO para un proyecto Angular de **una única página/vista principal**
       basado en ese análisis visual. El proyecto debe funcionar directamente con:
         - npm install
         - npm run start (ng serve)
         sin necesidad de modificaciones
       manuales en los archivos de configuración base.
    3. UTILIZA componentes y clases de **Bootstrap 5** (la versión estable más
       reciente, por ejemplo, ~5.3.0) para replicar el diseño y estilo visual de la
       imagen lo más fielmente posible en el archivo HTML del componente principal.
    4. EXTRAE el texto visible en la imagen e insértalo en los
       lugares correspondientes del HTML generado.
    5. CREA un único componente Angular para la página principal, utilizando los archivos estándar .ts, .html, .css.
    
    Estructura de archivos requerida (siguiendo tu referencia, adaptada para una página):
    - package.json (Configuración de dependencias y scripts)
    - angular.json (Configuración del CLI y build)
    - tsconfig.json (Configuración global de TypeScript)
    - tsconfig.app.json (Configuración de TypeScript para la app)
    - tsconfig.spec.json (Configuración de TypeScript para tests - puede ser mínimo)
    - src/main.ts (Punto de entrada de la app)
    - src/index.html (HTML principal de la app)
    - src/styles.css (Estilos globales - Bootstrap se añade vía angular.json)
    - src/polyfills.ts (Polyfills necesarios)
    - src/test.ts (Configuración de tests - puede ser mínimo)
    - src/app/app.module.ts (Módulo raíz de la app)
    - src/app/app.component.ts (Componente raíz con router-outlet)
    - src/app/app.component.html (Solo router-outlet)
    - src/app/app.component.css (Estilos AppComponent - puede ser vacío)
    - src/app/app-routing.module.ts (Módulo de rutas)
    - src/app/components/main-page/main-page.component.ts (TS del componente principal)
    - src/app/components/main-page/main-page.component.html (HTML del componente principal - derivado de la imagen con Bootstrap)
    - src/app/components/main-page/main-page.component.css (CSS del componente principal - estilos personalizados inferidos)
    
    Para la única página/vista principal (src/app/components/main-page/*):
    - **main-page.component.ts:** Genera la estructura básica del componente con selector \`app-main-page\`. Incluye propiedades básicas si se infieren campos de formulario u estado simple de la imagen. Inyecta \`HttpClient\` si la imagen sugiere interacción con una API (ej: formulario de submit).
    - **main-page.component.html:** Genera el código HTML para esta página usando **clases de Bootstrap 5** para layout (\`container\`, \`row\`, \`col-*\`) y componentes (\`navbar\`, \`card\`, \`btn\`, \`form-control\`, etc.) basado en la interpretación de la imagen. Inserta el texto extraído.
    - **main-page.component.css:** Incluye **solo** estilos CSS personalizados si se infieren de la imagen que son adicionales a Bootstrap y no pueden lograrse solo con clases de utilidad de Bootstrap. Si no hay estilos personalizados claros, genera un archivo vacío.
    
    Detalles obligatorios y Plantillas de Archivos Clave:
    Debes generar el contenido de los siguientes archivos respetando estrictamente estas plantillas y convenciones. **ES CRUCIAL NO AGREGAR NINGÚN TEXTO, COMENTARIO ADICIONAL (excepto los marcadores de archivo), NI ENVOLVER EL CÓDIGO EN BLOQUES DE MARKDOWN (\`\`\`)**.
    
    // archivo: package.json
    {
      "name": "angular-bootstrap-project",
      "version": "0.0.0",
      "scripts": {
        "ng": "ng",
        "start": "ng serve",
        "build": "ng build",
        "test": "ng test"
      },
      "private": true,
      "dependencies": {
        "@angular/animations": "~17.0.0",
        "@angular/common": "~17.0.0",
        "@angular/compiler": "~17.0.0",
        "@angular/core": "~17.0.0",
        "@angular/forms": "~17.0.0",
        "@angular/platform-browser": "~17.0.0",
        "@angular/platform-browser-dynamic": "~17.0.0",
        "@angular/router": "~17.0.0",
        "bootstrap": "~5.3.0",
        "rxjs": "~7.8.0",
        "zone.js": "~0.14.0"
      },
      "devDependencies": {
        "@angular-devkit/build-angular": "~17.0.0",
        "@angular/cli": "~17.0.0",
        "@angular/compiler-cli": "~17.0.0",
        "@types/jasmine": "~5.1.0",
        "jasmine-core": "~5.1.0",
        "karma": "~6.4.0",
        "karma-chrome-launcher": "~3.2.0",
        "karma-coverage": "~2.2.0",
        "karma-jasmine": "~5.1.0",
        "karma-jasmine-html-reporter": "~2.1.0",
        "typescript": "~5.2.2"
      }
    }
    
    // archivo: angular.json
    {
      "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
      "version": 1,
      "newProjectRoot": "projects",
      "projects": {
        "angular-bootstrap-project": {
          "projectType": "application",
          "schematics": {},
          "root": "",
          "sourceRoot": "src",
          "prefix": "app",
          "architect": {
            "build": {
              "builder": "@angular-devkit/build-angular:application",
              "options": {
                "outputPath": "dist/angular-bootstrap-project",
                "index": "src/index.html",
                "browser": "src/main.ts",
                "polyfills": [
                  "zone.js"
                ],
                "tsConfig": "tsconfig.app.json",
                "assets": [
                  "src/favicon.ico",
                  "src/assets"
                ],
                "styles": [
                  "node_modules/bootstrap/dist/css/bootstrap.min.css",
                  "src/styles.css"
                ],
                "scripts": []
              }
            },
            "serve": {
              "builder": "@angular-devkit/build-angular:dev-server",
              "options": {
                "buildTarget": "angular-bootstrap-project:build"
              }
            },
            "extract-i18n": {
              "builder": "@angular-devkit/build-angular:extract-i18n",
              "options": {
                "buildTarget": "angular-bootstrap-project:build"
              }
            },
            "test": {
              "builder": "@angular-devkit/build-angular:karma",
              "options": {
                "polyfills": [
                  "zone.js",
                  "zone.js/testing"
                ],
                "tsConfig": "tsconfig.spec.json",
                "assets": [
                  "src/favicon.ico",
                  "src/assets"
                ],
                "styles": [
                   "node_modules/bootstrap/dist/css/bootstrap.min.css",
                  "src/styles.css"
                ],
                "scripts": []
              }
            }
          }
        }
      }
    }
    
    // archivo: tsconfig.json
    /* Standard Angular compiler options */
    {
      "compileOnSave": false,
      "compilerOptions": {
        "baseUrl": "./",
        "outDir": "./dist/out-tsc",
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "noImplicitOverride": true,
        "noPropertyAccessFromIndexSignature": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "sourceMap": true,
        "declaration": false,
        "downlevelIteration": true,
        "experimentalDecorators": true,
        "moduleResolution": "bundler",
        "importHelpers": true,
        "target": "es2022",
        "module": "es2022",
        "useDefineForClassFields": false,
        "lib": [
          "es2022",
          "dom"
        ]
      },
      "angularCompilerOptions": {
        "enableI18nLegacyMessageIdFormat": false,
        "strictInjectionParameters": true,
        "strictInputAccessModifiers": true,
        "strictTemplates": true
      }
    }
    // Note: The tsconfig.json above is the base. The tsconfig.app.json and tsconfig.spec.json will extend it and add file lists/references.
    
    // archivo: tsconfig.app.json
    {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "outDir": "./out-tsc/app",
        "types": []
      },
      "files": [
        "src/main.ts",
        "src/polyfills.ts"
      ],
      "include": [
        "src/**/*.ts"
        // NOT including spec files here
      ],
      "exclude": [
        "src/test.ts",
        "**/*.spec.ts"
      ]
    }
    
    // archivo: tsconfig.spec.json
    {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "outDir": "./out-tsc/spec",
        "types": [
          "jasmine"
        ]
      },
      "files": [
        "src/test.ts"
      ],
      "include": [
        "**/*.spec.ts",
        "**/*.d.ts"
      ]
    }
    
    // archivo: src/polyfills.ts
    import 'zone.js'; // Included with Angular CLI.
    
    // archivo: src/main.ts
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
    
    import { AppModule } from './app/app.module';
    
    
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch((err: any) => console.error(err)); // Added (err: any) for TS7006
    
    // archivo: src/index.html
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>AngularBootstrapProject</title>
      <base href="/">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" type="image/x-icon" href="favicon.ico">
    </head>
    <body>
      <app-root></app-root>
    </body>
    </html>
    
    // archivo: src/styles.css
    /* Puedes añadir estilos globales aquí si son necesarios, pero prioriza Bootstrap. */
    /* Los estilos de Bootstrap se importan vía angular.json */
    /* Add global styles here, and specify body, html, etc. stylings */
    /* body { margin: 0; } */
    
    
    // archivo: src/app/app.component.html
    <router-outlet></router-outlet>
    
    // archivo: src/app/app.component.css
    /* Add styles specific to the AppComponent here */
    /* styles.css for AppComponent */
    
    
    // archivo: src/app/app.component.ts
    import { Component } from '@angular/core';
    
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css'] // Usar .css para consistencia con las plantillas .css
    })
    export class AppComponent {
      title = 'angular-bootstrap-project'; // Título por defecto del proyecto
    }
    
    // archivo: src/app/app-routing.module.ts
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { MainPageComponent } from './components/main-page/main-page.component'; // Importa tu componente principal
    
    // Define la única ruta para el componente principal en la raíz
    const routes: Routes = [
      { path: '', component: MainPageComponent },
      // Opcional: redirigir rutas no encontradas a la raíz
      { path: '**', redirectTo: '' }
    ];
    
    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule] // Exporta RouterModule para que esté disponible en AppModule
    })
    export class AppRoutingModule { }
    
    // archivo: src/app/app.module.ts
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { HttpClientModule } from '@angular/common/http'; // Incluir si se necesita hacer peticiones HTTP
    
    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { MainPageComponent } from './components/main-page/main-page.component'; // Importa tu componente principal
    
    @NgModule({
      declarations: [
        AppComponent,
        MainPageComponent // Declara tu componente principal aquí
      ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        // HttpClientModule // Descomentar si se necesita HttpClient en algún componente
      ],
      providers: [],
      bootstrap: [AppComponent] // AppComponent es el componente inicial
    })
    export class AppModule { }
    
    // archivo: src/app/components/main-page/main-page.component.ts
    import { Component, OnInit } from '@angular/core';
    // import { HttpClient } from '@angular/common/http'; // Descomentar si necesitas HttpClient
    
    @Component({
      selector: 'app-main-page',
      templateUrl: './main-page.component.html',
      styleUrls: ['./main-page.component.css']
    })
    export class MainPageComponent implements OnInit {
      // Propiedades para datos o estado inferido de la imagen
      // ejemplo: titulo: string = 'Título por defecto';
      // ejemplo: items: string[] = ['Item 1', 'Item 2'];
      // ejemplo: formulario = { campo1: '', campo2: '' };
    
      // Inyectar HttpClient si es necesario (descomentar import arriba y en constructor)
      // constructor(private http: HttpClient) { }
      constructor() { }
    
    
      ngOnInit(): void {
        // Lógica de inicialización si es necesaria (ej: cargar datos)
      }
    
      // Métodos para interacción inferida (ej: envío de formulario)
      // onSubmit() {
      //   console.log('Formulario enviado', this.formulario);
      //   // Lógica para enviar datos vía HttpClient
      // }
    }
    
    // archivo: src/app/components/main-page/main-page.component.html
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1 class="text-center">Bienvenido</h1>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Sección Izquierda</h5>
              <p class="card-text">Contenido derivado de la imagen aquí.</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Sección Derecha</h5>
              <p class="card-text">Más contenido de la imagen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    // archivo: src/app/components/main-page/main-page.component.css
    /* Agrega aquí estilos personalizados para main-page si son estrictamente necesarios y se infieren de la imagen */
    /* De lo contrario, deja vacío o con comentarios */
    /* Estilos personalizados para main-page */
    /* .custom-heading { color: purple; } */
    
    
    Formato de salida:
    - Cada archivo **DEBE** comenzar **EXACTAMENTE** con:
    - **NO** agregar ningún texto, comentario, explicación ni separación **adicional** entre los marcadores 
    - **NUNCA** envolver los bloques de código en la respuesta con marcadores de markdown como typescript o json. **SOLO** usar el marcador 
    - **La respuesta debe consistir ÚNICAMENTE en los bloques de archivo delimitados por \// archivo: ... concatenados.**
    
    Importante:
    - La única entrada de diseño es la **IMAGEN** proporcionada. Tu tarea es interpretarla y generar el código para una única página principal (main-page.component.html/ts/css).
    - **ES VITAL seguir estrictamente las plantillas proporcionadas para los archivos de configuración y módulos para asegurar que el proyecto compile (package.json, angular.json, tsconfig*.json, main.ts, polyfills.ts, index.html, app.component.html, app.component.css, app.module.ts, app-routing.module.ts, src/app/app.component.ts).**
    - El contenido de main-page.component.html/ts/css se basara en tu interpretación de la imagen y el uso de Bootstrap.
    - Utiliza las clases de Bootstrap 5 de forma semántica y para layouts responsive basados en la imagen.
    - Extrae el texto de la imagen.
    - El resultado **puede requerir ajustes manuales** en el HTML/CSS/TS del componente principal (la parte generada a partir de la imagen), pero los archivos de configuración y módulos generados a partir de las plantillas deberían ser correctos.
    - Cumplir estrictamente con las versiones y estructura especificada.
    - No inventes ningun texto o contenido adicional que no se encuentre en la imagen.
    `;

    const payload = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: imageMimeType,
              data: imageBase64
            }
          },
          { text: prompt }
        ]
      }]
    };

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, payload, {
      headers: { "Content-Type": "application/json" }
    });

    fs.unlink(imagePath, () => {});

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(500).json({ error: 'Respuesta inválida de Gemini' });
    }

    const code = response.data.candidates[0].content.parts[0].text;
    tempFolder = path.join('/tmp', `angular_image_${uuidv4()}`);
    fs.mkdirSync(tempFolder, { recursive: true });

    const matches = [...code.matchAll(FILE_PATTERN)];

    if (!matches.length) {
      fs.writeFileSync(path.join(tempFolder, 'gemini_raw_response.txt'), code, 'utf-8');
      return res.status(500).json({ error: 'No se encontraron archivos generados.' });
    }

    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + matches[i][0].length;
      const end = matches[i + 1]?.index ?? code.length;
      const filename = matches[i][1].trim();
      const content = code.substring(start, end).trim();
      const fullPath = path.join(tempFolder, filename);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content, 'utf-8');
    }

    zipPath = `${tempFolder}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.directory(tempFolder, false);
    archive.pipe(output);
    await archive.finalize();

    output.on('close', () => {
      res.download(zipPath, 'angular_bootstrap_project.zip', () => {
        fs.rmSync(tempFolder, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      });
    });

  } catch (error) {
    console.error('Error:', error);
    if (tempFolder && fs.existsSync(tempFolder)) fs.rmSync(tempFolder, { recursive: true, force: true });
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    if (!res.headersSent) res.status(500).json({ error: 'Error interno al generar el proyecto.' });
  }
};
