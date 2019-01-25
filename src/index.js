export const version = '0.2.0'

const _defaultConfig = {
  places: 2,
  symbol: '$',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  format: '/%money%/',
  directive: 'money-format',
  global: 'moneyFormat',
  filter: 'money',
  componentTag: 'money-input',
  globalDirective: 'money'
}

const _formatMoney = function (el, value, {places, format, symbol, thousandsSeparator, decimalSeparator}) {
  let v = value
  if (isNaN(v) || v === null) {
    return
  }
  v = Number(v).toFixed(places).toString()
  if (!el.dataset.text.match(format)) {
    return _format(v, symbol, thousandsSeparator, decimalSeparator)
  }
  return el.dataset.text.replace(format, _format(v, symbol, thousandsSeparator, decimalSeparator))
}

const _format = function (value, currencySymbol, thousandsSeparator, decimalSeparator) {
  let sign = ''
  if (value.indexOf('-') === 0) {
    sign = '-'
    value = value.substr(1)
  }
  if (value.indexOf('.') < 0) {
    return `${sign}${currencySymbol}${_formatInteger(value, thousandsSeparator)}${decimalSeparator}00`
  }
  const decimal = value.substr(value.indexOf('.')).replace('.', decimalSeparator)
  const whole = value.substr(0, value.indexOf('.'))
  return `${sign}${currencySymbol}${_formatInteger(whole, thousandsSeparator)}${decimal}`
}

const _formatInteger = function (value, thousandsSeparator) {
  if (value.length > 3) {
    const offset = value.length - 3
    return _formatInteger(value.substr(0, offset)) + thousandsSeparator + value.substr(-3)
  }
  return value
}
/**
 * Removes the format of a money String formatted by this same formatter
 * @param {String!} formattedString - String to remove the format and return the number equivalent
 * @param {Number?} defaultValue - Default value to evaluate an invalid String
 * @param {String} currencySymbol - Currency symbol used
 * @param {String} decimalSeparator - Symbol used to separate decimals
 * @param {String} thousandsSeparator - Symbol used to separate thousands
 * @private
 */
const _removeFormat = function ({formattedString, defaultValue = null, currencySymbol = _defaultConfig.symbol, decimalSeparator = _defaultConfig.decimalSeparator, thousandsSeparator = _defaultConfig.thousandsSeparator}) {
  if (!formattedString) return defaultValue
  const value = Number(formattedString.replace(new RegExp(`\\s|${thousandsSeparator}`, 'g'), '').replace(currencySymbol, ''))
  return isNaN(value) ? defaultValue : value
}

export const Money = {
  install: function (Vue, options = {}) {
    let config = {}
    for (let prop in _defaultConfig) {
      if (!_defaultConfig.hasOwnProperty(prop)) continue

      config[prop] = options[prop] || _defaultConfig[prop]
    }
    const moneyFormatFunction = function (value) {
      if (isNaN(value) || value === null) {
        return value
      }
      return _format(value.toFixed(config.places).toString(), config.symbol, config.thousandsSeparator, config.decimalSeparator)
    }
    const removeMoneyFormatFunction = function (value, defaultValue) {
      return _removeFormat({
        formattedString: value,
        currencySymbol: config.currencySymbol,
        thousandsSeparator: config.thousandsSeparator,
        decimalSeparator: config.decimalSeparator,
        defaultValue: defaultValue
      })
    }
    const component = {
      props: {
        value: {
          type: Number,
          default: 0.0
        },
        defaultValue: {
          type: Number,
          default: 0.0
        }
      },
      data () {
        const vm = this

        return {
          formatted: vm.moneyFormatFunction(vm.value)
        }
      },
      methods: {
        moneyFormatFunction,
        removeMoneyFormatFunction,
        blur () {
          const vm = this
          const value = vm.removeMoneyFormatFunction(vm.formatted, vm.defaultValue)
          vm.$emit('input', value)
          vm.formatted = vm.moneyFormatFunction(value)
        }
      },
      render (h) {
        const vm = this
        return h('input', {
          directives: [
            {
              name: 'model',
              rawName: 'v-model',
              value: vm.formatted,
              expression: 'formatted'
            }
          ],
          attrs: {
            type: 'text'
          },
          domProps: {
            value: vm.formatted
          },
          on: {
            blur: vm.blur,
            input: function ($event) {
              if ($event.target.composing) return

              vm.formatted = $event.target.value
            }
          }
        })
      }
    }

    Vue.component(config.componentTag, component)

    Vue.directive(config.directive, {
      bind: function (el, binding, vnode, oldVnode) {
        el.dataset.text = el.innerHTML
        el.innerHTML = _formatMoney(el, binding.value, config)
      },
      update: function (el, binding, vnode, oldVnode) {
        el.innerHTML = _formatMoney(el, binding.value, config)
      }
    })

    Vue.filter(config.filter, moneyFormatFunction)

    Vue.prototype[`$${config.global}`] = moneyFormatFunction
    Vue.prototype[`$${config.globalDirective}`] = {
      format: moneyFormatFunction,
      removeFormat: removeMoneyFormatFunction
    }
  }
}

export default Money
