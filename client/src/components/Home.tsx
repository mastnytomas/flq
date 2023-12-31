import { Button } from 'antd';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineupsContext } from './LineupsContext';
import TeamListTable from './TeamListTable';

const Home = () => {
  const navigate = useNavigate();
  const { teamLineups } = useContext(LineupsContext);
  const handleRandomTeam = () => {
    const randomTeamLineup = teamLineups[Math.floor(Math.random() * teamLineups.length)];
    navigate(`/guess/${randomTeamLineup.id}`);
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
