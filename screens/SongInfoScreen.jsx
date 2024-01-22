import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, {useEffect} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo,} from '@expo/vector-icons';

const SongInfoScreen = () => {
    
    const {params} = useRoute();
    const albumUrl = params?.item?.track?.album?.uri
    const [tracks, setTracks] = useState([]);
    const albumId = albumUrl.split(":")[2]

    const navigation = useNavigation();

    //console.log(albumId)

    const safeAreaTop = { paddingTop: useSafeAreaInsets().top };
    const safeAreaBottom = { paddingBottom: useSafeAreaInsets().bottom };

    useEffect(() => {
        const fetchSongs = async () => {
          const accessToken = await AsyncStorage.getItem("token");
          try {
            const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
      
            if (!response.ok) {
              throw new Error("Failed to get album Songs");
            }
      
            const data = await response.json();
            const tracks = data.items;
            setTracks(tracks)
            //console.log(data);
          } catch (err) {
            console.log(err.message);
          }
        };
      
        fetchSongs();
      }, []);  
      
//console.log(tracks)

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{flex: 1}}>
        <ScrollView style={safeAreaTop}>
            <View style={{flexDirection: "row", padding: 12}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: "center"}}>
                    <Image
                        style={{width: 200, height: 200}}
                        source={{uri: params?.item?.track?.album?.images[0]?.url}}
                    />
                </View>
            </View>  

            <Text style={{
                color: "white",
                marginHorizontal: 12,
                marginTop: 10,
                fontSize: 22,
                fontWeight: "bold",
                }}
            >
                {params?.item?.track?.name}
            </Text>
            
            <View style={{
                marginHorizontal: 12,
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "Wrap",
                marginTop: 10, 
                gap: 7,
            }}>
                {params?.item?.track?.artists.map((item, index) => (
                    <Text style={{
                        color: "#909090",
                        fontSize: 13,
                        fontWeight: "500",
                        }}
                        key={index}
                    >
                        {item.name}
                    </Text>
                ))}
            </View>

            <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 10
            }}>
                <TouchableOpacity 
                style={{
                    width: 30, 
                    height: 30, 
                    borderRadius: 15,
                    backgroundColor: "#1D8954",
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                >
                    <AntDesign name="arrowdown" size={20} color="white" />
                </TouchableOpacity>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                }}>
                    <MaterialCommunityIcons name="cross-bolnisi" size={24} color="#1D8954" />

                    <TouchableOpacity
                     style={{
                        width: 60, 
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: "#1D8954",
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Entypo name="controller-play" size={24} color="white" />
                    </TouchableOpacity>
                </View>

            </TouchableOpacity>

            <View style={{paddingBottom: 50}}>
                <View style={{
                    marginTop: 10,
                    marginHorizontal: 12,
                }}>
                    {tracks?.map((track, index) => (
                        <TouchableOpacity key={index} style={{
                            marginVertical: 10,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <View>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "500",
                                    color: "white",
                                    }}
                                >
                                    {track.name}
                                </Text>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                    marginTop: 5
                                    }}
                                >
                                    {track?.artists?.map((item, index) => (
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: "500",
                                            color: "gray", 
                                            }}
                                            key={index}
                                        >
                                            {item?.name}
                                        </Text>
                                    ))}
                                </View>
                            </View>

                            <Entypo name="dots-three-vertical" size={24} color="white" />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={safeAreaBottom}/>
        </ScrollView>
    </LinearGradient>
  )
}

export default SongInfoScreen 