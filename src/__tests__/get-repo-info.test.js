import getRepoInfo from '../get-repo-info'

describe('getRepoInfo', () => {
  it('extracts owner and repo name from github url', () => {
    expect(getRepoInfo('https://github.com/vuejs/vue')).toEqual({
      owner: 'vuejs',
      repo: 'vue'
    })
  })

  it('returns null for a non-repo url', () => {
    expect(getRepoInfo('https://github.com/')).toBeNull()
    expect(getRepoInfo('https://github.com/explore')).toBeNull()
  })
})
