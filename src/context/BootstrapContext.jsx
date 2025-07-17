import { useOrganisation } from "@/api/organisation/organisation";
import { createContext, useContext, useState, useEffect } from "react";

const BootstrapContext = createContext();

/**
 * Provides common user/organisation related data
 */
export const BootstrapProvider = ({ children }) => {
  // TODO: Move user fetch and enums fetch to this provider.
  const { data: organisation } = useOrganisation();

  return (
    <BootstrapContext.Provider value={{ organisation }}>
      {children}
    </BootstrapContext.Provider>
  );
};
