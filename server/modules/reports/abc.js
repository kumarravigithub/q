report1 = function(fileInfo) {
  // storecode = "0020013371";
  fileid = fileInfo._id;
  Meteor.call('getDistinctStores', fileid, function(err, result) {
    uniqueGencats=result.uniqueGencats;
    result=result.uniqueStores;
    for (l = 0; l < result.length; l++) {
      storecode = result[l];
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
        products_withabc.insert(pre_store_calculation_data[i])
      }
      fileInfo.status.message = "Generating report: " + l + " store(s)";
      fileInfo.status.status = "REPORTING";
      fileInfo.status.timestamp = new Date();
      __pre_excel_process.upsert({
        fileid: fileInfo._id
      }, {
        $set: fileInfo.status
      });
      console.log("Done for " + l);
      // if (storecode == "0020026418") {
      //   console.log("PAKDAYA");
      // }
    }
    fileInfo.status.message = "DONE";
    fileInfo.status.status = "DONE";
    __pre_excel_process.upsert({
      fileid: fileInfo._id
    }, {
      $set: fileInfo.status
    });
    Images.update({
      _id: fileInfo._id
    }, {
      $set: fileInfo
    });
    const fs = Npm.require('fs');
    filePath='/home/qart/files/reports/abc.xlsx';
try {
    fs.unlinkSync(filePath)
} catch (e) {
    //ignore
}
    mycsv = "Ship To Store,Entity,A,B,C,Total,A%,B%,C%";
    fs.appendFileSync(filePath, mycsv + "\n");

    for (l = 0; l < result.length; l++) {
      storecode=result[l];
      storeA = products_withabc.find({shiptocustomer2: storecode, abc_store_level: "A"}).count();
      storeB = products_withabc.find({shiptocustomer2: storecode, abc_store_level: "B"}).count();
      storeC = products_withabc.find({shiptocustomer2: storecode, abc_store_level: "C"}).count();
      total=storeA+storeB+storeC;
      storeAper=(storeA/total) * 100;
      storeBper=(storeB/total) * 100;
      storeCper=(storeC/total) * 100;

      mycsv=storecode  + "," + "store"  + "," + storeA  + "," + storeB  + "," + storeC + "," + total + "," + storeAper + "," + storeBper + "," + storeCper;
      fs.appendFileSync(filePath, mycsv + "\n");
      // console.log(uniqueGencats.length);
      for(i=0;i<uniqueGencats.length;i++) {
        gencatA = products_withabc.find({shiptocustomer2: storecode, abc_store_level: "A", gencat2:uniqueGencats[i]}).count();
        gencatB = products_withabc.find({shiptocustomer2: storecode, abc_store_level: "B", gencat2:uniqueGencats[i]}).count();
        gencatC = products_withabc.find({shiptocustomer2: storecode, abc_store_level: "C", gencat2:uniqueGencats[i]}).count();
        total=gencatA+gencatB+gencatC;
        gencatAper=(gencatA/total) * 100;
        gencatBper=(gencatB/total) * 100;
        gencatCper=(gencatC/total) * 100;

        mycsv=storecode + "," + uniqueGencats[i] + "," + gencatA + "," + gencatB  + "," + gencatC + "," + total + "," + gencatAper + "," + gencatBper + "," + gencatCper;;
        fs.appendFileSync(filePath, mycsv + "\n");
      }
    }
    console.log("Done");
  });
}


// TODO
// JSON TO CSV for dumping the ABC analysis product wise to csv file
// download file
// qr code report on mobile
// table for reports - abc analysis to be written to db collection and loaded in table
// dashboard beautification
// email of reports on QR code on scan
// ABC report browsable on mobile and website
