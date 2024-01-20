import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ProfileScreen = () => {
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

console.log(playlist);

  return (
    <LinearGradient 
      colors={["#040306", "#131624"]} 
      style={{flex: 1}}
    >
      <ScrollView style={safeAreaTop}>
        <View style={{ padding: 12 }}>
          <View style={{
            flexDirection: "row", 
            alignItems: "center",
            gap: 10
          }}>
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
            }}
          >
            Your Playlists
          </Text>

          <View style={{padding: 15}}>
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
          </View>
      </ScrollView>
    </LinearGradient>
  )
}

export default ProfileScreen