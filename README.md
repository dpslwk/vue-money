# Vue Money

**Disclaimer:** I did this as my first vue plugin to allow have elements that autoformat any
given number to a comma separated values. It may lack some stuff, or have serious bugs.

## How to use

`yarn add vue-money`

Then:

```javascript
import Vue from 'vue'
import Money from 'vue-money'

Vue.use(Money, config)
```

Where `config` can be: 
```javascript
const config = {
    places: 2,
    symbol: '$',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    format: '/%money%/',
    directive: 'money-format',
    global: 'moneyFormat', // Will be deprecated for next release
    filter: 'money',
    componentTag: 'money-input',
    globalDirective: 'money'
}
```

This will make the plugin available via the directive `v-money-format` or the global method
`this.$moneyFormat`.

## Usage:

### Global 

You can access the format utilities through `vm.$money` (or the `globalDirective` value set in the config options).

This will let you use two methods:

#### `format(value)`

Receives the number to format

##### `removeFormat(formattedString, defaultValue)`

Receives the String to remove format and a default value in case the string can't be evaluated.

### Input component

Now the plugin comes with an input component that can be used as:

```vue
<template>
    <money-input v-model=""/>
</template>
```

This will format the value `@blur` and emit the numeric value

> You can change the name of the component through the `componentTag` config parameter.


### Directive mode:

```html
<p v-money-format="value"></p>

<!-- or -->

<p v-money-format="value">Price is %money%</p>
```

This would result in the following:

```html
<p>$123.45</p>

<!-- or -->

<p>Price is $123.45</p>
```