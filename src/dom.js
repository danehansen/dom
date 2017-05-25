import { toTitleCase } from '@danehansen/format'

const NO_WINDOW = typeof window === 'undefined'

// dom manipulation
// dom manipulation
// dom manipulation

function addPrefix(str) {
  let prefixed = PROP_STORAGE[str]
  if (prefixed) {
    return prefixed
  }
  const { prefix } = browser()
  if (prefix) {
    return prefix + toTitleCase(str)
  }
  return str
}

const PROP_STORAGE = {}
export function getStyle(element, property) {
  const { style } = element
  let value = style[property]
  if (value) {
    return value
  }

  const prefixed = addPrefix(property)
  value = style[prefixed]
  if (value) {
    PROP_STORAGE[property] = property
    return value
  }

  if (NO_WINDOW) {
    return ''
  }

  value = window.getComputedStyle(element)[property]
  if (value) {
    return value
  }

  PROP_STORAGE[property] = prefixed
  return window.getComputedStyle(element)[prefixed]
}

const MATRIX_VALUES = /matrix\(\s?([\d\-\.]+)\s?,\s?([\d\-\.]+)\s?,\s?([\d\-\.]+)\s?,\s?([\d\-\.]+)\s?,\s?([\d\-\.]+)\s?,\s?([\d\-\.]+)\s?\)/i
export function getMatrixStyle(element, axis) {
  const transform = getStyle(element, 'transform')
  const exec = MATRIX_VALUES.exec(transform)
  switch(axis) {
    case 'scaleX':
      return exec ? parseFloat(exec[1]) : 1
    case 'skewY':
      return exec ? parseFloat(exec[2]) : 0
    case 'skewX':
      return exec ? parseFloat(exec[3]) : 0
    case 'scaleY':
      return exec ? parseFloat(exec[4]) : 1
    case 'translateX':
      return exec ? parseFloat(exec[5]) : 0
    case 'translateY':
      return exec ? parseFloat(exec[6]) : 0
  }
}

/*export function relativePosition(evt, relativeTo = evt.currentTarget) {
  const rect = relativeTo.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  }
}*/

const COVER_ELEMENTS = []
const COVER_ASPECTS = []
export function cover(content, frame) {
  let index = COVER_ELEMENTS.indexOf(content)
  if (index < 0) {
    COVER_ELEMENTS.push(content)
    COVER_ASPECTS.push(content.offsetWidth / content.offsetHeight)
    index = COVER_ELEMENTS.indexOf(content)
  }
  const contentRatio = COVER_ASPECTS[index]
  const frameWidth = frame.offsetWidth
  const frameHeight = frame.offsetHeight
  const frameRatio = frameWidth / frameHeight
  const { style } = content
  if (frameRatio) {
    if(contentRatio > frameRatio) {
      const newWidth = frameHeight * contentRatio
      style.width = `${newWidth}px`
      style.height = `${frameHeight}px`
      style.left = `${-(newWidth - frameWidth) / 2}px`
      style.top = 0
    } else {
      const newHeight = frameWidth / contentRatio
      style.width = `${frameWidth}px`
      style.height = `${newHeight}px`
      style.left = 0
      style.top = `${-(newHeight - frameHeight) / 2}px`
    }
  } else {
    console.warn('Warning: @danehansen/dom.cover() called with no dimensions to work with.')
  }
}

// browser shit TODO: split this into 2 repos?
// browser shit
// browser shit

/*const URL_VARS = /[?&]+([^=&]+)=([^&]*)/gi
export function getURLVars() {
  if (NO_WINDOW) {
    return {}
  }
  const vars = {}
  const parts = window.location.href.replace(URL_VARS, function(m, key, value) { vars[key] = value })
  return vars
}*/

