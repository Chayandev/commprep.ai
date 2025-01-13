import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Book,
  Edit,
  Headphones,
  MessageSquare,
  Mic,
  Speech,
} from "lucide-react";
import { calculateProgress, formatDate } from "../../utils/formalCalculation";
import { getEachTotalAssessmentCount } from "../../../actions/user.actions";
import { v4 as uuidv4 } from "uuid";
import ShimmerCard from "../../components/ShimmerCard";
import { Typography } from "@mui/material";

const cloudinaryBaseImaegUrl = import.meta.env
  .VITE_CLOUDINARY_IMAGE_FOLDER_BASE_URL;
const CategoryCard = React.lazy(() =>
  import("../../components/ProfileCategoryCard")
);

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  console.log(user);
  const { isProcessing, totalAssessmentCount } = useSelector(
    (state) => state.operation
  );
  useEffect(() => {
    dispatch(getEachTotalAssessmentCount());
  }, [dispatch]);
  const categories = [
    {
      name: "Reading",
      icon: Mic,
      progress: calculateProgress(
        user?.progress?.reading?.assessments?.length,
        totalAssessmentCount?.totalReadingAssessments
      ),
      path: "reading",
    },
    {
      name: "Listening",
      icon: Headphones,

      progress: calculateProgress(
        user?.progress?.listening?.assessments?.length,
        totalAssessmentCount?.totalListeningAssessments
      ),
      path: "listening",
    },
    {
      name: "Grammar",
      icon: MessageSquare,

      progress: calculateProgress(
        user?.progress?.grammar?.assessments?.length,
        totalAssessmentCount?.totalGrammarAssessments
      ),
      path: "grammar",
    },
    {
      name: "Vocabulary",
      icon: Book,

      progress: calculateProgress(
        user?.progress?.vocabulary?.assessments?.length,
        totalAssessmentCount?.totalVocabularyAssessments
      ),

      path: "vocabulary",
    },
    {
      name: "Speaking",
      icon: Speech,

      progress: calculateProgress(
        user?.progress?.speaking?.assessments?.length,
        totalAssessmentCount?.totalSpeakingAssessments
      ),

      path: "speaking",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <main className="w-[90%] lg:w-[80%] mx-auto py-6">
        <div className="w-full overflow-hidden border border-gray-300 rounded-md">
          <div className="h-32 bg-gradient-to-r from-[#02ccc2] to-[#0f6284]" />
          <div className="relative pt-16 pb-8 px-6">
            <div className="absolute -top-16 left-6 h-32 w-32 rounded-full border-4 border-white">
              <div className="bg-gray-300 w-full h-full rounded-full object-fill">
                <img
                  src={`${cloudinaryBaseImaegUrl}${user?.avatar}.webp`}
                  alt="User"
                  className="w-full h-full rounded-full object-fill"
                />
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{user?.fullname}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="flex space-x-2 mt-2">
                  <div className="bg-green-500 text-white font-semibold text-sm rounded-full px-3 py-0.5">
                    Active
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {`Joined: ${formatDate(user?.createdAt)}`}
                </p>
              </div>
              <button size="icon" variant="ghost">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full overflow-hidden border py-6 px-2 border-gray-300 rounded-md mt-6 flex flex-col justify-evenly">
          <Typography
            variant="h5"
            style={{ fontWeight: "bold" }}
            className="px-6 font-semibold"
          >
            Progress Overview
          </Typography>
          {categories.map((category) => (
            <Suspense key={uuidv4()} fallback={<ShimmerCard />}>
              {isProcessing ? (
                <ShimmerCard />
              ) : (
                <CategoryCard category={category} />
              )}
            </Suspense>
          ))}
        </div>
      </main>
    </div>
  );
}
