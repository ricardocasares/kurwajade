export function mixed(time: string = '') {
  const [amount, unit] = time.split(' ')
  return String(amount).padStart(2, '0') + unit.replace('%UNIT_MIN%', 'm')
}

export function merge_maps<K, V>(a: Map<K, V[]>, b: Map<K, V[]>): Map<K, V[]> {
  const map = new Map(a)

  for (const [key, value] of b) {
    map.set(key, (map.get(key) || []).concat(value))
  }

  return map
}
