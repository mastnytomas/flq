import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import TeamListTable from './TeamListTable';
import { useLineupStore } from '../store/lineupStore';

const Home = () => {
  const navigate = useNavigate();
  const { getRandomLineup, lineups } = useLineupStore();
  const handleRandomTeam = async () => {
    const randomTeamLineup = await getRandomLineup();
    if (randomTeamLineup) {
      navigate(`/guess/${randomTeamLineup.id}`);
    }
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
        <TeamListTable teams={lineups} />
      </div>
    </div>
  );
};

export default Home;
