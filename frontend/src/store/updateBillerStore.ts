import { create } from "zustand";

type Permission = "allow" | "deny" | null;

interface UpdateBillerStore {
  dialogueStatus: boolean;
  updateStatus: boolean;
  permission: Permission;

  openDialogue: () => void;
  closeDialogue: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onSettle: () => void;
  clearPermission: () => void
}

export const useUpdateBillerStore = create<UpdateBillerStore>((set) => ({
  dialogueStatus: false,
  updateStatus: false,
  permission: null,

  openDialogue: () =>
    set({
      dialogueStatus: true,
    }),
  closeDialogue: () =>
    set({
      dialogueStatus: false
    }),
  onDecline: () =>
    set({
      permission: "deny",
      updateStatus: false,
      dialogueStatus: false,
    }),
  onAccept: () =>
    set({
      permission: "allow",
      updateStatus: true,
    }),
  onSettle: () =>
    set({
      updateStatus: false,
    }),
  clearPermission: () => set({
    permission : null
  })
}));
