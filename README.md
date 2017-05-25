# dom

The dom library contains static methods to help manipulate the dom.

## Installation

`npm install --save @danehansen/dom`

## Usage

As a module:

    import * as dom from '@danehansen/dom';

    var r = dom.red('#ff0000');

In your browser:

    <script src='danehansen-dom.min.js'></script>
    <script>
      var dom = window.danehansen.dom;
      var r = dom.red('#ff0000');
    </script>

## Public Methods

* __red__(dom:uint):uint  
[static] Returns the red portion of a uint.
