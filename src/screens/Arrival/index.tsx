import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useObject, useRealm } from '../../libs/realm'
import { useUser } from '@realm/react'
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ButtonIcon } from '../../components/ButtonIcon';
import { X } from 'phosphor-react-native';
import { BSON } from 'realm';

const keyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const route = useRoute()
  const { id } = route.params as RouteParamsProps
  const historic = useObject(Historic, new BSON.UUID(id));

  const realm = useRealm()
  const navigation = useNavigation()

  const title = historic?.status !== 'arrival' ? 'Chegada': 'Detalhes'

  function handleRemoveVechileUsage() {
    Alert.alert(
      'Cancelar',
      'Cancelar a utilização do veículo?',
      [
        { text: 'Não', style: 'cancel'},
        { text: 'Sim, desejo cancelar.', onPress: removeVechileUsage}
      ]
    )
  }

  function removeVechileUsage() {
    // Write é uma transação
    realm.write(() => {
      realm.delete(historic)
    });

    navigation.goBack();
  }

  function handleArrivalRegister() {
    try {
      if(!historic) 
        return Alert.alert('Error', 'Não foi possivel obter os dados para registrar a chegada do veiculo.')

      realm.write(() => {
        historic.status = 'arrival',
        historic.updated_at = new Date();
      });

      Alert.alert('Chegada', 'Chegada registrar com sucesso!')

      navigation.goBack()

    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Não foi possivel registrar a chegada do veículo.')
    }
  }

  return (
    <Container>
      <Header title={title} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={keyboardAvoidingViewBehavior}>
        <ScrollView>
          <Content>
            <Label>Placa do veiculo</Label>
            <LicensePlate>{historic?.license_plate}</LicensePlate>
            <Description>{historic?.description}</Description>
            
            {
              historic?.status !== 'arrival' && (
              <Footer>
                <ButtonIcon icon={X} onPress={handleRemoveVechileUsage}/>
                <Button title='Registrar chegada' onPress={handleArrivalRegister}/>
              </Footer>
              )
            }
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}