import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Checkbox, message } from 'antd';
import { createProfile } from '../services/createProfile';
import { updateProfile } from '../services/updateProfile';
import { getRandomUserAgent } from '../services/userAgentService';

function ProfileForm({ isModalVisible, setIsModalVisible, currentProfile, fetchProfiles }) {
  const [form] = Form.useForm();
  const [userAgent, setUserAgent] = useState('');
  const [useCustomUserAgent, setUseCustomUserAgent] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      form.setFieldsValue(currentProfile);
      setUserAgent(currentProfile.userAgent || '');
      setUseCustomUserAgent(!!currentProfile.userAgent);
    } else {
      form.resetFields(); // Reset form khi currentProfile là null
      setUserAgent('');
      setUseCustomUserAgent(false);
    }
  }, [currentProfile, form]);

  const handleRandomUserAgent = async () => {
    try {
      const { userAgent } = await getRandomUserAgent();
      setUserAgent(userAgent);
      message.success('Random User-Agent generated');
    } catch (error) {
      message.error('Failed to generate random User-Agent');
    }
  };

  const handleModalOk = async (values) => {
    try {
      const profileData = { 
        ...values, 
        userAgent: useCustomUserAgent ? userAgent : navigator.userAgent 
      };
  
      const result = await ipcRenderer.invoke('create-profile', profileData);
  
      if (result.success) {
        message.success(result.message);
      } else {
        message.error(result.message);
      }
  
      setIsModalVisible(false);
      fetchProfiles();
    } catch (error) {
      message.error('Failed to create profile');
    }
  };
  

  return (
    <Modal
      title={currentProfile ? 'Edit Profile' : 'Create Profile'}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      <Form form={form} onFinish={handleModalOk}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter profile name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="note" label="Note">
          <Input />
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={useCustomUserAgent}
            onChange={(e) => setUseCustomUserAgent(e.target.checked)}
          >
            Use Custom User-Agent
          </Checkbox>
        </Form.Item>
        {useCustomUserAgent && (
          <Form.Item label="User-Agent">
            <Input value={userAgent} readOnly />
            <Button type="primary" onClick={handleRandomUserAgent} style={{ marginTop: 8 }}>
              Random User-Agent
            </Button>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProfileForm;
