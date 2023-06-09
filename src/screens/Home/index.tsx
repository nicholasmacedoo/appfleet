import React, { useEffect, useState } from 'react';
import { Container, Content, Label, Title } from './styles';
import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { Alert, FlatList } from 'react-native';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import dayjs from 'dayjs';

export function Home() {
  const [vechileInUse, setVechileInUse] = useState<Historic | null>(null)
  const [vechileHistoric, setVechileHistoric] = useState<HistoricCardProps[]>([])
  const navigation = useNavigation()
  const historic = useQuery(Historic);
  const realm = useRealm()

  function handleRegisterMovement() {
    if(vechileInUse?._id) {
      return navigation.navigate('arrival', {
        id: vechileInUse._id.toString(),
      })
    } 

    navigation.navigate('departune')
  }

  function fetchVechileInUse() {
    try {
      const vechile = historic.filtered("status = 'departune'")[0];
      setVechileInUse(vechile)
    } catch (error) {
      Alert.alert('Veículo em uso', 'Não foi possivel carregar o veiculo em uso')
      console.log(error)
    }
  }

  function fecthHistoric() {
    const response = historic.filtered("status = 'arrival' SORT(created_at DESC)");
    const formattedHistoric = response.map((item) => {
      return {
        id: item._id.toString(),
        licensePlate: item.license_plate,
        created_at: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [às] HH:mm'),
        isSync: false,
      }
    });

    setVechileHistoric(formattedHistoric);
  }

  function handleHistoricDetails(id: string) {
    navigation.navigate('arrival', { id })
  }

  useEffect(() => {
    fetchVechileInUse()
  }, [])

  useEffect(() => {
    realm.addListener('change', () => fetchVechileInUse())

    return () => {
      if(realm && realm.isClosed) {
        realm.removeListener('change', () => fetchVechileInUse)
      }
    }
  }, [])

  useEffect(() => {
    fecthHistoric();
  }, [historic])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus 
          licensePlate={vechileInUse?.license_plate} 
          onPress={handleRegisterMovement} 
        />

        <Title>Histórico</Title>
        
        <FlatList 
          data={vechileHistoric}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoricCard data={item} onPress={() => handleHistoricDetails(item.id)}/>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListEmptyComponent={(
            <Label>
              Nenhum registro de utilização.
            </Label>
          )}
        />
      </Content>
    </Container>
  );
}