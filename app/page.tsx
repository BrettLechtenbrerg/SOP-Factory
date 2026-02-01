"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  FileDown,
  Printer,
  Search,
  FolderOpen,
  Clock,
  GripVertical,
} from "lucide-react";
import { HelpButton } from "@/components/help/help-button";

interface SOPStep {
  id: string;
  description: string;
  details: string;
  estimatedTime: string;
}

interface SOP {
  id: string;
  title: string;
  department: string;
  purpose: string;
  scope: string;
  responsible: string;
  frequency: string;
  steps: SOPStep[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const DEPARTMENTS = [
  "Front Desk",
  "Instruction",
  "Sales",
  "Marketing",
  "Operations",
  "Management",
  "Finance",
  "HR",
  "Facilities",
  "Other",
];

const TEMPLATES: Omit<SOP, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Opening Procedures",
    department: "Operations",
    purpose: "Ensure the facility is ready for students and staff each day with consistent quality and safety standards.",
    scope: "All staff members responsible for opening shifts.",
    responsible: "Opening Staff / Manager on Duty",
    frequency: "Daily",
    steps: [
      { id: "1", description: "Unlock facility and disarm security system", details: "Use assigned code. Check all entry points.", estimatedTime: "2 min" },
      { id: "2", description: "Turn on all lights and HVAC system", details: "Check thermostat is set to 72°F. Verify all zones are on.", estimatedTime: "2 min" },
      { id: "3", description: "Inspect training floor and equipment", details: "Check for hazards, cleanliness, and equipment condition. Report issues.", estimatedTime: "5 min" },
      { id: "4", description: "Boot up computers and POS system", details: "Verify internet connection. Open scheduling software.", estimatedTime: "3 min" },
      { id: "5", description: "Review day's schedule and prepare materials", details: "Check class schedule, appointments, and any special events.", estimatedTime: "5 min" },
      { id: "6", description: "Set out welcome signage and retail displays", details: "Ensure all displays are stocked and presentable.", estimatedTime: "3 min" },
    ],
    notes: "Opening staff should arrive 30 minutes before first class. Any issues should be reported immediately to the manager on duty.",
  },
  {
    title: "Closing Procedures",
    department: "Operations",
    purpose: "Secure the facility and ensure everything is ready for the next business day.",
    scope: "All staff members responsible for closing shifts.",
    responsible: "Closing Staff / Manager on Duty",
    frequency: "Daily",
    steps: [
      { id: "1", description: "Complete all end-of-day financial reconciliation", details: "Balance register, process pending payments.", estimatedTime: "10 min" },
      { id: "2", description: "Clean and sanitize all training areas", details: "Mop floors, wipe equipment, empty trash cans.", estimatedTime: "15 min" },
      { id: "3", description: "Restock supplies and retail inventory", details: "Check bathroom supplies, retail displays, water station.", estimatedTime: "5 min" },
      { id: "4", description: "Shut down computers and POS system", details: "Close all applications, run backups if scheduled.", estimatedTime: "3 min" },
      { id: "5", description: "Set security system and lock all doors", details: "Check all exits, set alarm with assigned code.", estimatedTime: "3 min" },
    ],
    notes: "Closing staff should not leave until all checklist items are complete. Log completion in the Manager's Log app.",
  },
  {
    title: "New Student Enrollment",
    department: "Sales",
    purpose: "Provide a consistent, welcoming enrollment experience that converts trials into memberships.",
    scope: "Front desk staff and program directors.",
    responsible: "Front Desk / Sales Team",
    frequency: "Per enrollment",
    steps: [
      { id: "1", description: "Greet student/parent warmly and offer a tour", details: "Use their first name. Ask what brought them in today.", estimatedTime: "5 min" },
      { id: "2", description: "Conduct facility tour highlighting key areas", details: "Show training areas, amenities, achievement wall, and schedule board.", estimatedTime: "10 min" },
      { id: "3", description: "Present program options and pricing", details: "Match their goals to the right program. Show value, not just price.", estimatedTime: "10 min" },
      { id: "4", description: "Complete enrollment paperwork and waiver", details: "Collect all required information, emergency contacts, medical notes.", estimatedTime: "10 min" },
      { id: "5", description: "Process payment and set up account in GHL", details: "Enter into CRM, set up billing, send welcome email.", estimatedTime: "5 min" },
      { id: "6", description: "Schedule first class and introduce to instructor", details: "Personal introduction builds connection. Walk them to the training area.", estimatedTime: "5 min" },
    ],
    notes: "Follow up within 24 hours with a welcome text. Schedule a check-in call at 7 days and 30 days.",
  },
  {
    title: "Student Retention Call",
    department: "Management",
    purpose: "Proactively reach out to at-risk students before they cancel, showing them they matter.",
    scope: "Program directors and managers.",
    responsible: "Program Director",
    frequency: "Weekly (check attendance triggers)",
    steps: [
      { id: "1", description: "Pull attendance report for missed students", details: "Check for students who missed 2+ classes in a row.", estimatedTime: "5 min" },
      { id: "2", description: "Prioritize by risk level", details: "New students (< 90 days) are highest risk. Long-term students who suddenly stop are next.", estimatedTime: "5 min" },
      { id: "3", description: "Make personal phone calls (not texts)", details: "Say: 'Hi [Name], this is [You] from [School]. We noticed you missed class and wanted to check in. Everything okay?'", estimatedTime: "3 min each" },
      { id: "4", description: "Listen and address concerns", details: "Don't sell. Listen. Offer solutions: schedule change, private lesson, catch-up class.", estimatedTime: "5 min each" },
      { id: "5", description: "Log outcome in Manager's Log", details: "Record response, next steps, and follow-up date.", estimatedTime: "2 min each" },
    ],
    notes: "The goal is connection, not sales. Students who feel cared about stay longer. Track retention rate monthly.",
  },
  {
    title: "Social Media Content Posting",
    department: "Marketing",
    purpose: "Maintain consistent social media presence to attract new students and engage current ones.",
    scope: "Marketing team or designated social media manager.",
    responsible: "Marketing Manager",
    frequency: "Daily",
    steps: [
      { id: "1", description: "Check content calendar for today's planned post", details: "Reference the monthly marketing plan in the Daily Marketing app.", estimatedTime: "2 min" },
      { id: "2", description: "Create or queue content (photo/video/graphic)", details: "Use Canva for graphics. Authentic photos and videos perform best.", estimatedTime: "15 min" },
      { id: "3", description: "Write engaging caption with call-to-action", details: "Keep it authentic. End with a question or CTA. Use 3-5 relevant hashtags.", estimatedTime: "5 min" },
      { id: "4", description: "Post to all platforms (FB Group, FB Page, GHL Communities)", details: "Use the Social Media app for quick access to all platforms.", estimatedTime: "5 min" },
      { id: "5", description: "Respond to all comments within 2 hours", details: "Engagement drives algorithm. Every comment deserves a response.", estimatedTime: "Ongoing" },
    ],
    notes: "Best posting times: 7-9 AM, 12-1 PM, 6-8 PM. Video content gets 3x more engagement than photos. Use Canva via the AI Tools app.",
  },
];

