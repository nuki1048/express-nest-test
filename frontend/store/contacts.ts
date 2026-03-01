import { create } from 'zustand'
import { IContacts } from '@/types/contacts.types'

interface ContactsStore {
  contacts: IContacts | null
  setContacts: (data: IContacts) => void
}

export const useContactsStore = create<ContactsStore>((set) => ({
  contacts: null,
  setContacts: (data) => set({ contacts: data }),
}))