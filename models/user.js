const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;


const user = new Schema( {
    username : {type : String , required : true},
    email : {type : String , required : true, unique : true},
    password : {type : String , required : true},
    dept : {type:String, required : true},
    year : {type:Number, required : true},
    notifications : [
        {type: String}
    ],
    invitation : [    //* invitations recieved by the user
        {
            type  : mongoose.Schema.Types.ObjectId,
            ref   : 'Invitation'
        }
    ],
    events : [      //* Events created by the user
        {
            type  : mongoose.Schema.Types.ObjectId,
            ref   : 'Invitation'
        }
    ],
    attending : [   //*Event invites accepted by the user
        {
            type  : mongoose.Schema.Types.ObjectId,
            ref   : 'Invitation'
        }
    ]
});

module.exports = mongoose.model('User', user);
