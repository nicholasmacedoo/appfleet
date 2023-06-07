import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Container, IconBox, Message, TextHighlight } from './styles';
import { Key, Car } from 'phosphor-react-native'
import theme from '../../theme';

interface CarStatusProps extends TouchableOpacityProps {
    licensePlate?: string | null
}
export function CarStatus({ licensePlate = null, ...rest }: CarStatusProps) {

    const Icon = licensePlate ? Key : Car
    const message = licensePlate ? `Veiculo ${licensePlate} em uso.` : `Nenhum veiculo em uso.`;
    const status = licensePlate ? 'chegada' : 'saida';

   return (
    <Container {...rest}>
        <IconBox>
            <Icon size={32} color={theme.COLORS.BRAND_MID}/>
        </IconBox>
        <Message>
            {message}
            <TextHighlight>
                Clique aqui para registrar a {status}
            </TextHighlight>
        </Message>
    </Container>
  );
}