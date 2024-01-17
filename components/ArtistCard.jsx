import { View, Text, Image } from 'react-native'
import React from 'react'

const ArtistCard = ({item}) => {
  return (
    <View style={{margin: 10}}>
      <Image 
        style={{width: 130, height: 130, borderRadius: 5}} 
        source={{uri: item?.images?.[0]?.url}}
      />
      <Text style={{color: "white", fontSize: 13, fontWeight: "500", marginTop: 10}}>{item?.name}</Text>
    </View>
  )
}
// uri: item.track.album.images[0].url
// item?.track?.name
export default ArtistCard