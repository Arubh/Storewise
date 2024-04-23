const { Order } = require("../model/Order");


exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.user; 
  //we cant just pass req.user in the body of the postman. It is usually populated by the authentication mechanisms
  try {
    const orders = await Order.find({ user: id });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true,});
    //new: true means the new updated document will be returned after the operation
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  //example of url:
  //localhost:8080/orders?_sort=totalAmount&_order=-1&_page=2&_limit=3
  let query = Order.find({ deleted: { $ne: true } });
  //used to find the orders where 'deleted' flag is not equal to true 
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });
 

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    //query.sort() is a method provided by Mongoose to sort the results of a query. 
    //It accepts an object where the keys represent the fields to sort by, and the values represent the sorting order 
    //(1 for ascending, -1 for descending).
  }

  const totalDocs = await totalOrdersQuery.count().exec(); //find the numbers of such docs
  // console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const pageNumber = req.query._page;
    query = query.skip(pageSize * (pageNumber - 1)).limit(pageSize);
    // .skip() skips the specified number of entries from the database
    //.limit() limits the number of entries returned to the specified number
  }

  try {
    const docs = await query.exec(); // we finally execute the query on which we have applied multiple funtions
    res.set('X-Total-Count', totalDocs);
    //we set a key in the response headers named 'X-Total-Count' with its value as totalDocs
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};
