import getCacheKey from '../get-cache-key'

describe('getCacheKey', () => {
  it('generates a unique key', () => {
    expect(getCacheKey('vue')).toBe('npm.vue')
  })
})
