// Dependencies
var CatalogRouter;
Dependency.autorun(function(){
  CatalogRouter = Dependency.get('CatalogRouter');
});

// Helpers
Template.HomeView.helpers({
  'catalog_url': function(){
    return CatalogRouter.get.productPageUrl();
  }
});
