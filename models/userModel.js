import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    roleList:{type: [Number], default:[2001]},
    refreshToken:{type:String},
    cartData: {type: Object, default: {}}
},{minimize: false});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;