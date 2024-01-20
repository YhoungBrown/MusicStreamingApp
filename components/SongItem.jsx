import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { AntDesign, Entypo} from '@expo/vector-icons';
import { useContext } from 'react';
import { Player } from '../PlayerContext';

const SongItem = ({item, onPress, isPlaying}) => {
    //console.log(item.track)
    //item?.track?.album?.artists[0]?.name

    const {currentTrack, SetCurrentTrack} = useContext(Player);

    const handlePress = () => {
      SetCurrentTrack(item);
      onPress(item)
    }

    
  return (
    <TouchableOpacity
    onPress={handlePress} 
      style={{
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10
      }}
    >
      <Image 
        style={{width: 50, height: 50, marginRight: 10}}
        source={{uri: item?.track?.album?.images[0]?.url}}
      />

      <View style={{flex: 1}}>
        <Text style={
          isPlaying ? {
            fontWeight: 'bold',
            fontSize: 14,
            color: "#3FFF00"
          } : {
            fontWeight: 'bold',
            fontSize: 14,
            color: "white"
            }
          }
            numberOfLines={1}
        >
            {item?.track?.name}
        </Text>
        <Text
        style={{
            marginTop: 4,
            color: "#989898"
        }}>
            {item?.track?.artists[0]?.name}
        </Text> 
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: 10
      }}>
        <AntDesign name="heart" size={24} color="#1D8954" />
        <Entypo name="dots-three-vertical" size={24} color="#989898" />
      </View>
    </TouchableOpacity>
  )
}

export default SongItem