// src/context/EnumsContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { fetchEnums } from "@/api/monacoCodeApi";

const EnumsContext = createContext();

export const EnumsProvider = ({ children }) => {
  const [enums, setEnums] = useState(null);
  const [enumsLoading, setEnumsLoading] = useState(false);

  const resolveEnum = useCallback(
    (enumName) => {
      if (enumsLoading) return null;
      const [type, value] = enumName.split(".");
      console.debug("type", type, "value", value);
      if (!type || !value) throw new Error(`Invalid enum name: ${enumName}`);
      return enums.enums[type][value];
    },
    [enumsLoading]
  );

  useEffect(() => {
    if (!enums && !enumsLoading) {
      setEnumsLoading(true);
      fetchEnums()
        .then((data) => {
          console.debug("data", data);
          setEnums(data);
        })
        .catch(console.error)
        .finally(() => setEnumsLoading(false));
    }
  }, [enums]);

  return (
    <EnumsContext.Provider value={{ enums, enumsLoading, resolveEnum }}>
      {children}
    </EnumsContext.Provider>
  );
};

export const useEnums = () => useContext(EnumsContext);
