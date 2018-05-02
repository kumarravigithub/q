report1 = function() {
  storecode = "0020013371";
  Meteor.call('getDistinctStores', function(err, result) {
    for (l = 0; l < result.length; l++) {
      // console.log(result[l]);
      // continue;
      var resultQ = product.find({
        shiptocustomer2: storecode
      }).fetch();
      data = {}
      // categorise in gencats and find their sum.
      for (i = 0; i < resultQ.length; i++) {
        if (typeof data[resultQ[i].gencat2] === 'undefined') {
          data[resultQ[i].gencat2] = {};
          data[resultQ[i].gencat2].sum = 0
          data[resultQ[i].gencat2].products = []
        }
        data[resultQ[i].gencat2].products.push(resultQ[i]);
        resultQ[i].netretailvalue = resultQ[i].netretailvalue || 0;
        data[resultQ[i].gencat2].sum += Number(resultQ[i].netretailvalue);
      }

      // find sum at store
      sumofstore = 0;
      var keys = [];
      pre_store_calculation_data = []
      for (var k in data) {
        // lets sort the data[k].products
        data[k].products.sort((a, b) => Number(b.netretailvalue) - Number(a.netretailvalue));

        keys.push(k);
        gencat_contrib_sum = 0;
        for (i = 0; i < data[k].products.length; i++) {
          data[k].products[i].gencat_contrib = data[k].products[i].netretailvalue / data[k].sum
          gencat_contrib_sum += data[k].products[i].gencat_contrib;
          switch (true) {
            case gencat_contrib_sum <= 0.80:
              data[k].products[i].abc_gencat_level = "A"
              break;
            case (gencat_contrib_sum > 0.80) && (gencat_contrib_sum <= 0.95):
              data[k].products[i].abc_gencat_level = "B"
              break;
            case (gencat_contrib_sum > 0.95) && (gencat_contrib_sum <= 1):
              data[k].products[i].abc_gencat_level = "C"
              break;
            default:
              // THIS DEFAULT CASE CATCHES THE F*$&#NG FLOATING POINT NUMBERS
              data[k].products[i].abc_gencat_level = "C"
          }
          pre_store_calculation_data.push(data[k].products[i]);
        }
        sumofstore += data[k].sum;
        // console.log(data[k].sum);
      }
      // console.log(sumofstore);

      pre_store_calculation_data.sort((a, b) => Number(b.netretailvalue) - Number(a.netretailvalue));


      store_contrib_sum = 0;
      for (i = 0; i < pre_store_calculation_data.length; i++) {
        pre_store_calculation_data[i].store_contrib = pre_store_calculation_data[i].netretailvalue / sumofstore
        store_contrib_sum += pre_store_calculation_data[i].store_contrib;
        switch (true) {
          case store_contrib_sum <= 0.80:
            pre_store_calculation_data[i].abc_store_level = "A"
            break;
          case (store_contrib_sum > 0.80) && (store_contrib_sum <= 0.95):
            pre_store_calculation_data[i].abc_store_level = "B"
            break;
          case (store_contrib_sum > 0.95) && (store_contrib_sum <= 1):
            pre_store_calculation_data[i].abc_store_level = "C"
            break;
          default:
            // THIS DEFAULT CASE CATCHES THE F*$&#NG FLOATING POINT NUMBERS
            pre_store_calculation_data[i].abc_store_level = "C"
        }
      }
      console.log("Done for " + l);
    }
  });
}


// data[k].products[i].store_contrib = data[k].products[i].netretailvalue / sumofstore
