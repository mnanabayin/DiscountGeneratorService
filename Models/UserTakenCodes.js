const mongoose = require('mongoose');


// User Taken Codes Model

mongoose.model("User_Taken_Codes", {
	userID: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true
	},
	brandUserID: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true
	},
	codeID: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true
	},
	createdAt: {
		type: Date,
		required: true
	},
	updatedAt: {
		type: Date,
		required: false
	},
	
})