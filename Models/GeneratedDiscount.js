const mongoose = require('mongoose');


// Generated Discount Model

mongoose.model("Generated_Discount", {
	brandUserId: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true
	},
	discountCode: {
		type: String,
		required: true
	},
	/*expiryDate: {
		type: Date,
		required: false
	},*/
	createdAt: {
		type: Date,
		required: true
	},
	updatedAt: {
		type: Date,
		required: false
	},
	
})