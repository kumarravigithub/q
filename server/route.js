Picker.route('/post', function(params, req, res, next) {
    var products = product.find({}).fetch();
    res.end(JSON.stringify(products));
});
