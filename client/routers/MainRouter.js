MainRouter = function () {
  var self = this;

  // Routes
  var routes = {
    home:    "/",
    catalog: "/catalog/"
  };

  // Getters
  self.getRoute = function (route) {
      return routes[route];
  };

  // FlowRouter
  FlowRouter.route(self.getRoute("home"), {
    action: function() {
      Dispatcher.dispatch({ actionType: "GO_TO_HOME" });
    }
  });
  FlowRouter.route(self.getRoute("catalog"), {
    action: function(params) {
      Dispatcher.dispatch({ actionType: "GO_TO_CATALOG_PAGE", page: 1 });
    }
  });
  FlowRouter.route(self.getRoute("catalog") + ':page', {
    action: function(params) {
      Dispatcher.dispatch({ actionType: "GO_TO_CATALOG_PAGE", page: params.page });
    }
  });

  return self;
};

// Initialize
Dependency.add('MainRouter', new MainRouter());
