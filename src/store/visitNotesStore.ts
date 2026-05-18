import { create } from 'zustand';

export interface TreatmentSuggestion {
  id: string;
  text: string;
  description?: string;
}

interface DiagnosisSuggestionMapping {
  pattern: RegExp;
  suggestions: Omit<TreatmentSuggestion, 'id'>[];
}

// Define comprehensive static dictionary mapping diagnosis regex patterns to suggested treatments
export const DIAGNOSIS_TREATMENT_DICTIONARY: DiagnosisSuggestionMapping[] = [
  {
    // Pulpitis / sakit gigi dalam
    pattern: /pulpitis/i,
    suggestions: [
      { text: 'Pulpektomi vital gigi', description: 'Pengambilan seluruh jaringan pulpa vital' },
      { text: 'Restorasi resin komposit', description: 'Penambalan estetik dengan komposit' },
      { text: 'Perawatan Saluran Akar (PSA)', description: 'Terapi endodontik komprehensif' },
      { text: 'Devitalisasi pulpa gigi', description: 'Aplikasi bahan devitalisasi' }
    ]
  },
  {
    // Karang gigi / scaling / gingivitis / periodontitis
    pattern: /(kalkulus|scaling|karang|gingivitis|periodontitis)/i,
    suggestions: [
      { text: 'Scaling rahang atas dan bawah', description: 'Pembersihan karang gigi supra & subgingiva' },
      { text: 'Root planing & curretage', description: 'Pembersihan permukaan akar gigi' },
      { text: 'Aplikasi fluor topikal', description: 'Pemberian gel fluoride pelindung enamel' },
      { text: 'Profiaksis dental', description: 'Pembersihan dan pemolesan gigi' }
    ]
  },
  {
    // Karies / gigi berlubang / kavitas / penambalan
    pattern: /(karies|kavitas|lubang|caries|decay)/i,
    suggestions: [
      { text: 'Tumpatan resin komposit kelas I/II', description: 'Tambalan komposit gigi posterior' },
      { text: 'Tumpatan Glass Ionomer Cement (GIC)', description: 'Tambalan semen ionomer kaca' },
      { text: 'Preparasi kavitas gigi', description: 'Pembuangan jaringan karies' },
      { text: 'Fissure sealant gigi', description: 'Pencegahan karies pada pit & fissure' }
    ]
  },
  {
    // Crown / mahkota / jembatan / dental bridge / lepas / sementasi
    pattern: /(crown|bridge|mahkota|cementation|sementasi)/i,
    suggestions: [
      { text: 'Recementation crown gigi', description: 'Penyemenan kembali mahkota gigi' },
      { text: 'Preparasi mahkota tiruan', description: 'Pengasahan gigi penyangga' },
      { text: 'Cetak rahang untuk koping', description: 'Pengambilan cetakan anatomi' },
      { text: 'Pemasangan mahkota sementara', description: 'Aplikasi mahkota sementara akrilik' }
    ]
  },
  {
    // Ortodonti / kontrol behel / kawat gigi
    pattern: /(orthodontic|ortho|behel|kawat|bracket|crowding|maloklusi)/i,
    suggestions: [
      { text: 'Adjustment orthodontic bracket & archwire', description: 'Kontrol rutin bulanan kawat orto' },
      { text: 'Penggantian ligatur karet (power O/chain)', description: 'Penggantian modul karet gigi' },
      { text: 'Pemasangan buccal tube baru', description: 'Sementasi bracket gigi molar' },
      { text: 'Pencetakan studi model ortodonti', description: 'Cetak rahang analisis kasus' }
    ]
  },
  {
    // Gigi goyang / ekstraksi / cabut
    pattern: /(luksasi|goyang|ekstraksi|cabut|extraction|mobilitas)/i,
    suggestions: [
      { text: 'Ekstraksi gigi dengan anestesi lokal', description: 'Pencabutan gigi sulung/permanen' },
      { text: 'Splinting komposit intracoronal', description: 'Fiksasi gigi goyang dengan komposit + fiber' },
      { text: 'Kuretase soket gigi', description: 'Pembersihan jaringan granulasi soket' },
      { text: 'Suture & hemostasis control', description: 'Penjahitan luka pasca ekstraksi' }
    ]
  }
];

export interface VisitNotesState {
  // Input fields state
  diagnosis: string;
  treatment: string;
  notes: string;

  // Active suggestions & matching state
  suggestions: TreatmentSuggestion[];
  isDiagnosisFocused: boolean;

  // Setters & actions
  setDiagnosis: (val: string) => void;
  setTreatment: (val: string) => void;
  setNotes: (val: string) => void;
  setDiagnosisFocused: (isFocused: boolean) => void;

  // Initialization/reset helpers
  initFromAppointment: (appointment: { diagnosis?: string; treatment?: string; notes?: string }) => void;
}

export const useVisitNotesStore = create<VisitNotesState>((set, get) => ({
  diagnosis: '',
  treatment: '',
  notes: '',
  suggestions: [],
  isDiagnosisFocused: false,

  setDiagnosis: (val: string) => {
    set({ diagnosis: val });
    
    // Perform client-side regex matching to populate suggestions
    if (!val.trim()) {
      set({ suggestions: [] });
      return;
    }

    const matchedSuggestions: TreatmentSuggestion[] = [];
    let idCounter = 1;

    for (const mapping of DIAGNOSIS_TREATMENT_DICTIONARY) {
      if (mapping.pattern.test(val)) {
        for (const sugg of mapping.suggestions) {
          matchedSuggestions.push({
            id: `sugg-${idCounter++}`,
            text: sugg.text,
            description: sugg.description
          });
        }
      }
    }

    set({ suggestions: matchedSuggestions });
  },

  setTreatment: (val: string) => set({ treatment: val }),
  setNotes: (val: string) => set({ notes: val }),
  setDiagnosisFocused: (isFocused: boolean) => set({ isDiagnosisFocused: isFocused }),

  initFromAppointment: (appointment) => {
    const diag = appointment.diagnosis || '';
    set({
      diagnosis: diag,
      treatment: appointment.treatment || '',
      notes: appointment.notes || '',
      suggestions: []
    });
    // Trigger regex matching to populate initial suggestions if diagnosis is already filled
    get().setDiagnosis(diag);
  }
}));
