var MainRouter = null;
Dependency.autorun(function(){
  MainRouter = Dependency.get('MainRouter');
});

// FlowRouter
Meteor.startup(function(){
  FlowRouter.route(MainRouter.get.route('home'), {
    action: function() {
      Dispatcher.dispatch({ actionType: "GO_TO_HOME" });
    }
  });
  FlowRouter.route(MainRouter.get.route('catalog'), {
    action: function(params) {
      Dispatcher.dispatch({ actionType: "GO_TO_CATALOG_PAGE", page: 1 });
    }
  });
  FlowRouter.route(MainRouter.get.route('catalog') + ':page', {
    action: function(params) {
      Dispatcher.dispatch({ actionType: "GO_TO_CATALOG_PAGE", page: params.page });
    }
  });
});
