var validations = {
  trimInput: function(value) {
      return value.replace(/^\s*|\s*$/g, '');
  },
  isNotEmpty: function(value) {
      if (value && value !== ''){
          return true;
      }
      return false;
  },
  isEmail: function(value) {
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (filter.test(value)) {
          return true;
      }
      return false;
  },
  isValidPassword: function(password) {
      if (password.length < 6) {
          return false;
      }
      return true;
  },
  areValidPasswords: function(password, confirm) {
      if (!Libs.Validations.isValidPassword(password)) {
          return false;
      }
      if (password !== confirm) {
          return false;
      }
      return true;
  }
};

Dependency.add('Libraries.Validations', validations);
