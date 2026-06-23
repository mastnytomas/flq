import { Button, Card, Select, Table, Alert, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/config';
import { useLineupStore } from '../store/lineupStore';
import { Squad } from '../types';

interface LineupData {
  team: string;
  opponent: string;
  formation: string;
  players: Record<string, string>;
}

const ImportLineups = () => {
  const navigate = useNavigate();
  const { createLineup } = useLineupStore();

  const [leagues, setLeagues] = useState<string[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('2024-25');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lineupData, setLineupData] = useState<LineupData[]>([]);
  const [importing, setImporting] = useState(false);

  const seasons = [
    { label: '2024-25', value: '2024-25' },
    { label: '2023-24', value: '2023-24' },
    { label: '2022-23', value: '2022-23' },
    { label: '2021-22', value: '2021-22' },
  ];

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.AVAILABLE_LEAGUES);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        setLeagues(result.data || []);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Chyba při načítání lig';
        setError(errorMsg);
        console.error('Fetch leagues error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const handleSearchLineups = async () => {
    if (!selectedLeague) {
      setError('Prosím vyberte ligu');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLineupData([]);

      const url = API_ENDPOINTS.TEAM_LINEUPS(selectedLeague, selectedSeason);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Nepodařilo se stáhnout lineups`);
      }

      const result = await response.json();
      const data = result.data || [];

      const formatted = data.map((lineup: any, idx: number) => ({
        key: idx,
        team: lineup.team || 'N/A',
        opponent: lineup.opponent || 'N/A',
        formation: lineup.formation || 'N/A',
        players: lineup.players || {},
        date: lineup.date || 'N/A',
      }));

      setLineupData(formatted);
      if (formatted.length === 0) {
        setError('Žádné lineups nenalezeny pro vybranou ligu a sezónu');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Chyba při načítání lineupů';
      setError(errorMsg);
      console.error('Fetch lineups error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImportLineup = async (lineup: LineupData) => {
    try {
      setImporting(true);

      const squadData: Omit<Squad, 'id'> = {
        name: lineup.team,
        coach: 'Imported from SoccerData',
        description: `Match against ${lineup.opponent}`,
        year: parseInt(selectedSeason.split('-')[0]),
        opponent: lineup.opponent,
        formation: lineup.formation,
        players: Object.entries(lineup.players).map(([pos, name], idx) => ({
          id: idx + 1,
          position: pos,
          name: name as string,
          guessed: false,
          correctChars: [],
          wrongChars: [],
        })),
        source: 'soccerdata',
      };

      await createLineup(squadData);
      message.success(`${lineup.team} byl úspěšně importován!`);

      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Chyba při importu';
      message.error(`Chyba: ${errorMsg}`);
      console.error('Import lineup error:', err);
    } finally {
      setImporting(false);
    }
  };

  const columns = [
    {
      title: 'Tým',
      dataIndex: 'team',
      key: 'team',
    },
    {
      title: 'Soupeř',
      dataIndex: 'opponent',
      key: 'opponent',
    },
    {
      title: 'Formace',
      dataIndex: 'formation',
      key: 'formation',
    },
    {
      title: 'Počet hráčů',
      key: 'playerCount',
      render: (_: any, record: LineupData) => Object.keys(record.players).length,
    },
    {
      title: 'Akce',
      key: 'action',
      render: (_: any, record: LineupData) => (
        <Button
          type='primary'
          size='small'
          onClick={() => handleImportLineup(record)}
          loading={importing}
        >
          Importovat
        </Button>
      ),
    },
  ];

  return (
    <div className='import-container' style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Button onClick={() => navigate('/')} style={{ marginBottom: 16 }} type='text'>
        ← Back
      </Button>

      <Card title='Importovat Real Lineups' bordered={false} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ minWidth: 250 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Liga</label>
            <Select
              placeholder='Vyberte ligu'
              value={selectedLeague || undefined}
              onChange={setSelectedLeague}
              options={leagues.map((league) => ({ label: league, value: league }))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ minWidth: 150 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Sezóna</label>
            <Select
              value={selectedSeason}
              onChange={setSelectedSeason}
              options={seasons}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button
              type='primary'
              onClick={handleSearchLineups}
              loading={loading}
              disabled={!selectedLeague}
            >
              Hledat Lineups
            </Button>
          </div>
        </div>

        {error && (
          <Alert
            message='Chyba'
            description={error}
            type='error'
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size='large' tip='Načítám lineups...' />
        </div>
      ) : (
        <Card title={`Dostupné Lineups (${lineupData.length})`} bordered={false}>
          {lineupData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={lineupData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>
              {selectedLeague
                ? 'Vyberte ligu a sezónu, pak klikněte "Hledat Lineups"'
                : 'Žádné lineups k zobrazení'}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ImportLineups;
