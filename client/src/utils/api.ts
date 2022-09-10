const BASE_URL = 'http://localhost:8080';



const settings = {
	notificationLoaded: '.loaded',
	notificationFailed: '.loaded-fail',
	statusName: {
		functionCreated: 'Function Created',
		zipCreated: 'Zip Created',
		zipUploaded: 'Zip Uploaded',
		lambdaCreated: 'Lambda Created',
		rangeTimeAdded: 'Range time added',
	},
	endPointUrls: {
		modifyFileUrl: '/api/modify-file',
		createZipUrl: '/api/create-zip',
		uploadZipUrl: '/api/uploadZip',
		createLambdaUrl: '/api/create-lambda',
		addEventBridgeUrl: '/api/add-eventbridge',
		modifyFileLocalUrl: '/api/modify-file-local',
		createCfZip: '/api/create-cf-zip',
	},
};


class Api {
	constructor() {

	}


	customFetch = async (bodyToSend: object, url: string) => {
		return await fetch(`${BASE_URL}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			...(Object.keys(bodyToSend).length > 0
				? { body: JSON.stringify(bodyToSend) }
				: {}),
		})
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.catch((err) => {
				console.log(err);
				//display error
				return err.json();
			});
	};
}

export default Api;