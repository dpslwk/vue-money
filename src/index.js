export const version = '0.0.6'

export const Money = {
  install: function (Vue, options) {
    const config = {
      places: options && options.places ? options.places : 2,
      symbol: options && options.symbol ? options.symbol : '$',
      format: options && options.format ? options.format : /%money%/,
      directive: options && options.directive ? options.directive : 'money-format',
      global: options && options.global ? options.global : 'moneyFormat',
      filter: options && options.filter ? options.filter : 'money',
    }

    const moneyFormatFunction = function (value) {
      if (isNaN(value) || value === null) {
        return value
      }
      return Money.format(value.toFixed(config.places).toString(), config.symbol)
    }

    Vue.directive(config.directive, {
      bind: function (el, binding, vnode, oldVnode) {
        el.dataset.text = el.innerHTML
        el.innerHTML = Money.formatMoney(el, binding.value, config)
      },
      update: function (el, binding, vnode, oldVnode) {
        el.innerHTML = Money.formatMoney(el, binding.value, config)
      }
    })

    Vue.filter(config.filter, moneyFormatFunction)

    Vue.prototype[`$${config.global}`] = moneyFormatFunction
  },
  formatMoney: function (el, value, {places, format, symbol}) {
    let v = value
    if (isNaN(v) || v === null) {
      return
    }
    v = Number(v).toFixed(places).toString()
    if (!el.dataset.text.match(format)) {
      return Money.format(v, symbol)
    }
    return el.dataset.text.replace(format, Money.format(v, symbol))
  },
  format: function (value, currencySymbol) {
    let sign = ''
    if (value.indexOf('-') === 0) {
      sign = '-'
      value = value.substr(1)
    }
    if (value.indexOf('.') < 0) {
      return `${sign}${currencySymbol}${Money._formatInteger(value)}.00`
    }
    const decimal = value.substr(value.indexOf('.'))
    const whole = value.substr(0, value.indexOf('.'))
    return `${sign}${currencySymbol}${Money._formatInteger(whole)}${decimal}`
  },
  _formatInteger: function (value) {
    if (value.length > 3) {
      const offset = value.length - 3
      return Money._formatInteger(value.substr(0, offset)) + ',' + value.substr(-3)
    }
    return value
  }
}

export default Money
