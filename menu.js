'use strict';
const os = require('os');
const electron = require('electron');
const traverse = require('traverse');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const appName = app.getName();
const utils = require('./utils');
const appLauncher = require('./auto-launch');

const flattenMenuItem = (menu) => {
	return traverse(menu.items).reduce((acc, node) => {
		if (node instanceof electron.MenuItem) {
			if (node.type === 'submenu') {
				acc.push(node.submenu.items);
			} else {
				acc.push(node);
			}
		}
		return acc;
	}, []);
};

const findMenuItemById = (menu, id) => {
	if (typeof id === 'undefined') {
		return null;
	}
	return flattenMenuItem(menu).filter((menuItem) => menuItem.id === id).shift();
};

const disableMenuItem = (menuItem) => {
	menuItem.checked = menuItem.enabled = false;
	return menuItem;
};

const getMenuTemplate = (platform) => {
	let autoInitializerMenuItem = {
		id: 'auto-initializer',
		label: 'Abrir ao inicializar',
		type: 'checkbox',
		enabled: false,
		click() {
			let autoInitializer = findMenuItemById(menu, 'auto-initializer');
			let changePromise;

			if (autoInitializer.checked) {
				changePromise = appLauncher.enable();
			} else {
				changePromise = appLauncher.disable();
			}

			changePromise
				.catch(() => {
					disableMenuItem(autoInitializer);
				});
		}
	};

	const helpMenuTemplate = [
		{
			label: `Website ${appName}`,
			click() {
				shell.openExternal('http://farmamobile.com.br');
			}
		},
		{
			label: 'Reportar um Erro',
			click() {
				// Unfortunately we can't let it right indented
				// because the special characters (\t \s) will
				// be shown in e-mail body
				const body = `**Seja o mais detalhista possível ao descrever o erro.**

-

${app.getName()} ${app.getVersion()}
${platform} ${process.arch} ${os.release()}`;

				shell.openExternal(`mailto:contato@farmamobile.com.br?body=${encodeURIComponent(body)}`);
			}
		}
	];

	const darwinTemplate = [
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
					label: 'Desconectar',
					click() {
						utils.sendAction('log-out');
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
				autoInitializerMenuItem,
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
						utils.sendAction('show-notifications');
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
					label: 'Recarregar',
					accelerator: 'CmdOrCtrl+R',
					click() {
						utils.sendAction('reload');
					}
				},
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
			role: 'help',
			submenu: helpMenuTemplate
		}
	];

	const commonTemplate = [
		{
			label: 'Arquivo',
			submenu: [
				{
					label: 'Ver Notificações',
					accelerator: 'CmdOrCtrl+N',
					click() {
						utils.sendAction('show-notifications');
					}
				},
				autoInitializerMenuItem,
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
			label: 'Janela',
			submenu: [
				{
					label: 'Recarregar',
					accelerator: 'CmdOrCtrl+R',
					click() {
						utils.sendAction('reload');
					}
				}
			]
		},
		{
			label: 'Ajuda',
			role: 'help',
			submenu: helpMenuTemplate
		}
	];

	return (platform === 'darwin') ? darwinTemplate : commonTemplate;
};

let menu = electron.Menu.buildFromTemplate(getMenuTemplate(process.platform));

// Set `auto-initializer` menu item checkbox value
let autoInitializer = findMenuItemById(menu, 'auto-initializer');

appLauncher.isEnabled()
	.then((enabled) => {
		autoInitializer.enabled = true;
		autoInitializer.checked = enabled;
	})
	.catch(() => {
		disableMenuItem(autoInitializer);
	});

module.exports = menu;
