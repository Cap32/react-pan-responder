# react-pan-responder-view

[![Build Status](https://travis-ci.org/Cap32/react-pan-responder-view.svg?branch=master)](https://travis-ci.org/Cap32/react-pan-responder-view) [![Coverage Status](https://coveralls.io/repos/github/Cap32/react-pan-responder-view/badge.svg?branch=master)](https://coveralls.io/github/Cap32/react-pan-responder-view?branch=master) [![License](https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat)](https://github.com/Cap32/react-pan-responder-view/blob/master/LICENSE.md)

Low level pan gesture responder React component for DOM. This library is highly inspired by [React Native PanResponder](http://facebook.github.io/react-native/docs/panresponder.html).

## Table of Contents

<!-- MarkdownTOC autolink="true" bracket="round" -->

- [Features](#features)
- [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Example](#example)
    - [Demo](#demo)
- [Responder Lifecycle](#responder-lifecycle)
- [Responder Handlers](#responder-handlers)
    - [Event](#event)
    - [GestureState](#gesturestate)
- [Properties](#properties)
    - [component](#component)
    - [onStartShouldSetPanResponder](#onstartshouldsetpanresponder)
    - [onStartShouldSetPanResponderCapture](#onstartshouldsetpanrespondercapture)
    - [onMoveShouldSetPanResponder](#onmoveshouldsetpanresponder)
    - [onMoveShouldSetPanResponderCapture](#onmoveshouldsetpanrespondercapture)
    - [onPanResponderGrant](#onpanrespondergrant)
    - [onPanResponderStart](#onpanresponderstart)
    - [onPanResponderMove](#onpanrespondermove)
    - [onPanResponderEnd](#onpanresponderend)
    - [onPanResponderRelease](#onpanresponderrelease)
    - [touchAction](#touchaction)
    - [static TouchActions](#static-touchactions)
- [License](#license)

<!-- /MarkdownTOC -->


<a name="features"></a>
## Features

- Provides `gestureState` helper object
- Reconciles several touches into a single gesture
- Reconciles move and end events outside target element
- Compatible with mouse event


<a name="getting-started"></a>
## Getting Started

<a name="installation"></a>
### Installation

```bash
$ yarn add react-pan-responder-view
```


<a name="example"></a>
### Example

```js
import React, { Component } from 'react';
import PanResponderView from 'react-pan-responder-view';

export default class MyApp extends Component {
  render() {
    <PanResponderView
      onStartShouldSetPanResponder={(event, gestureState) => true}
      onPanResponderGrant={(event, gestureState) => {}}
      onPanResponderMove={(event, gestureState) => {}}
      onPanResponderRelease={(event, gestureState) => {}}
    >
      Awesome
    </PanResponderView>
  }
}
```

<a name="demo"></a>
### Demo

[https://cap32.github.io/react-pan-responder-view/](https://cap32.github.io/react-pan-responder-view/)


<a name="responder-lifecycle"></a>
## Responder Lifecycle

A view can become the touch responder by implementing the correct negotiation methods. There are two methods to ask the view if it wants to become responder:

* `View.props.onStartShouldSetResponder: (event, gestureState) => true`, - Does this view want to become responder on the start of a touch?
* `View.props.onMoveShouldSetResponder: (event, gestureState) => true`, - Called for every touch move on the View when it is not the responder: does this view want to "claim" touch responsiveness?

If the View returns true and attempts to become the responder, one of the following will happen:

* `View.props.onResponderGrant: (event, gestureState) => {}` - The View is now responding for touch events. This is the time to highlight and show the user what is happening

If the view is responding, the following handlers can be called:

* `View.props.onResponderMove: (event, gestureState) => {}` - The user is moving their finger
* `View.props.onResponderRelease: (event, gestureState) => {}` - Fired at the end of the touch, i.e. "touchUp"


<a name="responder-handlers"></a>
## Responder Handlers

It provides a predictable wrapper of the responder handlers provided by the gesture responder system. For each handler, it provides a new `gestureState` object alongside the native event object:

```js
onPanResponderMove: (event, gestureState) => {}
```

<a name="event"></a>
### Event

The native event that binding to `window` object. **This is NOT a [Synthetic Event](https://facebook.github.io/react/docs/events.html)**

<a name="gesturestate"></a>
### GestureState

A gestureState object has the following:

* stateID - ID of the gestureState- persisted as long as there at least one touch on screen
* moveX - the latest screen coordinates of the recently-moved touch
* moveY - the latest screen coordinates of the recently-moved touch
* x0 - the screen coordinates of the responder grant
* y0 - the screen coordinates of the responder grant
* dx - accumulated distance of the gesture since the touch started
* dy - accumulated distance of the gesture since the touch started
* vx - current velocity of the gesture
* vy - current velocity of the gesture
* numberActiveTouches - Number of touches currently on screen


<a name="properties"></a>
## Properties

*All properties are optional*

<a name="component"></a>
### component

`string|function`

Wrapper component. Defaults to `div`.


<a name="onstartshouldsetpanresponder"></a>
### onStartShouldSetPanResponder

`boolean|function`

Deciding this component to become responder on the start of a touch. Defaults to `false`. If giving a function, it should return a `boolean`.


<a name="onstartshouldsetpanrespondercapture"></a>
### onStartShouldSetPanResponderCapture

`boolean|function`

Just like `onStartShouldSetPanResponder`, but using capture. Defaults to `false`.


<a name="onmoveshouldsetpanresponder"></a>
### onMoveShouldSetPanResponder

`boolean|function`

Deciding this component to become responder on every touch move on the View when it is not the responder. Defaults to `false`.


<a name="onmoveshouldsetpanrespondercapture"></a>
### onMoveShouldSetPanResponderCapture

`boolean|function`

Just like `onMoveShouldSetPanResponder`, but using capture. Defaults to `false`.


<a name="onpanrespondergrant"></a>
### onPanResponderGrant

`function`

Calling when this component is now responding for touch events. This is the time to highlight and show the user what is happening.


<a name="onpanresponderstart"></a>
### onPanResponderStart

`function`

Calling for every touch start when it is the responder.


<a name="onpanrespondermove"></a>
### onPanResponderMove

`function`

Calling for every touch move when it is the responder.


<a name="onpanresponderend"></a>
### onPanResponderEnd

`function`

Calling for every touch end when it is the responder.


<a name="onpanresponderrelease"></a>
### onPanResponderRelease

`function`

Calling at the end of the touch, i.e. "touchUp".


<a name="touchaction"></a>
### touchAction

`string`

Defining responder panning action. The value could be one of `TouchActions.none` (default), `TouchActions.x` or `TouchActions.y`. See the following for detail.


<a name="static-touchactions"></a>
### static TouchActions

An helper object for `touchAction`:

- `none`: Disable browser handling of all panning gestures.
- `x`: Enable single-finger horizontal panning gestures.
- `y`: Enable single-finger vertical panning gestures.


<a name="license"></a>
## License

MIT
