import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import _ from 'lodash';
import {
  Box, Center, Container, FlatList, Pressable, Text,
} from 'native-base';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useAsync } from 'react-async-hook';
import { useIsFocused } from '@react-navigation/native';
import { Character, Movie } from '../components/modals';

const GET_CHARACTERS = gql`
  query {
    allPeople {
      people {
        id,
        name
      }
    }
  }
`;

export default function Like() {
  const isFocused = useIsFocused();
  const { loading, error, data } = useQuery(GET_CHARACTERS);
  const { getItem } = useAsyncStorage('likes');
  const { result, execute } = useAsync(getItem);
  const likedCharacterIds = result ? JSON.parse(result) : [];
  const likedCharacters = _.filter(_.get(data, ['allPeople', 'people'], []), (people) => _.includes(likedCharacterIds, _.get(people, 'id')));
  const [movieId, setMovieId] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  useEffect(() => { execute(); }, [isFocused]);

  if (loading) return <Text>Loading</Text>;
  if (error) return <Text>{error.message}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Movie
        isOpen={showMovieModal}
        onClose={() => setShowMovieModal(false)}
        movieId={movieId}
        onOpenCharacter={(id) => { setCharacterId(id); setShowCharacterModal(true); }}
      />
      <Character
        isOpen={showCharacterModal}
        onClose={() => { setShowCharacterModal(false); execute(); }}
        characterId={characterId}
        onOpenMovie={(id) => { setMovieId(id); setShowMovieModal(true); }}
      />
      <Center style={{ flex: 1 }}>
        <Container style={{ flex: 1, padding: 8 }} size="md">
          {loading && <Text>Loading</Text>}
          {error && <Text>{error.message}</Text>}
          <Box flex={1} width="100%">
            <FlatList
              keyExtractor={({ id }) => id}
              data={likedCharacters}
              renderItem={({
                item: {
                  id, name,
                },
              }) => (
                <Pressable onPress={() => { setCharacterId(id); setShowCharacterModal(true); }} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" margin={2} padding={4}>
                  <Box>
                    <Text fontSize="lg">{name}</Text>
                  </Box>
                </Pressable>
              )}
            />
          </Box>

        </Container>
      </Center>
    </View>
  );
}
