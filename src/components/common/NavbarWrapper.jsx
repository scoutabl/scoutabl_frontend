import Navbar from "@/components/Navbar";
import LogoIcon from "@/assets/logoFull.svg?react";
import RocketIcon from "@/assets/rocketIcon.svg?react";
import RocketSolidIcon from "@/assets/rocketSolidIcon.svg?react";
import CommunityIcon from "@/assets/communityIcon.svg?react";
import CommunitySolidIcon from "@/assets/communitySolidIcon.svg?react";
import WorldIcon from "@/assets/worldIcon.svg?react";
import WorldSolidIcon from "@/assets/worldSolidIcon.svg?react";
import BookIcon from "@/assets/bookIcon.svg?react";
import BookSolidIcon from "@/assets/bookSolidIcon.svg?react";
import { ROUTES } from "@/lib/routes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

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

const Actions = (
  <Avatar className="border border-white border-2 hover:cursor-pointer size-11">
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);

const NavbarWrapper = ({ children }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <Navbar
        logo={<LogoIcon />}
        navItems={NAV_ITEMS}
        actions={Actions}
        logoOnClick={() => navigate(ROUTES.ROOT)}
      />
      <div className="mt-31 mx-[116px]">{children}</div>
    </div>
  );
};

export default NavbarWrapper;
