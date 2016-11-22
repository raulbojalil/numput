# Numput
jQuery plugin that turns any input control into a numeric-friendly color coded input that allows the user to input numeric values like currency and percentage values.

## Usage
First, include the Javascript and CSS files in your HTML page.
To initialize the plugin just call .numput(options) in any input tag.

$("#some-input").numput(options);

![numput](https://github.com/raulbojalil/numput/blob/master/screenshoot.png?raw=true "numput")

##Options

You can pass an options object as parameter. This object can contain the following properties:

- minRange: The minimum value allowed. Defaults to 0.
- maxRange: The maximum value allowed. Defaults to 9,999,999.99
- maxDecimals: The maximum amount of decimal places allowed. Defaults to 2.
- prefixCharacter: A prefix character to place before the number. Defaults to ''.
- currencySymbol: Currency symbol. Defaults to '$'. This symbol gets displayed when the input contains the [data-type="currency"] attribute.
- percentSymbol: Percentage symbol. Defaults to '%'. This symbol gets displayed when the input contains the [data-type="percentage"] attribute.
- groupSeparator: Group separator symbol. Defaults to ','.
- currencyGroupSeparator: Currency group separator symbol. Defaults to ','.
- decimalSeparator: Decimal separator symbol. Defaults to '.'.
- currencyDecimalSeparator: Currency decimal separator symbol. Defaults to '.'.
- groupSize: Specifies the group size. For example in 1,333,555.34 the group size is 3. Defaults to 3.

You can also specify these properties globally. For example, to specify the Euro symbol as the default symbol for all inputs on the page just write:

$.fn.numput.defaults.currencySymbol = "€"

##API

To call any of the following methods, use the element.numput("method_name") syntax.

- clear: Clears the value of the control.
- reset: Resets the value of the control to zero.
- refresh: Forces a redraw of the control (after setting the value for example).
- show: Shows the control.
- hide: Hides the control.

##JSFiddle

https://jsfiddle.net/raulbojalil/nLoh23bg/2/





