import React, { useState } from "react";
import RequestReviewDeck from "./components/RequestReviewDeck";
import CalmBreathingCanvas from "./components/CalmBreathingCanvas";
import WeeklyOverviewRibbon from "./components/WeeklyOverviewRibbon";
import { Sparkles, Calendar, Plus, RefreshCw, Layers } from "lucide-react";

const INITIAL_REQUESTS = [
  {
    id: "req-1",
    patientName: "Adrian Wijaya",
    patientDetails: "Patient ID: DH-9082 • Male, 34 yrs",
    time: "09:00 AM",
    date: "Tue, May 19",
    type: "Root Canal",
    complaint: "Severe throbbing pain in the lower left molar when eating warm foods. Started 3 days ago.",
    requestedAgo: "5 mins ago"
  },
  {
    id: "req-2",
    patientName: "Clara Salsabila",
    patientDetails: "Patient ID: DH-1029 • Female, 27 yrs",
    time: "11:30 AM",
    date: "Tue, May 19",
    type: "Checkup & Clean",
    complaint: "Routine scaling and checkup. Slight bleeding when flossing. Wants to discuss wisdom teeth removal.",
    requestedAgo: "2 hours ago"
  },
  {
    id: "req-3",
    patientName: "Budi Santoso",
    patientDetails: "Patient ID: DH-4731 • Male, 45 yrs",
    time: "02:00 PM",
    date: "Wed, May 20",
    type: "Crown & Bridge",
    complaint: "Damaged molar crown due to accident. Needs restoration/replacement immediately. Pain is mild.",
    requestedAgo: "4 hours ago"
  },
  {
    id: "req-4",
    patientName: "Elena Rostova",
    patientDetails: "Patient ID: DH-5582 • Female, 31 yrs",
    time: "04:15 PM",
    date: "Thu, May 21",
    type: "Invisalign First",
    complaint: "First consultation for teeth alignment options. Requesting general diagnostic check.",
    requestedAgo: "1 day ago"
  }
];

export default function App() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ id: Date.now(), text: `[${timestamp}] ${message}`, type }, ...prev].slice(0, 10));
  };

  const handleApprove = (id) => {
    const req = requests.find((r) => r.id === id);
    if (req) {
      addLog(`APPROVED: ${req.patientName} (${req.type}) at ${req.time}`, "success");
      // Remove from stack
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleReject = (id, reason) => {
    const req = requests.find((r) => r.id === id);
    if (req) {
      addLog(`REJECTED: ${req.patientName} (${req.type}) - Reason: "${reason}"`, "error");
      // Remove from stack
      setRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleReload = () => {
    setRequests(INITIAL_REQUESTS);
    addLog("Reloaded full request review deck stack.", "info");
  };

  const handleAddNew = () => {
    const newId = `req-${Date.now()}`;
    const firstNames = ["Dani", "Fiona", "Gerry", "Hana", "Indra"];
    const lastNames = ["Saputra", "Wulandari", "Pratama", "Lestari", "Kurniawan"];
    const types = ["Tooth Extraction", "Teeth Whitening", "Implants", "Orthodontics Consultation"];
    const complaints = [
      "Wants a quick consultation about scaling.",
      "Broken front tooth needs quick composite bonding.",
      "Sensitivity to cold drinks has increased dramatically over the weekend.",
      "Post-extraction checkup to see if the gums are healing properly."
    ];
    
    const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    
    const newRequest = {
      id: newId,
      patientName: randomName,
      patientDetails: `Patient ID: DH-${Math.floor(1000 + Math.random() * 9000)} • New Patient`,
      time: `${Math.floor(1 + Math.random() * 12)}:${Math.random() > 0.5 ? "00" : "30"} PM`,
      date: "Fri, May 22",
      type: types[Math.floor(Math.random() * types.length)],
      complaint: complaints[Math.floor(Math.random() * complaints.length)],
      requestedAgo: "Just now"
    };

    setRequests((prev) => [newRequest, ...prev]);
    addLog(`INCOMING REQUEST: ${newRequest.patientName} inserted at top of stack.`, "incoming");
  };

  // If stack is completely empty, display the relaxing Calm UI empty state canvas
  if (requests.length === 0) {
    return <CalmBreathingCanvas onSimulate={handleAddNew} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col items-center justify-start p-6 md:p-12 overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <header className="w-full max-w-4xl text-center md:text-left mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <Layers className="w-7 h-7 text-violet-600 animate-pulse" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">DentHub Review</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Super Modern, Motion-First Physics Stacked Deck
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-violet-600 text-white rounded-xl hover:bg-violet-700 shadow-md shadow-violet-600/10 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Simulate New Request
          </button>
          
          <button
            onClick={handleReload}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Stack
          </button>
        </div>
      </header>

      {/* SECONDARY LAYER: WEEKLY CALENDAR OVERVIEW RIBBON */}
      <WeeklyOverviewRibbon onLogAction={(msg) => addLog(msg, "info")} />

      {/* CORE WORKFLOW AREA */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* SWIPABLE DECK WRAPPER */}
        <div className="flex flex-col items-center justify-center bg-white/40 border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[500px]">
          <div className="mb-4 text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Reviewing Stack ({requests.length} pending)
            </span>
          </div>
          
          <RequestReviewDeck
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>

        {/* LOGS AND SYSTEM STATUS */}
        <div className="flex flex-col h-[500px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-ping" />
              <h2 className="text-lg font-bold text-gray-800">Clinic Activity Log</h2>
            </div>
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              Live Monitor
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <Sparkles className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm font-medium">No actions performed yet.</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Try swiping a card right or dragging down to reject.
                </p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-2xl border text-xs font-medium transition-all duration-300 ${
                    log.type === "success"
                      ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                      : log.type === "error"
                      ? "bg-rose-50/50 border-rose-100 text-rose-800"
                      : log.type === "incoming"
                      ? "bg-violet-50/50 border-violet-100 text-violet-800"
                      : "bg-gray-50 border-gray-100 text-gray-700"
                  }`}
                >
                  {log.text}
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              DentHub System 2026. Designed for boutique dental clinics.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
