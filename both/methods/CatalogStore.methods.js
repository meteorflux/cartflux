// CatalogStore Methods
Meteor.methods({
  'CatalogStore.addProduct': function(product){
    var date = Date.now();
    Catalog.insert({name:product.name, price:product.price, date:date});
  },
  'CatalogStore.removeProduct': function(id){
    Catalog.remove(id);
  }
});
