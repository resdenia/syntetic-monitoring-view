import React, { FunctionComponent, useState } from 'react';

import Layout from '../../components/Layout';

import EditCodeContainer from '../../containers/EditCodeContainer';
import ButtonContainer from '../../containers/ButtonContainer';
import ExportDeploy from '../../containers/ExportDeployContainer';
import Error from '../../components/Error';

import api from '../../utils/api';
import { rangeTimeVariable } from '../../utils/selectOptions';
const defaultCode = `const playwright = require('playwright-aws-lambda');
const readSendData = require('./rsData');

const handler = async () => {
	let context = null;
	let browser = null;
	try {
	browser = await playwright.launchChromium(false);
	context = await browser.newContext({
		recordHar: {
			path: './capture-hars/example.har',
			mode: 'full',
			content: 'omit',
		},
    });
	const page = await context.newPage();
	//////////////////////////////////
	//// add your code from here ////
	///////////////////////////////////
					
	///////////////////////////////////
	//// add your code to here ////
	//////////////////////////////////
				
	} catch (error) {
		throw error;
	} finally {
		if (browser) {
			await context.close();
			await browser.close();
		}
	}
	
	readSendData();
	return true;
};`;

type Meta = {
    field: string;
    value: string;
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

type EnvVariable = {
    [key: string]: string;
};
interface CustomResponse {
    zip?: string;
    error?: boolean;
    errorMessage?: string;
}
const Home: FunctionComponent = () => {
    const [activeRangeTime, setActiveRangeTime] = useState<string>('1 minute');
    const [methodTest, setMethodTest] = useState<string>('Cloud');
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [codeSnippet, setCodeSnippet] = useState<string>(defaultCode);
    const [activeStep, setActiveStep] = useState<string>('edit_code');

    const [envList, setEnvList] = useState<EnvVariable[]>([]);
    const [configs, setConfigs] = useState<MetaConfig>({
        codeSnippet: '',
        name: '',
        accessKey: '',
        secretKey: '',
        bucketName: '',
        token: '',
        listener: '',
        region: '',
        listEnvVariables: [],
        description: '',
    });

    const [activeCloudProvider, setActiveCloudProvider] =
        useState<string>('AWS');
    const onChangeStepHandler = async (activeStep: string) => {
        setActiveStep(activeStep);
        let response: any;
        if (activeStep === 'download') {
            response = await api.downloadCFTemplate(
                codeSnippet,
                envList,
                configs.name,
                rangeTimeVariable[
                    activeRangeTime.split(' ').reverse().join('_')
                ],
                configs.bucketName,
                configs.token,
                configs.listener,
                configs.description,
            );
        }
        if (activeStep === 'cloud') {
            response = await api.initPage(
                rangeTimeVariable[
                    activeRangeTime.split(' ').reverse().join('_')
                ],
                codeSnippet,
                configs.name,
                configs.accessKey,
                configs.secretKey,
                configs.bucketName,
                configs.token,
                configs.listener,
                configs.region,
                envList,
                configs.description,
            );
        }

        if (activeStep === 'cloud' || activeStep === 'download') {
            if (response!.error) {
                setErrorMessage(response.errorData);
                setIsError(true);
                setTimeout(() => {
                    setIsError(false);
                    setErrorMessage('');
                }, 10000);
            }
        }
    };

    const onChangeCloudProviderHandler = (option: string) => {
        setActiveCloudProvider(option);
    };

    const updateMetaHandler = (data: Meta) => {
        setConfigs({ ...configs, ...{ [data.field]: data.value } });
    };

    const updateRangeTimeHandler = (option: string) => {
        setActiveRangeTime(option);
    };

    const onChangeMethodTestHandler = (option: string) => {
        setMethodTest(option);
    };

    const onSetCodeSnippetHandler = (val: string) => {
        setCodeSnippet(val);
    };
    const onSetEnvVariableHandler = (listEnv: EnvVariable[]) => {
        setEnvList(listEnv);
    };

    return (
        <Layout activeStep={activeStep}>
            {activeStep === 'edit_code' ? (
                <EditCodeContainer
                    codeSnippet={codeSnippet}
                    setCodeSnippet={onSetCodeSnippetHandler}
                    setEnvVariable={onSetEnvVariableHandler}
                />
            ) : (
                <ExportDeploy
                    methodTest={methodTest}
                    activeRangeTime={activeRangeTime}
                    activeCloudProvider={activeCloudProvider}
                    onChangeMethodTest={onChangeMethodTestHandler}
                    onChangeRangeTime={updateRangeTimeHandler}
                    onChangeCloudProvider={onChangeCloudProviderHandler}
                    updateMeta={updateMetaHandler}
                />
            )}
            <ButtonContainer
                methodTest={methodTest}
                activeStep={activeStep}
                onChangeStep={onChangeStepHandler}
            />
            {isError ? <Error>{errorMessage}</Error> : ''}
        </Layout>
    );
};

export default Home;
