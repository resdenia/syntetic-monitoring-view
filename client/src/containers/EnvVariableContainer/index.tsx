import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Text from '../../components/Text';
import Label from '../../components/Label';
import Input from '../../components/Input';
import Button from '../../components/Button';

const EnvVariableWrapper = styled.div`
    width: 25%;
    margin-right: 0;
`;

const EnvVariableElement = styled.div``;

const renderEnvVariableHandler = (
    id: number,
    onClickAdd: () => void,
    onChangeKey: () => void,
    onChangeValue: () => void,
) => {
    return (
        <EnvVariableElement>
            <Label>Key</Label>
            <Input
                name={`key_${id}`}
                placeholder='Key'
                type='text'
                onChange={onChangeKey}
            />
            <Label>Value</Label>
            <Input
                name={`value_${id}`}
                placeholder='Value'
                type='text'
                onChange={onChangeValue}
            />
            <Button type='white' onClick={onClickAdd}>
                + Add
            </Button>
        </EnvVariableElement>
    );
};
type EnvVariable = {
    [key: string]: string;
};
const EnvVariableContainer: FunctionComponent = () => {
    const [counterEnvVariable, setCounterEnvVariable] = useState<number>(1);
    const [key, setKey] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [envVariables, setEnvVariables] = useState<EnvVariable[]>([]);
    const addEnviromentKey = () => {
        const newEnvVariables = envVariables;
        newEnvVariables.push({ key: value });
        setEnvVariables(newEnvVariables);
    };

    return (
        <EnvVariableWrapper>
            <Text tag='h2'>Add Enviroment Variable</Text>

            <EnvVariableElement></EnvVariableElement>
        </EnvVariableWrapper>
    );
};

export default EnvVariableContainer;
