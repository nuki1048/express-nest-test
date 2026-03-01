'use client'

import { contactsService } from '@/services/contacts.service'
import { useContactsStore } from '@/store/contacts'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useContacts() {
  const { contacts, setContacts } = useContactsStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => contactsService.getAll(),
    enabled: !contacts,
    staleTime: Infinity, 
  })
  useEffect(() => {
    if (data && !contacts) {
      setContacts(data)
    }
  }, [data, contacts, setContacts])

  return {
    data: contacts || data, 
    isLoading: isLoading && !contacts, 
    error 
  }
}