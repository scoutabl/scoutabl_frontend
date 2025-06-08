// src/context/EnumsContext.jsx
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEnums } from "@/api/monacoCodeApi";

const EnumsContext = createContext();

export const EnumsProvider = ({ children }) => {
  const { data: enums, isLoading } = useQuery({
    queryKey: ["enums"],
    queryFn: fetchEnums,
    staleTime: Infinity,
  });

  return (
    <EnumsContext.Provider value={{ enums, enumsLoading: isLoading }}>
      {children}
    </EnumsContext.Provider>
  );
};

export const useEnums = () => useContext(EnumsContext);