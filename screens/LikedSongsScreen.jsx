import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo} from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LikedSongsScreen = () => {
    const safeAreaTop = { paddingTop: useSafeAreaInsets().top };
    const navigation = useNavigation();
    const [input, setInput] = useState("");
    const [savedTracks, setSavedTracks] = useState([]);

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

    console.log(savedTracks);

    useEffect(() => {
        getSavedTracks();
    }, [])

  return (
    <LinearGradient colors={["#614385","#516395"]} style={{flex:1}}>
        <ScrollView style={[safeAreaTop, {flex: 1,}]}>
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
                        onChangeText={(text) => setInput(text)}
                        placeholderTextColor={"white"}
                        style={{fontWeight: "500"}}
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
                    430 songs
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

                    <TouchableOpacity style={{
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
        </ScrollView>
    </LinearGradient>
  )
}

export default LikedSongsScreen