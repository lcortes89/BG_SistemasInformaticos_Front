import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientCard from '@/components/clients/ClientCard.vue'
import ClientModel from '@/core/models/client/ClientModel'

describe('ClientCard (BGSI-244)', () => {
  it('shows only the logo and the name, without rating or testimonial', () => {
    const client = new ClientModel(1, 'Bar La Plaza', 'Bar', 'Great service', 'http://x.com/logo.png', 5)
    const wrapper = mount(ClientCard, { props: { client } })

    expect(wrapper.find('img').attributes('alt')).toBe('Logo de Bar La Plaza')
    expect(wrapper.text()).toContain('Bar La Plaza')
    expect(wrapper.text()).not.toContain('Great service')
    expect(wrapper.find('[aria-label^="Valoración"]').exists()).toBe(false)
  })

  it('shows the initials when there is no logo or it cannot be loaded', async () => {
    const withoutLogo = mount(ClientCard, { props: { client: new ClientModel(1, 'Bar La Plaza', 'Bar', '', null, 5) } })
    expect(withoutLogo.find('.client-card__badge').text()).toBe('BL')

    const brokenLogo = mount(ClientCard, {
      props: { client: new ClientModel(2, 'Café Central', 'Café', '', 'http://x.com/broken.png', 4) },
    })
    await brokenLogo.find('img').trigger('error')
    expect(brokenLogo.find('.client-card__badge').text()).toBe('CC')
  })
})
