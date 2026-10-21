<p align="center">
  <img src="https://img.shields.io/badge/🎬_ScriptForge-AI-FF4500?style=for-the-badge" alt="ScriptForge AI" />
  <img src="https://img.shields.io/badge/TypeScript-96%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Bilingual-EN_|_AR-F59E0B?style=for-the-badge" alt="Bilingual" />
</p>

<h1 align="center">🎬 ScriptForge AI</h1>

<p align="center">
  <strong>Convierte cualquier idea en un guion de video impactante en segundos.</strong><br/>
  Prompt de agente de IA optimizado para YouTube, TikTok, Reels y contenido educativo.<br/>
  Soporta inglés y árabe.
</p>

<p align="center">
  <a href="https://scriptforgeaii.lovable.app/">🌐 Demo en Vivo</a> &nbsp;·&nbsp;
  <a href="#-features">✨ Características</a> &nbsp;·&nbsp;
  <a href="#-tech-stack">⚙️ Stack Tecnológico</a> &nbsp;·&nbsp;
  <a href="#-getting-started">🚀 Primeros Pasos</a>
</p>

---

## 🔍 Descripción General

**ScriptForge AI** es un generador de guiones de video impulsado por IA que transforma ideas brutas en guiones listos para producción, adaptados a las plataformas modernas de redes sociales. Ya sea que estés creando contenido de formato largo para YouTube, hooks para TikTok, Instagram Reels o videos educativos explicativos, ScriptForge crea guiones atractivos y optimizados para cada plataforma con el tono, ritmo y estructura adecuados.

---

## ✨ Características

### 🤖 Generación de Guiones con IA
- **Creación Instantánea de Guiones** — Describe tu idea y obtén un guion de video pulido en segundos.
- **Optimización Específica por Plataforma** — Guiones adaptados para YouTube, TikTok, Instagram Reels y formatos educativos.
- **Escritura Basada en "Hooks"** — Cada guion comienza con un gancho diseñado para capturar la atención del usuario inmediatamente.
- **Marco Viral** — Patrones integrados para fomentar el engagement, la retención y el llamado a la acción (CTA).

### 🌍 Soporte Bilingüe
- **Inglés y Árabe** — Soporte completo para ambos idiomas.
- **Diseño RTL** — Interfaz nativa de derecha a izquierda para creadores de contenido en árabe.
- **Adaptación Cultural** — Guiones que resuenan con las audiencias regionales.

### 💰 Monetización y Autenticación
- **Autenticación de Usuarios** — Registro e inicio de sesión seguro a través de Supabase Auth.
- **Planes de Suscripción** — Monetización integrada con niveles de acceso.
- **Seguimiento de Uso** — Monitoreo de créditos de generación de guiones y consumo.

### 🎯 Tipos de Contenido
- 📹 Guiones de formato largo para YouTube con capítulos y marcas de tiempo.
- 📱 Formato corto para TikTok / Reels con ganchos y transiciones.
- 🎓 Contenido educativo y explicativo con estructura clara.
- 📢 Guiones de marketing y promocionales con CTAs.

---

## ⚙️ Stack Tecnológico

