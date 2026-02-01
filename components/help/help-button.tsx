"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  HelpCircle,
  ClipboardList,
  PenLine,
  FolderOpen,
  Printer,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: PenLine,
    color: "from-blue-500 to-indigo-600",
    title: "Step 1: Create a New SOP",
    subtitle: "Document any business procedure",
    description:
      "Click 'New SOP' to start fresh, or choose from a pre-loaded template. Fill in the title, department, purpose, and add your step-by-step procedure. Each step can include details and estimated time.",
    tip: "Start with your most-repeated tasks — the ones you explain to new hires over and over.",
  },
  {
    icon: FolderOpen,
    color: "from-indigo-500 to-blue-600",
    title: "Step 2: Organize & Manage",
    subtitle: "Keep your SOPs organized by department",
    description:
      "All SOPs are saved automatically to your browser. Filter by department, search by keyword, or browse the full list. Click any SOP to view, edit, or update it as your processes evolve.",
    tip: "Review SOPs quarterly to keep them current. Outdated procedures are worse than no procedures.",
  },
  {
    icon: Printer,
    color: "from-sky-500 to-blue-600",
    title: "Step 3: Export & Share",
    subtitle: "Print or export for your team",
    description:
      "Export any SOP as a text file for sharing, or use the print button for physical binders. Your SOPs become the training manual for every new team member.",
    tip: "Print your most critical SOPs and keep them in a binder at the front desk for quick reference.",
  },
];

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Help</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-white" />
              </div>
              SOP Factory Guide
            </DialogTitle>
            <DialogDescription>
              Document once, delegate forever.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 -mx-6 px-6 space-y-4 py-4">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 space-y-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Why SOPs Matter
              </h3>
              <p className="text-sm text-blue-800">
                Standard Operating Procedures are the backbone of a scalable
                business. When every process is documented, anyone on your team
                can execute it consistently — freeing you to focus on growth.
              </p>
            </div>

            {steps.map((step, index) => (
              <div key={index} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}
                  >
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                <div className="flex items-start gap-2 rounded-md bg-blue-50 p-3">
                  <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-800">{step.tip}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={() => setOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
