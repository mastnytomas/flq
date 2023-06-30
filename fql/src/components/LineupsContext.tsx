import React, { createContext, useState, useEffect } from 'react';

interface LineupsContextProps {
  teamLineups: any[];
}

export const LineupsContext = createContext<LineupsContextProps>({
  teamLineups: [],
});

export const LineupsProvider: React.FC = ({ children }) => {
  const [teamLineups, setTeamLineups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/loadData');
        const data = await response.json();
        setTeamLineups(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Chyba při načítání dat:', error);
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
