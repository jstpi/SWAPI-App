import React, { useState } from 'react';
import {
  FlatList, View,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';
import _ from 'lodash';
import {
  Box, Center, Container, HStack, IconButton, Pressable, Spacer, Stack, Text,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Character, Movie } from '../components/modals';

const GET_FILMS = gql`
  query {
    allFilms {
      films {
        id,
        title,
        openingCrawl,
        releaseDate
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_FILMS);
  const [isOrderForward, setIsOrderForward] = useState(true);
  const [movieId, setMovieId] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  const films = _.orderBy(_.get(data, ['allFilms', 'films'], []), ['releaseDate'], [`${isOrderForward ? 'asc' : 'desc'}`]);

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
        onClose={() => setShowCharacterModal(false)}
        characterId={characterId}
        onOpenMovie={(id) => { setMovieId(id); setShowMovieModal(true); }}
      />
      <Center style={{ flex: 1 }}>
        <Container style={{ flex: 1, padding: 8 }} size="md">
          {loading && <Text>Loading</Text>}
          {error && <Text>{error.message}</Text>}
          <Stack flex={1} width="100%">
            <HStack>
              <Spacer />
              <IconButton icon={<Ionicons name={isOrderForward ? 'arrow-down-outline' : 'arrow-up-outline'} size="sm" onPress={() => setIsOrderForward((v) => !v)} />} />
            </HStack>
            <Box flex={1}>
              <FlatList
                keyExtractor={({ id }) => id}
                data={films}
                renderItem={({
                  item: {
                    id, title, openingCrawl, releaseDate,
                  },
                }) => (
                  <Pressable onPress={() => { setMovieId(id); setShowMovieModal(true); }} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" margin={2} padding={4}>
                    <Box>
                      <Stack>
                        <HStack alignItems="center" space="sm">
                          <Text fontSize="lg">{title}</Text>
                          <Spacer />
                          <Text fontSize={10} color="secondary">
                            {releaseDate}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="coolGray.700" isTruncated numberOfLines={2}>
                          {openingCrawl}
                        </Text>
                      </Stack>
                    </Box>
                  </Pressable>
                )}
              />
            </Box>
          </Stack>
        </Container>
      </Center>
    </View>

  );
}
