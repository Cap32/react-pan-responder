
const createEvent = ({ isTouch }) => (eventType, eventData = {}) => {
	const event = document.createEvent('MouseEvents');
	event.initMouseEvent(
		eventType,
		true,
		true,
		window,					 					// view
		1,												// detail
		eventData.screenX || 0,		// screenX
		eventData.screenY || 0,		// screenY
		eventData.clientX || 0,		// clientX
		eventData.clientY || 0,		// clientY
		eventData.pageX || 0,			// pageX
		eventData.pageY || 0,			// pageY
		false,										// ctrlKey
		false,										// altKey
		false,										// shiftKey
		false,										// metaKey
		0,												// button
		null
	);
	isTouch && (event.touches = [eventData]);
	window.dispatchEvent(event);
};

export const simulateTouchEvent = createEvent({ isTouch: true });
export const simulateMouseEvent = createEvent({ isTouch: false });
