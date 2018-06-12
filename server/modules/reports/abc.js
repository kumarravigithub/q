report1 = function (fileInfo, season) {
  // storecode = "0020013371";
  //  season='H1-18';
  //products_withabc.remove({});
  console.log("Generating report");
  fileid = fileInfo._id;
  Meteor.call('getDistinctStores', fileid, season, function (err, result) {
    uniqueGencats = result.uniqueGencats;
    result = result.uniqueStores;
    // result=["0020027533"];

    // console.log(result);
    // return;
    for (l = 0; l < result.length; l++) {
      storecode = result[l];
      if(storecode=="0020015779") {
      console.log(storecode);
      }
      return;
      var resultQ = product.find({
        shiptocustomer: storecode,
        seasontoconsider: season
      }).fetch();
      data = {}
      // categorise in gencats and find their sum.
      for (i = 0; i < resultQ.length; i++) {
        if (typeof data[resultQ[i].gencat] === 'undefined') {
          data[resultQ[i].gencat] = {};
          data[resultQ[i].gencat].sum = 0
          data[resultQ[i].gencat].products = []
        }
        resultQ[i].netsellthrudiscountedretailvalue = resultQ[i].netsellthrudiscountedretailvalue || 0;
        data[resultQ[i].gencat].products.push(resultQ[i]);
        data[resultQ[i].gencat].sum += Number(resultQ[i].netsellthrudiscountedretailvalue);
      }

      // find sum at store
      sumofstore = 0;
      var keys = [];
      pre_store_calculation_data = []
      for (var k in data) {
        // lets sort the data[k].products
        data[k].products.sort((a, b) => Number(b.netsellthrudiscountedretailvalue) - Number(a.netsellthrudiscountedretailvalue));

        keys.push(k);
        gencat_contrib_sum = 0;
        for (i = 0; i < data[k].products.length; i++) {
          data[k].products[i].gencat_contrib = data[k].products[i].netsellthrudiscountedretailvalue / data[k].sum
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
      pre_store_calculation_data.sort((a, b) => Number(b.netsellthrudiscountedretailvalue) - Number(a.netsellthrudiscountedretailvalue));

      store_contrib_sum = 0;
      for (i = 0; i < pre_store_calculation_data.length; i++) {
        pre_store_calculation_data[i].store_contrib = pre_store_calculation_data[i].netsellthrudiscountedretailvalue / sumofstore
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

    const fs = Npm.require('fs');
    filePath = MetaSetting.reportPath + "/" + season + '.csv';
    try {
      console.log("Deleting existing report file");
      fs.unlinkSync(filePath);
    } catch (e) {
      //ignore
    }
    mycsv = "Ship To Store,Entity,A,B,C,Total,A%,B%,C%";
    fs.appendFileSync(filePath, mycsv + "\n");
    var lengg = result.length;
    for (l = 0; l < result.length; l++) {
      storecode = result[l];
      storeA = products_withabc.find({
        shiptocustomer: storecode,
        abc_store_level: "A"
      }).count();
      storeB = products_withabc.find({
        shiptocustomer: storecode,
        abc_store_level: "B"
      }).count();
      storeC = products_withabc.find({
        shiptocustomer: storecode,
        abc_store_level: "C"
      }).count();
      total = storeA + storeB + storeC;
      storeAper = (storeA / total) * 100;
      storeBper = (storeB / total) * 100;
      storeCper = (storeC / total) * 100;

      mycsv = storecode + "," + "store" + "," + storeA + "," + storeB + "," + storeC + "," + total + "," + storeAper + "," + storeBper + "," + storeCper;
      fs.appendFileSync(filePath, mycsv + "\n");
      console.log("[" + l + "/" + lengg + "]");
      console.log("Writing :" + mycsv);
      fileInfo.status.message = "Writing report to file: " + "[" + l + "/" + lengg + "]";
      fileInfo.status.status = "REPORTING";
      fileInfo.status.timestamp = new Date();
      __pre_excel_process.upsert({
        fileid: fileInfo._id
      }, {
        $set: fileInfo.status
      });
      // console.log(uniqueGencats.length);
      for (i = 0; i < uniqueGencats.length; i++) {
        gencatA = products_withabc.find({
          shiptocustomer: storecode,
          abc_gencat_level: "A",
          gencat: uniqueGencats[i]
        }).count();
        gencatB = products_withabc.find({
          shiptocustomer: storecode,
          abc_gencat_level: "B",
          gencat: uniqueGencats[i]
        }).count();
        gencatC = products_withabc.find({
          shiptocustomer: storecode,
          abc_gencat_level: "C",
          gencat: uniqueGencats[i]
        }).count();
        total = gencatA + gencatB + gencatC;
        gencatAper = (gencatA / total) * 100;
        gencatBper = (gencatB / total) * 100;
        gencatCper = (gencatC / total) * 100;

        mycsv = storecode + "," + uniqueGencats[i] + "," + gencatA + "," + gencatB + "," + gencatC + "," + total + "," + gencatAper + "," + gencatBper + "," + gencatCper;;
        fs.appendFileSync(filePath, mycsv + "\n");
        console.log("Writing :" + mycsv);
      }
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
    console.log("yo")

    console.log("Done");
    tasks.update({
      season: season
    }, {
      $set: {
        status: "DONE",
        href:"/abcdownload/" + season
      }
    });
    isTaskRunning = false;
  });
}


// TODO:
// JSON TO CSV for dumping the ABC analysis product wise to csv file
// download file
// qr code report on mobile
// table for reports - abc analysis to be written to db collection and loaded in table
// dashboard beautification
// email of reports on QR code on scan
// ABC report browsable on mobile and website