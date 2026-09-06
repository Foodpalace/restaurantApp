import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { askAssistant, runNlQuery } from "@/lib/roshoi/server/api";
import { PageHeader, RequirePerm } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/ai")({ component: () => <RequirePerm perm="view_ai"><AiPage /></RequirePerm> });

function AiPage() {
  const [nl, setNl] = useState("Show today's refund rate");
  const [prompt, setPrompt] = useState("What should we prioritise in the next two hours?");
  const nlMut = useMutation({
    mutationFn: async () => {
      const r = await runNlQuery({ data: { q: nl } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const ask = useMutation({
    mutationFn: async () => {
      const r = await askAssistant({ data: { prompt, mode: "ops" } });
      if (!r.ok) throw new Error(r.error);
      return r.data;
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <div>
      <PageHeader title="AI assist" description="Read-only queries run immediately. Mutations still need a human with permission." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-2 text-base">Natural-language operations</CardTitle>
          <textarea className="mb-3 min-h-24 w-full rounded-sm border border-border bg-elevated p-3 text-sm" value={nl} onChange={(e) => setNl(e.target.value)} />
          <Button onClick={() => nlMut.mutate()} disabled={nlMut.isPending}>
            Run query
          </Button>
          {nlMut.data ? <p className="mt-3 text-sm leading-relaxed">{nlMut.data.answer}</p> : null}
        </Card>
        <Card>
          <CardTitle className="mb-2 text-base">Employee copilot</CardTitle>
          <textarea className="mb-3 min-h-24 w-full rounded-sm border border-border bg-elevated p-3 text-sm" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <Button onClick={() => ask.mutate()} disabled={ask.isPending}>
            {ask.isPending ? "Thinking…" : "Ask"}
          </Button>
          {ask.data ? (
            <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
              {ask.data.text}
              <div className="mt-2 text-xs text-subtle">{ask.data.provider}</div>
            </pre>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
