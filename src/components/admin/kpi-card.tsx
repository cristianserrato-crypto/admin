import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function KpiCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return (
    <Card className="rounded-lg p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
          <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
          <div className="mt-2 text-sm text-slate-400">{detail}</div>
        </div>
        <div className="flex size-11 items-center justify-center rounded-md border border-cyan-200/15 bg-cyan-200/10">
          <Icon className="size-5 text-cyan-100" />
        </div>
      </div>
    </Card>
  );
}
