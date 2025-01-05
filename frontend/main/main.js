const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const mongoose = require('mongoose');
const Profile = require('../backend/domain/profile');

let mainWindow;
let profileRootPath = path.join(app.getPath('userData'), 'profiles'); // Đường dẫn mặc định cho profile

// Kết nối MongoDB
mongoose
  .connect('mongodb://localhost:27017/stlogin', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Tạo thư mục profiles nếu chưa tồn tại
if (!fs.existsSync(profileRootPath)) {
  fs.mkdirSync(profileRootPath);
}

// Hàm tạo cửa sổ chính của ứng dụng
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script cho phép giao tiếp giữa main và renderer
      nodeIntegration: false, // Tắt nodeIntegration để tăng bảo mật
      contextIsolation: true, // Bật contextIsolation để sử dụng contextBridge
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../build/index.html'));

  mainWindow.webContents.once('did-finish-load', () => {
    console.log('Main window loaded');
    mainWindow.webContents.openDevTools(); // Mở DevTools để debug
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Lắng nghe sự kiện chọn thư mục profile từ frontend
ipcMain.handle('select-profile-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (result.canceled) {
    return profileRootPath; // Nếu người dùng không chọn thì trả về đường dẫn mặc định
  }

  profileRootPath = result.filePaths[0];
  return profileRootPath;
});

// Lắng nghe sự kiện tạo profile từ frontend
ipcMain.handle('create-profile', async (event, profileData) => {
  try {
    const { name, note, userAgent } = profileData;
    const profilePath = path.join(profileRootPath, name);

    if (!fs.existsSync(profilePath)) {
      fs.mkdirSync(profilePath);
    }

    // Lưu thông tin profile dưới dạng file JSON trong thư mục đã chọn
    const profileInfo = { name, note, userAgent, createdAt: new Date() };
    fs.writeFileSync(
      path.join(profilePath, 'profile.json'),
      JSON.stringify(profileInfo, null, 2)
    );

    // Lưu vào MongoDB
    const newProfile = new Profile({
      name,
      note,
      userAgent,
      status: 'stopped',
      path: profilePath,
    });

    await newProfile.save();

    return { success: true, message: 'Profile created successfully', path: profilePath };
  } catch (error) {
    console.error('Error creating profile:', error);
    return { success: false, message: 'Failed to create profile' };
  }
});

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
