// Dependencies
var CatalogStore, CatalogRouter, CountersStore;
Dependency.autorun(function(){
  CatalogStore  = Dependency.get('CatalogStore');
  CatalogRouter = Dependency.get('CatalogRouter');
  CountersStore = Dependency.get('CountersStore');
});

// CatalogView Helpers
Template.CatalogView.helpers({
  catalog_products: function(){
    return CatalogStore.get.productsInPage();
  },
  left_arrow_class: function(){
    if (CatalogRouter.is.firstPage())
      return "disabled";
    return "waves-effect";
  },
  left_arrow_url: function(){
    return CatalogRouter.get.previousPageUrl();
  },
  right_arrow_class: function(){
    if (CatalogRouter.is.lastPage())
      return "disabled";
    return "waves-effect";
  },
  right_arrow_url: function(){
    return CatalogRouter.get.nextPageUrl();
  },
  pages: function(){
    var total_pages = CatalogRouter.get.numberOfPages();
    var actual_page = CatalogRouter.get.actualPage();
    var pages_array = [];
    for (var i = 1; i <= total_pages; i++ ){
      var item = {
        item_number: i,
        item_url: CatalogRouter.get.productPageUrl(i)
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
    return CatalogStore.get.productsInPageReady();
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
  //CatalogStore.subscriptions.searchedProducts(this);
  CountersStore.subscriptions.catalogCounter(this);
});
