/**
 * @author huke
 * @email hu-ke@hotmail.com
 * @create date 2017-08-08 14:05:07
 * @modify date 2017-08-08 14:05:07
 * @desc [description]
*/
let dragHelper = null
console.log('zzz')
console.log('111')
console.log('222')
class DragHelper {
  constructor(el, options) {
    this.cursor = 'default'
    this.margin = 0
    this.el = el
    this.landPoint = {}
    this.position = window.getComputedStyle(el).getPropertyValue('position')

    if (options) {

      if (typeof(options['margin']) === 'number') {
        this.margin = options.margin
      }

      if (typeof(options['cursor']) === 'string') {
        this.cursor = options.cursor
      }

      // mouse events hooks
      if (typeof(options['onStart']) === 'function') {
        this.onStart = options.onStart
      }
      if (typeof(options['onDragging']) === 'function') {
        this.onDragging = options.onDragging
      }
      if (typeof(options['onEnd']) === 'function') {
        this.onEnd = options.onEnd
      }

    }

    this.el.style.cursor = this.cursor
  }
  // calculate position left/top based on mouse events
  calPosLeft(e) {
    let left = null

    let deltaX = e.clientX - this.getLandPoint().x
    let eleWidth = this.getEleWidth()
    let margin = this.margin
    let viewWidth = this.getViewportWidth()

    if (this.position === 'fixed') {

      if (deltaX >= margin && deltaX <= viewWidth - eleWidth - margin) {
        left = `${deltaX}px`
      } else if (deltaX < margin) { // left border overflow
        left = `${margin}px`
      } else if (deltaX > viewWidth - eleWidth - margin) { // right border overflow
        left = `${viewWidth - eleWidth - margin}px`
      }

    } else if (this.position === 'absolute') {
      let parentEle = this.getPosNotStaticParent()
      let parentRect = parentEle.getBoundingClientRect()
      let parentLeft = parentRect.left
      let parentWidth = parentRect.width

      if (deltaX >= margin + parentLeft && deltaX <= parentWidth + parentLeft - eleWidth - margin) {
        left = `${deltaX - parentLeft}px`
      } else if (deltaX < margin + parentLeft) { // left border overflow
        left = `${margin}px`
      } else if (deltaX >  parentWidth + parentLeft - eleWidth - margin) { // right border overflow
        left = `${parentWidth - eleWidth - margin}px`
      }

    } else if (this.position === 'relative') {
      let parentEle = this.getPosNotStaticParent()
      let parentRect = parentEle.getBoundingClientRect()
      let parentLeft = parentRect.left

      left = `${e.clientX - parentLeft - this.getLandPoint().x}px`
    }
    
    return left
  }
  calPosTop(e) {
    let top = null
    let deltaY = e.clientY - this.getLandPoint().y
    let eleHeight = this.getEleHeight()
    let margin = this.margin
    let viewHeight = this.getViewportHeight()

    if (this.position === 'fixed') {

      if (deltaY >= margin && deltaY <= viewHeight - eleHeight - margin) {
        top = `${deltaY}px`
      } else if (deltaY < margin) { // top border overflow
        top = `${margin}px`
      } else if (deltaY > viewHeight - eleHeight - margin) { // bottom border overflow
        top = `${viewHeight - eleHeight - margin}px`
      }
      
    } else if (this.position === 'absolute') {
      let parentEle = this.getPosNotStaticParent()
      let parentRect = parentEle.getBoundingClientRect()
      let parentTop = parentRect.top
      let parentHeight = parentRect.height

      if (deltaY >= margin + parentTop && deltaY <= parentHeight + parentTop - eleHeight - margin) {
        top = `${deltaY - parentTop}px`
      } else if (deltaY < margin + parentTop) { // top border overflow
        top = `${margin}px`
      } else if (deltaY > parentHeight + parentTop - eleHeight - margin) { // bottom border overflow
        top = `${parentHeight - eleHeight - margin}px`
      }

    } else if (this.position === 'relative') {
      let parentEle = this.getPosNotStaticParent()
      let parentRect = parentEle.getBoundingClientRect()
      let parentTop = parentRect.top

      top = `${e.clientY - parentTop - this.getLandPoint().y}px`
    }
    
    return top
  }

  // getters & setters
  setLandPoint(landPoint) {
    this.landPoint = landPoint
  }
  setPosLeft(left) {
    this.el.style.left = left
  }
  setPosTop(top) {
    this.el.style.top = top
  }
  getLandPoint() {
    return this.landPoint
  }
  getEle() {
    return this.el
  }
  getEleWidth() {
    return this.el.offsetWidth
  }
  getEleHeight() {
    return this.el.offsetHeight
  }
  getViewportWidth() { // get viewport width
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  }
  getViewportHeight() { // get viewport height
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  }

  // get element's parent whose position is not 'static'
  getPosNotStaticParent() {
    let parentEle = this.getEle().parentElement

    while(parentEle && parentEle.nodeType !== 8) { // not document node
      if (window.getComputedStyle(parentEle).getPropertyValue('position') !== 'static') {
        return parentEle
      }
      parentEle = parentEle.parentElement
    }

    return document.body
  }
}

// add/remove listeners
function addListener(type, listener) {
  if (document.addEventListener) {
    document.addEventListener(type, listener, false)
  } else {
    document.attachEvent(type, listener)
  }
}

function removeListener(type, listener) {
  if (document.removeLisntener) {
    document.removeLisntener(type, listener, false)
  } else {
    document.removeEventListener(type, listener, false)
  }
}

// mouse events
function mousedown(e) {
  preventDefault(e)

  // onStart callback
  dragHelper.onStart && dragHelper.onStart(e)
  
  let el = dragHelper.el

  const rect = el.getBoundingClientRect()
  dragHelper.setLandPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top })

  addListener('mousemove', mousemove)
  addListener('mouseup', mouseup)

}

function mouseup(e) {
  preventDefault(e)

  // onEnd callback
  dragHelper.onEnd && dragHelper.onEnd(e)

  dragHelper.setLandPoint(null)

  removeListener('mousemove', mousemove)
  removeListener('mouseup', mouseup)

}

function mousemove(e) {
  preventDefault(e)
  
  // onDragging callback
  dragHelper.onDragging && dragHelper.onDragging(e)
  
  if (dragHelper.getLandPoint()) {
    dragHelper.setPosLeft(dragHelper.calPosLeft(e))
    dragHelper.setPosTop(dragHelper.calPosTop(e))
  }

}

// deal with the mousescroll event
function preventDefault(e) {
  e = e || window.event
  if (e.preventDefault) {
    e.preventDefault()
  }
  e.returnValue = false
}

// returns true if it is a DOM element    
function isElement(o){
  return (
    typeof HTMLElement === 'object' ? o instanceof HTMLElement : // DOM2
    o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName==='string'
  )
}

export default function(el, options) {

  if (!isElement(el)) {
    throw new Error(`It's not a valid element!`)
  }

  if (window.getComputedStyle(el).getPropertyValue('position') !== 'relative'
    && window.getComputedStyle(el).getPropertyValue('position') !== 'absolute' 
    && window.getComputedStyle(el).getPropertyValue('position') !== 'fixed') {
    
    throw new Error(`position should be 'relative', 'absolute', or 'fixed'!`)
  }

  dragHelper = new DragHelper(el, options)
  addListener('mousedown', mousedown)

  return dragHelper
}
