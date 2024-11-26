import React from "react";
import Progress from "./Progress";

const ProfileCategoryCard = ({ category }) => {
  return (
    <div key={category.name} className="p-4">
      <div className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="text-sm font-medium">
          <category.icon className="inline-block mr-2" size={18} />
          {category.name}
        </div>
        <div className="text-sm font-bold">{category.progress}%</div>
      </div>
      <div>
        <Progress
          value={category.progress}
          className="mt-4 h-2 rounded-full"
          indicatorClassName="bg-black"
        />
      </div>
    </div>
  );
};

export default ProfileCategoryCard;
