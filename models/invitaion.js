const mongoose  = require('mongoose'),
      Schema    = mongoose.Schema;


const invitation = new Schema( {
    title : {type: String, required : true},
    creator : {
        type  : mongoose.Schema.Types.ObjectId,
        ref   : 'User'
    },
    time : {type : Date, required : true},  //* When the event is going to happen
    description : {type : String, required : true},
    food : {type : String, required : true},    //* What food is going to be served
    duration : {type : Date, required : true},    
    deadline : {type : Date, required : true},  //* Deadline to accept the event
    people : {type : Number, required : true},    //* Max no of ppl who can attend the event
    elements : [                                    //* Elements of the body
        {
            type : { type : String},  //* Image || Text || Template
            x1 : { 
                dx : {type : Number},
            },x2 :  { 
                dx : {type : Number},
            },y1 : { 
                dy : {type : Number},
            },y2 : { 
                dy : {type : Number},
            },
            font : { type : String },  //* first, second .... (the name of the font in font-face)
            text : {type : String},  //* Content of the element
            size : { type : Number },
            color : { type : String },
            src : { type : String },
        }
    ],
    acceptees : [
        {
            type  : mongoose.Schema.Types.ObjectId,
            ref   : 'User'
        }
    ],
    attendees : [   //?     PPL WHO ACTUALLY SHOW UP FOR THE EVENT
        {
            type  : mongoose.Schema.Types.ObjectId,
            ref   : 'User'
        }
    ],
    private : {
        private : {type : Boolean},
        year : { type : Number},
        dept : { type : String},
    }
});

module.exports = mongoose.model('Invitation', invitation);
