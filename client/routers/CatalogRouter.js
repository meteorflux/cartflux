// Creator
var CatalogRouter = function(){
  var self = this;

  // Dependencies
  var MainRouter   = null,
      CatalogStore = null;
  Dependency.autorun(function(){
    MainRouter   = Dependency.get('MainRouter');
    CatalogStore = Dependency.get('CatalogStore');
  });

  // Reactive Vars
  var productsPerPage = new ReactiveVar(5);
  var actualPage      = new ReactiveVar(1);

  // Callbacks
  self.on = {
    goToPage: function(page){
      actualPage.set(page || 1);
    }
  };

  // Goers
  self.go = {
    firstPage: function(){
      FlowRouter.go( MainRouter.get.route('catalog') + 1 );
    },
    lastPage: function(){
      var last_page = self.get.numberOfPages();
      FlowRouter.go( MainRouter.get.route('catalog') + last_page );
    }
  };

  // Issers
  self.is = {
    firstPage: function(){
      return actualPage.get() === 1 ? true : false;
    },
    lastPage: function(){
      return actualPage.get() === self.get.numberOfPages() ? true : false;
    }
  };

  // Getters
  self.get = {
    actualPage: function(){
      return actualPage.get();
    },
    numberOfPages: function(){
      var total_products = CatalogStore.get.numberOfProducts();
      var pages          = Math.ceil(total_products/productsPerPage.get());
      return pages;
    },
    productPageUrl: function(page) {
      return MainRouter.get.route('catalog') + (page || "");
    },
    nextPageUrl: function() {
      if (!self.is.lastPage())
        return MainRouter.get.route('catalog') + (actualPage.get() + 1);
      return "";
    },
    previousPageUrl: function(){
      if (!self.is.firstPage())
        return MainRouter.get.route('catalog') + (actualPage.get() - 1);
      return "";
    },
    productsPerPage: function(){
      return productsPerPage.get();
    }
  };

  // Register
  CatalogRouter.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "GO_TO_CATALOG_PAGE":
        var page = parseInt(payload.page);
        self.on.goToPage(page);
        break;
    }
  });


  Meteor.startup(function(){

    // Coherence
    Tracker.autorun(function(){
      var totalPages = self.get.numberOfPages();
      var actualPage = self.get.actualPage();
      if ((totalPages !== 0)&&(actualPage > totalPages)) {
        self.go.lastPage();
      }
    });

    // Subscriptions
    Tracker.autorun(function(){
      var searchQuery     = CatalogStore.get.searchQuery();
      var actualPage      = self.get.actualPage();
      var productsPerPage = self.get.productsPerPage();

      Meteor.subscribe('CatalogStore.searchedProducts',
        searchQuery,
        (actualPage + 1) * productsPerPage
      );
    });
  });

  return self;

};

// Initialize
Dependency.add('CatalogRouter', new CatalogRouter());
