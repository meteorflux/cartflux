// Creator
var CatalogStore = function () {
  var self = this;

  // Dependencies
  var CountersStore = null,
      CatalogRouter = null;
  Dependency.autorun(function () {
    CatalogRouter = Dependency.get('CatalogRouter');
    CountersStore = Dependency.get('CountersStore');
  });

  // Reactive Vars
  var addingProduct = new ReactiveVar(false);
  var searchQuery   = new ReactiveVar("");

  // Callbacks
  self.on = {
    addProduct: function (name, price) {
      // some validation in the Store side
      var error = false;
      if (name === '') {
        error = new Meteor.Error("wrong-name","Please provide a valid name.");
      } else if ((price === '')||(!$.isNumeric(price))) {
        error = new Meteor.Error("wrong-price","Please provide a valid price.");
      } else {
        Meteor.call('CatalogStore.addProduct', {name:name, price:price});
      }
      addingProduct.set(error);
    },
    addAnotherProduct: function () {
      var number = self.get.numberOfProducts() + 1;
      self.on.addProduct("Product "+ number, number);
    },
    addAnother10Products: function () {
      var number = self.get.numberOfProducts() + 1;
      for (var i=number; i < number+10; i++) {
        self.on.addProduct("Product "+ i, i);
      }
    },
    removeProduct: function (id) {
      Meteor.call('CatalogStore.removeProduct', id);
    },
    userIsAddingProduct: function (state) {
      addingProduct.set(state);
    },
    searchProducts: function (search) {
      searchQuery.set(search);
    }
  };

  // Getters
  self.get = {
    searchedProducts: function () {
      var regexp = new RegExp(searchQuery.get(), 'i');
      return Catalog.find(
        {name: regexp},
        { sort: {date: 1},
          limit: CatalogRouter.get.productsPerPage()});
    },
    searchQuery: function () {
      return searchQuery.get();
    },
    oneProduct: function (id) {
      return Catalog.findOne(id);
    },
    userIsAddingProduct: function () {
      return addingProduct.get();
    },
    numberOfProducts: function () {
      return CountersStore.get.numberOfProducts();
    },
    productsInPage: function () {
      var actualPage      = CatalogRouter.get.actualPage();
      var productsPerPage = CatalogRouter.get.productsPerPage();
      var regexp          = new RegExp(searchQuery.get(), 'i');

      var skip = (actualPage - 1) * productsPerPage;
      if (CatalogRouter.is.firstPage())
        skip = 0;

      return Catalog.find(
        { name: regexp },
        { limit: productsPerPage,
          skip: skip,
          sort: { date: 1 }
      });
    },
    productsInPageReady: function () {
      return self.get.productsInPage().count() === 0 ? false : true;
    }
  };

  // Register
  self.tokenId = Dispatcher.register(function (payload) {
    switch(payload.actionType) {
      case "ADD_PRODUCT":
        self.on.addProduct(payload.product.name, payload.product.price);
        break;
      case "REMOVE_PRODUCT":
        self.on.removeProduct(payload.product._id);
        break;
      case "ADD_ANOTHER_PRODUCT":
        self.on.addAnotherProduct();
        break;
      case "ADD_ANOTHER_10_PRODUCTS":
        self.on.addAnother10Products();
        break;
      case "USER_IS_ADDING_PRODUCT":
        self.on.userIsAddingProduct(true);
        break;
      case "USER_CANCELED":
        self.on.userIsAddingProduct(false);
        break;
      case "USER_HAS_SEARCHED_PRODUCTS":
        self.on.searchProducts(payload.search);
        break;
    }
  });

  return self;
};

// Initialize
Dependency.add('CatalogStore', new CatalogStore());
