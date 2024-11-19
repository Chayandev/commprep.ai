import mongoose,{Schema} from 'mongoose';

const vocabularyAssessmentSchema= new Schema({},{timestamps:true});

export const VocabularyAssessment=mongoose.model("VocabularyAssessment",vocabularyAssessmentSchema);