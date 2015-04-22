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

  FlowRouter.route(routes.home, {
    action: function() {
      Dispatcher.dispatch({ actionType: "GO_TO_HOME" });
    }
  });
  FlowRouter.route(routes.catalog, {
    action: function(params) {
      Dispatcher.dispatch({ actionType: "GO_TO_CATALOG_PAGE", page: 1 });
    }
  });
  FlowRouter.route(routes.catalog + ':page', {
    action: function(params) {
      Dispatcher.dispatch({ actionType: "GO_TO_CATALOG_PAGE", page: params.page });
    }
  });

  return self;

};

// Initialize
Dependency.add('MainRouter', new MainRouter());
