import React, { Component } from 'react';
import PanResponderView from 'react-pan-responder-view';

export default class MyApp extends Component {
  render() {
    <PanResponderView
      onStartShouldSetPanResponder={this._handleStartShouldSetResponder}
      onMoveShouldSetPanResponder={this._handleMoveShouldSetResponder}
      onPanResponderGrant={this._handleResponderGrant}
      onPanResponderMove={this._handleResponderMove}
      onPanResponderRelease={this._handleResponderRelease}
    >
      Awesome
    </PanResponderView>
  }
}