const STORAGE_KEY = "sop-factory-data";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function newStep(): SOPStep {
  return { id: generateId(), description: "", details: "", estimatedTime: "" };
}

function newSOP(): SOP {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: "",
    department: "Operations",
    purpose: "",
    scope: "",
    responsible: "",
    frequency: "",
    steps: [newStep()],
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
}

export default function SOPFactoryPage() {
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [activeSOP, setActiveSOP] = useState<SOP | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setSOPs(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(sops));
  }, [sops, loaded]);

  const handleSave = useCallback(() => {
    if (!activeSOP) return;
    const updated = { ...activeSOP, updatedAt: new Date().toISOString() };
    setSOPs((prev) => {
      const exists = prev.find((s) => s.id === updated.id);
      if (exists) return prev.map((s) => (s.id === updated.id ? updated : s));
      return [...prev, updated];
    });
    setActiveSOP(updated);
    setEditMode(false);
  }, [activeSOP]);

  const handleDelete = useCallback((id: string) => {
    setSOPs((prev) => prev.filter((s) => s.id !== id));
    setActiveSOP(null);
    setEditMode(false);
  }, []);

  const handleNewSOP = () => {
    const sop = newSOP();
    setActiveSOP(sop);
    setEditMode(true);
  };

  const handleTemplate = (tmpl: (typeof TEMPLATES)[number]) => {
    const now = new Date().toISOString();
    const sop: SOP = { ...tmpl, id: generateId(), createdAt: now, updatedAt: now };
    setActiveSOP(sop);
    setEditMode(true);
  };

  const addStep = () => {
    if (!activeSOP) return;
    setActiveSOP({ ...activeSOP, steps: [...activeSOP.steps, newStep()] });
  };

  const removeStep = (stepId: string) => {
    if (!activeSOP) return;
    setActiveSOP({ ...activeSOP, steps: activeSOP.steps.filter((s) => s.id !== stepId) });
  };

  const updateStep = (stepId: string, field: keyof SOPStep, value: string) => {
    if (!activeSOP) return;
    setActiveSOP({
      ...activeSOP,
      steps: activeSOP.steps.map((s) => (s.id === stepId ? { ...s, [field]: value } : s)),
    });
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if (!activeSOP) return;
    const arr = [...activeSOP.steps];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setActiveSOP({ ...activeSOP, steps: arr });
  };

  const exportSOP = (sop: SOP) => {
    const lines = [
      `SOP: ${sop.title}`,
      `Department: ${sop.department}`,
      `Responsible: ${sop.responsible}`,
      `Frequency: ${sop.frequency}`,
      `Last Updated: ${new Date(sop.updatedAt).toLocaleDateString()}`,
      "",
      `PURPOSE: ${sop.purpose}`,
      "",
      `SCOPE: ${sop.scope}`,
      "",
      "PROCEDURE:",
      ...sop.steps.map((s, i) => `  ${i + 1}. ${s.description}${s.details ? `\n     Details: ${s.details}` : ""}${s.estimatedTime ? `\n     Est. Time: ${s.estimatedTime}` : ""}`),
      "",
      `NOTES: ${sop.notes}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SOP-${sop.title.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const filtered = sops.filter((s) => {
    const matchDept = filterDept === "All" || s.department === filterDept;
    const matchSearch = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">SOP Factory</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Document once, delegate forever</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HelpButton />
            <a href="https://masters-edge-portal.vercel.app" className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Portal</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - SOP List */}
          <div className="lg:w-80 shrink-0 no-print">
            <div className="space-y-4">
              <button onClick={handleNewSOP} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 cursor-pointer">
                <Plus className="w-4 h-4" /> New SOP
              </button>

              {/* Search & Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search SOPs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All Departments</option>
                {DEPARTMENTS.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>

              {/* SOP List */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {filtered.length === 0 && loaded && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    {sops.length === 0 ? "No SOPs yet. Create one or use a template below!" : "No matches found."}
                  </p>
                )}
                {filtered.map((sop) => (
                  <button key={sop.id} onClick={() => { setActiveSOP(sop); setEditMode(false); }} className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${activeSOP?.id === sop.id ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"}`}>
                    <h3 className="font-medium text-sm text-gray-900 truncate">{sop.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{sop.department}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{sop.steps.length} steps</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Templates */}
              <div className="border-t pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5" /> Templates
                </h3>
                <div className="space-y-1.5">
                  {TEMPLATES.map((tmpl, i) => (
                    <button key={i} onClick={() => handleTemplate(tmpl)} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors cursor-pointer truncate">
                      {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - SOP Editor/Viewer */}
          <div className="flex-1 min-w-0">
            {!activeSOP ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Select or Create an SOP</h2>
                <p className="text-gray-500 max-w-md">Choose an existing SOP from the left, create a new one, or start from a template. Your SOPs auto-save to this browser.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                {/* SOP Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {editMode ? (
                        <input type="text" value={activeSOP.title} onChange={(e) => setActiveSOP({ ...activeSOP, title: e.target.value })} placeholder="SOP Title" className="text-xl font-bold text-gray-900 w-full border-b-2 border-blue-300 focus:outline-none focus:border-blue-500 pb-1" />
                      ) : (
                        <h2 className="text-xl font-bold text-gray-900">{activeSOP.title || "Untitled SOP"}</h2>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {editMode ? (
                          <select value={activeSOP.department} onChange={(e) => setActiveSOP({ ...activeSOP, department: e.target.value })} className="text-sm px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {DEPARTMENTS.map((d) => (<option key={d} value={d}>{d}</option>))}
                          </select>
                        ) : (
                          <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">{activeSOP.department}</span>
                        )}
                        <span className="text-xs text-gray-400">Updated {new Date(activeSOP.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 no-print">
                      {editMode ? (
                        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"><Save className="w-4 h-4" /> Save</button>
                      ) : (
                        <>
                          <button onClick={() => setEditMode(true)} className="px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 cursor-pointer">Edit</button>
                          <button onClick={() => exportSOP(activeSOP)} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"><FileDown className="w-4 h-4" /></button>
                          <button onClick={() => window.print()} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"><Printer className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(activeSOP.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* SOP Body */}
                <div className="p-6 space-y-6">
                  {/* Meta Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Responsible", field: "responsible" as const },
                      { label: "Frequency", field: "frequency" as const },
                      { label: "Scope", field: "scope" as const },
                    ].map((item) => (
                      <div key={item.field}>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</label>
                        {editMode ? (
                          <input type="text" value={activeSOP[item.field]} onChange={(e) => setActiveSOP({ ...activeSOP, [item.field]: e.target.value })} className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        ) : (
                          <p className="mt-1 text-sm text-gray-700">{activeSOP[item.field] || "—"}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Purpose</label>
                    {editMode ? (
                      <textarea value={activeSOP.purpose} onChange={(e) => setActiveSOP({ ...activeSOP, purpose: e.target.value })} rows={2} className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    ) : (
                      <p className="mt-1 text-sm text-gray-700">{activeSOP.purpose || "—"}</p>
                    )}
                  </div>

                  {/* Steps */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Procedure Steps</label>
                      {editMode && (
                        <button onClick={addStep} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"><Plus className="w-3.5 h-3.5" /> Add Step</button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {activeSOP.steps.map((step, index) => (
                        <div key={step.id} className="rounded-xl border border-gray-200 bg-gray-50/50 overflow-hidden">
                          <div className="flex items-center gap-3 px-4 py-3">
                            {editMode && (
                              <div className="flex flex-col gap-0.5">
                                <button onClick={() => moveStep(index, "up")} disabled={index === 0} className="text-gray-400 hover:text-blue-600 disabled:opacity-30 cursor-pointer"><ChevronUp className="w-3.5 h-3.5" /></button>
                                <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                                <button onClick={() => moveStep(index, "down")} disabled={index === activeSOP.steps.length - 1} className="text-gray-400 hover:text-blue-600 disabled:opacity-30 cursor-pointer"><ChevronDown className="w-3.5 h-3.5" /></button>
                              </div>
                            )}
                            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{index + 1}</div>
                            <div className="flex-1 min-w-0">
                              {editMode ? (
                                <input type="text" value={step.description} onChange={(e) => updateStep(step.id, "description", e.target.value)} placeholder="Step description..." className="w-full text-sm font-medium bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-0.5" />
                              ) : (
                                <button onClick={() => toggleExpand(step.id)} className="w-full text-left text-sm font-medium text-gray-900 hover:text-blue-700 cursor-pointer">{step.description}</button>
                              )}
                            </div>
                            {step.estimatedTime && !editMode && <span className="text-xs text-gray-400 shrink-0">{step.estimatedTime}</span>}
                            {editMode && (
                              <button onClick={() => removeStep(step.id)} className="text-gray-400 hover:text-red-500 shrink-0 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                            )}
                          </div>
                          {(editMode || expandedSteps.has(step.id)) && (
                            <div className="px-4 pb-3 pt-0 ml-10 space-y-2 border-t border-gray-200 mt-1 pt-3">
                              {editMode ? (
                                <>
                                  <textarea value={step.details} onChange={(e) => updateStep(step.id, "details", e.target.value)} placeholder="Details/notes for this step..." rows={2} className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                                  <input type="text" value={step.estimatedTime} onChange={(e) => updateStep(step.id, "estimatedTime", e.target.value)} placeholder="Est. time (e.g., 5 min)" className="w-40 px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </>
                              ) : (
                                <>
                                  {step.details && <p className="text-xs text-gray-600">{step.details}</p>}
                                  {step.estimatedTime && <p className="text-xs text-gray-400">Est. time: {step.estimatedTime}</p>}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Additional Notes</label>
                    {editMode ? (
                      <textarea value={activeSOP.notes} onChange={(e) => setActiveSOP({ ...activeSOP, notes: e.target.value })} rows={3} className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    ) : (
                      <p className="mt-1 text-sm text-gray-700">{activeSOP.notes || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t bg-white/60 backdrop-blur-sm mt-auto no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-gray-400">
          The Master&apos;s Edge Business Program &bull; Total Success AI
        </div>
      </footer>
    </div>
  );
}
