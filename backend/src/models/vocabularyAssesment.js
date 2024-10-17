import mongoose,{Schema} from 'mongoose';

const vocabularyAssesmentSchema= new Schema({},{timestamps:true});

export const VocabularyAssesment=mongoose.model("VocabularyAssesment",vocabularyAssesmentSchema);