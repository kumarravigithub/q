Meteor.methods({
  getDistinctStores: function() {
    return Meteor.wrapAsync(callback => {
      product.rawCollection().distinct('shiptocustomer2', callback);
    })();
  },
  getDistinctProducts: function() {
    return Meteor.wrapAsync(callback => {
      product.rawCollection().distinct('product', callback);
    })();
  }
});
