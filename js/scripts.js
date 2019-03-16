var navigate = (function() {
  $('.dd').toggle();
  $('.dd_btn').click(function() {
    var dataName = $(this).attr('data-name');
    $('.dd').hide();
    $('.' + dataName).toggle();
  });
})();

var __assign = this && this.__assign || Object.assign || function(t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    if (window.CP.shouldStopExecution(0)) break;
    s = arguments[i];
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
  }
  window.CP.exitedLoop(0);
  return t;
};
var foo = {
  id: 12345,
  active: true,
  deleted: false,
  firstName: "Bobby",
  lastName: "Shaftoe",
  age: 32,
  address: {
    street: "123 Manila Bay Road",
    suburb: "Intramuros",
    city: "Manila"
  },

  tags: [1, 2, 3, 4, 5]
};

var entityEncode = function(value) {
  return $('<div/>').text(value).html();
};
Vue.component('v-input', {
  template: "\n<div>\n    <input type=\"text\"\n            :placeholder=\"placeholder\"\n            class=\"form-control\"\n            :class=\"{'is-valid': (value && isValid), 'is-invalid': !isValid}\"\n            :value=\"value\"\n            @input=\"$emit('input', $event.target.value)\"/>\n</div>\n",
  props: {
    value: String,
    placeholder: String,
    hasErrors: Boolean
  },

  computed: {
    isValid: function() {
      return !this.hasErrors;
    }
  }
});


Vue.component('console', {
  template: "\n<div class=\"card console\">\n  <div class=\"console-brand\"><span v-html=\"watermark\" v-if=\"!hideWatermark\"></span></div>\n  <div v-for=\"(line, i) in lines\" class=\"mb-1\">\n    {{line.split(' ').join('&nbsp;')}}\n  </div>\n</div>",
  props: {
    hideWatermark: false,
    text: String
  },

  data: function() {
    return {
      watermark: "Stewart ilondanga <i class=\"fa fa-github\"></i>"
    };
  },
  computed: {
    lines: function() {
      return this.text.split('\n');
    }
  }
});


Vue.component('builder-alert', {
  template: "\n<div>\n  <div class=\"alert\" :class=\"isEmpty ? 'alert-info' : isValid ? 'alert-success' : 'alert-danger'\" role=\"alert\">\n    <h5 class=\"alert-heading\">{{ isEmpty ? '' : isValid ? 'Looks Good! \uD83C\uDF89' : 'Oops \uD83D\uDE13' }}</h5>\n    <p v-html=\"message\"></p>\n    <hr v-if=\"!isValid\">\n    <p v-if=\"!isValid\" class=\"mb-0\">Make sure that the <b>property name</b> is <b>not empty</b> and that <b>string values</b> and <b>nested properties</b> names are wrapped in <b>double quotes</b>.</p>\n  </div>\n</div>\n",
  props: {
    name: String,
    validName: Boolean,
    value: String,
    validValue: Boolean
  },

  computed: {
    isValid: function() {
      return !this.isEmpty && this.validName && this.validValue;
    },
    isEmpty: function() {
      return !this.name || !this.value;
    },
    message: function() {
      return this.isEmpty ? 'Add and validate a new property' : this.isValid ? "Will add <b>{ \"" + entityEncode(this.name) + "\": " + entityEncode(this.value) + " }</b>" : "Looks like something is wrong.";
    }
  }
});


