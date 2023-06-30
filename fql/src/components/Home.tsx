import { useContext } from 'react';
import { Button } from 'antd';
import TeamListTable from './TeamListTable';
import { LineupsContext } from './LineupsContext';

const Home = () => {
  const { teamLineups } = useContext(LineupsContext);
  console.log(teamLineups);
  const handleRandomTeam = () => {
    const randomTeamLineup = teamLineups[Math.floor(Math.random() * teamLineups.length)];
    window.location.href = `/guess/${randomTeamLineup.id}`;
  };
  return (
    <div>
      <h1>Football Lineup Quizzer</h1>
      <h2>Guess Lineup</h2>
      <div>
        <p>Please select a team:</p>
        <a href='/create'>
          <Button>Create</Button>
        </a>
        <Button onClick={handleRandomTeam}>Random Team</Button>
        <TeamListTable teams={teamLineups} />
      </div>
    </div>
  );
};

export default Home;
