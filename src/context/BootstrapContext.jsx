import { useOrganisation } from "@/api/organisation/organisation";
import { createContext, useContext, useState, useEffect } from "react";

const BootstrapContext = createContext();

/**
 * Provides common user/organisation related data
 */
export const BootstrapProvider = ({ children }) => {
  // TODO: Move user fetch and enums fetch to this provider.
  const { data: organisation } = useOrganisation();
  const { libraries } = organisation || {};
  const platformLibraryId = libraries?.find(
    (l) => l.platform === true
  )?.library;
  const organisationLibraryId = libraries?.find(
    (l) => l.template === true
  )?.library;
//   console.log(
//     "--libs",
//     libraries,
//     organisation,
//     paltformLibraryId,
//     organisationLibraryId
//   );

  return (
    <BootstrapContext.Provider
      value={{ organisation, platformLibraryId, organisationLibraryId }}
    >
      {children}
    </BootstrapContext.Provider>
  );
};

export const useBootstrap = () => {
  const context = useContext(BootstrapContext);
  if (!context) {
    throw new Error("useBootstrap must be used within a BootstrapProvider");
  }
  return context;
};
