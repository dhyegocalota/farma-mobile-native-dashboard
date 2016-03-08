'use strict';
const os = require('os');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const appName = app.getName();

function sendAction(action) {
	const win = BrowserWindow.getAllWindows()[0];

	if (process.platform === 'darwin') {
		win.restore();
	}

	win.webContents.send(action);
}

const darwinTpl = [
	{
		label: appName,
		submenu: [
			{
				label: `Sobre ${appName}`,
				role: 'about'
			},
			{
				type: 'separator'
			},
			{
				label: 'Deslogar',
				click() {
					sendAction('log-out');
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Serviços',
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				label: `Esconder ${appName}`,
				accelerator: 'Cmd+H',
				role: 'hide'
			},
			{
				label: 'Esconder Outros',
				accelerator: 'Cmd+Shift+H',
				role: 'hideothers'
			},
			{
				label: 'Mostrar Tudo',
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				label: `Sair ${appName}`,
				accelerator: 'Cmd+Q',
				click() {
					app.quit();
				}
			}
		]
	},
	{
		label: 'Arquivo',
		submenu: [
			{
				label: 'Ver Notificações',
				accelerator: 'CmdOrCtrl+N',
				click() {
					sendAction('show-notifications');
				}
			}
		]
	},
	{
		label: 'Editar',
		submenu: [
			{
				label: 'Desfazer',
				accelerator: 'CmdOrCtrl+Z',
				role: 'undo'
			},
			{
				label: 'Refazer',
				accelerator: 'Shift+CmdOrCtrl+Z',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label: 'Recortar',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: 'Copiar',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: 'Colar',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			},
			{
				label: 'Selecionar Tudo',
				accelerator: 'CmdOrCtrl+A',
				role: 'selectall'
			}
		]
	},
	{
		label: 'Janela',
		role: 'window',
		submenu: [
			{
				label: 'Minimizar',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Fechar',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				type: 'separator'
			},
			{
				label: 'Trazer Tudo para Frente',
				role: 'front'
			},

			// temp workaround for:
			// https://github.com/sindresorhus/caprine/issues/5
			{
				label: 'Tela Cheia',
				accelerator: 'Ctrl+Cmd+F',
				click() {
					const win = BrowserWindow.getAllWindows()[0];
					win.setFullScreen(!win.isFullScreen());
				}
			}
		]
	},
	{
		label: 'Ajuda',
		role: 'help'
	}
];

const linuxTpl = [
	{
		label: 'Arquivo',
		submenu: [
			{
				label: 'Ver Notificações',
				accelerator: 'CmdOrCtrl+N',
				click() {
					sendAction('show-notifications');
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Deslogar',
				click() {
					sendAction('log-out');
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Sair',
				click() {
					app.quit();
				}
			}
		]
	},
	{
		label: 'Editar',
		submenu: [
			{
				label: 'Recortar',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: 'Copiar',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: 'Colar',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			}
		]
	},
	{
		label: 'Ajuda',
		role: 'help'
	}
];

const helpSubmenu = [
	{
		label: `Website ${appName}...`,
		click() {
			shell.openExternal('http://farmamobile.com.br');
		}
	},
	{
		label: 'Reportar um Erro...',
		click() {
			const body = `
**Seja o mais detalhista possível ao descrever o erro.**

-

${app.getName()} ${app.getVersion()}
${process.platform} ${process.arch} ${os.release()}`;

			shell.openExternal(`mailto:contato@farmamobile.com.br?body=${encodeURIComponent(body)}`);
		}
	}
];

let tpl;
if (process.platform === 'darwin') {
	tpl = darwinTpl;
} else {
	tpl = linuxTpl;
}

tpl[tpl.length - 1].submenu = helpSubmenu;

module.exports = electron.Menu.buildFromTemplate(tpl);