| Tecnología | Propósito |
|-----------|---------|
| [TypeScript](https://www.typescriptlang.org/) | Lógica de aplicación con tipado seguro (96%) |
| [React 18](https://react.dev/) | Framework de UI basado en componentes |
| [Vite](https://vitejs.dev/) | Herramientas de construcción ultrarrápidas |
| [Supabase](https://supabase.com/) | Auth, base de datos (PostgreSQL) y backend |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes de UI accesibles y personalizables |
| [Tailwind CSS](https://tailwindcss.com/) | Framework de CSS orientado a utilidades |
| [PL/pgSQL](https://www.postgresql.org/) | Funciones de base de datos y procedimientos almacenados |
| [Lovable](https://lovable.dev/) | Plataforma de desarrollo impulsada por IA |

---

## 📐 Arquitectura

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│         React + TypeScript + Vite            │
│              shadcn/ui + Tailwind            │
├──────────────┬──────────────────────────────┤
│   Flujo Auth  │      Motor de Guiones         │
│  (Supabase)  │   Prompt IA → Salida Guion    │
├──────────────┴──────────────────────────────┤
│              Backend de Supabase             │
│   PostgreSQL  ·  Auth  ·  Edge Functions     │
│   Seguridad a Nivel de Fila  ·  Realtime      │
└─────────────────────────────────────────────┘
```

---

## 🚀 Primeros Pasos

### Requisitos Previos

- [Node.js](https://nodejs.org/) v18+
- npm o [bun](https://bun.sh/)
- Proyecto de [Supabase](https://supabase.com/) (para auth y base de datos)

### Variables de Entorno

Crea un archivo `.env` local en el directorio raíz copiando el archivo `.env.example`:

```bash
cp .env.example .env
```

Luego, reemplaza cada marcador de posición con los valores de tu propio proyecto de Supabase. Mantén las credenciales reales y los valores específicos de despliegue en tu entorno local o en los secretos de Supabase, y nunca los subas al control de versiones.

```env
VITE_SUPABASE_PUBLISHABLE_KEY=replace-with-your-supabase-publishable-key
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/3h0ll7/scriptforge-ai.git

# Navegar al directorio del proyecto
cd scriptforge-ai

# Instalar dependencias
npm install
# o
bun install

# Iniciar el servidor de desarrollo
npm run dev
# o
bun dev
```

La aplicación estará disponible en `http://localhost:5173`

### Configuración de Supabase

```bash
# Vincular tu proyecto de Supabase
npx supabase link --project-ref your-project-ref

# Aplicar migraciones de base de datos
npx supabase db push
```

Para la edge function `create-checkout`, establece `APP_BASE_URL` en los secretos de tu proyecto de Supabase (no en tu archivo `.env` local) para que las redirecciones de éxito/cancelación de pago devuelvan a los usuarios al dominio desplegado correcto.

### Compilar para Producción

```bash
npm run build
# o
bun run build
```

---

## 📁 Estructura del Proyecto

```
scriptforge-ai/
├── public/                # Activos estáticos
├── src/
│   ├── components/        # Componentes de UI reutilizables
│   ├── pages/             # Páginas de rutas
│   ├── hooks/             # Hooks de React personalizados
│   ├── lib/               # Utilidades y cliente de Supabase
│   ├── services/          # Lógica de generación de guiones IA
│   └── styles/            # Estilos globales
├── supabase/
│   ├── migrations/        # Migraciones del esquema de base de datos
│   └── functions/         # Edge functions
├── .env.example           # Plantilla segura de entorno
├── .env                   # Variables de entorno locales (gitignored)
├── vite.config.ts         # Configuración de Vite
├── tailwind.config.ts     # Configuración de Tailwind
└── tsconfig.json          # Configuración de TypeScript
```

---

## 🎯 Casos de Uso

| Audiencia | Caso de Uso |
|----------|----------|
| 🎥 **YouTubers** | Generar guiones estructurados de formato largo con hooks, capítulos y CTAs |
| 📱 **Creadores de TikTok** | Crear guiones cortos virales con patrones en tendencia |
| 🎓 **Educadores** | Construir guiones explicativos claros y atractivos para cursos y tutoriales |
| 📈 **Marketers** | Crear guiones de video promocionales optimizados para conversiones |
| 🌐 **Creadores Árabes** | Producir guiones nativos en árabe con un tono culturalmente relevante |

---

## 🗺️ Hoja de Ruta (Roadmap)

- [x] Motor principal de generación de guiones IA
- [x] Plantillas para YouTube, TikTok y Reels
- [x] Soporte bilingüe Inglés y Árabe
- [x] Autenticación de Supabase y cuentas de usuario
- [x] Monetización y niveles de suscripción
- [ ] Historial de guiones y favoritos
- [ ] Colaboración en equipo y espacios de trabajo compartidos
- [ ] Acceso a API para integraciones de terceros
- [ ] Integración de generación de locuciones (voice-over)
- [ ] Panel de analíticas para el rendimiento de los guiones

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Aquí te decimos cómo involucrarte:

1. Haz un fork del repositorio
2. Crea tu rama de característica (`git checkout -b feature/new-template`)
3. Haz commit de tus cambios (`git commit -m 'feat: add new script template'`)
4. Haz push a la rama (`git push origin feature/new-template`)
5. Abre un Pull Request

---

## 📊 Estadísticas

<p align="center">
  <img src="https://img.shields.io/github/last-commit/3h0ll7/scriptforge-ai?style=flat-square&color=FF4500" alt="Last Commit" />
  <img src="https://img.shields.io/github/commit-activity/m/3h0ll7/scriptforge-ai?style=flat-square&color=06B6D4" alt="Commit Activity" />
  <img src="https://img.shields.io/github/repo-size/3h0ll7/scriptforge-ai?style=flat-square&color=10B981" alt="Repo Size" />
</p>

---

## 📜 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

## 🙏 Agradecimientos

- Construido con [Lovable](https://lovable.dev/) — Plataforma de desarrollo impulsada por IA
- Backend impulsado por [Supabase](https://supabase.com/)
- Componentes de UI de [shadcn/ui](https://ui.shadcn.com/)

---

<p align="center">
  <strong>🎬 Deja de mirar una página en blanco. Comienza a forjar guiones.</strong><br/><br/>
  <a href="https://scriptforgeaii.lovable.app/">
    <img src="https://img.shields.io/badge/🚀_Prueba_ScriptForge-Demo_en_Vivo-FF4500?style=for-the-badge" alt="Try ScriptForge AI" />
  </a>
</p>
