import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
  name:{
    type:String,
    
    
  },
  phoneNumber:{
    type:Number,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  profileImage:{
    type:String,
    
  },
  password:{
    type:String,
    required:true,
    min:6,
    max:12
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  }

},{timestamps:true});



userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10);
})


userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}


userSchema.methods.generateAccessToken = function() {
    const token = jwt.sign(
        {
            _id:this._id,
            name:this.name,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )

    return token;
}


export const User = mongoose.model('User', userSchema);