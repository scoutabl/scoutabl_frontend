const Chip = ({ children, className = "", ...rest }) => {
  return (
    <span
      className={`block px-3 py-1 mt-auto rounded-md text-sm text-greyPrimary bg-[#F5F5F5] whitespace-nowrap ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Chip;
