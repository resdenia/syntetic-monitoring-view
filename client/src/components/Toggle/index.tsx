import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

type Option = {
    name: string;
    // value: string;
};

type Props = {
    options: Option[];
    onToggle: (option: string) => void;
    activeToggle: string;
};

const ToggleWrapper = styled.div``;
const ToggleList = styled.ul`
    list-style: none;
    padding: 0px;
    display: flex;
`;
const ToggleElement = styled.li`
    padding: 6px 8px;
    border: 1px solid #849dc5;
    color: #696969;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    cursor: pointer;

    &:last-child {
        border-radius: 0px 3px 3px 0px;
    }
    &:first-child {
        border-radius: 3px 0px 0px 3px;
    }
    &.active {
        color: #ffffff;
        background: #5b78a4;
    }
`;

const Toggle: FunctionComponent<Props> = ({
    options,
    onToggle,
    activeToggle,
}) => {
    const renderToggle = () => {
        return options.map((option) => (
            <ToggleElement
                className={`${activeToggle === option.name ? 'active' : ''}`}
                onClick={() => {
                    onToggle(option.name);
                }}
                key={option.name}
            >
                {option.name}
            </ToggleElement>
        ));
    };

    return (
        <ToggleWrapper>
            <ToggleList>{renderToggle()}</ToggleList>
        </ToggleWrapper>
    );
};

export default Toggle;
