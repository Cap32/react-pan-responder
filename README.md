# react-pan-responder

[![Build Status](https://travis-ci.org/Cap32/react-pan-responder.svg?branch=master)](https://travis-ci.org/Cap32/react-pan-responder) [![Coverage Status](https://coveralls.io/repos/github/Cap32/react-pan-responder/badge.svg?branch=master)](https://coveralls.io/github/Cap32/react-pan-responder?branch=master) [![License](https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat)](https://github.com/Cap32/react-pan-responder/blob/master/LICENSE.md)

Low level pan gesture responder React component for DOM. This library is highly inspired by [React Native PanResponder](http://facebook.github.io/react-native/docs/panresponder.html).

## Table of Contents

- [Table of Contents](#table-of-contents)
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
  - [onStartShouldSetPanResponder](#onstartshouldsetpanresponder)
  - [onStartShouldSetPanResponderCapture](#onstartshouldsetpanrespondercapture)
  - [onMoveShouldSetPanResponder](#onmoveshouldsetpanresponder)
  - [onMoveShouldSetPanResponderCapture](#onmoveshouldsetpanrespondercapture)
  - [onPanResponderGrant](#onpanrespondergrant)
  - [onPanResponderReject](#onpanresponderreject)
  - [onPanResponderStart](#onpanresponderstart)
  - [onPanResponderMove](#onpanrespondermove)
  - [onPanResponderEnd](#onpanresponderend)
  - [onPanResponderRelease](#onpanresponderrelease)
  - [onResponderTerminationRequest](#onresponderterminationrequest)
  - [onResponderTerminate](#onresponderterminate)
  - [directionalLock](#directionallock)
  - [static DirectionalLock](#static-directionallock)
- [License](#license)


## Features

- Provides `gestureState` helper object
- Reconciles several touches into a single gesture
- Reconciles move and end events outside target element
- Compatible with mouse event


## Getting Started

### Installation

```bash
$ yarn add react-pan-responder
```


### Example

```js
import React, { Component } from 'react';
import PanResponder from 'react-pan-responder';

export default class MyApp extends Component {
  render() {
    <PanResponder
      onStartShouldSetPanResponder={(event, gestureState) => true}
      onPanResponderGrant={(event, gestureState) => {}}
      onPanResponderMove={(event, gestureState) => {}}
      onPanResponderRelease={(event, gestureState) => {}}
    >
      {(ref) =>
        <div ref={ref}>Awesome</div>
      }
    </PanResponder>
  }
}
```

### Demo

[https://cap32.github.io/react-pan-responder/](https://cap32.github.io/react-pan-responder/)


## Responder Lifecycle

A view can become the touch responder by implementing the correct negotiation methods. There are two methods to ask the view if it wants to become responder:

* `View.props.onStartShouldSetResponder: (event, gestureState) => true`, - Does this view want to become responder on the start of a touch?
* `View.props.onMoveShouldSetResponder: (event, gestureState) => true`, - Called for every touch move on the View when it is not the responder: does this view want to "claim" touch responsiveness?

If the View returns true and attempts to become the responder, one of the following will happen:

* `View.props.onResponderGrant: (event, gestureState) => {}` - The View is now responding for touch events. This is the time to highlight and show the user what is happening
* `View.props.onResponderReject: (event, gestureState) => {}`  - Something else is the responder right now and will not release it

If the view is responding, the following handlers can be called:

* `View.props.onResponderMove: (event, gestureState) => {}` - The user is moving their finger
* `View.props.onResponderRelease: (event, gestureState) => {}` - Fired at the end of the touch, i.e. "touchUp"
* `View.props.onResponderTerminationRequest: (event, gestureState) => true` - Something else wants to become responder. Should this view release the responder? Returning `true` allows release
* `View.props.onResponderTerminate: (event, gestureState) => {}` - The responder has been taken by other views after a call to `onResponderTerminationRequest`


## Responder Handlers

It provides a predictable wrapper of the responder handlers provided by the gesture responder system. For each handler, it provides a new `gestureState` object alongside the native event object:

```js
onPanResponderMove: (event, gestureState) => {}
```

### Event

The native event that binding to `window` object. **This is NOT a [Synthetic Event](https://facebook.github.io/react/docs/events.html)**

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


## Properties

*All properties are optional*

### onStartShouldSetPanResponder

`boolean|function`

Deciding this component to become responder on the start of a touch. Defaults to `false`. If giving a function, it should return a `boolean`.


### onStartShouldSetPanResponderCapture

`boolean|function`

Just like `onStartShouldSetPanResponder`, but using capture. Defaults to `false`.


### onMoveShouldSetPanResponder

`boolean|function`

Deciding this component to become responder on every touch move on the View when it is not the responder. Defaults to `false`.


### onMoveShouldSetPanResponderCapture

`boolean|function`

Just like `onMoveShouldSetPanResponder`, but using capture. Defaults to `false`.


### onPanResponderGrant

`function`

Fired when this component is now responding for touch events. This is the time to highlight and show the user what is happening.

### onPanResponderReject

`function`

Fired when something else is the responder right now and will not release it


### onPanResponderStart

`function`

Fired for every touch start when it is the responder.


### onPanResponderMove

`function`

Fired for every touch move when it is the responder.


### onPanResponderEnd

`function`

Fired for every touch end when it is the responder.


### onPanResponderRelease

`function`

Fired at the end of the touch, i.e. "touchUp".

### onResponderTerminationRequest

`boolean|function`

Fired when something else wants to become responder. Should this view release the responder? Returning `true` allows release

### onResponderTerminate

`function`

Fired when responder has been taken by other views after a call to `onResponderTerminationRequest`

### directionalLock

`string`

Disable browser handling (i.e. scrolling). The value could be one of `DirectionalLock.both` (default), `DirectionalLock.x`, `DirectionalLock.y` or `DirectionalLock.none`. See the following for detail.


### static DirectionalLock

An helper object for `directionalLock`:

- `both`: Disable browser handling of all panning gestures.
- `x`: Enable single-finger horizontal panning gestures for browser handling.
- `y`: Enable single-finger vertical panning gestures for browser handling.
- `none`: Enable browser handling of all panning gestures.


## License

MIT
