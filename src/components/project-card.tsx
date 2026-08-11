"use client";

import type { CSSProperties } from "react";
import { BadgeDollarSign, Bot, Boxes, ChevronDown, ExternalLink, Gem } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const icons = {
    boxes: Boxes,
    bot: Bot,
    finance: BadgeDollarSign,
    gem: Gem,
  };
  const Icon = icons[project.icon];
  const backgroundStyle = project.backgroundImage
    ? ({ "--project-bg": `url(${project.backgroundImage})` } as CSSProperties)
    : undefined;

  return (
    <article className="reveal premium-card group overflow-hidden" style={{ transitionDelay: `${index * 80}ms` }}>
      <div
        className={project.backgroundImage ? "project-showcase project-showcase--image relative min-h-72 overflow-hidden bg-[var(--surface-secondary)] p-6 sm:p-8" : "project-showcase relative min-h-72 overflow-hidden bg-[var(--surface-secondary)] p-6 sm:p-8"}
        style={backgroundStyle}
      >
        <div className="project-ambient" data-accent={project.icon} />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-white text-[var(--primary)] shadow-[var(--shadow-soft)]">
            <Icon className="size-6" aria-hidden="true" />
          </div>
          <span className={project.status === "Offline" ? "rounded-full border border-red-200 bg-red-50/75 px-3 py-1 text-xs font-medium text-red-600 backdrop-blur-xl" : "rounded-full border border-[var(--border)] bg-white/60 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] backdrop-blur-xl"}>
            {project.status}
          </span>
        </div>

        <div className="relative mt-20 max-w-xl">
          <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">{project.summary}</p>
          <a
            href={`https://${project.domain}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] transition-colors duration-300 hover:text-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--surface-secondary)]"
            aria-label={`Abrir ${project.name} en una nueva pagina`}
          >
            {project.domain}
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {project.stats.map((stat) => (
            <div key={stat.label} className="rounded-[20px] bg-[var(--surface-secondary)] p-4">
              <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
              <div className="mt-1 text-sm font-semibold">{stat.value}</div>
            </div>
          ))}
        </div>

        <Accordion.Root type="single" collapsible className="mt-6">
          <Accordion.Item value="details">
            <Accordion.Trigger className="group/trigger flex w-full items-center justify-between rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium transition-colors duration-300 hover:bg-[var(--surface-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--surface)]">
              Detalles tecnicos
              <ChevronDown className="size-4 transition-transform duration-300 group-data-[state=open]/trigger:rotate-180" aria-hidden="true" />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="grid gap-3 pt-4 text-sm leading-6 text-[var(--text-secondary)]">
                <Detail label="Arquitectura" value={project.details.architecture} />
                <Detail label="Problemas resueltos" value={project.details.solved} />
                <Detail label="Infraestructura" value={project.details.infrastructure} />
                <Detail label="Metricas" value={project.details.metrics} />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-secondary)] p-4">
      <div className="text-xs font-semibold uppercase text-[var(--text-secondary)]">{label}</div>
      <div className="mt-2 text-[var(--text-primary)]">{value}</div>
    </div>
  );
}
