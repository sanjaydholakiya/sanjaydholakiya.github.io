var app = angular.module('myApp', ['ui.mask']);

app.controller('MainCtrl', ['$scope', function ($scope) {
  var vm = this;
  vm.name = 'Ui Mask';
  vm.phoneAU = '';
  vm.phoneNZ = '';
  vm.defaultPlaceholder = '04xx xxx xxx';
  vm.defaultPlaceholderNZ = '02x xxx xxxxx';

  vm.regExpPhone = '^[1,0]\\d{9}$';
  vm.regExpPhoneNz = '^[0]\\d{8}$|^[0][2][1,2,7,0]\\d{6,8}$'
  vm.messageErrorPhoneAU = 'Please enter your phone number starting with a 0 or 1 AU.';
  vm.messageErrorPhoneNZ = 'Please enter a valid phone number NZ.';
  // mimic refresh

  if(localStorage.phoneNZ){
    vm.phoneNZ = localStorage.phoneNZ;
  }

  if(localStorage.phoneAU){
    vm.phoneAU = localStorage.phoneAU;
  }
  
  vm.updatePhone = function () {
    if (!vm.isValidPhone(vm.regExpPhone, vm.phoneAU)) {
      return;
    }
    // save in localstorage for retrival
    localStorage.phoneAU = vm.phoneAU;
  };

  vm.updatePhoneNZ = function () {
    if (!vm.isValidPhone(vm.regExpPhoneNz, vm.phoneNZ)) {
      return;
    }
    // save in localstorage for retrival
    localStorage.phoneNZ = vm.phoneNZ;
  };

  vm.isValidPhoneNZ = function () {
    return vm.isValidPhone(vm.regExpPhoneNz, vm.phoneNZ);
  }

  vm.isValidPhoneAU = function () {
    return vm.isValidPhone(vm.regExpPhone, vm.phoneAU);
  }

  vm.isValidPhone = function (reg, phone) {
    if (phone === null || angular.isUndefined(phone) || phone === '') {
      return false;
    }

    phone = phone.replace(/[()\-# ]/gi, '');

    var re = new RegExp(reg);
    var result;
    result = re.test(phone);
    return result;
  };
}]);

app.directive('customPlaceholder', [function () {
  return {
    scope: {
      phoneNumber: "=",
      pholder: "=",
      isAu: "@"
    },
    link: function (scope, element, attr) {
      var landlineMask = scope.isAu === "true" ? '(99) 9999 9999' : '(99) 999 9999';
      var mobileMask = scope.isAu === "true" ? '9999 999 999' : '999 999 999?9?9';
      var defaultMask = scope.isAu === "true" ? "9999999999" : '999999999?9?9';
      var regExpMobilePrefix = scope.isAu === "true" ? '(^[1][38]00)|(^04)' : '^[0][2][1,2,7,0][\\d]*$';

      var re = new RegExp(regExpMobilePrefix);

      angular.element(document).ready(function () {
        if (scope.phoneNumber) {
          maskPhoneNumber();
        }
      });

      element.on('focus', function () {
        console.log(scope.isAu);
        if (!scope.phoneNumber) {
          attr.$set('uiMask', defaultMask);
          setPlaceholder(attr, defaultMask);
        }
      });

      element.on('keyup', function () {
        if (element.val().replace(" ", '').trim() === "( )" ||
          element.val().replace(" ", '').trim() === ""
        ) {
          attr.$set('uiMask', defaultMask);
          setPlaceholder(attr, defaultMask);
        }
        if (!scope.phoneNumber) {
          return;
        };
        maskPhoneNumber();
      });

      element.on('focusout', function () {
        if (!scope.phoneNumber) {
          attr.$set('uiMask', mobileMask);
          attr.$set('placeholder', scope.pholder);
        }
      });

      function maskPhoneNumber() {
        if (scope.phoneNumber.match(re)) {
          attr.$set('uiMask', mobileMask);
          setPlaceholder(attr, mobileMask);
        }
        else {
          attr.$set('uiMask', landlineMask);
          setPlaceholder(attr, landlineMask);
        }
      }

      function setPlaceholder(attr, value) {
        var replacePattern = /[a-zA-Z0-9?]/g;
        value = value.replace(replacePattern, ' ');
        attr.$set('placeholder', value);
      }
    }
  }
}]);

