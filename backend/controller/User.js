const { User } = require('../model/User');

exports.fetchUserById = async (req, res) => {
  const { id } = req.user; //equivalent to const id = req.user.id
  try {
    const user = await User.findById(id);
    res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role});
  } catch (err) {
    res.status(400).json(err);
  } 
}; 

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    //It takes three arguments:
    //id: The ID of the user to update, extracted from the request parameters.
    //req.body: The updated user data, taken from the request body. This data will replace the existing user data in the database.
    //{ new: true }: An options object that specifies to return the modified user document rather than the original one. 
    //This ensures that the user variable holds the updated user document.
    res.status(200).json(user);
  } catch (err) { 
    res.status(400).json(err); 
  }
};
 