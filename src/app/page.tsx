import { ArrowRight, Github, Linkedin, Mail, Network, Phone, ShieldCheck } from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";
import { HeroOrb } from "@/components/hero-orb";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <AnimatedBackground />
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md border border-cyan-200/25 bg-cyan-200/10 text-sm font-semibold text-cyan-100">
            CS
          </span>
          <span className="text-sm font-medium text-slate-200">Cristian Serrato</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          <a href="#proyectos" className="transition hover:text-cyan-100">Proyectos</a>
          <a href="#infraestructura" className="transition hover:text-cyan-100">Infraestructura</a>
          <a href="/admin" className="transition hover:text-cyan-100">Admin</a>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-82px)] w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs text-cyan-100">
            <ShieldCheck className="size-3.5" />
            Software, infraestructura e inteligencia artificial
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Cristian Serrato
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Ingeniero Electronico con enfoque en desarrollo de software, infraestructura cloud y soporte IT. Experiencia en despliegue de aplicaciones web full stack, administracion basica de servidores Linux y configuracion de entornos en la nube utilizando Amazon Web Services y Render. Conocimientos en desarrollo backend con Python, gestion de bases de datos SQL/NoSQL, consumo de APIs REST y control de versiones con GitHub.
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
            Desarrollo plataformas digitales, automatizacion, sistemas de inteligencia artificial e infraestructura para productos web modernos.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="#proyectos">
                Ver proyectos
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="mailto:cristianserrato1307@gmail.com">
                <Mail className="size-4" />
                Contactar
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="#infraestructura">
                <Network className="size-4" />
                Ver infraestructura
              </a>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-400">
            <a className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2" href="tel:+573124552830">
              <Phone className="size-4 text-cyan-100" />
              +57 3124552830
            </a>
            <a className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2" href="mailto:cristianserrato1307@gmail.com">
              <Mail className="size-4 text-cyan-100" />
              cristianserrato1307@gmail.com
            </a>
            <a className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2" href="https://linkedin.com/in/cristian-serrato-085518334">
              <Linkedin className="size-4 text-cyan-100" />
              LinkedIn
            </a>
            <a className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2" href="https://github.com/cristianserrato-crypto">
              <Github className="size-4 text-cyan-100" />
              GitHub
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="glass scanline relative rounded-lg p-4">
            <HeroOrb />
          </div>
        </div>
      </section>

      <section id="proyectos" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-100/70">Ecosistema</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">Proyectos conectados a producto, IA e infraestructura.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </section>

      <section id="infraestructura" className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
        <div className="glass holo-border grid gap-8 rounded-lg p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-100/70">Infraestructura</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Centro de control privado.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              El panel administrativo concentra metricas de servidor, servicios, proyectos, bases de datos, latencias y logs operativos en tiempo real.
            </p>
            <Button asChild className="mt-6">
              <a href="/admin">
                Abrir admin
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["CPU/RAM", "Nginx", "PostgreSQL", "Cloudflare", "APIs", "WebSockets"].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-slate-950/40 p-4">
                <div className="text-sm font-semibold text-slate-50">{item}</div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-800">
                  <div className="h-full w-3/4 rounded-full bg-cyan-300 shadow-glow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
