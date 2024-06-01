import React from 'react'
import T from 'prop-types'
import {Canvas3D, Group3DFacade, ListFacade} from 'troika-3d'
import {UIBlock3DFacade} from 'troika-3d-ui'
import Globe from './Globe'
import XRGrabbable from './XRGrabbable'
import ConnectionsFacade from './ConnectionsFacade'
import cities from './cities.json'
import { Matrix4, Vector2, Raycaster, PerspectiveCamera } from 'three'


const gripSpaceTransform = new Matrix4().makeRotationX(Math.PI / -2).setPosition(0, 0.02, -0.17)

class GlobeConnectionsExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stickToHand: true
    }
    this.raycaster = new Raycaster();
    this.refs = Object.create(null)
    this._onFacadeRef = this._onFacadeRef.bind(this)
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  }

  _onFacadeRef(name, facade) {
    this.refs[name] = facade
  }

  onGotClick = e => {
    // console.log("hi")
    // const mouse = new Vector2();
    //   mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    //   this.raycaster.setFromCamera(mouse.clone(), this.camera);
    //   var objects = this.raycaster.intersectObjects(this.scene.children);
    //   if (objects.length === 0) return;
    //   const clickedPtInTextMesh = new THREE.Vector3(
    //     objects[0].point.x,
    //     objects[0].point.y,
    //     0
    //   );
  }

  render() {
    let {props, state} = this
    console.log('props', props)
    let {width, height} = props
    return (
      <div onMouseMove={ this._onMouseMove } onClick={this.onGotClick}>
        <Canvas3D
          antialias
          stats={ this.props.stats }
          width={ width }
          height={ height }
          lights={ [
            {
              type: 'ambient'
            },
            {
              type: 'directional',
              x: 0,
              y: 0,
              z: 1
            }
          ] }
          objects={ [
            // Spinning globe - wrapped to make it grabbable by an XR hand controller
            {
              facade: XRGrabbable,
              transition: {
                grabbedAmount: {duration: 500, easing: 'easeOutExpo'}
              },
              x: -0.15,
              z: -0.5,
              gripSpaceTransform,
              children: {
                key: 'globe',
                facade: Globe,
                ref: this._onFacadeRef.bind(this, 'globe'),
                scale: 0.075,
                pointerEvents: true,
                animation: {
                  from: {rotateY: -Math.PI},
                  to: {rotateY: Math.PI},
                  duration: 24000,
                  iterations: Infinity
                }
              }
            },

            // Scrollable list of cities:
            {
              facade: UIBlock3DFacade,
              x: 0.3,
              y: 0.1,
              z: props.vr ? -0.5 : -0.9,
              rotateY: Math.PI / -16,
              width: 0.25,
              height: 0.35,
              fontSize: 0.014,
              font: 'https://caseymanning.github.io/robot_old.woff',
              lineHeight: 1.1,
              flexDirection: 'column',
              border: '1px solid white',
              children: [
                {
                  facade: UIBlock3DFacade,
                  padding: [0.005, 0.01],
                  borderRadius: [0.005, 0.005, 0, 0],
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  color: 0x8D8D8D,
                  // font: 'https://caseymanning.github.io/RobotoMono-Regular.ttf',
                  children: ['MUSIC/ART/DESIGN \nEST. AUGUST 03, 2016\nSERVED WORLDWIDE']
                },
                {
                  facade: UIBlock3DFacade,
                  flex: 1,
                  overflow: 'scroll',
                  flexDirection: 'column',
                  children: {
                    key: 'cities',
                    ref: this._onFacadeRef.bind(this, 'cities'),
                    facade: ListFacade,
                    data: cities,  // array of city objects
                    onclick: (d, i) => {
                      console.log("hhiiii", i)
                    },
                    template: {
                      key: (d, i) => i,
                      facade: UIBlock3DFacade,
                      lat: d => d.lat,
                      lng: d => d.lng,
                      padding: [0.005, 0.01],
                      hovering: false,
                      backgroundColor: null,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      pointerStates: {
                        hover: {
                          hovering: true,
                          backgroundColor: 0xffffff,
                          color: 0x000000
                        }
                      },
                      children: d => [d.name],
                    }
                  }
                },
                /*{
                  facade: UIBlock3DFacade,
                  padding: 0.005,
                  text: '',
                  onAfterRender(renderer) {
                    const now = Date.now()
                    if (now - (this._lastStats || 0) > 500) {
                      this.text = 'Draw calls: ' + renderer.info.render.calls
                      this.afterUpdate()
                      this._lastStats = now
                    }
                  }
                }*/
              ]
            },
            { // Container that manages syncing connection beziers to their endpoint object positions
              facade: ConnectionsFacade,
              objectRefs: this.refs
            }
          ] }
        />
      </div>
    )
  }
}

GlobeConnectionsExample.propTypes = {
  width: T.number,
  height: T.number
}

export default GlobeConnectionsExample

