// Creator
var newCatalogRouter = function(){

  // Paths
  var product_path = "/products/";

  // Reactive vars
  var products_per_page = new ReactiveVar(5);
  if (Meteor.isClient)
    Session.setDefault("CatalogRouter.actualPage", 1); // persistant thru sessions

  // Object
  CatalogRouter = {
    // Callbacks
    on: {
      goToPage: function(page){
        Session.set("CatalogRouter.actualPage", page);
      }
    },

    // Goers
    go: {
      firstPage: function(){
        FlowRouter.go( product_path + 1 );
      },
      lastPage: function(){
        var last_page = CatalogRouter.get.numberOfPages();
        FlowRouter.go( product_path + last_page );
      }
    },

    // Issers
    is: {
      firstPage: function(){
        if (Session.get("CatalogRouter.actualPage") === 1)
          return true;
        return false;
      },
      lastPage: function(){
        if (Session.get("CatalogRouter.actualPage") === CatalogRouter.get.numberOfPages())
          return true;
        return false;
      }
    },

    // Getters
    get: {
      actualPage: function(){
        return Session.get("CatalogRouter.actualPage");
      },
      numberOfPages: function(){
        var total_products = CatalogStore.get.numberOfProducts();
        var pages          = Math.ceil(total_products/products_per_page.get());
        return pages;
      },
      productPageUrl: function(page) {
        return product_path + page;
      },
      nextPageUrl: function() {
        if (!CatalogRouter.is.lastPage())
          return product_path + (Session.get("CatalogRouter.actualPage") + 1);
        return "";
      },
      previousPageUrl: function(){
        if (!CatalogRouter.is.firstPage())
          return product_path + (Session.get("CatalogRouter.actualPage") - 1);
        return "";
      },
      productsPerPage: function(){
        return products_per_page.get();
      }
    }
  };

  CatalogRouter.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "GO_TO_HOME":
        CatalogRouter.go.firstPage();
        break;
      case "GO_TO_PRODUCTS_PAGE":
        var page = parseInt(payload.page);
        CatalogRouter.on.goToPage(page);
        break;
    }
  });

  // Routes
  FlowRouter.route('/', {
    action: function() {
      Dispatcher.dispatch({ actionType: "GO_TO_HOME" });
    }
  });
  FlowRouter.route(product_path + ':page', {
    action: function(params) {
      Dispatcher.dispatch({ actionType: "GO_TO_PRODUCTS_PAGE", page: params.page });
    }
  });

  // Coherence
  if (Meteor.isClient) {
    Meteor.startup(function(){
      Tracker.autorun(function(){
        var total_pages = CatalogRouter.get.numberOfPages();
        var actual_page = CatalogRouter.get.actualPage();
        if ((total_pages !== 0)&&(actual_page > total_pages)) {
          CatalogRouter.go.lastPage();
        }
      });
    });
  }

  return CatalogRouter;

};

CatalogRouter = newCatalogRouter();
