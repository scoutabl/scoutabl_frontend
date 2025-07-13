import Navbar from "@/components/Navbar";

const NavbarWrapper = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mt-31 mx-[116px]">{children}</div>
    </div>
  );
};

export default NavbarWrapper;
