import ExportRepository from '@/core/apis/export/ExportRepository'
import { saveFile } from '@/core/utils/save-file'

// Name of the downloaded file for each list, as the backend names it
const FILE_NAMES = { clients: 'clientes', brands: 'marcas', services: 'productos' }

// 2026-10-15 (local date of the admin)
const today = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-')

export default class ExportService {

  #repo
  #save

  // save: lets the tests check the file without downloading anything
  constructor(repository = new ExportRepository(), save = saveFile) {
    this.#repo = repository
    this.#save = save
  }

  // resource: 'clients' | 'brands' | 'services' · format: 'pdf' | 'xlsx' · params: e.g. { brandId: 1 }
  async download(resource, format, params = {}, date = new Date()) {
    const blob = await this.#repo.findFile(resource, format, params)
    const fileName = `${FILE_NAMES[resource] ?? resource}-${today(date)}.${format}`
    this.#save(blob, fileName)
    return fileName
  }
}
