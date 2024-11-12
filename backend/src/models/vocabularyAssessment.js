import mongoose,{Schema} from 'mongoose';

const vocabularyAssessmentSchema= new Schema({},{timestamps:true});

export const VocabularyAssesment=mongoose.model("VocabularyAssessment",vocabularyAssessmentSchema);