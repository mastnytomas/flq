import React, { createContext, useEffect, useState } from 'react';
import { Squad } from '../config/config';

export interface LineupsContextProps {
  teamLineups: Squad[];
}

export const LineupsContext = createContext<LineupsContextProps>({
  teamLineups: [],
});

export interface Props {
  children: React.ReactNode;
}
export const LineupsProvider: React.FC<Props> = ({ children }) => {
  const [teamLineups, setTeamLineups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://flq-server.vercel.app/loadData');
        const data = await response.json();
        setTeamLineups(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <LineupsContext.Provider value={{ teamLineups }}>{children}</LineupsContext.Provider>;
};
