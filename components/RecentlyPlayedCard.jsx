import { View, Text, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const RecentlyPlayedCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{margin: 10}} onPress={() => navigation.navigate("SongInfo", {item})}>
      <Image 
        style={{width: 130, height: 130, borderRadius: 5}} 
        source={{uri: item.track.album.images[0].url}}
      />

      <Text
        numberOfLines={1} 
        style={{
            color: "white", 
            fontSize: 13, 
            fontWeight: "500", 
            marginTop: 10
            }}
      >
        {item?.track?.name}
      </Text>
    </TouchableOpacity>
  )
}

export default RecentlyPlayedCard