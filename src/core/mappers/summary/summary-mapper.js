import ContactModel from '@/core/models/contact/ContactModel'
import { contactMapper } from '@/core/mappers/contact/contact-mapper'

// BGSI-141: a missing number becomes 0, a missing list becomes []
const count = (value) => (Number.isFinite(value) ? value : 0)

export const summaryMapper = {
  counters: (dto) => ({
    newContacts: count(dto.newContacts),
    totalContacts: count(dto.totalContacts),
    activeBrands: count(dto.activeBrands),
    totalBrands: count(dto.totalBrands),
    featuredServices: count(dto.featuredServices),
    totalServices: count(dto.totalServices),
    publishedClients: count(dto.publishedClients),
    totalClients: count(dto.totalClients),
  }),
  latestContacts: (dto) => (dto.latestContacts ?? []).map((contact) => ContactModel.create(contact, contactMapper)),
}
