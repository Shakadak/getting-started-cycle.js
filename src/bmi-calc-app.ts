import { div, h2, input, makeDOMDriver } from "@cycle/dom"
import run from "@cycle/run"
import xs from "xstream"

function main(sources) {
  const changeWeight$ = sources.DOM.select('.weight')
  .events('input')
  .map(ev => ev.target.value)

  const changeHeight$ = sources.DOM.select('.height')
  .events('input')
  .map(ev => ev.target.value)

  const weight$ = changeWeight$.startWith(70)
  const height$ = changeHeight$.startWith(170)

  const state$ = xs.combine(weight$, height$)
  .map(([weight, height]) => {
    const heightMeters = height * 0.01
    const bmi = Math.round(weight / (heightMeters * heightMeters))
    return {bmi, weight, height}
  })

  const vdom$ = state$.map(({bmi, weight, height}) =>
    div([
      div([
        `Weight ${weight} kg`,
        input('.weight', {attrs: {type: 'range', min: 40, max: 140, value: weight}})
      ]),
      div([
        `Height ${height}cm`,
        input('.height', {attrs: {type: 'range', min: 140, max: 210, value: height}})
      ]),
      h2(`BMI is ${bmi}`),
    ])
  )

  return {
    DOM: vdom$
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
})
