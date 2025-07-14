import React from "react";
import PropTypes from "prop-types";
import IconButton from "@/components/ui/icon-button";
import { useLocation } from "react-router-dom";

function isActiveRoute(itemRoute, currentPath) {
  if (itemRoute === "/") {
    return currentPath === "/";
  }
  return (
    currentPath === itemRoute ||
    currentPath.startsWith(itemRoute + "/")
  );
}

function Navbar({ logo, navItems, actions, logoOnClick }) {
  const location = useLocation();

  return (
    <nav className="fixed z-20 top-0 left-[110px] right-[110px] h-20 mt-4 flex items-center justify-between px-6 rounded-full bg-purplePrimary">
      {/* {Logo && (
        <Logo
          className="hover:cursor-pointer"
          onClick={logoOnClick}
        />
      )} */}
      {logo && logo}
      <div className="flex flex-row gap-10">
        {navItems && navItems.map((item) => (
          <IconButton
            key={item.name}
            iconSolid={item.iconSolid}
            iconOutline={item.iconOutline}
            label={item.name}
            active={isActiveRoute(item.route, location.pathname)}
            onClick={() => item.onClick && item.onClick()}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center gap-12">
        {actions}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  logo: PropTypes.elementType.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      iconSolid: PropTypes.elementType.isRequired,
      iconOutline: PropTypes.elementType.isRequired,
      route: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
  actions: PropTypes.node.isRequired,
  logoOnClick: PropTypes.func.isRequired,
};

export default Navbar;
