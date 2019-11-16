const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

const locationSchema = new Schema({
    location: {
      type: {
        type: String,
        required: true,
        enum: [ 'Point' ]
      },
      coordinates: {
        type: [ Number ],
        required: true,
        validate: {
          validator: validateGeoJsonCoordinates,
          message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
        }
      }
    }
  });
  
  // Create a geospatial index on the location property.
  geolocatedSchema.index({ location: '2dsphere' });
  
  // Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
  function validateGeoJsonCoordinates(value) {
    return Array.isArray(value) && value.length >= 2 && value.length <= 3 && value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90;
  }

  // Create the model from the schema and export it
module.exports = mongoose.model('Location', locationSchema);