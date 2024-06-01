import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import { ReactXRAware } from 'troika-xr'
import { preloadFont } from 'troika-three-text';

import GlobeConnectionsExample from './GlobeConnectionsExample'

const EXAMPLES = [
 {id: 'globeConnections', name: 'Globe Connections', component: GlobeConnectionsExample},
]

// preloadFont(
//   {
//     font: 'https://caseymanning.github.io/RobotoMono-Regular.ttf',
//     characters: 'abcdefghijklmnopqrstuvwxyz/().,',
//   },
//   () => {
//     console.log('preload font complete');
//   },
// );

class ExamplesApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedExampleId: (location.hash && location.hash.replace(/^#/, '')) || EXAMPLES[0].id,
      bodyWidth: null,
      bodyHeight: null,
      stats: true
    }
    this._onBodyElRef = this._onBodyElRef.bind(this)
    this._onWindowResize = this._onWindowResize.bind(this)
    this._onHashChange = this._onHashChange.bind(this)
    this._onExampleSelect = this._onExampleSelect.bind(this)
    this._onToggleStats = this._onToggleStats.bind(this)
  }
  componentWillMount() {
    window.addEventListener('hashchange', this._onHashChange, false)
    window.addEventListener('resize', this._onWindowResize, false)
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this._onHashChange, false)
    window.removeEventListener('resize', this._onWindowResize, false)
  }

  _onBodyElRef(el) {
    this._bodyEl = el
    if (el) {
      this._onWindowResize()
    }
  }

  _onWindowResize() {
    let box = this._bodyEl.getBoundingClientRect()
    this.setState({bodyWidth: box.width, bodyHeight: box.height})
  }

  _onHashChange() {
    const selectedExampleId = location.hash.replace(/^#/, '')
    const exampleObj = EXAMPLES.filter(({id}) => id === selectedExampleId)[0]
    if (exampleObj) {
      if (exampleObj.disableXR && this.props.xrSession) {
        this.props.xrSession.end().then(() => {
          this.setState({selectedExampleId})
        })
      } else {
        this.setState({selectedExampleId})
      }
    }
  }

  _onExampleSelect(e) {
    location.hash = e.target.value
  }

  _onToggleStats() {
    this.setState({stats: !this.state.stats})
  }

  render() {
    let {selectedExampleId, bodyWidth, bodyHeight, stats} = this.state
    let example = EXAMPLES.filter(({id}) => id === selectedExampleId)[0]
    let ExampleCmp = example && example.component

    return (
      <div>
        <GlobeConnectionsExample
        width={ window.innerWidth }
        height={ window.innerHeight }
        stats={ false }
        vr={false}/>
      </div>
    )
  }
}

ExamplesApp = ReactXRAware(ExamplesApp, {
  // For now, none of the examples make use of floor-relative tracking, so let's just
  // limit it to a 'local' space to make it easier to keep things at eye height.
  // TODO: figure out a good approach for floor-relative tracking for any future
  //  examples that make use of it.
  referenceSpaces: ['local']
})
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<ExamplesApp/>);
// ReactDOM.render(<ExamplesApp />, document.getElementById('app'))
