import UploadRepository from '@/core/apis/upload/UploadRepository'

// Same rules as the backend (LocalImageStorageService)
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024 // 2 MB

export default class UploadService {

  #repo

  constructor(repository = new UploadRepository()) {
    this.#repo = repository
  }

  // Checked before uploading, so the admin gets the error at once
  static validate(file) {
    if (!file) return 'Elige un archivo'
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Solo se permiten imágenes JPG, PNG o WebP'
    if (file.size > MAX_IMAGE_BYTES) return 'La imagen no puede superar los 2 MB'
    return null
  }

  // Returns the public URL of the uploaded image
  async uploadImage(file) {
    const error = UploadService.validate(file)
    if (error) throw new Error(error)
    const { url } = await this.#repo.upload(file)
    return url
  }
}
