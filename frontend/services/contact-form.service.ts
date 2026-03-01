import { axiosClassic } from '@/api/interceptors'
import { TypeContactForm } from '@/types/contact-form.types'

class ContactFormService {
  private BASE_URL = '/contact-form'

  async sendMessage(data: TypeContactForm) {
    const response = await axiosClassic.post(this.BASE_URL, data)
    return response.data
  }
}

export const contactFormService = new ContactFormService()