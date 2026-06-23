import { Button, Empty, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import TeamListTable from './TeamListTable';
import { useLineupStore } from '../store/lineupStore';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { getRandomLineup, lineups, fetchLineups } = useLineupStore();

  useEffect(() => {
    fetchLineups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRandomTeam = async () => {
    const randomTeamLineup = await getRandomLineup();
    if (randomTeamLineup) {
      navigate(`/guess/${randomTeamLineup.id}`);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 40 }}>Football Lineup Quizzer</h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <Button type='primary' size='large' onClick={() => navigate('/import-lineups')}>
          Import Real Lineups
        </Button>
        <Button
          type='default'
          size='large'
          onClick={handleRandomTeam}
          disabled={lineups.length === 0}
        >
          Random Team
        </Button>
      </div>

      <Card title='My Lineups' style={{ marginBottom: 24 }}>
        {lineups.length === 0 ? (
          <Empty description='No lineups yet' style={{ marginTop: 20 }} />
        ) : (
          <TeamListTable teams={lineups} />
        )}
      </Card>
    </div>
  );
};

export default Home;
