export const availableCodeLanguages = [
	{ name: 'Playwright', default: true, isDisabled: false },
	{ name: 'Selenium', default: false, isDisabled: true },
	{ name: 'Pupeeter', default: false, isDisabled: true },
];

export const availableCloudProviders = [
	{ name: 'AWS', default: true, isDisabled: false },
	{ name: 'Azure', default: false, isDisabled: true },
	{ name: 'Google Cloud', default: false, isDisabled: true },
];

export const availableTimeRange = [
	{ name: '1 minute', default: true, isDisabled: false },
	{ name: '2 minutes', default: false, isDisabled: true },
	{ name: '3 minutes', default: false, isDisabled: true },
	{ name: '5 minutes', default: false, isDisabled: true },
	{ name: '15 minutes', default: false, isDisabled: true },
	{ name: '60 minutes', default: false, isDisabled: true },

];
export const availableMethod = [
	{ name: 'Cloud' },
	{ name: 'Locally' }
]