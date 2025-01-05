import React, { useState } from 'react';
import { Table, Button, message } from 'antd';
import { deleteProfile } from '../services/deleteProfile';
import axios from 'axios';

function ProfileList({ profiles, handleEdit, fetchProfiles }) {
  const [runningProfiles, setRunningProfiles] = useState({}); // Lưu trạng thái các profile đang chạy

  const handleDelete = async (id) => {
    try {
      await deleteProfile(id);
      message.success('Profile deleted successfully');
      fetchProfiles();
    } catch (error) {
      message.error('Failed to delete profile');
    }
  };

  const handleStart = async (name) => {
    try {
      await axios.post(`http://localhost:4000/api/profiles/${name}/start`);
      setRunningProfiles((prev) => ({ ...prev, [name]: true }));
      message.success('Profile started successfully');
    } catch (error) {
      message.error('Failed to start profile');
    }
  };

  const handleStop = async (name) => {
    try {
      await axios.post(`http://localhost:4000/api/profiles/${name}/stop`);
      setRunningProfiles((prev) => ({ ...prev, [name]: false }));
      message.success('Profile stopped successfully');
    } catch (error) {
      message.error('Failed to stop profile');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
          {runningProfiles[record.name] ? (
            <Button
              type="primary"
              danger
              onClick={() => handleStop(record.name)}
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              Stop
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => handleStart(record.name)}
              style={{ backgroundColor: 'green', color: 'white' }}
            >
              Start
            </Button>
          )}
        </span>
      ),
    },
  ];

  return <Table columns={columns} dataSource={profiles} rowKey="_id" style={{ marginTop: 20 }} />;
}

export default ProfileList;
