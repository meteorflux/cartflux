// Creator
CatalogStore = function () {
  var self = this;

  var catalogRouter, countersStore;
  // Dependencies
  Dependency.autorun(function () {
    catalogRouter = Dependency.get('CatalogRouter');
    countersStore = Dependency.get('CountersStore');
  });

  // Reactive Vars
  var addingProduct = new ReactiveVar(false);
  var searchQuery   = new ReactiveVar("");

  // Private Callbacks
  var onAddProduct = function (name, price) {
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
  };

  var onAddAnotherProduct = function () {
    var number = self.getNumberOfProducts() + 1;
    onAddProduct("Product "+ number, number);
  };

  var onAddAnother10Products = function () {
    var number = self.getNumberOfProducts() + 1;
    for (var i = number; i < (number + 10); i++) {
      onAddProduct("Product "+ i, i);
    }
  };

  var onRemoveProduct = function (id) {
    Meteor.call('CatalogStore.removeProduct', id);
  };

  var onUserIsAddingProduct = function (state) {
    addingProduct.set(state);
  };

  var onSearchProducts = function (search) {
    searchQuery.set(search);
  };

  // Getters
  self.getSearchedProducts = function () {
    var regexp = new RegExp(searchQuery.get(), 'i');
    return Catalog.find(
      { name: regexp },
      { sort: { date: 1 },
        limit: catalogRouter.get.productsPerPage() });
  };

  self.getSearchQuery = function () {
    return searchQuery.get();
  };

  self.getOneProduct = function (id) {
    return Catalog.findOne(id);
  };

  self.getUserIsAddingProduct = function () {
    return addingProduct.get();
  };

  self.getNumberOfProducts = function () {
    return countersStore.get.numberOfProducts();
  };

  self.getProductsInPage = function () {
    var actualPage      = catalogRouter.get.actualPage();
    var productsPerPage = catalogRouter.get.productsPerPage();
    var regexp          = new RegExp(searchQuery.get(), 'i');

    var skip = (actualPage - 1) * productsPerPage;
    if (catalogRouter.is.firstPage())
      skip = 0;

    return Catalog.find(
      { name: regexp },
      { limit: productsPerPage,
        skip: skip,
        sort: { date: 1 }
    });
  };

  self.getProductsInPageReady = function () {
    return self.getProductsInPage().count() === 0 ? false : true;
  };

  // Register
  self.tokenId = Dispatcher.register(function (payload) {
    switch (payload.actionType) {
      case "ADD_PRODUCT":
        onAddProduct(payload.product.name, payload.product.price);
        break;
      case "REMOVE_PRODUCT":
        onRemoveProduct(payload.product._id);
        break;
      case "ADD_ANOTHER_PRODUCT":
        onAddAnotherProduct();
        break;
      case "ADD_ANOTHER_10_PRODUCTS":
        onAddAnother10Products();
        break;
      case "USER_IS_ADDING_PRODUCT":
        onUserIsAddingProduct(true);
        break;
      case "USER_CANCELED":
        onUserIsAddingProduct(false);
        break;
      case "USER_HAS_SEARCHED_PRODUCTS":
        onSearchProducts(payload.search);
        break;
    }
  });

  return self;
};

// Initialize
Dependency.add('CatalogStore', new CatalogStore());
