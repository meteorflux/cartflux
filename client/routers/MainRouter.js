var MainRouter = function () {
  var self = this;

  // Routes
  var routes = {
    home:    "/",
    catalog: "/catalog/"
  };

  self.get = {
    route: function(route){
      return routes[route];
    }
  };

  return self;

};

// Initialize
Dependency.add('MainRouter', new MainRouter());
