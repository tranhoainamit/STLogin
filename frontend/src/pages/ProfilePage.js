import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import ProfileForm from '../components/ProfileForm';
import ProfileList from '../components/ProfileList';
const { getProfiles } = require('../services/getProfiles');


function ProfilePage() {
  const [profiles, setProfiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);

  // Hàm lấy danh sách profiles
  const fetchProfiles = async () => {
    try {
      const data = await getProfiles();
      setProfiles(data);
      console.log('Fetched profiles:', data);
    } catch (error) {
      message.error('Failed to fetch profiles');
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Hàm xử lý khi bấm vào nút Edit
  const handleEdit = (record) => {
    setCurrentProfile(record); // Đặt profile cần chỉnh sửa vào state
    setIsModalVisible(true);   // Hiển thị modal
  };

  // Hàm xử lý khi bấm vào nút Create
  const handleCreate = () => {
    setCurrentProfile(null);   // Đặt currentProfile về null để tạo mới
    setIsModalVisible(true);   // Hiển thị modal
  };

  return (
    <div>
      <Button type="primary" onClick={handleCreate}>
        Create Profile
      </Button>
      <ProfileList profiles={profiles} handleEdit={handleEdit} fetchProfiles={fetchProfiles} />
      <ProfileForm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        currentProfile={currentProfile}
        fetchProfiles={fetchProfiles}
      />
    </div>
  );
}

export default ProfilePage;
