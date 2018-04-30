// Images = new FilesCollection({
//   debug: true,
//   collectionName: 'Images',
//   allowClientCode: false, // Disallow remove files from Client
//   storagePath: '/Users/kumarravi/projects/files',
//   onBeforeUpload: function(file) {
//     // Allow upload files under 10MB, and only in png/jpg/jpeg formats
//     return true;
//     if (file.size <= 1024 * 1024 * 1000 && /png|xlsx?g/i.test(file.extension)) {
//       return true;
//     }
//     return 'Please upload image, with size equal or less than 10MB';
//   },
//   onAfterUpload: function(file) {
//     readExcel(file.path);
//   }
// });
//
// if (Meteor.isServer) {
//   globalvars = {
//     for: 'EXCELIMPORT',
//     status: 'na',
//     excellinecount: 0
//   };
//   rowjsonkeys = [];
//   rowjsonvalues = [];
//   uniquestoreids = [];
//   uniqueproducts = [];
//   uniquegencat = [];
//   Images.denyClient();
//   // TODO : Organize Publishings.
//   Meteor.publish('files.images.all', function() {
//     return Images.find().cursor;
//   });
//   Meteor.publish('excelimportstatus', function() {
//     return __pre_excel_process.find({
//       for: "EXCELIMPORT"
//     });
//   });
//   Meteor.startup(function() {
//     // readExcel('/home/kumar/Downloads/H1-17 FOR ABC.xlsx')
//     // Meteor.call('getDistinctStores', (error, result) => {
//     //   if (error) {
//     //     // do something
//     //   } else {
//     //     uniquestores.insert({
//     //       filename: 'H2-17 DATA FOR ABC.xlsx',
//     //       stores: result
//     //     })
//     //     console.log(result); // save result when we get it
//     //   }
//     // });
//     // Meteor.call('getDistinctProducts', (error, result) => {
//     //   if (error) {
//     //     // do something
//     //   } else {
//     //     uniquestores.insert({
//     //       filename: 'H2-17 DATA FOR ABC.xlsx',
//     //       stores: result
//     //     })
//     //     console.log(result); // save result when we get it
//     //   }
//     // });
//     storecode = "0020013371";
//     const fs = Npm.require('fs');
//
//     Meteor.call('getDistinctStores', function(err, result) {
//       // console.log(result)
//       for (l = 0; l < result.length; l++) {
//         console.log(result[l]);
//         // continue;
//         var resultQ = product.find({
//           shiptocustomer2: storecode
//         }).fetch();
//
//         sumofsellthroughdiscount = 0;
//         finalrows = []
//         console.log(resultQ.length);
//         for (i = 0; i < resultQ.length; i++) {
//           if (!isNaN(Number(resultQ[i]['netretailvalue']))) {
//             if (Number(resultQ[i]['netretailvalue']) > 0) {
//               sumofsellthroughdiscount += Number(resultQ[i]['netretailvalue']);
//               resultQ[i]['netretailvalue'] = Number(resultQ[i]['netretailvalue']);
//               finalrows.push(resultQ[i]);
//             }
//           }
//         }
//         //     Npm.require('fs').writeFile('/Users/kumarravi/projects/files/a.json', JSON.stringify(finalrows),
//         //
//         //     function (err) {
//         //         if (err) {
//         //             console.log(err);
//         //         }
//         //     }
//         // );
//         console.log(sumofsellthroughdiscount);
//         console.log(finalrows.length);
//         finalrows.sort((a, b) => Number(b.netretailvalue) - Number(a.netretailvalue));
//         // console.log(result);
//         sumofpercent = 0;
//         analysisA = [];
//         analysisB = [];
//         analysisC = [];
//         MB = {}
//         MB.A = []
//         MB.B = []
//         MB.C = []
//
//         MT = {}
//         MT.A = []
//         MT.B = []
//         MT.C = []
//
//         WT = {}
//         WT.A = []
//         WT.B = []
//         WT.C = []
//
//         WB = {}
//         WB.A = []
//         WB.B = []
//         WB.C = []
//
//         for (i = 0; i < finalrows.length; i++) {
//           finalrows[i].contriper = (finalrows[i].netretailvalue / sumofsellthroughdiscount);
//           sumofpercent += finalrows[i].contriper;
//           switch (true) {
//             case sumofpercent <= 0.80:
//               analysisA.push(finalrows[i]);
//               switch (finalrows[i].gencat2) {
//                 case "MB":
//                   MB.A.push(finalrows[i])
//                   break;
//                 case "MT":
//                   MT.A.push(finalrows[i])
//                   break;
//                 case "WT":
//                   WT.A.push(finalrows[i])
//                   break;
//                 case "WB":
//                   WB.A.push(finalrows[i])
//                   break;
//                 default:
//               }
//               break;
//             case (sumofpercent > 0.80 && sumofpercent <= 0.95):
//               analysisB.push(finalrows[i]);
//               switch (finalrows[i].gencat2) {
//                 case "MB":
//                   MB.B.push(finalrows[i])
//                   break;
//                 case "MT":
//                   MT.B.push(finalrows[i])
//                   break;
//                 case "WT":
//                   WT.B.push(finalrows[i])
//                   break;
//                 case "WB":
//                   WB.B.push(finalrows[i])
//                   break;
//                 default:
//               }
//               break;
//             case (sumofpercent > 0.95 && sumofpercent <= 1):
//               analysisC.push(finalrows[i]);
//               switch (finalrows[i].gencat2) {
//                 case "MB":
//                   MB.C.push(finalrows[i])
//                   break;
//                 case "MT":
//                   MT.C.push(finalrows[i])
//                   break;
//                 case "WT":
//                   WT.C.push(finalrows[i])
//                   break;
//                 case "WB":
//                   WB.C.push(finalrows[i])
//                   break;
//                 default:
//               }
//               // console.log("");
//               break;
//             default:
//               analysisC.push(finalrows[i]);
//               console.log("THIS SHOULD NOT HAPPEN - " + sumofpercent);
//           }
//         }
//         //fs.appendFileSync("/Users/kumarravi/projects/files/a.csv","test")
//         fs.appendFileSync("/Users/kumarravi/projects/files/a.csv",storecode+ "," + "STORE"+ "," + analysisA.length+ "," + analysisB.length+ "," + analysisC.length+ "," + analysisA.length + analysisB.length + analysisC.length + "\n");
//         fs.appendFileSync("/Users/kumarravi/projects/files/a.csv",storecode+ "," + "MB"+ "," + MB.A.length+ "," + MB.B.length+ "," + MB.C.length+ "," + MB.A.length + MB.B.length + MB.C.length+ "\n");
//         fs.appendFileSync("/Users/kumarravi/projects/files/a.csv",storecode+ "," + "MT"+ "," + MT.A.length+ "," + MT.B.length+ "," + MT.C.length+ "," + MT.A.length + MT.B.length + MT.C.length+ "\n");
//         fs.appendFileSync("/Users/kumarravi/projects/files/a.csv",storecode+ "," + "WT"+ "," + WT.A.length+ "," + WT.B.length+ "," + WT.C.length+ "," + WT.A.length + WT.B.length + WT.C.length+ "\n");
//         fs.appendFileSync("/Users/kumarravi/projects/files/a.csv",storecode+ "," + "WB"+ "," + WB.A.length+ "," + WB.B.length+ "," + WB.C.length+ "," + WB.A.length + WB.B.length + WB.C.length+ "\n");
//         console.log(storecode+ "," + "STORE"+ "," + analysisA.length+ "," + analysisB.length+ "," + analysisC.length+ "," + analysisA.length + analysisB.length + analysisC.length);
//         console.log(storecode+ "," + "MB"+ "," + MB.A.length+ "," + MB.B.length+ "," + MB.C.length+ "," + MB.A.length + MB.B.length + MB.C.length);
//         console.log(storecode+ "," + "MT"+ "," + MT.A.length+ "," + MT.B.length+ "," + MT.C.length+ "," + MT.A.length + MT.B.length + MT.C.length);
//         console.log(storecode+ "," + "WT"+ "," + WT.A.length+ "," + WT.B.length+ "," + WT.C.length+ "," + WT.A.length + WT.B.length + WT.C.length);
//         console.log(storecode+ "," + "WB"+ "," + WB.A.length+ "," + WB.B.length+ "," + WB.C.length+ "," + WB.A.length + WB.B.length + WB.C.length);
//
//       }
//       console.log("Done : Created CSV for " + result.length + " stores");
//     });
//   });
// } else {
//   Meteor.subscribe('files.images.all');
// }
//
// function updateMessage(message) {
//   globalvars.message = message;
//   __pre_excel_process.upsert({
//     for: 'EXCELIMPORT'
//   }, {
//     $set: globalvars
//   });
//
// }
//
// function readExcel(fileName) {
//   rowjsonkeys = [];
//   rowjsonvalues = [];
//   uniquestoreids = [];
//   uniqueproducts = [];
//   uniquegencat = [];
//   const XlsxStreamReader = Npm.require("xlsx-stream-reader");
//   globalvars.status = "processing";
//   globalvars.filename = fileName;
//   updateMessage("processing the excel uploaded");
//   var workBookReader = new XlsxStreamReader();
//   workBookReader.on('error', function(error) {
//     throw (error);
//   });
//   workBookReader.on('sharedStrings', Meteor.bindEnvironment(function() {
//     // do not need to do anything with these,
//     // cached and used when processing worksheets
//     //console.log(workBookReader.workBookSharedStrings);
//     updateMessage("Reading the excel layouts");
//   }));
//
//   workBookReader.on('styles', Meteor.bindEnvironment(function() {
//     // do not need to do anything with these
//     // but not currently handled in any other way
//     //console.log(workBookReader.workBookStyles);
//     updateMessage("Understanding styles")
//   }));
//
//   workBookReader.on('worksheet', Meteor.bindEnvironment(function(workSheetReader) {
//     //console.log(workSheetReader.name);
//     updateMessage("getting sheet names : " + workSheetReader.name);
//     console.log(workSheetReader.name);
//     if (workSheetReader.name != 'Sheet1') {
//       // we only want first sheet
//       workSheetReader.skip();
//       return;
//     }
//     // print worksheet name
//     updateMessage("Working on sheet : " + workBookReader.name);
//
//
//     // if we do not listen for rows we will only get end event
//     // and have infor about the sheet like row count
//     workSheetReader.on('row', Meteor.bindEnvironment(function(row) {
//
//       if (row.attributes.r == 1) {
//         // do something with row 1 like save as column names
//         for (let i = 0; i < row.values.length; i++) {
//           if (i == 0) {
//             rowjsonkeys.push("");
//             continue;
//           }
//           rowjsonkeys.push(row.values[i].replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
//         }
//         console.log(rowjsonkeys);
//         updateMessage(" Reading Coloumn names. Found " + (rowjsonkeys.length - 1) + " coloumns");
//         // process.exit();
//       } else {
//         // second param to forEach colNum is very important as
//         // null columns are not defined in the array, ie sparse array
//         // row.values.forEach(function(rowVal, colNum) {
//         //   // do something with row values
//         // });
//
//         valuetoinsert = {}
//         for (let i = 0; i < row.values.length; i++) {
//           if (i == 0) {
//             continue;
//           }
//           // console.log(rowjsonkeys[i])
//           valuetoinsert[rowjsonkeys[i]] = row.values[i];
//           //rowjsonkeys.push(row.values[i].replace(/ /g, "").toLowerCase());
//         }
//         //console.log(valuetoinsert)
//         product.insert(valuetoinsert);
//         if (!uniquestoreids.includes(row.values[1])) {
//           uniquestoreids.push(row.values[1])
//           // console.log("Unique Stores : " + uniquestoreids.length);
//           globalvars.uniquestorecount = uniquestoreids.length;
//         }
//         // if (!uniqueproducts.includes(row.values[5])) {
//         //   uniqueproducts.push(row.values[5])
//         //   // console.log("Unique products : " + uniqueproducts.length);
//         //   globalvars.uniqueproductcount = uniqueproducts.length;
//         // }
//         if (!uniquegencat.includes(row.values[7])) {
//           uniquegencat.push(row.values[7])
//           // console.log("Unique products : " + uniqueproducts.length);
//           globalvars.uniquegencat = uniquegencat.length;
//         }
//         globalvars.message = "processing each row .. ";
//         globalvars.excellinecount++;
//         globalvars.userid = Meteor.userid;
//         __pre_excel_process.upsert({
//           filename: globalvars.filename
//         }, {
//           $set: globalvars
//         });
//
//         //console.log(row.values);
//         // console.log(row.values[3]);
//       }
//     }));
//     workSheetReader.on('end', function() {
//       console.log(workSheetReader.rowCount);
//
//     });
//
//     // call process after registering handlers
//     workSheetReader.process();
//   }));
//   workBookReader.on('end', Meteor.bindEnvironment(function() {
//     globalvars.status = "DONE";
//     globalvars.userid = Meteor.userid;
//     __pre_excel_process.upsert({
//       for: 'EXCELIMPORT'
//     }, {
//       $set: globalvars
//     });
//     console.log("Done!");
//   }));
//   console.log("Initiating read..");
//   updateMessage("Initiating excel processing")
//   var fs = Npm.require("fs");
//   fs.createReadStream(fileName).pipe(workBookReader);
// }
