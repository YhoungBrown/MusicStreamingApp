import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Octicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native'




const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const safeAreaTop = { paddingTop: useSafeAreaInsets().top };

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");

    try{
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await response.json()
      setUserProfile(data);
      return data
    } catch(error) {
      console.log(error.message)
    }
  }

  const Logout = async () => {
    try {
      // Clearing the access token from AsyncStorage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("expirationDate");
  
  
      // Redirect to the login screen using React Navigation
      navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
      }));
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    getProfile();

    const getPlaylists = async() => {
      const accessToken = await AsyncStorage.getItem("token");

      try{
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

        setPlaylist(response.data.items)
      } catch(error) {
        console.log(error.message)
      }
    }

    getPlaylists();
  }, []);

//console.log(playlist);

  return (
    <LinearGradient 
      colors={["#040306", "#131624"]} 
      style={{flex: 1}}
    >
      <View style={safeAreaTop}>

              {/* Logout */}

          <TouchableOpacity style={{
            position: 'absolute', 
            left: 340, 
            top: 20, 
            alignItems: 'center'
            }}
            onPress={Logout}
          >
            <Octicons name="sign-out" size={24} color="white" />
            <Text style={{color: "gray", fontSize: 8}}>Logout</Text>
          </TouchableOpacity>
          
        <View style={{ padding: 6 }}>

          {/* ProfilePix and Mail */}

          <View style={{
            //flexDirection: "row", 
            alignItems: "center",
            gap: 10
            }}
          >
              <Image source={{uri: userProfile?.images?.[0]?.url}}
                style={{width: 40, height: 40, borderRadius: 20, resizeMode: 'cover'}}
              />

              <View>
                <Text style={{
                  color: "white", 
                  fontSize: 16, 
                  fontWeight: "bold"
                  }}
                >
                  {userProfile?.display_name}
                </Text>
                <Text style={{
                  color: "gray", 
                  fontSize: 16, 
                  fontWeight: "bold"
                  }}
                >
                  {userProfile?.email}
                </Text>
              </View>
          </View>
        </View>

            {/* My Playlist */}
          <Text style={{
            color: "white", 
            fontSize: 20, 
            fontWeight: "500",
            marginHorizontal:12,
            marginVertical: 5,
            marginTop: 7,
            }}
          >
            Your Playlists
          </Text>

          <ScrollView style={{paddingHorizontal: 15}}>
            {playlist.map((item, index) => (
              <View key={index} style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginVertical: 10
              }}>
                <Image 
                  source={{
                    uri: item?.images[0]?.url || "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }}
                  style={{
                    width: 50, height: 50, borderRadius: 4
                  }}
                />

                <View>
                  <Text style={{color: "white"}}>{item.name}</Text>
                  <Text style={{color: "gray", marginTop: 7}}>0 Followers</Text>
                </View>
              </View>
            ))}
          </ScrollView>
      </View>
    </LinearGradient>
  )
}

export default ProfileScreen