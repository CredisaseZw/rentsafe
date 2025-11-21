import { createContext, useContext, useState } from "react";

interface IndividualDialogContextType {
  open: boolean;
  setOpen: (value: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
}

const IndividualDialogContext = createContext<IndividualDialogContextType | undefined>(undefined);

export const IndividualDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <IndividualDialogContext.Provider value={{ open, setOpen, openDialog, closeDialog }}>
      {children}
    </IndividualDialogContext.Provider>
  );
};

export const useIndividualContextDialog = () => {
  const context = useContext(IndividualDialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a IndividualDialogProvider");
  }
  return context;
};
