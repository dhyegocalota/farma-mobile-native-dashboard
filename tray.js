const path = require('path');
const electron = require('electron');
const utils = require('./utils');
const app = electron.app;
const iconPath = path.join(__dirname, 'media', utils.ICONS.tray[process.platform]);

module.exports = win => {
	const toggleWin = () => {
		if (win.isVisible()) {
			win.hide();
		} else {
			win.show();
		}
	};

	const tray = new electron.Tray(iconPath);

	const contextMenu = electron.Menu.buildFromTemplate([
		{
			label: 'Mostrar/Esconder',
			click() {
				toggleWin();
			}
		},
		{
			label: 'Ver Notificações',
			click() {
				utils.sendAction('show-notifications');
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Desconectar',
			click() {
				utils.sendAction('log-out');
			}
		},
		{
			label: 'Sair',
			click() {
				app.quit();
			}
		}
	]);

	tray.setToolTip(`${app.getName()}`);
	tray.setContextMenu(contextMenu);

	const pressedIcon = utils.ICONS.trayPressed[process.platform];

	if (pressedIcon) {
		tray.setPressedImage(path.join(__dirname, 'media', pressedIcon));
	}

	tray.on('clicked', toggleWin);

	return tray;
};
