const path = require('path');
const electron = require('electron');
const utils = require('./utils');
const app = electron.app;
const iconPath = path.join(__dirname, 'media', utils.ICONS.tray[process.platform]);

var tray;
var win;

const toggleWin = () => {
	if (!win) {
		return;
	}

	if (win.isVisible()) {
		win.hide();
	} else {
		win.show();
	}
};

const defaultContextMenu = electron.Menu.buildFromTemplate([
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

const create = (_win_) => {
	if (tray) {
		return tray;
	}

	win = _win_;
	tray = new electron.Tray(iconPath);

	tray.setToolTip(`${app.getName()}`);
	updateContextMenu();

	const pressedIcon = utils.ICONS.trayPressed[process.platform];

	if (pressedIcon) {
		tray.setPressedImage(path.join(__dirname, 'media', pressedIcon));
	}

	tray.on('clicked', toggleWin);

	return tray;
};

const updateContextMenu = (menu) => {
	if (tray) {
		tray.setContextMenu(menu || defaultContextMenu);
	}
};

const setImage = (icon) => {
	if (tray) {
		tray.setImage(icon);
		updateContextMenu();
	}
};

module.exports = {
	create,
	updateContextMenu,
	defaultContextMenu,
	setImage
};