const DEFAULT_BROWSER = {
  android: false,
  ios: false,
  mobile: false,
  name: '',
  phone: false,
  prefix: '',
  tablet: false,
  version: 0,
  webkit: false,
}
let _browser
export function browser() {
  if (!_browser) {
    if (NO_WINDOW) {
      _browser = DEFAULT_BROWSER
    } else {
      const { userAgent } = window.navigator
      const isChrome = /chrome|crios/i.test(userAgent)
      const isAndroid = /android/i.test(userAgent)
      const isIos = /(ipod|iphone|ipad)/i.test(userAgent)
      const isTablet = /tablet/i.test(userAgent)
      const isMobile = isTablet || isAndroid || isIos
      const isPhone = !isTablet && /[^-]mobi/i.test(userAgent)

      if (isChrome) { // chrome
        _browser = {
          name: 'chrome',
          version: parseFloat(userAgent.match(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)[1]),
          webkit: true,
          prefix: 'webkit'
        }
      } else if (/firefox/i.test(userAgent)) { // firefox
        _browser = {
          name: 'firefox',
          version: parseFloat(userAgent.match(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)[1]),
          webkit: false,
          prefix: 'moz'
        }
      } else if (/safari/i.test(userAgent) && !chrome && !/phantom/i.test(userAgent)) { // safari
        _browser = {
          name: 'safari',
          version: parseFloat(userAgent.match(/version\/(\d+(\.\d+)?)/i)[2]),
          webkit: true,
          prefix: 'webkit'
        }
      } else if (/(msie|trident)/i.test(userAgent)) { // ie
        _browser = {
          name: 'msie',
          version: parseFloat(userAgent.match(/(?:msie |rv:)(\d+(\.\d+)?)/i)[2]),
          webkit: false,
          prefix: 'ms'
        }
      } else {
        _browser = DEFAULT_BROWSER
      }

      _browser.android = isAndroid
      _browser.ios = isIos
      _browser.tablet = isTablet
      _browser.mobile = isMobile
      _browser.phone = isPhone
    }
    Object.freeze(_browser)
  }

  return _browser
}

let _touch
export function touch() {
  if (_touch === undefined) {
    _touch = NO_WINDOW ? false : 'ontouchstart' in window
  }
  return _touch
}

/*export function deviceOrientation(evt, ref) {
  let { gamma } = evt
  if (gamma) {
    if (!ref) {
      ref = evt
    }
    const { orientation } = window
    gamma -= ref.gamma
    if (gamma < -180) {
      gamma += 360
    }
    gamma = _unadjust(gamma)
    gamma /= 90
    let beta = _adjustBeta(evt)
    const refBeta = _adjustBeta(ref)
    beta -= refBeta
    if (beta < -180) {
      beta += 360
    }
    beta = _unadjust(beta)
    beta /= 90
    let alpha = evt.alpha - ref.alpha
    if (alpha < 0) {
      alpha += 360
    }
    alpha = (alpha + orientation) / 90
    if (alpha < 2) {
      if (alpha > 1) {
        alpha = 2 - alpha
      }
      alpha *= -1
    } else {
      if (alpha < 3) {
        alpha -= 2
      } else {
        alpha = 4 - alpha
      }
    }
    if (Math.abs(orientation) == 90) {
      const a = gamma
      gamma = beta
      beta = a
    }
    if (orientation < 0) {
      gamma = -gamma
      beta = -beta
    }
    return {
      x: gamma,
      y: beta,
      z: alpha,
    }
  }
}

function _adjustBeta(evt) {
  let { beta } = evt
  const { gamma } = evt
  if (gamma > 90) {
    beta = 180 - beta
  } else if (gamma < -90) {
    beta = -180 - beta
  }
  return beta
}

function _unadjust(num) {
  if (num > 90) {
    num = 180 - num
  } else if (num < -90) {
    num = -180 - num
  }
  return num
}

export function logObject(obj, name) {
  if (name) {
    console.log(name)
  }
  console.log('{')
  for (let i in obj) {
    console.log(` ${i}: ${obj[i]},`)
  }
  console.log('}')
  console.log('')
}*/
