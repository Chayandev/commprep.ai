import mongoose,{Schema} from 'mongoose';

const listeningAssesmentSchema= new Schema({},{timestamps:true});

export const ListeningAssesment=mongoose.model("ListeningAssesment",listeningAssesmentSchema);