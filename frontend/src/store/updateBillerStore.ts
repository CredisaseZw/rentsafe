// updateBiller.store.ts
import { Store } from "@tanstack/store";

type Permission = "allow" | "deny";

interface UpdateBillerStore {
  dialogueStatus: boolean;
  updateStatus: boolean;
  permission: Permission;

  openDialogue: () => void;
  closeDialogue: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onSettle : () =>void;
}

export const updateBillerStore = new Store<UpdateBillerStore>({
  dialogueStatus: false,
  updateStatus: false,
  permission: "deny",

  openDialogue() {
    updateBillerStore.setState((s) => ({
      ...s,
      dialogueStatus: true,
      permission: "deny",
    }));
  },

  closeDialogue() {
    updateBillerStore.setState((s) => ({
      ...s,
      dialogueStatus: false,
      permission: "deny",
    }));
  },

  onAccept() {
    updateBillerStore.setState((s) => ({
      ...s,
      permission: "allow",
      updateStatus: true,
    }));
  },

  onDecline() {
    updateBillerStore.setState((s) => ({
      ...s,
      permission: "deny",
      updateStatus: false,
      dialogueStatus: false,
    }));
    },
    onSettle() {
        updateBillerStore.setState((s)=>({
            ...s,
            updateStatus: false
        }))
    },
});
