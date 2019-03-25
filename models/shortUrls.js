var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ShortUrls = new Schema ({
    original_url: {type: String, required: true},
    short_url: {type: String, required: true}
  });

  ShortUrls.set('toObject', { 
    virtuals: false,
    transform: (doc, ret, options) => {
      delete ret.__v;
      delete ret._id;
    },
  });
  
  module.exports = mongoose.model('ShortUrls', ShortUrls);