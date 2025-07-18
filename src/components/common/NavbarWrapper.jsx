import Navbar from "@/components/Navbar";
import LogoIcon from "@/assets/logoFull.svg?react";
import RocketIcon from "@/assets/rocketIcon.svg?react";
import RocketSolidIcon from "@/assets/rocketSolidIcon.svg?react";
import WorldIcon from "@/assets/worldIcon.svg?react";
import WorldSolidIcon from "@/assets/worldSolidIcon.svg?react";
import BookIcon from "@/assets/bookIcon.svg?react";
import BookSolidIcon from "@/assets/bookSolidIcon.svg?react";
import { ROUTES } from "@/lib/routes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UserAvatarBadge from "./UserAvatarBadge";

const NAV_ITEMS = [
  {
    name: "Assessments",
    iconSolid: <RocketSolidIcon className="size-5" />,
    iconOutline: <RocketIcon className="size-5" />,
    route: ROUTES.ASSESSMENT,
  },
  {
    name: "Talent Pool",
    iconSolid: <WorldSolidIcon className="size-5" />,
    iconOutline: <WorldIcon className="size-5" />,
    route: ROUTES.TALENT_POOL,
  },
  {
    name: "Test Library",
    iconSolid: <BookSolidIcon className="size-5" />,
    iconOutline: <BookIcon className="size-5" />,
    route: ROUTES.TEST_LIBRARY,
  },
];

const NavbarWrapper = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <Navbar
        logo={<LogoIcon />}
        navItems={NAV_ITEMS}
        actions={
          <UserAvatarBadge
            user={user}
            iconClassName="border border-white border-2 hover:cursor-pointer size-11"
            iconOnly
          />
        }
        logoOnClick={() => navigate(ROUTES.ROOT)}
      />
      <div className="mt-31 mx-[116px]">{children}</div>
    </div>
  );
};

export default NavbarWrapper;
