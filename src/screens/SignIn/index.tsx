import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { Realm, useApp } from '@realm/react'
import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button';

import { Container, Title, Slogan } from './styles';


WebBrowser.maybeCompleteAuthSession();

export function SignIn() {

  const [isLoading, setIsLoading] = useState(false);
  const app = useApp();

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email']
  })

  function handleGoogleSignIn() {
    setIsLoading(true);

    googleSignIn()
    .then(response => {
      if(response.type !== "success") {
        setIsLoading(false);
      } else {
        Alert.alert('Entrar', 'Não foi possivel conectar-se a sua conta Google.')
        setIsLoading(false)
      }
    })
  }
  
  useEffect(() => {
    if(response?.type === 'success') {
      if(response.authentication?.idToken) {
        /** Buscando os dados dentro da aplicação com o id_token */
        // fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.authentication.idToken}`)
        const credentials = Realm.Credentials.jwt(response.authentication.idToken);

        app.logIn(credentials).catch(error => {
          console.log(error)
          Alert.alert('Entrar', 'Não foi possivel conectar-se a sua conta Google.')
          setIsLoading(false)
        });
        
      }
    }
  }, [response]);

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>
        Gestão de uso de veículos
      </Slogan>

      <Button 
        title='Entrar com Google' 
        onPress={handleGoogleSignIn} 
        isLoading={isLoading}
      />
    </Container>
  );
}