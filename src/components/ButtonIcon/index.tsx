import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { IconProps } from 'phosphor-react-native';
import { Container } from './styles';
import { useTheme } from 'styled-components';

export type IconBoxProps = (props: IconProps) => JSX.Element;

type ButtonIconProps = TouchableOpacityProps & {
    icon: IconBoxProps
}

export function ButtonIcon({ icon: Icon, ...rest}: ButtonIconProps) {
    const { COLORS } = useTheme()
   return (
    <Container {...rest}>
        <Icon 
            size={24}
            color={COLORS.BRAND_MID}
        />
    </Container>
  );
}