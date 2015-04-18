// Creator
var MainLayout = function () {
  var self = this;

  self.on = {
    goHome: function(){
      FlowLayout.render('MainLayout', { main: 'HomeView' });
    },
    goToCatalog: function(page){
      FlowLayout.render('MainLayout', { main: 'CatalogView' });
    }
  };

  self.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "GO_TO_HOME":
        self.on.goHome();
        break;
      case "GO_TO_CATALOG_PAGE":
        self.on.goToCatalog(payload.page);
        break;
    }
  });

  return self;

};

Dependency.add('MainLayout', new MainLayout());
