import AdminRateRuleRepository from '@/core/apis/rate/AdminRateRuleRepository'
import RateRuleModel from '@/core/models/rate/RateRuleModel'
import { rateRuleMapper } from '@/core/mappers/rate/rate-rule-mapper'

export default class AdminRateRuleService {

  #repo

  constructor(repository = new AdminRateRuleRepository()) {
    this.#repo = repository
  }

  // -> [{ category, title, rules: RateRuleModel[] }], one block per question
  async getGroups() {
    const groups = await this.#repo.findAll()
    return groups.map((group) => ({
      category: group.category,
      title: rateRuleMapper.categoryTitle(group.category),
      rules: (group.rules ?? []).map((dto) => RateRuleModel.create(dto, rateRuleMapper)),
    }))
  }

  async updateAmount(id, amount) {
    const dto = await this.#repo.updateAmount(id, Number(amount))
    return RateRuleModel.create(dto, rateRuleMapper)
  }
}
