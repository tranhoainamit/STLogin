const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const profilesDir = path.join(app.getPath('userData'), 'profiles');

export const getProfiles = async () => {
  try {
    const files = fs.readdirSync(profilesDir);
    const profiles = files.map((file) => {
      const filePath = path.join(profilesDir, file);
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });
    console.log('Fetched profiles:', profiles);
    return profiles;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw new Error('Failed to fetch profiles');
  }
};
