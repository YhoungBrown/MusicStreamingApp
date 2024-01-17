import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo} from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongItem from '../components/SongItem';
import { Player } from '../PlayerContext';




const LikedSongsScreen = () => {
    const safeAreaTop = { paddingTop: useSafeAreaInsets().top };
    const navigation = useNavigation();
    const [input, setInput] = useState("");
    const [savedTracks, setSavedTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);

    const {currentTrack, SetCurrentTrack} = useContext(Player);

    const getSavedTracks = async () => {
        const accessToken = await AsyncStorage.getItem("token");

        const response = await fetch("https://api.spotify.com/v1/me/tracks?offset=0&limit=50", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                limit: 50
            }
        })

        if (!response.ok) {
            throw new Error ("Failed to fetch saved songs")
        }

        const data = await response.json();
        setSavedTracks(data);
    }

    
    useEffect(() => {
        getSavedTracks();
    }, [navigation])
    
    //console.log(savedTracks);
    //console.log(savedTracks?.track?.album?.images[0]?.url)
   // console.log(savedTracks?.items[0]?.track?.album?.images[0]?.url);
    //console.log(savedTracks?.items[0].track.album.name);
    //console.log(savedTracks?.items[0]?.track?.album?.artists[0]?.name)
    //?.track?.album?.images[0]?.url

     const searchingSongs = (text) => {
        const lowercasedText = text.toLowerCase();
        const filtered = savedTracks?.items.filter(item => {
            const trackName = item?.track?.name?.toLowerCase();
            const artistName = item?.track?.album?.artists[0]?.name?.toLowerCase();
            return trackName.includes(lowercasedText) || artistName.includes(lowercasedText);
        });
        setFilteredTracks(filtered);
    }

     const playTrack = async() => {
        if(savedTracks.items.length > 0) {
            SetCurrentTrack(savedTracks.items[0])
        }

        await play(savedTracks.items[0])
     }

     const play = async() => {

     }

  return (
    <>
    <LinearGradient colors={["#614385","#516395"]} style={{flex:1}}>
        <View style={[safeAreaTop, {flex: 1,}]}>
        {/* back Icon */}
            <TouchableOpacity 
                style={{marginHorizontal: 10}} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

                {/**search */}
            <TouchableOpacity style={{
                marginHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 9,
            }}>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    backgroundColor: "#42275a",
                    padding: 9,
                    flex: 1,
                    borderRadius: 3,
                    height: 38,
                }}>
                    <AntDesign name="search1" size={20} color="white" />
                    <TextInput 
                        value={input} 
                        placeholder='Find Liked Songs'
                        onChangeText={(text) => {setInput(text), searchingSongs(text)}}
                        placeholderTextColor={"white"}
                        style={{fontWeight: "500", color: "white"}}
                    />

                </TouchableOpacity>

                <TouchableOpacity style={{
                    marginHorizontal: 10, 
                    backgroundColor: "#42275a",
                    padding: 10,
                    borderRadius: 3,
                    height: 38,
                }}>
                    <Text style={{color: "white"}}>Sort</Text>
                </TouchableOpacity>
            </TouchableOpacity>

            <View style={{height: 50}}/>

            {/* Liked Songs, How Many, And Arrows Section */}

            <View style={{marginHorizontal: 10}}>
                <Text style={{
                    fontSize: 18, 
                    fontWeight: 'bold', 
                    color: "white"
                    }}
                > 
                    Liked Songs
                </Text>
                <Text style={{
                    fontSize: 13,  
                    color: "white",
                    marginTop: 5,
                    }}>
                    {`${savedTracks?.items?.length ?? 0} songs`}
                </Text>
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
                    onPress={playTrack}
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

            
            {savedTracks ? ( 
                filteredTracks.length > 0 ? (
                    <FlatList 
                        data={filteredTracks}
                        renderItem={({ item }) => (
                            <SongItem item={item}/>
                        )}
                        ListFooterComponent={ currentTrack && (<View  style={{marginBottom: 100}}/>)}
                     />
                ) : (
            
                <FlatList 
                    data={savedTracks?.items}
                    renderItem={({ item }) => (
                    <SongItem item={item}/>
                    )}
                    ListFooterComponent={ currentTrack && (<View  style={{marginBottom: 100}}/>)}
                />)
            ) : (
                <View 
                    style={{
                        justifyContent: 'center', 
                        alignItems: 'center',
                    }}
                >
                    <Text style={{color: "white"}}>Loading...</Text>
                </View>
            )}

            
        </View>
    </LinearGradient>

    {currentTrack && (
        <View style={{justifyContent: 'center'}}>
        <TouchableOpacity style={{
            backgroundColor: "#1DB954",
            width: "92%",
            padding: 10,
            marginLeft: 'auto',
            marginRight: "auto",
            marginBottom: 15,
            position: 'absolute',
            borderRadius: 6,
            left: 16,
            bottom: 10,
            justifyContent: 'space-between',
            flexDirection: 'row', 
            alignItems: 'center',
            gap: 10,
            }}
        >
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
            }}>
                <Image 
                    style={{
                        width: 40, height: 40
                    }}
                    source={{uri: currentTrack?.track?.album?.images[0]?.url}}
                /> 

                <Text numberOfLines={1}
                    style={{
                        fontSize: 13,
                        color: "white",
                        fontWeight: 'bold',
                        width: 220,
                    }}
                >
                    {currentTrack?.track?.name} . {currentTrack.track.artists[0].name}
                </Text>
            </View>

            <View style={{
                flexDirection: 'row', 
                alignItems: 'center',
                gap: 5,
            }}>
                <AntDesign name="heart" size={24} color="#FFFFFF" />
                <TouchableOpacity>
                    <AntDesign name="pausecircle" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        </View>
    )}
</>
  );
};

export default LikedSongsScreen