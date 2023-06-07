import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Power } from 'phosphor-react-native';
import { useUser, useApp } from '@realm/react';
import theme from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Container, Greeting, Message, Name, Picture } from './styles';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export function HomeHeader() {

    const user = useUser()
    const app = useApp();
    const insets = useSafeAreaInsets();
    const paddingTop = insets.top + 32

    function handleSignOut() {
        app.currentUser?.logOut();
    }

    return (
        <Container style={{ paddingTop }}>
            <Picture 
                source={{ uri: user?.profile.pictureUrl }} 
                placeholder={blurhash}
            />
            <Greeting>
                <Message>Olá</Message>
                <Name>{user?.profile.name}</Name>
            </Greeting>
            <TouchableOpacity activeOpacity={0.7} onPress={handleSignOut}>
                <Power size={32} color={theme.COLORS.GRAY_400} />
            </TouchableOpacity>
        </Container>
    );
}