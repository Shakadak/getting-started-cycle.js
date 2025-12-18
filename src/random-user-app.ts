import { a, button, div, h1, h4, makeDOMDriver } from "@cycle/dom"
import { makeHTTPDriver } from "@cycle/http"
import run from "@cycle/run"

function main(sources) {
  console.log('in main')

  const click$ = sources.DOM.select('.get-random').events('click')

  const getRandomUser$ = click$.map(() => {
    const randomNum = Math.round(Math.random() * 9) + 1
    return {
      url: `https://jsonplaceholder.typicode.com/users/${randomNum}`,
      category: 'users',
      method: 'GET',
    }
  })

  const users$ = sources.HTTP.select('users')
  .flatten()
  .map(resp => { console.log('in body mapping') ; return resp.body })
  .startWith(null)

  const vdom$ = users$.map(user => {
    console.log('in user mapping')
    return div('.users', [
      button('.get-random', 'Get random user'),
      user === null ? null : div('.user-details', [
        h1('.user-name', user.name),
        h4('.user-email', user.email),
        a('.user-website', {href: user.website}, user.website),
      ]),
    ])
  })

  return {
    DOM: vdom$,
    HTTP: getRandomUser$,
  }
}

console.log('before run')

run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
})
