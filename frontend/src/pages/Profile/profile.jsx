import React from "react";
import ComingSoon from "../../components/CommingSoon";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { Badge, Edit } from "lucide-react";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <main className="w-[90%] lg:w-[80%] mx-auto py-6">
        <div className="w-full overflow-hidden border border-gray-300 rounded-md">
          <div className="h-32 bg-gradient-to-r from-[#02ccc2] to-[#0f6284]" />
          <div className="relative pt-16 pb-8 px-6">
            <Avatar className="absolute -top-16 left-6 h-32 w-32 border-4 border-white">
              <img
                src={user?.avatar}
                alt="image"
                width={128}
                height={128}
                className="w-full h-full object-fill rounded-full"
              />
              {/* <AvatarImage
                src="/placeholder.svg?height=128&width=128"
                alt="User"
              /> */}
            </Avatar>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{user?.fullname}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="flex space-x-2 mt-2">
                  {/* <Badge variant="secondary">Premium Member</Badge> */}
                  <Badge
                    variant="secondary"
                    className="bg-green-500 text-white"
                  >
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Joined: July 1, 2023
                </p>
              </div>
              <button size="icon" variant="ghost">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
