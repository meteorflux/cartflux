// Dependencies
var catalogStore, catalogRouter, countersStore;
Dependency.autorun(function(){
  catalogStore  = Dependency.get('CatalogStore');
  catalogRouter = Dependency.get('CatalogRouter');
  countersStore = Dependency.get('CountersStore');
});

// CatalogView Helpers
Template.CatalogView.helpers({
  catalog_products: function(){
    return catalogStore.getProductsInPage();
  },
  left_arrow_class: function(){
    if (catalogRouter.is.firstPage())
      return "disabled";
    return "waves-effect";
  },
  left_arrow_url: function(){
    return catalogRouter.get.previousPageUrl();
  },
  right_arrow_class: function(){
    if (catalogRouter.is.lastPage())
      return "disabled";
    return "waves-effect";
  },
  right_arrow_url: function(){
    return catalogRouter.get.nextPageUrl();
  },
  pages: function(){
    var total_pages = catalogRouter.get.numberOfPages();
    var actual_page = catalogRouter.get.actualPage();
    var pages_array = [];
    for (var i = 1; i <= total_pages; i++ ){
      var item = {
        item_number: i,
        item_url: catalogRouter.get.productPageUrl(i)
      };
      if (i === actual_page) {
        item.item_class = "active";
      } else {
        item.item_class = "waves-effect";
      }
      pages_array.push(item);
    }
    return pages_array;
  },
  productsInPageReady: function () {
    return catalogStore.getProductsInPageReady();
  }
});

// CatalogView Events
Template.CatalogView.events({
  'click .add_cart_item': function(){
    Dispatcher.dispatch({ actionType: "ADD_CART_ITEM", item: this });
  },
  'click .remove_product': function(){
    Dispatcher.dispatch({ actionType: "REMOVE_PRODUCT", product: this });
  }
});

// CatalogView Subscriptions
Template.CatalogView.onCreated(function () {
  countersStore.subscriptions.catalogCounter(this);
});
