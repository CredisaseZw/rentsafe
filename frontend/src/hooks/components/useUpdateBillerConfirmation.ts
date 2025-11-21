import { useUpdateBillerStore } from "@/store/updateBillerStore";

export function useUpdateBillerDialog() {
  const {dialogueStatus, permission, updateStatus, openDialogue, closeDialogue, onAccept, onDecline } = useUpdateBillerStore()
  return {
    dialogueStatus,
    updateStatus,
    permission,
    openDialogue,
    closeDialogue,
    onAccept,
    onDecline,
  };
}
