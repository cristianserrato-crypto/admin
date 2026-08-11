import type { CSSProperties } from "react";
import { ArrowRight, ExternalLink, Github, Linkedin, Mail, MessageCircle, Network, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { AppleHomeEffects } from "@/components/apple-home-effects";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/projects";

const stackItems = ["Next.js", "Python", "PostgreSQL", "Nginx", "Cloudflare", "AI"];
const whatsappUrl = "https://wa.me/573124552830";
const projectBackgroundStyle = (image?: string): CSSProperties =>
  image ? ({ "--project-bg": `url(${image})` } as CSSProperties) : {};
const onlineProjectCount = projects.filter((project) => project.status !== "Offline").length;

export default function Home() {
  return (
    <main className="section-light min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <AppleHomeEffects />

      <header className="apple-nav fixed inset-x-0 top-0 z-50 border-b border-[var(--border)]/70">
        <div className="mx-auto flex h-12 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="group inline-flex items-center gap-2 text-sm font-semibold tracking-tight" aria-label="Ir al inicio">
            <span className="flex size-7 items-center justify-center rounded-full bg-[var(--text-primary)] text-[11px] font-semibold text-[var(--background)] transition-transform duration-500 apple-ease group-hover:scale-105">
              CS
            </span>
            <span>Cristian Serrato</span>
          </a>
          <nav className="hidden items-center gap-8 text-xs font-medium text-[var(--text-secondary)] md:flex" aria-label="Navegacion principal">
            <a href="#proyectos" className="transition-colors duration-300 hover:text-[var(--text-primary)]">Proyectos</a>
            <a href="#infraestructura" className="transition-colors duration-300 hover:text-[var(--text-primary)]">Infraestructura</a>
            <a href="/admin" className="transition-colors duration-300 hover:text-[var(--text-primary)]">Admin</a>
          </nav>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[var(--primary)] px-4 py-1.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            Contactar
          </a>
        </div>
      </header>

      <section className="hero-intro relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col items-center justify-center px-5 pb-20 pt-28 text-center sm:px-8">
        <div className="reveal flex flex-col items-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] shadow-[var(--shadow-soft)] backdrop-blur-2xl">
            <ShieldCheck className="size-4 text-[var(--primary)]" aria-hidden="true" />
            Software, infraestructura e inteligencia artificial
          </div>
          <h1 className="max-w-5xl text-5xl font-bold leading-none sm:text-7xl lg:text-8xl">
            CRISTIAN ALONSO SERRATO OLAVE
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-xl font-semibold uppercase leading-snug text-[var(--text-primary)] sm:text-2xl lg:text-3xl">
            INGENIERO ELECTRONICO
          </p>
          <div className="mx-auto mt-8 max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase text-[var(--text-secondary)]">PERFIL PROFESIONAL</p>
            <p className="mt-3 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Ingeniero Electronico con enfoque en desarrollo de software, infraestructura cloud y soporte IT. Experiencia en despliegue de aplicaciones web full stack, administracion basica de servidores Linux y configuracion de entornos en la nube utilizando Amazon Web Services y Render. Conocimientos en desarrollo backend con Python, gestion de bases de datos SQL/NoSQL, consumo de APIs REST y control de versiones con GitHub.
            </p>
          </div>
          <p className="sr-only">
            CV de Cristian Alonso Serrato Olave, Ingeniero Electronico.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild>
              <a href="#proyectos">
                Ver proyectos
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="#infraestructura">Explorar infraestructura</a>
            </Button>
          </div>
        </div>

        <div className="reveal mt-14 w-full max-w-6xl" data-parallax="0.08">
          <div className="hero-device mx-auto">
            <div className="hero-device__screen">
              <div className="hero-device__bar" />
              <div className="hero-device__content">
                <div className="hero-device__headline">
                  <span>Ecosistema</span>
                  <strong>{onlineProjectCount} proyectos online</strong>
                </div>
                <div className="hero-device__grid">
                  {projects.map((project) => (
                    <a
                      key={project.name}
                      href={`https://${project.domain}`}
                      className={project.backgroundImage ? "hero-project hero-project--image" : "hero-project"}
                      style={projectBackgroundStyle(project.backgroundImage)}
                      aria-label={`Abrir ${project.name}`}
                    >
                      <span>{project.status}</span>
                      <small>{project.domain}</small>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proyectos" className="section-light min-h-screen px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="reveal mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase text-[var(--text-secondary)]">Ecosistema</p>
            <h2 className="mt-4 text-4xl font-bold text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Todo conectado: producto, datos, IA e infraestructura.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="infraestructura" className="section-dark min-h-screen px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="reveal">
            <p className="text-sm font-semibold uppercase text-[var(--text-secondary)]">Infraestructura</p>
            <h2 className="mt-4 text-4xl font-bold text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              Un centro privado para operar con claridad.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
              El panel administrativo concentra metricas de servidor, servicios, proyectos, bases de datos, latencias y logs operativos en tiempo real.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href="/admin">
                  Abrir admin
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Contactar
                </a>
              </Button>
            </div>
          </div>

          <div className="reveal premium-panel p-5 sm:p-8" data-parallax="0.045">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Control Center</p>
                <h3 className="mt-1 text-2xl font-semibold">Estado operativo</h3>
              </div>
              <Network className="size-7 text-[var(--primary)]" aria-hidden="true" />
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["CPU/RAM", "Nginx", "PostgreSQL", "Cloudflare", "APIs", "WebSockets"].map((item) => (
                <div key={item} className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-secondary)] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{item}</span>
                    <span className="text-[var(--text-secondary)]">Online</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-[var(--primary)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-light min-h-screen px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1440px]">
          <div className="reveal mx-auto max-w-4xl text-center">
            <Sparkles className="mx-auto size-8 text-[var(--primary)]" aria-hidden="true" />
            <h2 className="mt-5 text-4xl font-bold sm:text-5xl lg:text-6xl">Construido para evolucionar.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
              Una base tecnica sobria para lanzar nuevas marcas, administrar servicios y conectar experiencias digitales con monitoreo real.
            </p>
          </div>
          <div className="reveal mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stackItems.map((item) => (
              <div key={item} className="premium-card min-h-36 p-6">
                <div className="text-3xl font-bold">{item}</div>
                <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">Componente activo dentro del ecosistema de producto y operacion.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="section-dark px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 text-sm text-[var(--text-secondary)] md:flex-row md:items-center md:justify-between">
          <p>Cristian Serrato - Software, cloud e inteligencia artificial.</p>
          <div className="flex flex-wrap gap-3">
            <a className="footer-link" href="tel:+573124552830" aria-label="Llamar a Cristian Serrato">
              <Phone className="size-4" aria-hidden="true" />
              +57 3124552830
            </a>
            <a className="footer-link" href="mailto:cristianserrato1307@gmail.com" aria-label="Enviar correo a Cristian Serrato">
              <Mail className="size-4" aria-hidden="true" />
              Email
            </a>
            <a className="footer-link" href="https://linkedin.com/in/cristian-serrato-085518334" aria-label="Abrir LinkedIn de Cristian Serrato">
              <Linkedin className="size-4" aria-hidden="true" />
              LinkedIn
            </a>
            <a className="footer-link" href="https://github.com/cristianserrato-crypto" aria-label="Abrir GitHub de Cristian Serrato">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </a>
            <a className="footer-link" href="#proyectos">
              <ExternalLink className="size-4" aria-hidden="true" />
              Proyectos
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
