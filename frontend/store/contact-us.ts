import { create } from 'zustand'
import { TypeContactFormState } from '@/constants/contact-us-form.schema'

interface ContactStore {
  formData: Partial<TypeContactFormState>
  setField: (field: keyof TypeContactFormState, value: string) => void
  resetStore: () => void
}

export const useContactStore = create<ContactStore>((set) => ({
  formData: {},
  setField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  resetStore: () => set({ formData: {} }),
}))