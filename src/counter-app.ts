import { button, div, makeDOMDriver, p } from "@cycle/dom";
import run from "@cycle/run";
import xs from "xstream";

function main(sources) {
  const action$ = xs.merge(
    sources.DOM.select('.decrement').events('click').mapTo(-1),
    sources.DOM.select('.increment').events('click').mapTo(+1),
  )

  const count$ = action$.fold((x, y) => x + y, 0)

  const vdom$ = count$.map(count =>
    div([
      button('.increment', 'Increment'),
      button('.decrement', 'Decrement'),
      p(`Counter: ${count}`)
    ])
  )

  return {
    DOM: vdom$,
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
})
