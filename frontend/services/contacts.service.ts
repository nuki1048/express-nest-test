import { axiosClassic } from '@/api/interceptors'
import { IContacts } from '@/types/contacts.types'

class ContactsService {
	private BASE_URL = '/contacts'

	async getAll() {
		const response = await axiosClassic.get<IContacts>(this.BASE_URL)
		return response.data
	}
}

export const contactsService = new ContactsService()