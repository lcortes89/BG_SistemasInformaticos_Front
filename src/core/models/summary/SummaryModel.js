// Counters + latest contacts of the dashboard (SummaryDTO)
export default class SummaryModel {

  constructor(counters, latestContacts) {
    this.newContacts = counters.newContacts
    this.totalContacts = counters.totalContacts
    this.activeBrands = counters.activeBrands
    this.totalBrands = counters.totalBrands
    this.featuredServices = counters.featuredServices
    this.totalServices = counters.totalServices
    this.publishedClients = counters.publishedClients
    this.totalClients = counters.totalClients
    this.latestContacts = latestContacts // ContactModel[]
  }

  static create(dto, mapper) {
    return new SummaryModel(mapper.counters(dto), mapper.latestContacts(dto))
  }

  // An empty dashboard: used while loading and as a safe default
  static empty() {
    return new SummaryModel({
      newContacts: 0, totalContacts: 0, activeBrands: 0, totalBrands: 0,
      featuredServices: 0, totalServices: 0, publishedClients: 0, totalClients: 0,
    }, [])
  }
}
