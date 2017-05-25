import * as dom from '../src/dom'
import * as math from '@danehansen/math'

const HOLDER = document.createElement('div')

describe('dom', function() {
  before(function() {
    document.body.appendChild(HOLDER)
  })

  after(function() {
    document.body.removeChild(HOLDER)
  })

  describe('getStyle', function() {
    it('gets inherited style if that is all', function() {
      const width = math.random(10, 1000, true)
      HOLDER.innerHTML = `
        <style>
          .outer {
            width: ${width}px;
          }
        </style>
        <div class="outer">
          <div class="inner"></div>
        </div>
      `
      const innerNode = HOLDER.querySelector('.inner')
      expect(dom.getStyle(innerNode, 'width')).to.equal(`${width}px`)
    })

    it('gets own style if defined', function() {
      const outerWidth = math.random(10, 1000, true)
      const innerWidth = math.random(10, 1000, true)
      HOLDER.innerHTML = `
      <style>
        .outer {
          width: ${outerWidth}px;
        }

        .inner {
          width: ${innerWidth}px;
        }
      </style>
        <div class="outer">
          <div class="inner"></div>
        </div>
      `
      const innerNode = HOLDER.querySelector('.inner')
      expect(dom.getStyle(innerNode, 'width')).to.equal(`${innerWidth}px`)
    })

    it('gets inline style if defined', function() {
      const outerWidth = math.random(10, 1000, true)
      const innerWidth = math.random(10, 1000, true)
      const inlineWidth = math.random(10, 1000, true)
      HOLDER.innerHTML = `
      <style>
        .outer {
          width: ${outerWidth}px;
        }

        .inner {
          width: ${innerWidth}px;
        }
      </style>
        <div class="outer">
          <div class="inner" style="width: ${inlineWidth}px;"></div>
        </div>
      `
      const innerNode = HOLDER.querySelector('.inner')
      expect(dom.getStyle(innerNode, 'width')).to.equal(`${inlineWidth}px`)
    })
  })

  describe('getMatrixStyle', function() {
    it('gets scales skews and translates', function() {
      const precision = 0.01
      const scaleX = math.random(-3, 3)
      const scaleY = math.random(-3, 3)
      const skewX = math.random(-1, 1)
      const skewY = math.random(-1, 1)
      const translateX = math.random(-100, 100)
      const translateY = math.random(-100, 100)
      HOLDER.innerHTML = `
        <style>
          .transformed {
            transform: matrix(${scaleX}, ${skewY}, ${skewX}, ${scaleY}, ${translateX}, ${translateY});
          }
        </style>
        <div class="transformed"></div>
      `
      const node = HOLDER.querySelector('.transformed')
      expect(math.round(dom.getMatrixStyle(node, 'scaleX'), precision)).to.equal(math.round(scaleX, precision))
      expect(math.round(dom.getMatrixStyle(node, 'scaleY'), precision)).to.equal(math.round(scaleY, precision))
      expect(math.round(dom.getMatrixStyle(node, 'skewX'), precision)).to.equal(math.round(skewX, precision))
      expect(math.round(dom.getMatrixStyle(node, 'skewY'), precision)).to.equal(math.round(skewY, precision))
      expect(math.round(dom.getMatrixStyle(node, 'translateX'), precision)).to.equal(math.round(translateX, precision))
      expect(math.round(dom.getMatrixStyle(node, 'translateY'), precision)).to.equal(math.round(translateY, precision))
    })

    it('gets defaults when no transform', function() {
      HOLDER.innerHTML = `
        <div class="transformed"></div>
      `
      const node = HOLDER.querySelector('.transformed')
      expect(dom.getMatrixStyle(node, 'scaleX')).to.equal(1)
      expect(dom.getMatrixStyle(node, 'scaleY')).to.equal(1)
      expect(dom.getMatrixStyle(node, 'skewX')).to.equal(0)
      expect(dom.getMatrixStyle(node, 'skewY')).to.equal(0)
      expect(dom.getMatrixStyle(node, 'translateX')).to.equal(0)
      expect(dom.getMatrixStyle(node, 'translateY')).to.equal(0)
    })
  })

  describe('cover', function() {
    it('makes an element fill its parent while remaining in a constant aspect ratio', function() {
      const width = 100
      const height = 200
      const precision = 0.1
      const round = math.round(width / height, precision)
      HOLDER.innerHTML = `<div class="outer"><div class="inner" style="width: ${width}px; height: ${height}px;"></div></div>`
      const outer = HOLDER.querySelector('.outer')
      const outerStyle = outer.style
      const inner = HOLDER.querySelector('.inner')

      for (let i = 0; i < 20; i++) {
        outerStyle.width = Math.random() * 300 + 'px'
        outerStyle.height = Math.random() * 300 + 'px'
        dom.cover(inner, outer)
        expect(math.round(inner.offsetWidth / inner.offsetHeight, precision)).to.equal(round)
      }
    })

    it.skip('does nothing when there are no dimentions to work with', function() {
      const width = 100
      const height = 200
      const precision = 0.1
      const round = math.round(width / height, precision)
      HOLDER.innerHTML = `<div class="outer" style="display: none;"><div class="inner" style="width: ${width}px; height: ${height}px;"></div></div>`
      const outer = HOLDER.querySelector('.outer')
      const outerStyle = outer.style
      const inner = HOLDER.querySelector('.inner')

      for (let i = 0; i < 20; i++) {
        outerStyle.width = Math.random() * 300 + 'px'
        outerStyle.height = Math.random() * 300 + 'px'
        dom.cover(inner, outer)
        expect(inner.offsetWidth).to.equal(0)
        expect(inner.offsetHeight).to.equal(0)
      }
    })
  })

  describe('browser', function() {
    it('gets browser details', function() {
      const b = dom.browser()
      expect(b.version).to.be.above(0)

      expect(typeof b.android).to.equal('boolean')
      expect(typeof b.ios).to.equal('boolean')
      expect(typeof b.mobile).to.equal('boolean')
      expect(typeof b.name).to.equal('string')
      expect(typeof b.phone).to.equal('boolean')
      expect(typeof b.prefix).to.equal('string')
      expect(typeof b.tablet).to.equal('boolean')
      expect(typeof b.webkit).to.equal('boolean')

      expect(b.android).to.be.false
      expect(b.ios).to.be.false
      expect(b.mobile).to.be.false
      expect(b.name).to.equal('chrome')
      expect(b.phone).to.be.false
      expect(b.prefix).to.equal('webkit')
      expect(b.tablet).to.be.false
      expect(b.webkit).to.be.true
    })
  })

  describe('touch', function() {
    it('detects if device is touch enabled', function() {
      expect(typeof dom.touch()).to.equal('boolean')
      expect(dom.touch()).to.be.false
    })
  })
})
