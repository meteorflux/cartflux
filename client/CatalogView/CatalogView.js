// CatalogView Helpers
Template.CatalogView.helpers({
  catalog_products: function(){
    return CatalogStore.getSearchedProducts();
  },
  left_arrow_class: function(){
    var actual_page = CatalogStore.getActualPage();
    if (actual_page === 1) {
      return "disabled";
    } else {
      return "waves-effect";
    }
  },
  right_arrow_class: function(){
    var actual_page = CatalogStore.getActualPage();
    var total_pages = CatalogStore.getNumberOfPages();
    if (actual_page === total_pages) {
      return "disabled";
    } else {
      return "waves-effect";
    }
  },
  pages: function(){
    var total_pages = CatalogStore.getNumberOfPages();
    var actual_page = CatalogStore.getActualPage();
    var pages_array = [];
    for (var i = 1; i <= total_pages; i++ ){
      var item = { number: i };
      if (i === actual_page) {
        item.class = "active";
      } else {
        item.class = "waves-effect";
      }
      pages_array.push(item);
    }
    return pages_array;
  }
});

// CatalogView Events
Template.CatalogView.events({
  'click .add_cart_item': function(){
    Dispatcher.dispatch({ actionType: "ADD_CART_ITEM", item: this });
  },
  'click .remove_product': function(){
    Dispatcher.dispatch({ actionType: "REMOVE_PRODUCT", product: this });
  },
  'click .pagination-item': function(event){
    event.preventDefault();
    var target_page = Number($(event.currentTarget).attr("data-page"));
    Dispatcher.dispatch({ actionType: "UWT_GO_TO_PAGE", target_page: target_page});
  },
  'click .pagination-left': function(){
    event.preventDefault();
    var actual_page = CatalogStore.getActualPage();
    if (actual_page !== 1)
      Dispatcher.dispatch({ actionType: "UWT_GO_TO_PAGE", target_page: actual_page - 1 });
  },
  'click .pagination-right': function(){
    event.preventDefault();
    var actual_page = CatalogStore.getActualPage();
    var total_pages = CatalogStore.getNumberOfPages();
    if (actual_page !== total_pages)
      Dispatcher.dispatch({ actionType: "UWT_GO_TO_PAGE", target_page: actual_page + 1 });
  },
});

// CatalogView Subscriptions
Template.CatalogView.onCreated(function () {
  CatalogStore.subSearchedProducts(this);
});
