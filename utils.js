const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ICONS = {
	tray: {
		win32: 'Icon.ico',
		linux: 'IconTray.png',
		darwin: 'IconTray-black.png'
	},
	trayPressed: {
		darwin: 'IconTray-white.png'
	},
	trayNew: {
		win32: 'IconTray-new.ico',
		linux: 'IconTray-new.png',
		darwin: 'IconTray-blue.png'
	}
};

function sendAction(action) {
	const win = BrowserWindow.getAllWindows()[0];

	if (process.platform === 'darwin') {
		win.restore();
	}

	// Make sure to be shown
	win.show();

	win.webContents.send(action);
}

module.exports = {
  sendAction,
	ICONS
};
