const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema(
    {
        username: { type: String , required: true, unique:true},
        email: { type: String , required: true, unique:true},
        password: { type: String , required: true},
        otp:{ type: Number , default: null},
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true  }
);

UserSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.__v
    return userObject
}

module.exports = mongoose.model("User", UserSchema);