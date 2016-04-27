'use strict';
const ipc = require('electron').ipcRenderer;

ipc.on('reload', () => {
	window.location.reload();
});

ipc.on('show-notifications', () => {
	document.querySelector('button.toolbar-button').click();
});

ipc.on('log-out', () => {
	// create the menu for the below
	document.querySelector('md-toolbar md-menu:last-child button').click();

	document.querySelector('.md-open-menu-container md-menu-item:last-child button').click();
});
