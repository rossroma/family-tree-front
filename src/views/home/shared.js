export function handleEvent(el) {
  if (!el || !el.target.dataset.type) return
  const { type, id, generation } = el.target.dataset
  if (type === 'edit') {
    window.open(`/admin/edit?id=${id}`)
  } else if (type === 'add') {
    window.open(`/admin/edit?parentId=${id}&generation=${generation}`)
  }
}
