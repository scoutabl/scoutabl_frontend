import Navbar from "@/components/Navbar";

const NavbarWrapper = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mt-25">{children}</div>
    </div>
  );
};

export default NavbarWrapper;
