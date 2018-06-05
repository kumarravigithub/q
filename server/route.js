Picker.route('/abcdownload', function(params, req, res, next) {
  const fs = Npm.require('fs');
  var filePath = '/home/qart/files/reports/abc.xlsx';
  var fileName = 'abc.csv';
  var data = fs.readFileSync(filePath);
  res.writeHead(200, {
    'Cache-Control': 'private, max-age=0, no-cache, must-revalidate, post-check=0, pre-check=0',
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; fileName= "' + fileName + '";'
  });
  res.write(data);
  res.end();
});


Picker.route('/abcproductwisedownload', function(params, req, res, next) {
  const fs = Npm.require('fs');

  console.log("reading..");
  var data = products_withabc.find({}).fetch();
  console.log("parsing..");
  var csv = Papa.unparse(data);
  var fileName = 'abc_product.csv';
  var filePath = '/home/qart/files/reports/abcproduct.xlsx';
  fs.writeFileSync(filePath,csv);
  var data = fs.readFileSync(filePath);
  console.log("downloading..");
  res.writeHead(200, {
    'Cache-Control': 'private, max-age=0, no-cache, must-revalidate, post-check=0, pre-check=0',
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; fileName= "' + fileName + '";'
  });
  res.write(data);
  res.end();
});

Picker.route('/abcdownload/:_season', function(params, req, res, next) {
  const fs = Npm.require('fs');
  season=decodeURI(params._season);

  var filePath = MetaSetting.reportPath + "/" + season + ".csv";

  var data = fs.readFileSync(filePath);
  console.log("downloading..");
  res.writeHead(200, {
    'Cache-Control': 'private, max-age=0, no-cache, must-revalidate, post-check=0, pre-check=0',
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; fileName= "' + params._season + ".csv" + '";'
  });
  res.write(data);
  res.end();
});

Picker.route('/full/abcdownload/:_season', function(params, req, res, next) {
  const fs = Npm.require('fs');
  season=decodeURI(params._season);
  console.log(season);
  
  console.log("reading..");
  var data = products_withabc.find({seasontoconsider:season}).fetch();
  
  console.log("parsing..");
  var csv = Papa.unparse(data);
  var fileName = season + "_product.csv";
  var filePath = MetaSetting.reportPath + '/' + fileName;
  fs.writeFileSync(filePath,csv);
  var data = fs.readFileSync(filePath);
  console.log("downloading..");
  res.writeHead(200, {
    'Cache-Control': 'private, max-age=0, no-cache, must-revalidate, post-check=0, pre-check=0',
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; fileName= "' + fileName + '";'
  });
  res.write(data);
  res.end();
});