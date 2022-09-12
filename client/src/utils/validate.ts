type EnvVariable = {
	[key: string]: string;
};

type MetaConfig = {
	codeSnippet: string;
	name: string;
	accessKey: string;
	secretKey: string;
	bucketName: string;
	token: string;
	listener: string;
	region: string;
	listEnvVariables: EnvVariable[];
	description?: string | undefined;
};

export const validateMetaDeploy = () => {
	// TODO: need to check if configs not empty 
}


export const validateMetaDownload = () => {
	// TODO: need to check if configs not empty
}