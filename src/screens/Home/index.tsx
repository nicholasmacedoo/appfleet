import React from 'react';
import { Container, Content } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';

export function Home() {
  const navigation = useNavigation()

  function handleRegisterMovement() {
    navigation.navigate('departune')
  }

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus onPress={handleRegisterMovement} />
      </Content>
    </Container>
  );
}