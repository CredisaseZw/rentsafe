import { useEffect, useState } from 'react';
import { updateBillerStore } from '@/store/updateBillerStore';

export function useUpdateBillerDialog() {
  const [state, setState] = useState(updateBillerStore.state);

  useEffect(() => {
    const unsubscribe = updateBillerStore.subscribe(() => {
      setState(updateBillerStore.state);
    });
    return () => unsubscribe();
  }, []);

  return {
    dialogueStatus: state.dialogueStatus,
    updateStatus: state.updateStatus,
    permission: state.permission,
    openDialogue: state.openDialogue,
    closeDialogue: state.closeDialogue,
    onAccept: state.onAccept,
    onDecline: state.onDecline,
  };
}
