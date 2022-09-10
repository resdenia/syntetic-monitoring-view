import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import Container from '../../components/Container';

import CodeEditor from '../../components/CodeEditor';
import EnvVariableWrapper from '../EnvVariableContainer';
import Text from '../../components/Text';
import Select from '../../components/Select';

import { availableCodeLanguages } from '../../utils/selectOptions';
import Button from '../../components/Button';

const TopWrapper = styled.div`
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
const ContainerSteps = styled.div`
    background: #fff;
    padding: 24px;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    margin-bottom: 24px;
`;
const SelectWrapper = styled.div`
    position: relative;
    max-width: 215px;
    width: 100%;
`;

const MainWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const BottomWrapper = styled.div`
    display: flex;
    align-items: baseline;
    margin-top: 20px;

    button {
        margin-left: 24px;
        margin-right: 24px;
    }
`;
const StatusTest = styled.div``;

const EditCodeContainer: FunctionComponent = () => {
    const [codeLanguage, setCodeLanguage] = useState<string>('Playwright');

    const onChangeSelect = (option: string) => {
        console.log(option);
        setCodeLanguage(option);
    };

    const startTestLocally = () => {
        console.log('locally');
    };

    return (
        <Container>
            <ContainerSteps>
                <TopWrapper>
                    <TextWrapper>
                        <Text tag={'h2'}> Edit your code</Text>
                        <Text tag={'p'}>
                            Choose Code Editor and then write some code ... then
                            do ...
                        </Text>
                    </TextWrapper>
                    <SelectWrapper>
                        <Select
                            options={availableCodeLanguages}
                            onChangeSelect={onChangeSelect}
                            currentValue={codeLanguage}
                        />
                    </SelectWrapper>
                </TopWrapper>
                <MainWrapper>
                    <CodeEditor />
                    <EnvVariableWrapper />
                </MainWrapper>
                <BottomWrapper>
                    <Text tag={'p'}>Test yuor script</Text>
                    <Button onClick={startTestLocally} type='white'>
                        Test script
                    </Button>
                    <StatusTest></StatusTest>
                </BottomWrapper>
            </ContainerSteps>
        </Container>
    );
};

export default EditCodeContainer;
