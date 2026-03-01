export interface IContacts {
  id: string
  phoneNumbers: string[]
  email: string
  address: {
    label: string
    url: string
  }
  links: {
    airbnb: string
    booking: string
    facebook: string
    instagram: string
  }
}

export type TypeContacts = IContacts