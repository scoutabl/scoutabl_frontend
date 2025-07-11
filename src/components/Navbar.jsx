import React from "react";
import LogoIcon from "@/assets/logoFull.svg?react";
import IconButton from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib/routes";
import RocketIcon from "@/assets/rocketIcon.svg?react";
import RocketFillIcon from "@/assets/rocketFillIcon.svg?react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed z-20 top-0 left-[110px] right-[110px] h-20 mt-4 flex items-center justify-between px-6 rounded-full bg-purplePrimary">
      <LogoIcon
        className="hover:cursor-pointer"
        onClick={() => navigate(ROUTES.ROOT)}
      />
      <div className="flex flex-row gap-10">
        <IconButton
          iconSolid={RocketFillIcon}
          iconOutline={RocketIcon}
          label="Assessments"
          active
        />
        <IconButton
          iconSolid={RocketFillIcon}
          iconOutline={RocketIcon}
          label="Assessments"
        />
        <IconButton
          iconSolid={RocketFillIcon}
          iconOutline={RocketIcon}
          label="Assessments"
        />
        <IconButton
          iconSolid={RocketFillIcon}
          iconOutline={RocketIcon}
          label="Assessments"
        />
      </div>
      <div className="flex flex-row flex-wrap items-center gap-12">
        <Avatar className="border border-white border-2 hover:cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

export default Navbar;
