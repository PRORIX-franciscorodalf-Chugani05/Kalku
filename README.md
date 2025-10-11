# Kalku

<div align="center">
  <img src="./imgs/kalku.png" alt="Kalku" width="200">
</div>

**Kalku** es una calculadora multiplataforma moderna construida con **Expo** y **React Native**. Combina un diseño colorido y amigable con un motor aritmético completo: historial interactivo, soporte de paréntesis, límites de dígitos inteligentes y detección automática del tema del sistema. Todo listo para ejecutarse en **iOS**, **Android** y **Web** desde el mismo código base.

## Tabla de contenidos

- [Características principales](#características-principales)
- [Requisitos](#requisitos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts útiles](#scripts-útiles)


## Características principales

* **Motor avanzado:** operaciones encadenadas, porcentajes, inversión de signo y hasta 11 dígitos significativos con manejo de errores.
* **Historial inteligente:** guarda los últimos cálculos, permite reinsertarlos y eliminarlos individualmente.
* **Paréntesis dinámicos:** botón contextual que abre o cierra paréntesis según la expresión actual.
* **Temas adaptativos:** se sincroniza con el tema del sistema, con opción manual claro/oscuro.
* **Diseño responsive:** botones y tipografía ajustables a móviles, tablets y web; display mantiene altura constante.
* **Interfaz moderna:** logo integrado, colores personalizables y fondo que cubre toda el área respetando zonas seguras.


## Requisitos

* **Node.js:** v18 o superior
* **npm**
* **Expo CLI** (`npm install -g expo-cli`) — opcional si usas `npx`


## Estructura del proyecto

```
calc/
├── app/                 # Rutas Expo Router y pantalla principal
├── components/          # Componentes reutilizables (botones, display, etc.)
├── context/             # Contextos como el de tema
├── assets/images/       # Logo y recursos gráficos
├── styles/              # Paleta y estilos globales
├── tsconfig.json        # Configuración y alias de TypeScript
└── package.json         # Dependencias y scripts
```

```
calc/
├── app/                 # Rutas Expo Router y pantalla principal
├── components/          # Componentes reutilizables (botones, display, etc.)
├── context/             # Contextos como el de tema
├── assets/images/       # Logo y recursos gráficos
├── styles/              # Paleta y estilos globales
├── tsconfig.json        # Configuración y alias de TypeScript
└── package.json         # Dependencias y scripts
```


## Puesta en marcha

```bash
npm install
npm run start
```

Desde la interfaz de **Expo**, abre la app en:

* **iOS:** presiona `i` para abrir el simulador.
* **Android:** presiona `a` o escanea el QR con **Expo Go**.
* **Web:** selecciona la opción `w`.


## Scripts útiles

| Comando           | Descripción                        |
| ----------------- | ---------------------------------- |
| `npm start`       | Inicia el servidor de desarrollo   |
| `npm run android` | Abre la app en un emulador Android |
| `npm run ios`     | Abre la app en un simulador iOS    |
| `npm run web`     | Lanza la versión web de la app     |
| `npm run lint`    | Ejecuta ESLint con reglas de Expo  |
