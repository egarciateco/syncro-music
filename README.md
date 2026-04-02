# 🎵 Syncro Music — Guía Completa de Instalación y Uso

## Videos integrados
- **Presentación (Splash):** `https://res.cloudinary.com/dkdvhes2i/video/upload/v1775151583/Video_para_Syncro_slfqma.mp4`
- **Podcast/Radio:** `https://res.cloudinary.com/dkdvhes2i/video/upload/v1775151584/Microfono_nw64oe.mp4`

---

## 🚀 OPCIÓN 1 — Expo Snack (sin instalar nada en la PC)

### Paso 1: Abrir Expo Snack
1. Abre tu navegador y ve a: **https://snack.expo.dev**
2. Crea una cuenta gratuita o inicia sesión con Google
3. Haz clic en **"New Snack"**

### Paso 2: Subir los archivos
Hay dos formas de hacerlo:

**Forma A — Subir archivos uno por uno:**
1. En el panel izquierdo de Snack, haz clic en el ícono de carpeta
2. Haz clic en el botón **"+"** para agregar archivo
3. Copia el nombre exacto del archivo y pega el contenido de cada archivo
4. Sube todos los archivos respetando la estructura de carpetas

**Forma B — GitHub (recomendado):**
1. Crea una cuenta en **github.com**
2. Crea un repositorio nuevo llamado `syncro-music`
3. Sube toda la carpeta `syncro-music` al repositorio
4. En Expo Snack, haz clic en **"Import from GitHub"**
5. Pega la URL de tu repositorio

### Paso 3: Probar en tu celular
1. Descarga la app **"Expo Go"** en tu celular (gratis en App Store / Google Play)
2. En Expo Snack, verás un código QR a la derecha
3. Escanea ese código QR con la cámara de tu celular o con Expo Go
4. ¡La app se abrirá en tu celular!

---

## 🚀 OPCIÓN 2 — Con Node.js instalado (si consigues instalarlo)

```bash
# 1. Abrir terminal en la carpeta del proyecto
cd C:\Users\u602202\.gemini\antigravity\scratch\syncro-music

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npx expo start

# 4. Escanear el QR con Expo Go en el celular
```

---

## 📁 Estructura de Archivos del Proyecto

```
syncro-music/
├── App.tsx                          ← Punto de entrada principal
├── app.json                         ← Configuración de Expo
├── package.json                     ← Dependencias
├── babel.config.js                  ← Configuración Babel
├── tsconfig.json                    ← Configuración TypeScript
├── assets/
│   ├── icon.png                     ← Ícono de la app
│   ├── splash.png                   ← Imagen de fondo splash
│   └── adaptive-icon.png            ← Ícono adaptativo Android
└── src/
    ├── types/
    │   └── declarations.d.ts        ← Tipos externos
    ├── constants/
    │   ├── colors.ts                ← Paleta de colores
    │   └── filters.ts               ← Categorías de filtros
    ├── services/
    │   ├── jamendo.ts               ← API música (Jamendo)
    │   ├── radioService.ts          ← API radios del mundo
    │   ├── storageService.ts        ← Almacenamiento local
    │   └── shareService.ts          ← Compartir por WS/Bluetooth
    ├── store/
    │   ├── playerStore.ts           ← Estado del reproductor
    │   ├── userStore.ts             ← Estado del usuario
    │   └── adminStore.ts            ← Configuración admin
    ├── navigation/
    │   └── AppNavigator.tsx         ← Navegación
    ├── components/
    │   ├── AppHeader.tsx            ← Header con logo (todas las pantallas)
    │   ├── AppFooter.tsx            ← Banner + botón Premium
    │   ├── KeypadModal.tsx          ← Teclado tipo cajero ATM
    │   ├── TrackCard.tsx            ← Tarjeta de canción
    │   ├── FilterGrid.tsx           ← Grid cuadrado de filtros
    │   ├── FilterOptions.tsx        ← Opciones circulares de filtros
    │   └── MiniPlayer.tsx           ← Mini reproductor persistente
    └── screens/
        ├── SplashScreen.tsx         ← Video de presentación (3s)
        ├── HomeScreen.tsx           ← Pantalla principal
        ├── PlayerScreen.tsx         ← Reproductor completo
        ├── FavoritesScreen.tsx      ← Tus Favoritos
        ├── SavedScreen.tsx          ← Carpetas guardadas (Premium)
        ├── PremiumScreen.tsx        ← Beneficios + MercadoPago
        ├── OfflineScreen.tsx        ← Modo sin internet (Premium)
        ├── RadioScreen.tsx          ← Radios en vivo (Premium)
        ├── AccessResultScreen.tsx   ← Pantalla verde/roja
        └── admin/
            └── AdminDashboard.tsx   ← Panel de administrador
```

---

## 🔑 Datos importantes

| Concepto | Valor |
|----------|-------|
| **Código de Administrador** | `5753` |
| **API de Música** | Jamendo (gratuita, Creative Commons) |
| **API de Radios** | Radio Browser (gratuita, mundial) |
| **Pagos** | MercadoPago (Preference ID ya configurado) |
| **MercadoPago Preference ID** | `2993211976-7e998a4f-4658-41bb-94d0-4340e2d43561` |

---

## 🎬 Videos de la App

### Video de Presentación (Splash Screen)
**URL:** `https://res.cloudinary.com/dkdvhes2i/video/upload/v1775151583/Video_para_Syncro_slfqma.mp4`

Se reproduce automáticamente durante 3 segundos al abrir la app.

### Video para Radios/Podcasts
**URL:** `https://res.cloudinary.com/dkdvhes2i/video/upload/v1775151584/Microfono_nw64oe.mp4`

Para agregar más videos, súbelos a Cloudinary y usa la URL directa en el código.

---

## 💳 Configuración de MercadoPago

El botón de pago Premium ya está configurado con el Preference ID del administrador. Para actualizar el precio:
1. Inicia sesión en **mercadopago.com.ar** como vendedor
2. Crea una nueva preferencia de pago con el nuevo precio
3. Obtén el nuevo Preference ID
4. Ingresa a la app como administrador (código `5753`)
5. En el Panel de Control → sección Pagos → pega el nuevo Preference ID

---

## 📱 Funcionalidades por pantalla

| Pantalla | Acceso | Descripción |
|----------|--------|-------------|
| Splash | Siempre | Video 3s → va al Home |
| Home | Siempre | Búsqueda con 8 filtros + lista de temas |
| Reproductor | Siempre | Play/Pausa/Stop/Siguiente/Anterior |
| Favoritos | Siempre | Auto-guardados al reproducir |
| Carpetas | **Premium** | Organiza temas en carpetas |
| Modo Offline | **Premium** | Temas descargados sin internet |
| Radios | **Premium** | Radios de Argentina y el mundo |
| Panel Admin | Código 5753 | Configurar precios, pagos, códigos |

---

## ❓ Preguntas Frecuentes

**P: ¿Cómo activo el modo de prueba Premium?**
R: En la pantalla Premium → botón "Activar modo demo Premium (prueba)"

**P: ¿Cómo accedo como administrador?**
R: En el home, toca el ícono del teclado (esquina superior derecha) → ingresa `5753`

**P: ¿De dónde viene la música?**
R: De [Jamendo](https://jamendo.com) — 100% gratuita y legal bajo licencia Creative Commons

**P: ¿Cuántas radios hay disponibles?**
R: Miles de radios de todo el mundo via [Radio Browser](https://radio-browser.info)
