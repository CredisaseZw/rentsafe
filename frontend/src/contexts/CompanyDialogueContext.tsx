import { createContext, useContext, useState } from "react";

interface CompanyDialogContextType {
  open: boolean;
  setOpen: (value: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
}

const CompanyDialogContext = createContext<CompanyDialogContextType | undefined>(undefined);

export const CompanyDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <CompanyDialogContext.Provider value={{ open, setOpen, openDialog, closeDialog }}>
      {children}
    </CompanyDialogContext.Provider>
  );
};

export const useCompanyContextDialog = () => {
  const context = useContext(CompanyDialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a CompanyDialogProvider");
  }
  return context;
};
