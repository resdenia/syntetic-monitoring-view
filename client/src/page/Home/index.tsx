import React, { FunctionComponent, useState } from 'react';

import Layout from '../../components/Layout';

import styled from 'styled-components';
import EditCodeContainer from '../../containers/EditCodeContainer';
import ButtonContainer from '../../containers/ButtonContainer';
import ExportDeploy from '../../containers/ExportDeploy';
const defaultCode = '';

type Meta = {
    field: string;
    value: string;
};

const Home: FunctionComponent = () => {
    const [activeRangeTime, setActiveRangeTime] = useState<string>('1 minute');
    const [methodTest, setMethodTest] = useState<string>('Cloud');
    const [codeSnippet, setCodeSnippet] = useState<string>(defaultCode);
    const [activeStep, setActiveStep] = useState<string>('edit_code');
    const [activeCloudProvider, setActiveCloudProvider] =
        useState<string>('AWS');
    const onChangeStepHandler = (activeStep: string) => {
        setActiveStep(activeStep);
    };

    const onChangeCloudProviderHandler = (option: string) => {
        setActiveCloudProvider(option);
    };

    const updateMetaHandler = (data: Meta) => {
        console.log('data', data);
    };

    const updateRangeTimeHandler = (option: string) => {
        setActiveRangeTime(option);
    };

    const onChangeMethodTestHandler = (option: string) => {
        setMethodTest(option);
    };

    return (
        <Layout activeStep={activeStep}>
            {activeStep === 'edit_code' ? (
                <EditCodeContainer />
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
        </Layout>
    );
};

export default Home;
