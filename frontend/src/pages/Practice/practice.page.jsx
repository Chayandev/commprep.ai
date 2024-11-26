import React, { Suspense, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { Mic, Headphones, MessageSquare, Book } from "lucide-react";
import Progress from "../../components/Progress";
import "../../App.css";
import LazyLoadingCard from "../../components/LazyLoadingCard";
import { getEachTotalAssessmentCount } from "../../../actions/user.actions";
import { calculateProgress } from "../../utils/formalCalculation";
const CategoryCard = React.lazy(() => import("../../components/CategoryCard"));


export default function Practice() {
  const user = useSelector((state) => state.auth.user);
  const { isProcessing, totalAssessmentCount } = useSelector(
    (state) => state.operation
  );
  const [progressPercentage, setProgressPercentage] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEachTotalAssessmentCount());
  }, [dispatch]);

  useMemo(() => {
    if (totalAssessmentCount && user?.progress) {
      const totalAssessments =
        (totalAssessmentCount.totalReadingAssessments || 0) +
        (totalAssessmentCount.totalListeningAssessments || 0) +
        (totalAssessmentCount.totalGrammarAssessments || 0) +
        (totalAssessmentCount.totalVocabularyAssessments || 0);

      const totalCompletedAssessments =
        (user.progress.reading?.assessments?.length || 0) +
        (user.progress.listening?.assessments?.length || 0) +
        (user.progress.grammar?.assessments?.length || 0) +
        (user.progress.vocabulary?.assessments?.length || 0);

      setProgressPercentage(
        totalAssessments
          ? Math.round((totalCompletedAssessments / totalAssessments) * 100)
          : 0
      );
    }
  }, [totalAssessmentCount, user]);

  const categories = [
    {
      name: "Reading",
      icon: Mic,
      description: "Boost comprehension through active reading skills.",
      progress: calculateProgress(
        user?.progress?.reading?.assessments?.length,
        totalAssessmentCount?.totalReadingAssessments
      ),
      color: "from-pink-500 to-rose-500",
      path: "reading",
    },
    {
      name: "Listening",
      icon: Headphones,
      description: "Sharpen listening to grasp spoken language quickly.",
      progress: calculateProgress(
        user?.progress?.listening?.assessments?.length,
        totalAssessmentCount?.totalListeningAssessments
      ),
      color: "from-purple-500 to-indigo-500",
      path: "listening",
    },
    {
      name: "Grammar",
      icon: MessageSquare,
      description: "Master rules for clear, effective communication.",
      progress: calculateProgress(
        user?.progress?.grammar?.assessments?.length,
        totalAssessmentCount?.totalGrammarAssessments
      ),
      color: "from-green-500 to-emerald-500",
      path: "grammar",
    },
    {
      name: "Vocabulary",
      icon: Book,
      description: "Expand your lexicon for richer conversations.",
      progress: calculateProgress(
        user?.progress?.vocabulary?.assessments?.length,
        totalAssessmentCount?.totalVocabularyAssessments
      ),
      color: "from-blue-500 to-cyan-500",
      path: "vocabulary",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        </div>
      )}
      <main className="w-[90%] lg:w-[80%] mx-auto py-6">
        <div className="relative px-4 py-6 sm:px-0">
          <div className="relative rounded-lg border border-gray-300/50 p-6 bg-white shadow-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center sm:text-left">
              Welcome back,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600">
                {user?.username}
              </span>
              !
            </h1>
            <p className="mt-2 text-lg text-gray-600 text-center sm:text-left">
              Ready to elevate your communication game?
            </p>
            <div className="flex justify-center sm:justify-start">
              <div className="mt-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105">
                Start Your Journey
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Progress
              </h2>
              <Progress
                value={progressPercentage || 0}
                className="mt-4 h-4 rounded-full bg-gray-200"
                indicatorClassName="bg-gradient-to-r from-teal-500 to-blue-600"
              />
              <p className="mt-2 text-lg text-gray-600">
                {progressPercentage || 0}% of goals achieved
              </p>
            </div>
            <div className="mt-12 grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <Suspense key={uuidv4()} fallback={<LazyLoadingCard />}>
                  <CategoryCard category={category} />
                </Suspense>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
