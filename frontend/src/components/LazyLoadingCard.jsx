import React from "react";
import { Card, CardContent } from "@mui/material";
import { Loader2 } from "lucide-react";

const LazyLoadingCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};

export default LazyLoadingCard;
