# 📊 DataPulse - Plataforma de Análisis de Redes Sociales con IA

> Transforma tus datos de redes sociales en insights accionables con el poder de la Inteligencia Artificial

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xdarwin13/data-analysis-challenge)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

🌐 **Demo en vivo**: [https://data-analysis-challenge.vercel.app/](https://data-analysis-challenge.vercel.app/)

---

## 🎯 ¿Qué es DataPulse?

DataPulse es una aplicación web moderna que utiliza Inteligencia Artificial para analizar datos de redes sociales (Instagram, Facebook, TikTok) y proporcionar insights valiosos para optimizar tu estrategia de contenido digital.

### ✨ Características Principales

- 🤖 **Limpieza de Datos con IA**: Procesamiento automático e inteligente de datos usando Groq AI
- 📈 **Análisis Avanzado**: Identifica patrones de éxito y detecta oportunidades de mejora
- ⏰ **Optimización Temporal**: Descubre los mejores días y horarios para publicar
- 💬 **Chatbot Especializado**: Asistente IA experto en estrategias de redes sociales
- 📊 **Visualización Interactiva**: Gráficos y métricas en tiempo real
- 🎨 **Interfaz Moderna**: Diseño intuitivo y responsivo con Tailwind CSS
- 📁 **Soporte Multi-formato**: Compatible con CSV y Excel (XLSX/XLS)
- 🔒 **Procesamiento Seguro**: Tus datos se procesan de forma segura y privada

---

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico

```
Frontend:
├── Next.js 16.0 (React Framework)
├── TypeScript (Type Safety)
├── Tailwind CSS (Styling)
└── Radix UI + shadcn/ui (UI Components)

Backend:
├── Next.js API Routes (Serverless Functions)
├── Groq AI SDK (LLM Integration)
└── CSV/Excel Parser (Data Processing)

Deployment:
└── Vercel (Production & Preview)
```

### Estructura de Directorios

```
data-analysis-challenge/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page con features y CTA
│   ├── layout.tsx                # Layout principal con providers
│   ├── globals.css               # Estilos globales
│   │
│   ├── dashboard/                # Dashboard de análisis
│   │   └── page.tsx              # Interfaz principal de análisis
│   │
│   ├── powerbi-dashboard/        # Vista Power BI (opcional)
│   │   └── page.tsx
│   │
│   └── api/                      # API Routes (Serverless)
│       ├── clean-data/
│       │   └── route.ts          # Endpoint de limpieza de datos con IA
│       └── chatbot/
│           └── route.ts          # Endpoint del chatbot streaming
│
├── components/                   # Componentes React
│   ├── file-upload.tsx           # Componente de carga de archivos
│   ├── data-preview.tsx          # Vista previa de datos
│   ├── data-analysis.tsx         # Visualización de análisis
│   ├── social-media-chatbot.tsx  # Interfaz del chatbot
│   ├── sample-data-download.tsx  # Descarga de datos de ejemplo
│   ├── powerbi-dashboard.tsx     # Integración Power BI
│   │
│   └── ui/                       # Componentes UI reutilizables
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── progress.tsx
│       └── ... (más componentes)
│
├── lib/                          # Utilidades y helpers
│   └── utils.ts                  # Funciones auxiliares (cn, etc.)
│
├── hooks/                        # Custom React Hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── public/                       # Archivos estáticos
│   ├── sample-data.csv           # Datos de ejemplo
│   ├── dirty-data.csv            # Datos sucios para demo
│   └── dirty-data-test.csv
│
├── styles/                       # Estilos adicionales
│   └── globals.css
│
├── next.config.mjs               # Configuración de Next.js
├── tailwind.config.ts            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
├── components.json               # Configuración de shadcn/ui
└── package.json                  # Dependencias del proyecto
```

---

## 🔄 Flujo de Funcionamiento

### 1. Página de Inicio (Landing Page)

```
Usuario → Landing Page → Explora Features → Click "Comenzar gratis"
```

- Presenta la propuesta de valor del producto
- Muestra características clave con animaciones
- CTA (Call-to-Action) hacia el dashboard

### 2. Dashboard de Análisis

```
Dashboard → Upload File → Processing Pipeline → Results + Chatbot
```

#### Pipeline de Procesamiento:

```typescript
1. Upload de Archivo (CSV/XLSX)
   ↓
2. Lectura del contenido
   ↓
3. Parsing inicial (headers + rows)
   ↓
4. Pre-limpieza (eliminar nulls en columnas críticas)
   ↓
5. Envío a API /clean-data
   ↓
6. Análisis con Groq AI (LLaMA 3.3 70B)
   ↓
7. Respuesta con datos limpios + análisis
   ↓
8. Visualización de resultados
   ↓
9. Chatbot disponible para consultas
```

### 3. API de Limpieza de Datos

**Endpoint**: `POST /api/clean-data`

```typescript
// Proceso:
1. Recibe archivo via FormData
2. Convierte a texto y parsea CSV
3. Pre-limpia datos (elimina filas con nulls)
4. Construye prompt para IA con reglas específicas
5. Groq AI procesa y devuelve:
   - cleanedData: Array de registros limpios
   - summary: Estadísticas agregadas
   - insights: Patrones y recomendaciones
   - bestTimes: Horarios óptimos
   - contentTypes: Análisis por tipo de contenido
```

**Reglas de Limpieza IA**:
- ✅ Mantener valores 0 (son datos válidos)
- ❌ Eliminar filas con nulls en columnas críticas
- 📅 Normalizar fechas a YYYY-MM-DD
- 🔢 Convertir números a formato numérico
- 🧮 Calcular engagement rate: `((Likes + Comentarios + Compartidos) / Alcance) * 100`
- 🚫 Eliminar outliers extremos

### 4. Chatbot de Redes Sociales

**Endpoint**: `POST /api/chatbot` (Streaming)

```typescript
// Características:
- Modelo: LLaMA 3.3 70B Versatile (via Groq)
- Streaming: Respuestas en tiempo real
- Contexto: Incluye datos del usuario si están disponibles
- Especialización: Solo temas de redes sociales
- Límites: Rechaza temas fuera de scope
```

**Capacidades del Chatbot**:
- 📱 Estrategias de contenido para IG, FB, TikTok
- ⏰ Mejores horarios para publicar
- 💡 Ideas creativas de contenido
- 📊 Análisis de métricas
- #️⃣ Sugerencias de hashtags
- 🎯 Optimización de engagement

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ instalado
- Cuenta en [Groq](https://console.groq.com/) para API keys
- pnpm (recomendado) o npm

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/xdarwin13/data-analysis-challenge.git
cd data-analysis-challenge
```

2. **Instalar dependencias**

```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` en la raíz del proyecto:

```env
GROQ_API_KEY=tu_api_key_aqui
GROQ_API_KEY2=tu_api_key_2_aqui
```

> **Nota**: Necesitas obtener tus API keys desde [Groq Console](https://console.groq.com/keys)

4. **Ejecutar en desarrollo**

```bash
pnpm dev
# o
npm run dev
```

5. **Abrir en el navegador**

```
http://localhost:3000
```

### Scripts Disponibles

```json
{
  "dev": "next dev",           // Desarrollo con hot-reload
  "build": "next build",       // Build de producción
  "start": "next start",       // Servidor de producción
  "lint": "eslint ."          // Linting del código
}
```

---

## 🎨 Componentes Principales

### FileUpload Component

Maneja la carga de archivos con drag & drop:

```typescript
<FileUpload 
  onFileSelect={(file) => handleFileUpload(file)}
  isProcessing={isProcessing}
/>
```

### DataPreview Component

Muestra una vista previa tabular de los datos:

```typescript
<DataPreview 
  data={cleanedData.cleanedData}
  summary={cleanedData.summary}
/>
```

### DataAnalysis Component

Renderiza gráficos y análisis visual:

```typescript
<DataAnalysis 
  data={cleanedData}
/>
```

### SocialMediaChatbot Component

Chatbot interactivo con streaming:

```typescript
<SocialMediaChatbot 
  userData={cleanedData}
/>
```

---

## 🌐 Despliegue en Vercel

El proyecto está optimizado para despliegue en Vercel:

### Deploy Automático

1. **Conectar repositorio en Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Importar tu repositorio de GitHub

2. **Configurar variables de entorno**
   - Agregar `GROQ_API_KEY` en Settings → Environment Variables
   - Agregar `GROQ_API_KEY2` en Settings → Environment Variables

3. **Deploy**
   - Vercel detecta automáticamente Next.js
   - Deploy se ejecuta en cada push a `main`

### Deploy Manual

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

**URL de Producción**: [https://data-analysis-challenge.vercel.app/](https://data-analysis-challenge.vercel.app/)

---

## 📊 Uso de la Aplicación

### 1. Preparar tus Datos

Formato CSV esperado:

```csv
Fecha,Hora,Plataforma,Tipo,Likes,Comentarios,Compartidos,Alcance,Impresiones
2024-01-15,14:30,Instagram,Foto,150,20,5,1200,1500
2024-01-16,18:00,TikTok,Video,890,45,120,5000,6500
```

**Columnas requeridas**:
- `Fecha`: Fecha de publicación
- `Hora`: Hora de publicación
- `Plataforma`: Instagram, Facebook, o TikTok
- `Tipo`: Tipo de contenido (Foto, Video, Carrusel, etc.)
- `Likes`: Número de likes
- `Comentarios`: Número de comentarios
- `Compartidos`: Número de compartidos
- `Alcance`: Alcance de la publicación
- `Impresiones`: Impresiones totales

### 2. Subir Archivo

- Arrastra tu archivo CSV/XLSX a la zona de carga
- O click en "Seleccionar archivo" para buscar

### 3. Análisis Automático

El sistema automáticamente:
- ✅ Limpia los datos
- ✅ Calcula engagement rate
- ✅ Identifica patrones
- ✅ Genera recomendaciones
- ✅ Encuentra mejores horarios

### 4. Explorar Resultados

- **Vista General**: Estadísticas clave (total posts, avg engagement, etc.)
- **Problemas Detectados**: Issues encontrados en los datos
- **Insights IA**: Recomendaciones personalizadas
- **Mejores Horarios**: Días y horas óptimas para publicar
- **Por Tipo de Contenido**: Análisis por formato

### 5. Consultar al Chatbot

Haz preguntas como:
- "¿Qué tipo de contenido debo crear?"
- "¿Cuándo es mejor publicar en Instagram?"
- "¿Cómo mejorar mi engagement?"
- "Dame ideas para Reels"

---

## 🔑 Tecnologías y Librerías Clave

### Core Framework
- **Next.js 16.0**: Framework React con App Router
- **React 19**: Biblioteca UI con Server Components
- **TypeScript**: Tipado estático

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Primitivos de UI accesibles
- **shadcn/ui**: Componentes pre-construidos
- **Lucide React**: Iconos modernos
- **Class Variance Authority**: Gestión de variantes de estilos

### AI & Data
- **Groq SDK**: Integración con LLMs ultra-rápidos
- **LLaMA 3.3 70B**: Modelo de lenguaje de Groq

### Forms & Validation
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas

### Utilities
- **clsx**: Utilidad para clases condicionales
- **date-fns**: Manipulación de fechas
- **cmdk**: Command palette
- **Embla Carousel**: Carruseles reactivos

---

## 🎯 Casos de Uso

### Para Content Creators
- Analiza qué tipo de contenido genera más engagement
- Descubre los mejores momentos para publicar
- Optimiza tu calendario de contenido

### Para Social Media Managers
- Reportes automáticos de rendimiento
- Insights basados en datos reales
- Recomendaciones de estrategia

### Para Pequeños Negocios
- Maximiza el ROI de tus redes sociales
- Identifica qué publicaciones generan más conversiones
- Planifica contenido data-driven

### Para Agencias
- Análisis multi-cliente
- Reportes profesionales
- Optimización de campañas

---

## 🛠️ Configuración Avanzada

### Personalizar el Modelo de IA

Editar `app/api/clean-data/route.ts`:

```typescript
const completion = await groq.chat.completions.create({
  messages: [...],
  model: "llama-3.3-70b-versatile", // Cambiar modelo
  temperature: 0.7,                  // Ajustar creatividad
  max_tokens: 2048,                  // Máximo de tokens
})
```

### Agregar Nuevas Plataformas

1. Actualizar tipos en componentes
2. Agregar validación en API
3. Actualizar prompt de IA con contexto de la nueva plataforma

### Modificar Reglas de Limpieza

Editar el prompt en `app/api/clean-data/route.ts`:

```typescript
const prompt = `
  Tus reglas personalizadas aquí...
`
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Próximas Funcionalidades

- [ ] Integración con APIs de redes sociales (Instagram Graph API, etc.)
- [ ] Exportación de reportes en PDF
- [ ] Dashboard colaborativo multi-usuario
- [ ] Análisis de competidores
- [ ] Predicciones con Machine Learning
- [ ] Integración con herramientas de calendario
- [ ] Notificaciones de mejores horarios
- [ ] A/B testing de contenido

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autor

**Darwin**
- GitHub: [@xdarwin13](https://github.com/xdarwin13)

---

## 🙏 Agradecimientos

- [Groq](https://groq.com/) por su increíble infraestructura de IA
- [Vercel](https://vercel.com/) por el hosting
- [shadcn](https://ui.shadcn.com/) por los componentes UI
- Comunidad de Next.js

---

## 📞 Soporte

¿Tienes preguntas o problemas?

- 🐛 [Reportar un bug](https://github.com/xdarwin13/data-analysis-challenge/issues)
- 💡 [Solicitar una feature](https://github.com/xdarwin13/data-analysis-challenge/issues)
- 📧 Contacto directo (agregar tu email si deseas)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

Hecho con ❤️ y ☕ por Darwin Y Camilo

[🌐 Ver Demo](https://data-analysis-challenge.vercel.app/) • [📖 Documentación](https://github.com/xdarwin13/data-analysis-challenge) • [🐛 Reportar Bug](https://github.com/xdarwin13/data-analysis-challenge/issues)

</div>
