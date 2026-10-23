import { flushPromises } from '@vue/test-utils'

// BGSI-312: the actions of a row are in the "⋯" menu (RowActionsMenu), which is drawn in <body> (Teleport).
// root: the table, the view or one row (a wrapper). index: which "⋯" inside root

async function openMenu(root, index) {
  const toggle = root.findAll('[data-test="row-actions"]')[index]
  if (!toggle) throw new Error(`There is no "⋯" number ${index}`)
  await toggle.trigger('click')
  await flushPromises()
  return { toggle, menu: document.body.querySelector('.row-actions__menu') }
}

const itemsOf = (menu) => [...menu.querySelectorAll('[role="menuitem"]')]

// The labels of the menu, in order (the menu is closed again)
export async function rowActionLabels(root, index = 0) {
  const { toggle, menu } = await openMenu(root, index)
  const labels = itemsOf(menu).map((item) => item.textContent.trim())
  await toggle.trigger('click')
  await flushPromises()
  return labels
}

// Opens the menu and clicks the action with that label
export async function chooseRowAction(root, label, index = 0) {
  const { menu } = await openMenu(root, index)
  const item = itemsOf(menu).find((element) => element.textContent.trim() === label)
  if (!item) throw new Error(`The menu has no "${label}": ${itemsOf(menu).map((i) => i.textContent.trim()).join(', ')}`)
  item.click()
  await flushPromises()
}
