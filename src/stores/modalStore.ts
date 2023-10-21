// store.ts
import { create } from "zustand";

// Define a state
type State = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setModal: (isOpen: boolean) => void;
};

const useGlobalStore = create<State>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setModal: (isOpen) => set({ isModalOpen: isOpen }),
}));

export default useGlobalStore;
