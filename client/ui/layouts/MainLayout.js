// Creator
MainLayout = function () {
  var self = this;

  self.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "GO_TO_HOME":
        FlowLayout.render('MainLayout', { main: 'HomeView' });
        break;
      case "GO_TO_CATALOG_PAGE":
        FlowLayout.render('MainLayout', { main: 'CatalogView' });
        break;
    }
  });

  return self;
};

Dependency.add('MainLayout', new MainLayout());
