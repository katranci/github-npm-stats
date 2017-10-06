import getRepoInfo from '../get-repo-info'

describe('getRepoInfo', () => {
  it('extracts owner and repo name from github url', () => {
    location.pathname = '/vuejs/vue'

    expect(getRepoInfo()).toEqual({
      owner: 'vuejs',
      repo: 'vue'
    })
  })

  it('returns null for a non-repo url', () => {
    location.pathname = '/'
    expect(getRepoInfo()).toBeNull()

    location.pathname = '/explore'
    expect(getRepoInfo()).toBeNull()
  })
})
