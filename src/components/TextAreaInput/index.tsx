import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native'
import { Container, Input, Label } from './styles';
import { useTheme } from 'styled-components';

interface Props extends TextInputProps {
    label: string
}

const TextAreaInput = forwardRef<TextInput, Props>(({ label, ...rest }, ref) => {
  const { COLORS } = useTheme()

    return (
    <Container>
        <Label>{label}</Label>
        <Input 
            ref={ref}
            placeholderTextColor={COLORS.GRAY_400}
            autoCapitalize='sentences'
            multiline
            {...rest}
        />
    </Container>
  );
})

export { TextAreaInput }