Vue.component('property-explorer', {
  template: "\n<div class=\"modal fade\" id=\"modal\" tabindex=\"-1\" role=\"dialog\">\n  <div class=\"modal-dialog\" role=\"document\">\n    <div class=\"modal-content modal-dialog-centered\">\n      <div class=\"container\">\n        <div class=\"row\">\n          <console :text=\"formattedValue\" :hideWatermark=\"true\" class=\"w-100\"></console>\n        </div>\n      </div>\n      <div class=\"p-1 ml-auto\">\n        <button type=\"button\" class=\"btn btn-danger btn-sm\" @click=\"remove\">Remove</button>\n        <button type=\"button\" class=\"btn btn-secondary btn-sm\" data-dismiss=\"modal\" ref=\"dismiss\">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n",
  props: {
    name: String,
    value: String
  },

  computed: {
    formattedValue: function() {
      var obj = {
        name: this.name,
        "typeof": typeof this.value
      };

      if (this.value !== null && this.value !== undefined) {
        obj = __assign({}, obj, {
          constructor: this.value.constructor.name
        });
      }
      return JSON.stringify(__assign({}, obj, {
        value: this.value
      }), null, 2);
    }
  },

  methods: {
    remove: function() {
      this.$emit('remove', this.name);
      this.$refs.dismiss.click();
    }
  }
});


Vue.component('builder', {
  template: "\n<div>\n  <div class=\"container card builder\">\n    <div class=\"row\">\n      <div class=\"col left\">\n        <label>Add Property:</label>\n        <div class=\"form-inline\">\n          <div class=\"mr-1\">\n            <v-input placeholder=\"Property name\"\n                   v-model=\"propertyName\"/>\n          </div>\n          <div class=\"mr-1\">\n            <v-input placeholder=\"Property value\"\n                   :hasErrors=\"!validPropertyValue\"\n                   v-model=\"propertyValue\"/>\n          </div>\n          <button type=\"button\" class=\"btn btn-info\" @click=\"addProperty\" :disabled=\"!canAdd\"><i class=\"fa fa-plus\"></i></button>\n        </div>\n        <builder-alert class=\"mt-3 mb-2\"\n                       :name=\"propertyName\"\n                       :validName=\"validPropertyName\"\n                       :value=\"propertyValue\"\n                       :validValue=\"validPropertyValue\"></builder-alert>\n        <label>Object properties:</label>\n        <div class=\"row pr-3 pt-1 pl-3\">\n          <div class=\"m-1\" v-for=\"(value, key) in foo\">\n            <button class=\"btn badge badge-secondary p-2\"\n                    data-toggle=\"modal\" data-target=\"#modal\"\n                    @click=\"selectProperty(key)\">{{key}} <i class=\"fa fa-external-link\"></i></button>\n          </div>\n        </div>\n      </div>\n      <div class=\"col console-wrapper\">\n          <console :text=\"jsonObject\" class=\"json-console\"></console>\n      </div>\n    </div>\n  </div>\n  <property-explorer :name=\"selectedProp\" :value=\"foo[selectedProp]\" @remove=\"removeProperty($event)\"></property-explorer>\n</div>",
  data: function() {
    return {
      foo: foo,
      selectedProp: '',
      propertyName: '',
      propertyValue: undefined
    };
  },
  methods: {
    addProperty: function() {
      var _this = this;
      if (!this.propertyName) {
        return;
      }
      var tmp = this.foo;
      var val = this.propertyValue ? JSON.parse(this.propertyValue) : this.propertyValue;
      this.foo = undefined;;
      this.$nextTick(function() {
        _this.foo = __assign({}, tmp, (_a = {}, _a[_this.propertyName] = val !== undefined ? val : 'undefined', _a));
        _this.propertyValue = undefined;
        _this.propertyName = undefined;
        var _a;
      });
    },
    selectProperty: function(prop) {
      this.selectedProp = prop;
    },
    removeProperty: function(prop) {
      var _this = this;
      var tmp = this.foo;
      this.foo = undefined;
      this.$nextTick(function() {
        delete tmp[prop];
        _this.foo = tmp;
      });
    }
  },

  computed: {
    jsonObject: function() {
      return JSON.stringify(this.foo, undefined, 2) || 'undefined';
    },
    validPropertyName: function() {
      return this.propertyName || false;
    },
    validPropertyValue: function() {
      if (!this.propertyValue)
        return true;
      var valid = true;
      try {
        JSON.parse(this.propertyValue);
      } catch (_error) {
        valid = false;
      }
      return valid;
    },
    canAdd: function() {
      return this.validPropertyValue && this.validPropertyName;
    }
  }
});

/*
new Vue({ el: '#app' });
