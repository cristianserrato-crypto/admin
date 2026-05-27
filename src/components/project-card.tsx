"use client";

import { BadgeDollarSign, Bot, Boxes, ChevronDown, ExternalLink, Gem } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const icons = {
    boxes: Boxes,
    bot: Bot,
    finance: BadgeDollarSign,
    gem: Gem,
  };
  const Icon = icons[project.icon];
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className="glass holo-border overflow-hidden rounded-lg"
    >
      <div className="relative min-h-44 border-b border-white/10 p-6">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", project.accent)} />
        <div className="absolute inset-0 grid-plane opacity-30" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-md border border-white/15 bg-slate-950/50">
            <Icon className="size-6 text-cyan-100" />
          </div>
          <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs text-cyan-100">
            {project.status}
          </span>
        </div>
        <div className="relative mt-8">
          <h3 className="text-2xl font-semibold tracking-tight text-white">{project.name}</h3>
          <a href={`https://${project.domain}`} className="mt-1 inline-flex items-center gap-2 text-sm text-cyan-100/80">
            {project.domain}
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="p-6">
        <p className="min-h-16 text-sm leading-6 text-slate-300">{project.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-200">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {project.stats.map((stat) => (
            <div key={stat.label} className="rounded-md border border-white/10 bg-slate-950/40 p-3">
              <div className="text-xs text-slate-500">{stat.label}</div>
              <div className="mt-1 text-sm font-semibold text-slate-50">{stat.value}</div>
            </div>
          ))}
        </div>
        <Accordion.Root type="single" collapsible className="mt-5">
          <Accordion.Item value="details">
            <Accordion.Trigger className="group flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 transition hover:bg-white/[0.06]">
              Detalles tecnicos
              <ChevronDown className="size-4 transition group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="grid gap-3 pt-4 text-sm leading-6 text-slate-300">
                <Detail label="Arquitectura" value={project.details.architecture} />
                <Detail label="Problemas resueltos" value={project.details.solved} />
                <Detail label="Infraestructura" value={project.details.infrastructure} />
                <Detail label="Metricas" value={project.details.metrics} />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </motion.article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-950/35 p-3">
      <div className="text-xs uppercase tracking-[0.18em] text-cyan-100/60">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
