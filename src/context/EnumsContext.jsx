// src/context/EnumsContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { fetchEnums } from "@/api/monacoCodeApi";

const EnumsContext = createContext();

export const EnumsProvider = ({ children }) => {
  const [enums, setEnums] = useState(() => {
    const stored = localStorage.getItem('enums');
    return stored ? JSON.parse(stored) : null;
  });
  const [enumsLoading, setEnumsLoading] = useState(!enums);

  useEffect(() => {
    if (!enums) {
      setEnumsLoading(true);
      fetchEnums()
        .then(data => {
          setEnums(data);
          localStorage.setItem('enums', JSON.stringify(data));
        })
        .catch(() => setEnums(null))
        .finally(() => setEnumsLoading(false));
    }
  }, [enums]);

  return (
    <EnumsContext.Provider value={{ enums, enumsLoading }}>
      {children}
    </EnumsContext.Provider>
  );
};

export const useEnums = () => useContext(EnumsContext);