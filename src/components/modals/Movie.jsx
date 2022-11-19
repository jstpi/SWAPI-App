import React from 'react';
import { useQuery, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import {
  Badge,
  Box, FlatList, Heading, HStack, Modal, Pressable, Stack, Text,
} from 'native-base';
import _ from 'lodash';
import Ionicons from '@expo/vector-icons/Ionicons';

const GET_FILM = (id) => gql`
  query {
    film(id: "${id}") {
      title,
      releaseDate,
      openingCrawl,
      speciesConnection {
        totalCount
      },
      planetConnection {
        totalCount
      },
      vehicleConnection {
        totalCount
      },
      characterConnection {
        characters {
          id,
          name
        }
      }
    }
  }
`;

export default function Movie({
  isOpen, onClose, onOpenCharacter, movieId,
}) {
  const { loading, error, data } = useQuery(GET_FILM(movieId));
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <Modal.Content flex={1}>
        <Modal.CloseButton />
        <Modal.Header>{_.get(data, ['film', 'title'])}</Modal.Header>
        <Modal.Body flex={1} _scrollview={{ _contentContainerStyle: { flex: 1 } }}>
          {loading && <Text>Loading</Text>}
          {error && <Text>{error.message}</Text>}
          <Stack flex={1} space="md">
            <Box>
              <Heading size="sm">
                Release Date
              </Heading>
              <Text>{_.get(data, ['film', 'releaseDate'])}</Text>
            </Box>
            <Stack flex={1}>
              <Heading size="sm">
                Opening Crawl
              </Heading>
              <Box flex={1} overflow="auto">
                <Text>{_.get(data, ['film', 'openingCrawl'])}</Text>
              </Box>
            </Stack>
            <HStack space="sm">
              <Badge flex={1}>
                <HStack alignItems="center" space="sm">
                  <Ionicons name="paw-outline" size="sm" />
                  <Text>{_.get(data, ['film', 'speciesConnection', 'totalCount'])}</Text>
                </HStack>
              </Badge>
              <Badge flex={1}>
                <HStack alignItems="center" space="sm">
                  <Ionicons name="earth-outline" size="sm" />
                  <Text>{_.get(data, ['film', 'planetConnection', 'totalCount'])}</Text>
                </HStack>
              </Badge>
              <Badge flex={1}>
                <HStack alignItems="center" space="sm">
                  <Ionicons name="car-outline" size="sm" />
                  <Text>{_.get(data, ['film', 'vehicleConnection', 'totalCount'])}</Text>
                </HStack>
              </Badge>
            </HStack>
            <Stack flex={1}>
              <Heading size="sm">
                Characters
              </Heading>
              <FlatList
                keyExtractor={(item) => _.get(item, 'id')}
                data={_.get(data, ['film', 'characterConnection', 'characters'])}
                renderItem={({
                  item,
                }) => (
                  <Pressable onPress={() => { onClose(); onOpenCharacter(_.get(item, 'id')); }} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" margin={1} padding={4}>
                    <Box>
                      <Text>
                        {_.get(item, 'name')}
                      </Text>
                    </Box>
                  </Pressable>
                )}
              />
            </Stack>
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

Movie.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenCharacter: PropTypes.func.isRequired,
  movieId: PropTypes.string.isRequired,
};
