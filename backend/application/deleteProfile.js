const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const profilesDir = path.join(app.getPath('userData'), 'profiles');

export const deleteProfile = async (profileName) => {
  try {
    const profilePath = path.join(profilesDir, `${profileName}.json`);
    if (fs.existsSync(profilePath)) {
      fs.unlinkSync(profilePath);
      console.log('Profile deleted:', profileName);
      return { message: 'Profile deleted successfully' };
    } else {
      throw new Error('Profile not found');
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw new Error('Failed to delete profile');
  }
};
