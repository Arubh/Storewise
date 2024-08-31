const mongoose = require('mongoose');
const {Schema} = mongoose;


const cartSchema = new Schema({
    quantity: { type : Number, required: true},
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true},
    //type: Schema.Types.ObjectId indicates that the value of this field should be a MongoDB ObjectId, 
    //which is used to reference documents in other collections. 
    //ref: 'Product' specifies the name of the model that this field references
    user:{ type: Schema.Types.ObjectId, ref: 'User', required: true}
})

const virtual  = cartSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
cartSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function (doc,ret) { delete ret._id}
}) 


exports.Cart = mongoose.model('Cart',cartSchema)