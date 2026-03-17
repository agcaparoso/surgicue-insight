import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserData {
  name: string;
  role: 'resident' | 'educator' | '';
  program: string;
  year: string;
  specialty: string;
  attending: string;
  institution: string;
  department: string;
  numTrainees: string;
  educatorRole: string;
  selectedProcedures: string[];
}

const defaultUser: UserData = {
  name: '',
  role: '',
  program: '',
  year: '',
  specialty: '',
  attending: '',
  institution: '',
  department: '',
  numTrainees: '',
  educatorRole: '',
  selectedProcedures: [],
};

interface UserContextType {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
}

const UserContext = createContext<UserContextType>({ user: defaultUser, setUser: () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData>(defaultUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
