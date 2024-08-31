const { Cart } = require('../model/Cart');


exports.addToCart = async (req, res) => {
  const { id } = req.user; //this is userId
  const cart = new Cart({ ...req.body, user: id });
  //we use spread operator to add a new entry to our req.body: userId
  try {
    const result = await cart.save();
    // const result = await doc.populate('product'); 
    //we actually dont need to populate during POST request to DB. We may populate if we expect the response 
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchCartByUser = async (req, res) => { 
  const { id } = req.user; //this is userId
  try {
    const cartItems = await Cart.find({ user: id }).populate('product');

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err); 
  }       
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params; //this is product id
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params; //this is product id
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate('product');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
        