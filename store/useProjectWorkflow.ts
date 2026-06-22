import { create } from "zustand";

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "PASS" | "ATTENTION" | "ERROR";
  selectedForQR: boolean;
  file?: File;
};

interface ProjectWorkflowState {
  // Navigation
  currentStep: number;
  furthestStep: number;
  isOpen: boolean;
  
  // Data
  projectName: string;
  machineName: string;
  location: string;
  files: UploadedFile[];
  qrConfig: {
    logo: string | null;
    color: string;
    errorCorrection: string;
  };

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setOpen: (isOpen: boolean) => void;
  
  updateDetails: (details: Partial<{ projectName: string; machineName: string; location: string }>) => void;
  setFiles: (files: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])) => void;
  updateFileStatus: (id: string, status: UploadedFile["status"]) => void;
  toggleQRSelection: (id: string) => void;
  updateQRConfig: (config: Partial<ProjectWorkflowState["qrConfig"]>) => void;
  resetWorkflow: () => void;
}

export const useProjectWorkflow = create<ProjectWorkflowState>((set) => ({
  currentStep: 1,
  furthestStep: 1,
  isOpen: false,
  
  projectName: "",
  machineName: "",
  location: "",
  files: [],
  qrConfig: {
    logo: null,
    color: "#000000",
    errorCorrection: "Medium",
  },

  setStep: (step) => set((state) => ({ 
    currentStep: step,
    furthestStep: Math.max(state.furthestStep, step) 
  })),
  nextStep: () => set((state) => {
    const next = Math.min(state.currentStep + 1, 7);
    return { currentStep: next, furthestStep: Math.max(state.furthestStep, next) };
  }),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  setOpen: (isOpen) => set({ isOpen }),

  updateDetails: (details) => set((state) => ({ ...state, ...details })),
  
  setFiles: (files) => set((state) => ({
    files: typeof files === "function" ? files(state.files) : files
  })),
  
  updateFileStatus: (id, status) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, status } : f)
  })),

  toggleQRSelection: (id) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, selectedForQR: !f.selectedForQR } : f)
  })),

  updateQRConfig: (config) => set((state) => ({
    qrConfig: { ...state.qrConfig, ...config }
  })),

  resetWorkflow: () => set({
    currentStep: 1,
    furthestStep: 1,
    projectName: "",
    machineName: "",
    location: "",
    files: [],
    qrConfig: { logo: null, color: "#000000", errorCorrection: "Medium" }
  })
}));
