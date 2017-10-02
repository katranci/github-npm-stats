import getRepoInfo from '../get-repo-info'

test('extracts owner and repo name from github url', () => {
  location.pathname = '/vuejs/vue'

  expect(getRepoInfo()).toEqual({
    owner: 'vuejs',
    repo: 'vue'
  })
})
