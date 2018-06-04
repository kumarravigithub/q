product_master = new Mongo.Collection("product_master");
product = new Mongo.Collection("products");
products_withabc = new Mongo.Collection("products_withabc");
__pre_excel_process = new Mongo.Collection("__pre_excel_process");
uniquestores = new Mongo.Collection("uniquestores");
uniqueproducts = new Mongo.Collection("uniqueproducts");
tasks = new Mongo.Collection("tasks");

isTaskRunning = false;
taskList = [];
MetaSetting = {
    uploadPath: "/home/kumar/projects/files",
    reportPath: "/home/kumar/projects/files/reports"
}