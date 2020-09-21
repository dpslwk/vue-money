"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Money = exports.version = void 0;
var version = '0.4.2';
exports.version = version;
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
      symbol = _ref.symbol,
      thousandsSeparator = _ref.thousandsSeparator,
      decimalSeparator = _ref.decimalSeparator;
  var v = value;

  if (isNaN(v) || v === null) {
    return;
  }

  v = Number(v).toFixed(places).toString();

  if (!el.dataset.text.match(format)) {
    return _format(v, symbol, thousandsSeparator, decimalSeparator);
  }

  return el.dataset.text.replace(format, _format(v, symbol, thousandsSeparator, decimalSeparator));
};

var _format = function _format(value, currencySymbol, thousandsSeparator, decimalSeparator) {
  var sign = '';

  if (value.indexOf('-') === 0) {
    sign = '-';
    value = value.substr(1);
  }

  if (value.indexOf('.') < 0) {
    return "".concat(sign).concat(currencySymbol).concat(_formatInteger(value, thousandsSeparator)).concat(decimalSeparator, "00");
  }

  var decimal = value.substr(value.indexOf('.')).replace('.', decimalSeparator);
  var whole = value.substr(0, value.indexOf('.'));
  return "".concat(sign).concat(currencySymbol).concat(_formatInteger(whole, thousandsSeparator)).concat(decimal);
};

var _formatInteger = function _formatInteger(value, thousandsSeparator) {
  if (value.length > 3) {
    var offset = value.length - 3;
    return _formatInteger(value.substr(0, offset), thousandsSeparator) + thousandsSeparator + value.substr(-3);
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
      defaultValue = _ref2$defaultValue === void 0 ? null : _ref2$defaultValue,
      _ref2$currencySymbol = _ref2.currencySymbol,
      currencySymbol = _ref2$currencySymbol === void 0 ? _defaultConfig.symbol : _ref2$currencySymbol,
      _ref2$decimalSeparato = _ref2.decimalSeparator,
      decimalSeparator = _ref2$decimalSeparato === void 0 ? _defaultConfig.decimalSeparator : _ref2$decimalSeparato,
      _ref2$thousandsSepara = _ref2.thousandsSeparator,
      thousandsSeparator = _ref2$thousandsSepara === void 0 ? _defaultConfig.thousandsSeparator : _ref2$thousandsSepara;
  if (!formattedString) return defaultValue;
  var value = Number(formattedString.replace(new RegExp("\\s|".concat(thousandsSeparator), 'g'), '').replace(currencySymbol, ''));
  return isNaN(value) ? defaultValue : value;
};

var Money = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var config = {};

    for (var prop in _defaultConfig) {
      if (!_defaultConfig.hasOwnProperty(prop)) continue;
      config[prop] = options[prop] || _defaultConfig[prop];
    }

    var moneyFormatFunction = function moneyFormatFunction(value) {
      var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var currencySymbol = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var thousandsSeparator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var decimalSeparator = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      if (isNaN(value) || value === null) {
        return value;
      }

      return _format(value.toFixed(places !== null && places !== void 0 ? places : config.places).toString(), currencySymbol !== null && currencySymbol !== void 0 ? currencySymbol : config.symbol, thousandsSeparator !== null && thousandsSeparator !== void 0 ? thousandsSeparator : config.thousandsSeparator, decimalSeparator !== null && decimalSeparator !== void 0 ? decimalSeparator : config.decimalSeparator);
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
          "default": 0.0
        },
        defaultValue: {
          type: Number,
          "default": 0.0
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
      watch: {
        value: function value(nv, ov) {
          var vm = this;
          vm.formatted = vm.moneyFormatFunction(nv);
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
              if ($event.target.composing) return; // Emit the value on the spot, format visually later

              var value = vm.removeMoneyFormatFunction($event.target.value, vm.defaultValue);
              vm.$emit('input', value);
              vm.formatted = $event.target.value;
            },
            keyup: function keyup($event) {
              console.log($event.target.selectionStart);
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
    Vue.prototype["$".concat(config.global)] = moneyFormatFunction;
    Vue.prototype["$".concat(config.globalDirective)] = {
      format: moneyFormatFunction,
      removeFormat: removeMoneyFormatFunction
    };
  }
};
exports.Money = Money;
var _default = Money;
exports["default"] = _default;
