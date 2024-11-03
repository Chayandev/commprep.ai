import mongoose,{Schema} from 'mongoose';

const grammerAssesmentSchema= new Schema({},{timestamps:true});

export const GrammerAssesment=mongoose.model("GrammerAssesment",grammerAssesmentSchema);