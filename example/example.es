import React, { Component } from 'react';
import PanResponder from 'react-pan-responder-view';

export default class MyApp extends Component {
  render() {
    <PanResponder
      onStartShouldSetPanResponder={(e, gestureState) => true}
      onStartShouldSetPanResponderCapture={(e, gestureState) => true}
      onMoveShouldSetPanResponderCapture={(e, gestureState) => true}
      onMoveShouldSetPanResponder={(e, gestureState) => true}
      onPanResponderGrant={(e, gestureState) => {}}
      onPanResponderStart={(e, gestureState) => {}}
      onPanResponderMove={(e, gestureState) => {}}
      onPanResponderEnd={(e, gestureState) => {}}
      onPanResponderRelease={(e, gestureState) => {}}
    >
      {(ref) => <h1 ref={ref}>Awesome</h1>}
    </PanResponder>
  }
}
