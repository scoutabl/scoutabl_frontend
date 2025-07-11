import React from "react";
import LogoIcon from "@/assets/logoFull.svg?react";
import IconButton from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../lib/routes";
import RocketIcon from "@/assets/rocketIcon.svg?react";
import RocketSolidIcon from "@/assets/rocketSolidIcon.svg?react";
import CommunityIcon from "@/assets/communityIcon.svg?react";
import CommunitySolidIcon from "@/assets/communitySolidIcon.svg?react";
import WorldIcon from "@/assets/worldIcon.svg?react";
import WorldSolidIcon from "@/assets/worldSolidIcon.svg?react";
import BookIcon from "@/assets/bookIcon.svg?react";
import BookSolidIcon from "@/assets/bookSolidIcon.svg?react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const NAV_ITEMS = [
  {
    name: "Assessments",
    iconSolid: RocketSolidIcon,
    iconOutline: RocketIcon,
    route: ROUTES.ASSESSMENT,
  },
  {
    name: "Talent Pool",
    iconSolid: WorldSolidIcon,
    iconOutline: WorldIcon,
    route: ROUTES.TALENT_POOL,
  },
  {
    name: "Test Library",
    iconSolid: BookSolidIcon,
    iconOutline: BookIcon,
    route: ROUTES.TEST_LIBRARY,
  },
];

function isActiveRoute(itemRoute, currentPath) {
  if (itemRoute === "/") {
    return currentPath === "/";
  }
  return (
    currentPath === itemRoute ||
    currentPath.startsWith(itemRoute + "/")
  );
}

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        {NAV_ITEMS.map((item) => (
          <IconButton
            key={item.name}
            iconSolid={item.iconSolid}
            iconOutline={item.iconOutline}
            label={item.name}
            active={isActiveRoute(item.route, location.pathname)}
            onClick={() => navigate(item.route)}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center gap-12">
        <Avatar className="border border-white border-2 hover:cursor-pointer size-11">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

export default Navbar;
