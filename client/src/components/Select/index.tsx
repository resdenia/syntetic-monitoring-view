import React, {
    FunctionComponent,
    useRef,
    useEffect,
    useState,
    useLayoutEffect,
} from 'react';
import styled from 'styled-components';

const LabelSelect = styled.div`
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    padding: 7px 8px;
    background: #f7f7f7;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #002e42;
    cursor: pointer;
    height: 30px;
    padding: 6px 8px;
`;

const DropdownList = styled.ul`
    list-style: none;
    border: 1px solid #d6d6d6;
    padding: 10px 0px 0px 0px;
    position: absolute;
    z-index: 1000;
    background: #fff;
    width: 100%;
    margin-top: 3px;
    border-radius: 3px;
    display: none;
    flex-direction: column;

    &.open {
        display: flex;
    }
`;

const DropdownListElement = styled.li`
    padding: 6px 10px 6px 5px;
    cursor: pointer;
    transition: 0.3s all ease-in-out;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #002e42;

    &:hover {
        background: rgb(231, 231, 231) 30%;
    }
    &.disabled {
        background: rgb(231, 231, 231) 30%;
        color: #8b8c8e;
    }
`;
type Option = {
    name: string;
    default: boolean;
    isDisabled: boolean;
};
type Props = {
    options: Option[];
    onChangeSelect: (option: string) => void;
    currentValue: string;
};

const Select: FunctionComponent<Props> = ({
    options,
    onChangeSelect,
    currentValue,
}) => {
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);

    const onOpen = () => {
        setOpenDropDown(true);
    };

    const onChangeSelectHandler = (name: string, isDisabled: boolean) => {
        if (isDisabled) return;
        onChangeSelect(name);
    };

    const renderOptions = () => {
        return options.map((option) => {
            return (
                <DropdownListElement
                    className={`${option.isDisabled ? 'disabled' : ''}`}
                    key={option.name.replace(' ', '-')}
                    onClick={() => {
                        onChangeSelectHandler(option.name, option.isDisabled);
                    }}
                >
                    {option.name}
                </DropdownListElement>
            );
        });
    };

    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: Event) => {
        const target = event.target as HTMLDivElement;
        if (ref.current && !ref.current.contains(target)) {
            setOpenDropDown(false);
        }
    };
    useLayoutEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return (
        <>
            <LabelSelect ref={ref} onClick={onOpen}>
                {currentValue}
            </LabelSelect>
            <DropdownList className={`${openDropDown ? 'open' : ''}`}>
                {renderOptions()}
            </DropdownList>
        </>
    );
};

export default Select;
