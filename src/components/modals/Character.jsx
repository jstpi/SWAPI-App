import React, { useCallback, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Box, FlatList, Heading, HStack, IconButton, Modal, Pressable, Stack, Text,
} from 'native-base';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { useAsync } from 'react-async-hook';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const GET_CHARACTER = (id) => gql`
  query {
    person(id: "${id}") {
      name,
      birthYear,
      height,
      mass,
      homeworld {
        name
      },
      filmConnection {
        films {
          id,
          title
        }
      }
    }
  }
`;

export default function Character({
  isOpen, onClose, onOpenMovie, characterId,
}) {
  // const [showLike, setShowLike] = useState(false);

  const { loading, error, data } = useQuery(GET_CHARACTER(characterId));
  const { getItem, setItem } = useAsyncStorage('likes');
  const { result, execute } = useAsync(getItem);
  const likedCharacterIds = result ? JSON.parse(result) : [];
  const isLiked = _.includes(likedCharacterIds, characterId);

  const likingCharacter = useCallback(
    () => {
      setItem(
        JSON.stringify(_.xor(likedCharacterIds, [characterId])),
      )
        .then(() => execute());
      // .then(() => setShowLike(true));
    },
    [characterId, setItem, execute],
  );

  useEffect(() => { execute(); }, [isOpen]);

  const tap = Gesture.Tap().numberOfTaps(2).onStart(() => { likingCharacter(); });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <Modal.Content flex={1}>
        <Modal.CloseButton />
        <Modal.Header>
          <HStack>
            <Box>
              <Heading size="sm">{_.get(data, ['person', 'name'])}</Heading>
            </Box>
            <IconButton
              size="sm"
              onPress={likingCharacter}
              style={{ marginTop: -10, marginBottom: -10 }}
              icon={<Ionicons name={isLiked ? 'heart' : 'heart-outline'} size="sm" />}
            />
          </HStack>

        </Modal.Header>
        <Modal.Body flex={1} _scrollview={{ _contentContainerStyle: { flex: 1 } }}>
          {loading && <Text>Loading</Text>}
          {error && <Text>{error.message}</Text>}
          <GestureDetector gesture={tap} style={{ flex: 1 }}>
            <Stack flex={1} space="md">
              {/* Animation for the heart icon, but not possible for the web due to this issue: https://github.com/software-mansion/react-native-reanimated/issues/2993
                {showLike && (
                <Animated.View entering={BounceIn}>
                  <Ionicons name="heart" />
                </Animated.View>
              )} */}
              <Box>
                <Heading size="sm">
                  Birth Year
                </Heading>
                <Text>{_.get(data, ['person', 'birthYear'])}</Text>
              </Box>
              <Box>
                <Heading size="sm">
                  Height
                </Heading>
                <Text>{_.get(data, ['person', 'height'])}</Text>
              </Box>
              <Box>
                <Heading size="sm">
                  Mass
                </Heading>
                <Text>{_.get(data, ['person', 'mass'])}</Text>
              </Box>
              <Box>
                <Heading size="sm">
                  Homeworld
                </Heading>
                <Text>{_.get(data, ['person', 'homeworld', 'name'])}</Text>
              </Box>
              <Stack flex={1}>
                <Heading size="sm">
                  Movies
                </Heading>
                <FlatList
                  keyExtractor={(item) => _.get(item, 'id')}
                  data={_.get(data, ['person', 'filmConnection', 'films'])}
                  renderItem={({
                    item,
                  }) => (
                    <Pressable onPress={() => { onClose(); onOpenMovie(_.get(item, 'id')); }} rounded="8" overflow="hidden" borderWidth="1" borderColor="coolGray.300" margin={1} padding={4}>
                      <Box>
                        <Text>
                          {_.get(item, 'title')}
                        </Text>
                      </Box>
                    </Pressable>
                  )}
                />
              </Stack>
            </Stack>
          </GestureDetector>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

Character.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenMovie: PropTypes.func.isRequired,
  characterId: PropTypes.string.isRequired,
};
