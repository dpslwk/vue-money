'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var version = exports.version = '0.1.0';

var _defaultConfig = {
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
};

var _formatMoney = function _formatMoney(el, value, _ref) {
  var places = _ref.places,
      format = _ref.format,
      symbol = _ref.symbol;

  var v = value;
  if (isNaN(v) || v === null) {
    return;
  }
  v = Number(v).toFixed(places).toString();
  if (!el.dataset.text.match(format)) {
    return _format(v, symbol);
  }
  return el.dataset.text.replace(format, _format(v, symbol));
};

var _format = function _format(value, currencySymbol, thousandsSeparator, decimalSeparator) {
  var sign = '';
  if (value.indexOf('-') === 0) {
    sign = '-';
    value = value.substr(1);
  }
  if (value.indexOf('.') < 0) {
    return '' + sign + currencySymbol + _formatInteger(value, thousandsSeparator) + decimalSeparator + '00';
  }
  var decimal = value.substr(value.indexOf('.')).replace('.', decimalSeparator);
  var whole = value.substr(0, value.indexOf('.'));
  return '' + sign + currencySymbol + _formatInteger(whole, thousandsSeparator) + decimal;
};

var _formatInteger = function _formatInteger(value, thousandsSeparator) {
  if (value.length > 3) {
    var offset = value.length - 3;
    return _formatInteger(value.substr(0, offset)) + thousandsSeparator + value.substr(-3);
  }
  return value;
};
/**
 * Removes the format of a money String formatted by this same formatter
 * @param {String!} formattedString - String to remove the format and return the number equivalent
 * @param {Number?} defaultValue - Default value to evaluate an invalid String
 * @param {String} currencySymbol - Currency symbol used
 * @param {String} decimalSeparator - Symbol used to separate decimals
 * @param {String} thousandsSeparator - Symbol used to separate thousands
 * @private
 */
var _removeFormat = function _removeFormat(_ref2) {
  var formattedString = _ref2.formattedString,
      _ref2$defaultValue = _ref2.defaultValue,
      defaultValue = _ref2$defaultValue === undefined ? null : _ref2$defaultValue,
      _ref2$currencySymbol = _ref2.currencySymbol,
      currencySymbol = _ref2$currencySymbol === undefined ? _defaultConfig.symbol : _ref2$currencySymbol,
      _ref2$decimalSeparato = _ref2.decimalSeparator,
      decimalSeparator = _ref2$decimalSeparato === undefined ? _defaultConfig.decimalSeparator : _ref2$decimalSeparato,
      _ref2$thousandsSepara = _ref2.thousandsSeparator,
      thousandsSeparator = _ref2$thousandsSepara === undefined ? _defaultConfig.thousandsSeparator : _ref2$thousandsSepara;

  if (!formattedString) return defaultValue;
  var value = Number(formattedString.replace(new RegExp('\\s|' + thousandsSeparator, 'g'), '').replace(currencySymbol, ''));
  return isNaN(value) ? defaultValue : value;
};

var Money = exports.Money = {
  install: function install(Vue, options) {
    var config = Object.assign({}, _defaultConfig, options);

    var moneyFormatFunction = function moneyFormatFunction(value) {
      if (isNaN(value) || value === null) {
        return value;
      }
      return _format(value.toFixed(config.places).toString(), config.symbol, config.thousandsSeparator, config.decimalSeparator);
    };

    var removeMoneyFormatFunction = function removeMoneyFormatFunction(value, defaultValue) {
      return _removeFormat({
        formattedString: value,
        currencySymbol: config.currencySymbol,
        thousandsSeparator: config.thousandsSeparator,
        decimalSeparator: config.decimalSeparator,
        defaultValue: defaultValue
      });
    };

    var component = {
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
      data: function data() {
        var vm = this;

        return {
          formatted: vm.moneyFormatFunction(vm.value)
        };
      },

      methods: {
        moneyFormatFunction: moneyFormatFunction,
        removeMoneyFormatFunction: removeMoneyFormatFunction,
        blur: function blur() {
          var vm = this;
          var value = vm.removeMoneyFormatFunction(vm.formatted, vm.defaultValue);
          vm.$emit('input', value);
          vm.formatted = vm.moneyFormatFunction(value);
        }
      },
      render: function render(h) {
        var vm = this;
        return h('input', {
          directives: [{
            name: 'model',
            rawName: 'v-model',
            value: vm.formatted,
            expression: 'formatted'
          }],
          attrs: {
            type: 'text'
          },
          domProps: {
            value: vm.formatted
          },
          on: {
            blur: vm.blur,
            input: function input($event) {
              if ($event.target.composing) return;

              vm.formatted = $event.target.value;
            }
          }
        });
      }
    };

    Vue.component(config.componentTag, component);

    Vue.directive(config.directive, {
      bind: function bind(el, binding, vnode, oldVnode) {
        el.dataset.text = el.innerHTML;
        el.innerHTML = _formatMoney(el, binding.value, config);
      },
      update: function update(el, binding, vnode, oldVnode) {
        el.innerHTML = _formatMoney(el, binding.value, config);
      }
    });

    Vue.filter(config.filter, moneyFormatFunction);

    Vue.prototype['$' + config.global] = moneyFormatFunction;
    Vue.prototype['$' + config.globalDirective] = {
      format: moneyFormatFunction,
      removeFormat: removeMoneyFormatFunction
    };
  }
};

exports.default = Money;
