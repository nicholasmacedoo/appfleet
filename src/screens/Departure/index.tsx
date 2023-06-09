import React, { useRef, useState } from 'react';
import { TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRealm } from '../../libs/realm'
import { useUser } from '@realm/react'
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Button } from '../../components/Button';
import { Container, Content } from './styles';
import { licensePlateValidate } from '../../utils/licensaPlateValidade';
import { Historic } from '../../libs/realm/schemas/Historic';
import { useNavigation } from '@react-navigation/native';

const keyboardAvoidingViewBehavior = Platform.OS === 'android' ? 'height' : 'position'

export function Departure() {
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);
  const [licensePlate, setLicensePlate] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const realm = useRealm()
  const user = useUser()
  const navigation = useNavigation()

  function handleDepartureRegister() {
    try {
      setIsLoading(true);
      if(!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert('Placa inválida', 'A placa é inválida. Por favor informe a placa correta do veiculo.')
      }
  
      if(description.length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilização do veiculo.')
      }
      /** 
       * Quando queremos criar ou modificar 
       * utilizamos o write pois ele trabalha em transações
       * e caso houver erro ele cancelar tudo realizado centro.
       */
      realm.write(() => {
        realm.create('Historic', Historic.generate({
          description,
          license_plate: licensePlate.toUpperCase(),
          user_id: user!.id,
        }))
      });
      
      Alert.alert('Saida', 'Saida do veiculo registrada com sucesso.')
      
      navigation.goBack()
      
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Não foi possivel registrar a saída do veiculo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header title="Saida" />

      <KeyboardAvoidingView behavior={keyboardAvoidingViewBehavior}>
        <ScrollView>
          <Content>
            <LicensePlateInput 
              ref={licensePlateRef}
              label='Placa do veiculo' 
              placeholder='BRA1234'
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType='next'
              onChangeText={setLicensePlate}
          />
            <TextAreaInput 
              ref={descriptionRef}
              label='Finalidade'
              placeholder='Vou utilizar o veiculo para...'
              onSubmitEditing={handleDepartureRegister}
              onChangeText={setDescription}
              returnKeyType='send'
              blurOnSubmit
            />
            <Button title='Registrar Saída' onPress={handleDepartureRegister} isLoading={isLoading}/>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}