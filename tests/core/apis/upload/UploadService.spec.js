import { describe, it, expect, vi } from 'vitest'
import UploadService, { MAX_IMAGE_BYTES } from '@/core/apis/upload/UploadService'

// A File-like object: the service only reads "type" and "size"
const fakeFile = (type, size = 1000) => ({ name: 'logo', type, size })

describe('UploadService', () => {
  it('uploads a valid image and returns its URL', async () => {
    const repo = { upload: vi.fn().mockResolvedValue({ url: 'http://localhost:8080/uploads/abc.png' }) }
    const file = fakeFile('image/png')

    const url = await new UploadService(repo).uploadImage(file)

    expect(repo.upload).toHaveBeenCalledWith(file)
    expect(url).toBe('http://localhost:8080/uploads/abc.png')
  })

  it('rejects files that are not JPG, PNG or WebP without calling the API', async () => {
    const repo = { upload: vi.fn() }

    await expect(new UploadService(repo).uploadImage(fakeFile('application/pdf')))
      .rejects.toThrow('Solo se permiten imágenes JPG, PNG o WebP')
    expect(repo.upload).not.toHaveBeenCalled()
  })

  it('rejects images bigger than 2 MB', () => {
    expect(UploadService.validate(fakeFile('image/jpeg', MAX_IMAGE_BYTES + 1)))
      .toBe('La imagen no puede superar los 2 MB')
    expect(UploadService.validate(fakeFile('image/webp', MAX_IMAGE_BYTES))).toBeNull()
  })
})
