import React, { Component } from 'react';
import PanResponderView from 'react-pan-responder-view';

export default class MyApp extends Component {
  render() {
    <PanResponderView
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
      Awesome
    </PanResponderView>
  }
}
