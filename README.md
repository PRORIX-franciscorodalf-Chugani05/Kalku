# Calculator

![Calculator logo](calc/resources/images/logo.png)

## Presentación

Bienvenido a la nueva calculadora multiplataforma construida con Expo y React Native. La app combina un diseño colorido con un motor aritmético completo: historial interactivo, soporte de paréntesis, límites de dígitos inteligentes y detección del tema del sistema. Todo listo para ejecutarse en iOS, Android o web desde el mismo código base.

---

## Características principales

- **Motor avanzado:** operaciones encadenadas, porcentajes, inversión de signo y hasta 11 dígitos significativos con manejo de errores.
- **Historial inteligente:** guarda los últimos cálculos, permite reinsertarlos en pantalla y eliminarlos individualmente.
- **Paréntesis dinámicos:** botón contextual que abre o cierra paréntesis según la expresión actual.
- **Temas adaptativos:** se alinea con el tema del dispositivo y aun así ofrece un interruptor manual claro/oscuro.
- **Diseño responsive:** botones y tipografía se ajustan automáticamente a móviles, tablets y web; el display mantiene altura constante.
- **UI moderna:** logo integrado, colores personales y fondo que cubre toda el área disponible respetando las zonas seguras.

---

## Requisitos

- Node.js 18+
- npm o pnpm (probado con npm)
- Expo CLI (`npm install -g expo-cli`, opcional si utilizas `npx`)

---

## Cómo empezar

```bash
cd calc
npm install
npm start
```

Desde la interfaz de Expo podrás abrir la app en:

- **iOS:** presiona `i` para lanzar el simulador.
- **Android:** presiona `a` o escanea el QR con la app Expo Go.
- **Web:** selecciona la opción `w`.

---

## Estructura del proyecto

```
calc/
├── app/                 # Rutas Expo Router y pantalla principal
├── components/          # Componentes reutilizables (botones, etc.)
├── context/             # Contextos como el de tema
├── resources/images/    # Logo y recursos gráficos
├── styles/              # Paleta y estilos globales
├── tsconfig.json        # Alias y configuración TypeScript
└── package.json         # Dependencias y scripts
```

---

## Scripts útiles

| Comando            | Descripción                          |
|--------------------|--------------------------------------|
| `npm start`        | Inicia el servidor de desarrollo     |
| `npm run android`  | Abre la app en un emulador Android   |
| `npm run ios`      | Abre la app en un simulador iOS      |
| `npm run web`      | Lanza la versión web                 |
| `npm run lint`     | Ejecuta las reglas de ESLint / Expo  |

---

## Roadmap sugerido

- Añadir tests automatizados de la lógica del motor.
- Internacionalización de los textos de la interfaz.
- Persistencia del historial en almacenamiento local.

---

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
