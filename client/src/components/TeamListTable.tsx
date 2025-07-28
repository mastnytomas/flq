import { Table } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Squad } from '../types';
import { useLineupStore } from '../store/lineupStore';

interface Props {
  teams?: Squad[];
}

const TeamListTable: React.FC<Props> = ({ teams }) => {
  const { lineups, fetchLineups, loading } = useLineupStore();
  useEffect(() => {
    fetchLineups();
  }, [fetchLineups]);
  const navigate = useNavigate();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Guessing team',
      dataIndex: 'name',
      key: 'id',
      sorter: (a: Squad, b: Squad) => a.name.localeCompare(b.name),
    },
    {
      title: 'Opponent',
      dataIndex: 'opponent',
      key: 'id',
      sorter: (a: Squad, b: Squad) => a.opponent.localeCompare(b.opponent),
    },
    {
      title: 'Match description',
      dataIndex: 'description',
      key: 'id',
    },
    {
      title: 'Coach',
      dataIndex: 'coach',
      key: 'id',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'id',
      sorter: (a: Squad, b: Squad) => a.year - b.year,
    },
  ];

  const handleRowClick = (record: Squad) => {
    navigate(`/guess/${record.id}`);
  };

  return (
    <Table<Squad>
      style={{ maxWidth: '1280px', margin: 'auto' }}
      dataSource={teams || lineups}
      columns={columns}
      loading={loading}
      onRow={(record) => ({
        onClick: () => handleRowClick(record),
      })}
    />
  );
};

export default TeamListTable;
