'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var version = exports.version = '0.0.6';

var Money = exports.Money = {
  install: function install(Vue, options) {
    var config = {
      places: options && options.places ? options.places : 2,
      symbol: options && options.symbol ? options.symbol : '$',
      format: options && options.format ? options.format : /%money%/,
      directive: options && options.directive ? options.directive : 'money-format',
      global: options && options.global ? options.global : 'moneyFormat',
      filter: options && options.filter ? options.filter : 'money'
    };

    var moneyFormatFunction = function moneyFormatFunction(value) {
      if (isNaN(value) || value === null) {
        return value;
      }
      return Money.format(value.toFixed(config.places).toString(), config.symbol);
    };

    Vue.directive(config.directive, {
      bind: function bind(el, binding, vnode, oldVnode) {
        el.dataset.text = el.innerHTML;
        el.innerHTML = Money.formatMoney(el, binding.value, config);
      },
      update: function update(el, binding, vnode, oldVnode) {
        el.innerHTML = Money.formatMoney(el, binding.value, config);
      }
    });

    Vue.filter(config.filter, moneyFormatFunction);

    Vue.prototype['$' + config.global] = moneyFormatFunction;
  },
  formatMoney: function formatMoney(el, value, _ref) {
    var places = _ref.places,
        format = _ref.format,
        symbol = _ref.symbol;

    var v = value;
    if (isNaN(v) || v === null) {
      return;
    }
    v = Number(v).toFixed(places).toString();
    if (!el.dataset.text.match(format)) {
      return Money.format(v, symbol);
    }
    return el.dataset.text.replace(format, Money.format(v, symbol));
  },
  format: function format(value, currencySymbol) {
    var sign = '';
    if (value.indexOf('-') === 0) {
      sign = '-';
      value = value.substr(1);
    }
    if (value.indexOf('.') < 0) {
      return '' + sign + currencySymbol + Money._formatInteger(value) + '.00';
    }
    var decimal = value.substr(value.indexOf('.'));
    var whole = value.substr(0, value.indexOf('.'));
    return '' + sign + currencySymbol + Money._formatInteger(whole) + decimal;
  },
  _formatInteger: function _formatInteger(value) {
    if (value.length > 3) {
      var offset = value.length - 3;
      return Money._formatInteger(value.substr(0, offset)) + ',' + value.substr(-3);
    }
    return value;
  }
};

exports.default = Money;
