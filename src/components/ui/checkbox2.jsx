const Checkbox = ({ active }) => {
  return (
    <span className="w-5 h-5 flex items-center justify-center mr-2">
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-sm border-2 transition-colors duration-150 border-purplePrimary`}
      >
        {active && (
          <div className="h-full w-full bg-purplePrimary rounded-sm border-2 border-white"></div>
        )}
      </span>
    </span>
  );
};

export default Checkbox;
