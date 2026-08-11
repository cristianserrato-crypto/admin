export type Project = {
  name: string;
  domain: string;
  summary: string;
  status: "Produccion" | "Activo" | "En evolucion" | "Offline";
  icon: "boxes" | "bot" | "finance" | "gem";
  accent: string;
  backgroundImage?: string;
  stats: { label: string; value: string }[];
  technologies: string[];
  details: {
    architecture: string;
    solved: string;
    infrastructure: string;
    metrics: string;
  };
};

export const projects: Project[] = [
  {
    name: "Majic.3D",
    domain: "majic3d.online",
    summary: "Emprendimiento de impresion 3D personalizado, prototipado y diseno generativo.",
    status: "Activo",
    icon: "boxes",
    accent: "from-cyan-300 to-blue-500",
    backgroundImage: "/project-backgrounds/majic.png",
    technologies: ["Web", "Diseno 3D", "Automatizacion", "IA generativa"],
    stats: [
      { label: "Linea", value: "3D" },
      { label: "Canal", value: "Social" },
      { label: "Estado", value: "Online" },
    ],
    details: {
      architecture: "Landing publica con galeria modular, bloques de producto y rutas listas para catalogo.",
      solved: "Centraliza visualmente piezas, prototipos, redes sociales y solicitudes personalizadas.",
      infrastructure: "Preparado para Nginx, Cloudflare y despliegue estatico o Node segun evolucione.",
      metrics: "Seguimiento de visitas, tiempo de respuesta y disponibilidad del dominio.",
    },
  },
  {
    name: "Cerbis",
    domain: "cerbis.online",
    summary: "Asistente conversacional avanzado con avatar holografico, voz local e integraciones IA.",
    status: "En evolucion",
    icon: "bot",
    accent: "from-sky-300 to-cyan-400",
    backgroundImage: "/project-backgrounds/cerbis.png",
    technologies: ["OpenAI", "Gemini", "Python", "WebSockets", "IA conversacional"],
    stats: [
      { label: "Avatar", value: "Holograma" },
      { label: "Voz", value: "Piper" },
      { label: "Modo", value: "Tiempo real" },
    ],
    details: {
      architecture: "Backend Flask, frontend Three.js, TTS local cacheado y panel de conversaciones.",
      solved: "Conversacion natural con experiencia tipo centro de IA, voz sintetizada y memoria operativa.",
      infrastructure: "Servicio systemd dedicado, Nginx como reverse proxy y dominio propio cerbis.online.",
      metrics: "Estado de API, errores recientes, latencia, conversaciones y uso del servicio de voz.",
    },
  },
  {
    name: "FinCSDash",
    domain: "fincsdash.online",
    summary: "Sistema de gestion financiera, KPIs, reportes y dashboards analiticos.",
    status: "Produccion",
    icon: "finance",
    accent: "from-blue-400 to-indigo-500",
    backgroundImage: "/project-backgrounds/fincsdash.png",
    technologies: ["React", "PostgreSQL", "APIs", "Backend analytics"],
    stats: [
      { label: "Datos", value: "SQL" },
      { label: "Vista", value: "KPIs" },
      { label: "Panel", value: "Admin" },
    ],
    details: {
      architecture: "Frontend de analiticas, backend de APIs y base PostgreSQL con reportes.",
      solved: "Permite leer actividad financiera, usuarios y estado operacional desde un panel.",
      infrastructure: "Servicio web detras de Nginx, base de datos PostgreSQL y monitoreo centralizado.",
      metrics: "Usuarios, verificacion, errores, respuesta de APIs y consumo de recursos.",
    },
  },
  {
    name: "Serata",
    domain: "serata.online",
    summary: "Marca digital de joyeria premium con catalogo visual, branding elegante y experiencia ecommerce.",
    status: "Offline",
    icon: "gem",
    accent: "from-cyan-200 to-slate-100",
    technologies: ["Ecommerce", "UI/UX", "Automatizacion", "Branding"],
    stats: [
      { label: "Marca", value: "Premium" },
      { label: "Vista", value: "Catalogo" },
      { label: "Estado", value: "Offline" },
    ],
    details: {
      architecture: "Sitio orientado a catalogo, conversion visual y futuras integraciones de compra.",
      solved: "Da presencia digital elegante a una linea de joyeria con narrativa de marca clara.",
      infrastructure: "Dominio propio, hosting web y monitoreo de disponibilidad desde el admin.",
      metrics: "Estado del sitio, trafico estimado y conversiones cuando se conecte ecommerce.",
    },
  },
];
