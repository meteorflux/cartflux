// CatalogStore Collections
Catalog = new Mongo.Collection('catalog');

// CatalogStore Creator
var newCatalogStore = function(Catalog){

  // Reactive Vars
  var adding_product    = new ReactiveVar(false);
  var search_query      = new ReactiveVar("");
  var products_per_page = new ReactiveVar(5);
  if (Meteor.isClient) {
    Session.setDefault('CatalogStore.actualPage', 1); // persistant thru sessions
  }

  // Subscription Handlers
  var searchedProducts;

  // CatalogStore Object
  var CatalogStore = {
    // Callbacks
    onAddProduct: function(name,price){
      // some validation in the Store side
      var error = false;
      if (name === '') {
        error = new Meteor.Error("wrong-name","Please provide a valid name.");
      } else if ((price === '')||(!$.isNumeric(price))){
        error = new Meteor.Error("wrong-price","Please provide a valid price.");
      } else {
        Meteor.call('CatalogStore.addProduct', {name:name, price:price});
      }
      adding_product.set(error);
    },
    onAddAnotherProduct: function(){
      var number = CatalogStore.getNumberOfProducts() + 1;
      CatalogStore.onAddProduct("Product "+ number, number);
    },
    onAddAnother10Products: function(){
      var number = CatalogStore.getNumberOfProducts() + 1;
      for (var i=number; i < number+10; i++){
        CatalogStore.onAddProduct("Product "+ i, i);
      }
    },
    onRemoveProduct: function(id){
      Meteor.call('CatalogStore.removeProduct', id);
    },
    onUserIsAddingProduct: function(state){
      adding_product.set(state);
    },
    onSearchProducts: function(search){
      search_query.set(search);
    },
    onUWTGoToPage: function(target_page){
      Session.set("CatalogStore.actualPage", target_page);
    },

    // Getters
    getSearchedProducts: function(){
      var regexp = new RegExp(search_query.get(), 'i');
      return Catalog.find({name: regexp}, {sort: {date: 1}, limit: products_per_page.get()});
    },
    getSearchQuery: function(){
      return search_query.get();
    },
    getOneProduct: function(id){
      return Catalog.findOne(id);
    },
    getUserIsAddingProduct: function(){
      return adding_product.get();
    },
    getActualPage: function(){
      return Session.get("CatalogStore.actualPage");
    },
    getNumberOfPages: function(){
      var total_products = CatalogStore.getNumberOfProducts();
      var pages          = Math.ceil(total_products/products_per_page.get());
      return pages;
    },
    getNumberOfProducts: function(){
      return CollectionCountersStore.getCatalogCounter();
    },

    // Subscriptions
    subSearchedProducts: function(template){
      template.autorun(function(){
        searchedProducts = template.subscribe("Catalog.searchedProducts",
          search_query.get(), products_per_page.get(), Session.get("CatalogStore.actualPage"));
      });
    }
  };

  // CatalogStore Meteor Methods
  Meteor.methods({
    'CatalogStore.addProduct': function(product){
      var date = Date.now();
      Catalog.insert({name:product.name, price:product.price, date:date});
    },
    'CatalogStore.removeProduct': function(id){
      Catalog.remove(id);
    }
  });

  // CatalogStore Publications
  if (Meteor.isServer) {
    Meteor.publish('Catalog.searchedProducts', function(search, products_per_page, page) {
      var skip = (page - 1) * products_per_page;
      var regexp = new RegExp(search, 'i');
      return Catalog.find({name: regexp}, {limit: products_per_page, sort: {date:1}, skip: skip});
    });
    Meteor.publish('Catalog.productsInCart', function(products) {
      return Catalog.find({_id: {$in: _.pluck(products, 'product_id')}});
    });
  }

  // CatalogStore Autoruns
  if (Meteor.isClient) {
    Meteor.startup(function(){
      Tracker.autorun(function(){
        var total_pages = CatalogStore.getNumberOfPages();
        var actual_page = CatalogStore.getActualPage();
        if ((total_pages !== 0)&&(actual_page > total_pages)) {
          Session.set("CatalogStore.actualPage", total_pages);
        }
      });
    });
  }

  // CatalogStore Callbacks
  CatalogStore.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "ADD_PRODUCT":
        CatalogStore.onAddProduct(payload.product.name, payload.product.price);
        break;
      case "REMOVE_PRODUCT":
        CatalogStore.onRemoveProduct(payload.product._id);
        break;
      case "ADD_ANOTHER_PRODUCT":
        CatalogStore.onAddAnotherProduct();
        break;
      case "ADD_ANOTHER_10_PRODUCTS":
        CatalogStore.onAddAnother10Products();
        break;
      case "USER_IS_ADDING_PRODUCT":
        CatalogStore.onUserIsAddingProduct(true);
        break;
      case "USER_CANCELED":
        CatalogStore.onUserIsAddingProduct(false);
        break;
      case "USER_HAS_SEARCHED_PRODUCTS":
        CatalogStore.onSearchProducts(payload.search);
        break;
      case "UWT_GO_TO_PAGE":
        CatalogStore.onUWTGoToPage(payload.target_page);
        break;
    }
  });

  return CatalogStore;
};

// Create the instance and pass Collections
CatalogStore = newCatalogStore(Catalog);
