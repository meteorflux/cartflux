describe('CatalogStore', function() {
  var catalogStore, countersStore, catalogRouter;

  beforeEach(function(){

    Dispatcher = new MeteorFlux.Dispatcher();

    countersStore = new CountersStore();
    catalogRouter = new CatalogRouter();

    Dependency.add('CatalogRouter', catalogRouter);
    Dependency.add('CountersStore', countersStore );

    catalogStore = new CatalogStore();
  });

  it('registers a callback with the dispatcher', function() {
    spyOn(Dispatcher, "register").and.callThrough();
    catalogStore = new CatalogStore();
    expect(Dispatcher.register.calls.any()).toBeTruthy();
  });

  it('has a public token ID', function() {
    expect(catalogStore.tokenId).toBeTruthy();
  });

  describe('on', function(){

    beforeEach(function(){
      spyOn(countersStore.get, "numberOfProducts").and.returnValue(11);
      spyOn(Meteor, "call");
    });

    it('should add a product to the Catalog Collection', function(){
      Dispatcher.dispatch({
        actionType: "ADD_PRODUCT",
        product: { name: "Test", price: 12345 }
      });
      expect(Meteor.call).toHaveBeenCalledWith(
        "CatalogStore.addProduct",
        { name: "Test", price: 12345 }
      );
    });

    it('should not add a product if the name is empty', function(){
      Dispatcher.dispatch({
        actionType: "ADD_PRODUCT",
        product: { name: "", price: 12345 }
      });
      expect(Meteor.call).not.toHaveBeenCalled();
    });

    it('should not add a product if the price is empty', function(){
      Dispatcher.dispatch({
        actionType: "ADD_PRODUCT",
        product: { name: "Test", price: undefined }
      });
      expect(Meteor.call).not.toHaveBeenCalled();
    });

    it('should not add a product if the price is not a number', function(){
      Dispatcher.dispatch({
        actionType: "ADD_PRODUCT",
        product: { name: "Test", price: "string" }
      });
      expect(Meteor.call).not.toHaveBeenCalled();
    });

    it('should add a random product to the Catalog Collection', function(){
      Dispatcher.dispatch({ actionType: "ADD_ANOTHER_PRODUCT" });
      expect(Meteor.call).toHaveBeenCalledWith(
        "CatalogStore.addProduct",
        { name: "Product 12", price: 12 }
      );
      expect(Meteor.call.calls.count()).toBe(1);
    });

    it('should add 10 random products to the Catalog Collection', function(){
      Meteor.call.calls.reset();
      Dispatcher.dispatch({ actionType: "ADD_ANOTHER_10_PRODUCTS" });
      expect(Meteor.call.calls.count()).toBe(10);
      expect(Meteor.call).toHaveBeenCalledWith(
        "CatalogStore.addProduct",
        { name: "Product 12", price: 12 }
      );
      expect(Meteor.call).toHaveBeenCalledWith(
        "CatalogStore.addProduct",
        { name: "Product 21", price: 21 }
      );
    });
  });

  describe('get', function(){

    beforeEach(function(){

    });

    it('should return all prodcuts', function(){
      spyOn(Catalog, "find").and.returnValue("LocalCollection");
      expect(catalogStore.getSearchedProducts()).toEqual("LocalCollection");
    });

    it('should return all the prodcuts', function(){
      spyOn(Catalog, "find").and.returnValue("LocalCollection");
      expect(catalogStore.getSearchedProducts()).toEqual("LocalCollection");
    });

    it('should not return any prodcuts in this search', function(){
      Dispatcher.dispatch({
        actionType: "USER_HAS_SEARCHED_PRODUCTS",
        search: "Test nonexistent product"
      });
      expect(catalogStore.getSearchedProducts().fetch()).toEqual([]);
    });

    it('should return searched prodcut', function(){
      Dispatcher.dispatch({
        actionType: "ADD_PRODUCT",
        product: { name: "Test existent product", price: 1 }
      });
      Dispatcher.dispatch({
        actionType: "USER_HAS_SEARCHED_PRODUCTS",
        search: "Test existent product"
      });
      var result = catalogStore.getSearchedProducts().fetch();
      expect(result)
        .toEqual(jasmine.arrayContaining([jasmine.objectContaining(
          { name: "Test existent product" })]));
      Dispatcher.dispatch({
        actionType: "REMOVE_PRODUCT",
        product: { _id: result[0]._id }
      });
      Dispatcher.dispatch({
        actionType: "USER_HAS_SEARCHED_PRODUCTS",
        search: "Test existent product"
      });
      expect(catalogStore.getSearchedProducts().fetch()).toEqual([]);
    });

    it('should return return a search query', function(){
      Dispatcher.dispatch({
        actionType: "USER_HAS_SEARCHED_PRODUCTS",
        search: "A search query"
      });
      expect(catalogStore.getSearchQuery()).toEqual("A search query");
    });

    it('should return a single product', function(){
      spyOn(Catalog, "findOne").and.callFake(function(id){
        return id;
      });
      expect(catalogStore.getOneProduct(123)).toEqual(123);
    });

    it('should return the number of products', function(){
      spyOn(countersStore.get, "numberOfProducts").and.returnValue(123);
      expect(catalogStore.getNumberOfProducts()).toEqual(123);
    });


  });

});
