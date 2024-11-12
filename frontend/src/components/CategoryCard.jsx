import React, { useEffect } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Progress from "./Progress";

const CategoryCard = ({ category }) => {
  return (
    <Card
      sx={{
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 6,
          transform: "scale(1.05)",
        },
      }}
      className="overflow-hidden transition-all duration-200 hover:shadow-xl hover:scale-105"
    >
      <CardHeader
        className={`bg-gradient-to-r ${category.color} text-white`}
        title={
          <Typography
            variant="h5"
            style={{ fontWeight: 600 }}
            className="flex items-center gap-2 text-white"
          >
            <category.icon className="h-6 w-6" />
            {category.name}
          </Typography>
        }
      />
      <CardContent className="pt-4">
        <Typography className="text-gray-600 mb-4">
          {category.description}
        </Typography>
        <Progress
          value={category.progress || 0}
          className="h-2 my-4 rounded-full bg-gray-200"
          indicatorClassName={`bg-gradient-to-r ${category.color}`}
        />
        <p className="mt-2 text-sm text-gray-600">
          {category.progress}% complete
        </p>
        <Link
          to={`/practice/${category.path}`}
          style={{ textDecoration: "none" }}
        >
          <button
            className={`mt-4 w-full bg-gradient-to-r ${category.color} text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-105`}
          >
            Practice {category.name}
          </button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
