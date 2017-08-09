# dragging
> Dragging is a simple javascript library for moving elements. Note that this lib works only if the target element's position set to be 'relative', 'absolute', or 'fixed'.
## Quick Start
```
import dragging from './dragging.js'
```
```
let ele = document.getElementById('ele')

dragging(ele, {
  cursor: 'pointer', // the cursor effect while mouse hovering on the target element.
  margin: 10, // 1.for absolutely positioned element, the margin specifies the minimum spaces(in pixels) kept to the border of the element's containing block. (The containing block is the ancestor to which the element is relatively positioned.)
              // 2.for fixedly positioned element, the margin specifies the minimum spaces(in pixels) kept to the border of the current viewport.
              // 3.for relatively positioned element, margin will be ignored.
  onStart: (e) => { console.log('onstart..', e) }, // triggered on drag start.
  onDragging: (e) => { console.log('ondragging..', e) }, // triggered on dragging
  onEnd: (e) => { console.log('onend..', e) }, // triggered on drag end
})
```

## Contributing
dragstart.js is a free and open source library, and I appreciate any help you're willing to give - whether it's fixing bugs, improving documentation, or suggesting new features.
