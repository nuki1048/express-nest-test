import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { useContactStore } from '@/store/contact-us'
import { contactFormService } from '@/services/contact-form.service'
import { TypeContactForm } from '@/types/contact-form.types'
import { errorCatch } from '@/api/error'

export function useContactForm(reset: () => void) {
  const { resetStore } = useContactStore()
  const t = useTranslations('ContactUs.ContactForm')

  const { mutate: sendContact, isPending } = useMutation({
    mutationKey: ['create contact'],
    mutationFn: (data: TypeContactForm) => contactFormService.sendMessage(data),
    onSuccess: () => {
      toast.success(t('successMessage')) 
      reset()
      resetStore() 
    },
    onError: (error) => {
      const serverError = errorCatch(error)
      toast.error(serverError || t('errorMessage'))
    }
  })

  return { sendContact, isPending }
}