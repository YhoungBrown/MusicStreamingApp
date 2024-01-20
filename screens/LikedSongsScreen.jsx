import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState, useRef} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo, FontAwesome, Feather} from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongItem from '../components/SongItem';
import { Player } from '../PlayerContext';
import { BottomModal, ModalContent } from 'react-native-modals';
import { Audio } from 'expo-av';
import { debounce } from 'lodash';




const LikedSongsScreen = () => {
    const safeAreaTop = { paddingTop: useSafeAreaInsets().top };
    const navigation = useNavigation();
    const [input, setInput] = useState("");
    const [savedTracks, setSavedTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentSound, setCurrentSound] = useState(null);
    const [progress, setProgress] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const value = useRef(0)


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

        return () => {
            // Cleanup event listeners when the component unmounts
            if (currentSound) {
                currentSound.setOnPlaybackStatusUpdate(null);
                currentSound.unloadAsync();
            }
        };
    }, [navigation, currentSound])
    
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

    const debouncedSearch = debounce(searchingSongs, 800)
    const handleSearch = (text) => {
        //the essence of using debounce and not searhing the song straight is to improve performance. debounch search any written character after a certain set delay not immediately as they are written
        debouncedSearch(text);
    }

    const playTrack = async() => {
        if(savedTracks.items.length > 0) {
            SetCurrentTrack(savedTracks.items[0])
        }

        await play(savedTracks.items[0])
     }

     const play = async(nextTrack) => {
        console.log(nextTrack)
        const preview_url = nextTrack?.track?.preview_url;

        try{
            if (currentSound) {
                await currentSound.stopAsync();
            }
            await Audio.setAudioModeAsync({
                //custom required options below
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: false,
            })

            const {sound, status} = await Audio.Sound.createAsync(
                {
                    uri: preview_url
                },
                {
                    shouldPlay: true, isLooping: false
                },
                onPlaybackStatusUpdate,
            ) 
            onPlaybackStatusUpdate(status)
            setCurrentSound(sound);
            //console.log(`sound ${status}`)
            setIsPlaying(status.isLoaded)
            await sound.playAsync();
        } catch(err) {
            console.log(err.message)
        }

     };

     const onPlaybackStatusUpdate = async (status) => {
        console.log(status)
        if(status.isLoaded && status.isPlaying) {
            const progress = status.positionMillis / status.durationMillis;
            console.log(`progress ${progress}`)
            setProgress(progress);
            setCurrentTime(status.positionMillis);
            setTotalDuration(status.durationMillis);
        }

        //play next track as current track finishes "below"

        if(status.didJustFinish === true) {
            setCurrentSound(null);
            playNextTrack();
        }
     };

     const circleSize = 12;
     const progressBarMovement = `${progress * 100}%`

     const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);

        return `${minutes} : ${seconds < 10 ? "0" : ""} ${seconds}`
     };



    const handlePlayPause = async () => {
        if (currentSound) {
          if (isPlaying) {
            await currentSound.pauseAsync();
          } else {
            await currentSound.playAsync();
          }
          setIsPlaying(!isPlaying);
        }
      };

      const playNextTrack = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }
    
        value.current += 1;
    
        if (value.current < savedTracks.items.length) {
            const nextTrack = savedTracks.items[value.current];
            if (nextTrack) {
                SetCurrentTrack(nextTrack);
                await play(nextTrack);
            } else {
                console.warn("Invalid track at index:", value.current);
            }
        } else {
            //console.warn("End of playlist, restarting playlist");
            alert("End of playlist, restarting playlist")
            value.current = 0;
            const nextTrack = savedTracks.items[value.current];
            if (nextTrack) {
                SetCurrentTrack(nextTrack);
                await play(nextTrack);
            } else {
                console.warn("Invalid track at index:", value.current);
            }
        }
    };

    const playPrevTrack = async() => {
        if (currentSound) {
            await currentSound.stopAsync();
            setCurrentSound(null);
        }

        value.current -= 1;

        if (value.current < savedTracks.items.length) {
            const nextTrack = savedTracks.items[value.current];
            if (nextTrack) {
                SetCurrentTrack(nextTrack);
                await play(nextTrack);
            } else {
                console.warn("Invalid track at index:", value.current);
            }
        } else {
            //console.warn("End of playlist, restarting playlist");
            alert("No more Previous song")
            value.current = 0;
            const nextTrack = savedTracks.items[value.current];
            if (nextTrack) {
                SetCurrentTrack(nextTrack);
                await play(nextTrack);
            } else {
                console.warn("Invalid track at index:", value.current);
            }
        }
    }
    

  return (
    <>
    <LinearGradient colors={["#614385","#516395"]} style={{flex:1}}>
        <View style={[safeAreaTop, {flex: 1,}]} >
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
                        onChangeText={(text) => {setInput(text), handleSearch(text)}}
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
                            <SongItem 
                                item={item} 
                                onPress={play}
                                isPlaying = {item === currentTrack}
                            />
                        )}
                        ListFooterComponent={ currentTrack && (<View  style={{marginBottom: 100}}/>)}
                     />
                ) : (
            
                <FlatList 
                    data={savedTracks?.items}
                    renderItem={({ item }) => (
                    <SongItem 
                        item={item}
                        onPress={play}
                        isPlaying = {item === currentTrack}
                    />
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

    {/* song playing showUp while on Liked songs screen */}

    {currentTrack && (
        
        <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={{
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
                zIndex: 2, // Ensure that the modal button is above other components
            }}
            pointerEvents="box-none" // Let touch events go through this view
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
        
    )}

    {/* song playing screen */}

    <BottomModal 
        visible={modalVisible} 
        onHardwareBackPress={() =>  setModalVisible(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
    >
        <ModalContent 
            style={{
                height: "100%", 
                width: "100%",
                backgroundColor: "#1DB954"
            }}
        >
            <View style={[{
                height: "100%",
                width: "100%",
            }, safeAreaTop]}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                        <AntDesign name="down" size={24} color="white"/>
                    </TouchableOpacity>

                    <Text 
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: "white"
                        }}
                    >
                    {currentTrack?.track?.name}
                    </Text>

                    <TouchableOpacity>
                        <Entypo name="dots-three-vertical" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={{height: 70}}/>
                
                <View style={{
                    padding: 10
                }}>
                    <Image 
                        style={{
                            width: "100%",
                            height: 330,
                            borderRadius: 4
                        }}
                        source={{uri: currentTrack?.track?.album?.images[0]?.url}}
                    />

                    <View style={{
                        marginTop: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        }}
                    >
                        <View>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: "white",
                                }}
                            >
                                {currentTrack?.track?.name}
                            </Text>
                            <Text style={{
                                color: "#D3D3D3",
                                marginTop: 4
                            }}>
                                {currentTrack?.track?.artists[0]?.name}
                            </Text>
                        </View>

                        <AntDesign name="heart" size={24} color="#FFFFFF" />
                    </View>

                    {/* progressBar section */}

                    <View style={{
                        marginTop: 10
                    }}>
                        <View style={{
                            width: "100%",
                            marginTop: 10,
                            height: 3,
                            backgroundColor: "gray",
                            borderRadius: 5
                        }}>
                            <View style={[styles.progressBar, {width: progressBarMovement}]}/>

                            <View style={[
                                {
                                    position: 'absolute',
                                    top: -5,
                                    width: circleSize,
                                    height: circleSize,
                                    borderRadius: circleSize / 2,
                                    backgroundColor: "white",
                                },
                                {
                                    left: `${progress * 100}%`,
                                    marginLeft: - circleSize / 2,
                                }
                                ]}
                            />
                        </View>

                        <View style={{
                            marginTop: 12,
                            alignItems: "center",
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}>
                       {/* music start time and endTime */}
                            <Text style={{
                                color: "#D3D3D3",
                                fontSize: 15
                            }}>{formatTime(currentTime)}</Text>

                            <Text style={{
                                color: "#D3D3D3",
                                fontSize: 15
                            }}>{formatTime(totalDuration)}</Text>
                        </View>
                    </View>

                    {/* controll Icons Section */}

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 17,
                    }}>
                        <TouchableOpacity>
                            <FontAwesome name="arrows" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={playPrevTrack}>
                            <Ionicons name="play-skip-back" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePlayPause}>
                            {isPlaying ? (
                                <AntDesign name="pausecircle" size={60} color="white" />
                            ) : (
                                <TouchableOpacity
                                    onPress={handlePlayPause}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                        backgroundColor: "white",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Entypo name="controller-play" size={26} color="black" />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={playNextTrack}>
                            <Ionicons name="play-skip-forward" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Feather name="repeat" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ModalContent>
    </BottomModal>
</>
  );
};

export default LikedSongsScreen

const styles = StyleSheet.create({
    progressBar: {
        height: "100%",
        backgroundColor: "white",
    }
})