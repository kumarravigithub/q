Meteor.methods({
  getDistinctStores: function(fileid, season) {
    season="H1-18";
    result=product.find({fileid:fileid, seasontoconsider:season},{fields: {'shiptocustomer':1, 'gencat':1}}).fetch();
    const uniqueStores = [...new Set(result.map(item => item.shiptocustomer))];
    const uniqueGencats = [...new Set(result.map(item => item.gencat))];
    return {uniqueStores:uniqueStores, uniqueGencats:uniqueGencats};
    // return Meteor.wrapAsync(callback => {
    //   product.rawCollection().distinct('shiptocustomer2', callback);
    // })();
  },
  getDistinctProducts: function() {
    return Meteor.wrapAsync(callback => {
      product.rawCollection().distinct('product', callback);
    })();
  },
  getDistinctSeason: function() {
    return Meteor.wrapAsync(callback => {
      product.rawCollection().distinct('seasontoconsider', callback);
    })();
  },
  getDistinctCatMaster: function() {
    return Meteor.wrapAsync(callback => {
      product_master.rawCollection().distinct('Gen_cat', callback);
    })();
  },
  callme : function() {
    var result = Meteor.call('getDistinctCatMaster');
    returnValue=[]
    result.forEach(function(ele) {
      var a = product_master.find({Gen_cat:ele}).count()
      var rv={};
      rv.cat=ele;
      rv.count=a;
      returnValue.push(rv);
    });
    console.log(returnValue);
    return returnValue;
  },
  getSeason : function() {
    var result = Meteor.call('getDistinctSeason');
    console.log("dsds");
    return result;
  }
});
