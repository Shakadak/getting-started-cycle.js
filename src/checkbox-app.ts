import { div, input, makeDOMDriver, p, type VNode } from "@cycle/dom"
import run from "@cycle/run"
import xs, { Stream } from "xstream"

// MatchingMain<{ DOM: (stream: Stream<VNode>) => MainDOMSource; }, (sources: { DOM: Stream<VNode>; }) => { DOM: any; }>

function main(sources: {DOM: Stream<VNode>}) {
  const sinks = {
    DOM: sources.DOM.select('input').events('change')
    .map(ev => ev.target.checked)
    .startWith(false)
    .map(toggled =>
      div([
        input({attrs: {type: 'checkbox'}}), 'Toggle me',
        p(toggled ? 'ON' : 'off')
      ])
    )
  }
  return sinks
}

run(main, {
  DOM: makeDOMDriver('#app'),
})
