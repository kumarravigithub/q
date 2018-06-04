Meteor.methods({
  getDistinctStores: function(fileid, season) {
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
    //console.log(returnValue);
    return returnValue;
  },
  getSeason : function() {
    var result = Meteor.call('getDistinctSeason');
    returnResult=[];
    for(i=0;i<=result.length;i++) {
      if(result[i]) {
        returnResult.push(result[i]);
      }
    }
    console.log(returnResult);
    return returnResult;
  },
  runABC: function(season, fileid) {
    console.log(season,fileid);
    var ispresent=tasks.find({type:"ABCREPORT",status:"pending"}).count();
    if(ispresent>0) {
      console.log("Already running report, wait for it to finish");
      return;
    } 
    var ispresent=tasks.find({type:"ABCREPORT",season:season}).count();
    if(ispresent>0) {
      console.log("This Season Already Generated. This must be downloaded. The button must have a download link");
      return;
    }

    tasks.insert({
      type:"ABCREPORT",
      status:"pending",
      season:season,
      fileid:fileid
    })
  },
  resetPortal: function() {
    product.remove({});
    products_withabc.remove({});
    __pre_excel_process.remove({});
    Images.remove({});
    product_master.remove({});
    tasks.remove({});
    console.log(" ** DATABASE EMPTY **");
    return "done";
  }
});
