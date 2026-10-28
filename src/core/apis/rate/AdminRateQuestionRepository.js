import BaseRepository from '@/core/apis/base/BaseRepository'

// /api/admin/rate-questions (BGSI-233): questions of the wizard and their options
export default class AdminRateQuestionRepository extends BaseRepository {

  constructor() {
    super('/admin/rate-questions')
  }

  async findAll() {
    return this.get()
  }

  async create(body) {
    return this.post('', body)
  }

  async update(id, body) {
    return this.put(`/${id}`, body)
  }

  async remove(id) {
    return this.delete(`/${id}`)
  }

  // PUT /order { ids: [3, 1, 2] }
  async reorder(ids) {
    return this.put('/order', { ids })
  }

  async addOption(questionId, body) {
    return this.post(`/${questionId}/options`, body)
  }

  async updateOption(optionId, body) {
    return this.put(`/options/${optionId}`, body)
  }

  async removeOption(optionId) {
    return this.delete(`/options/${optionId}`)
  }
}
