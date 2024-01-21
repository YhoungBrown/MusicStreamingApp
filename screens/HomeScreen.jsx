import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import ArtistCard from '../components/ArtistCard';
import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import { useNavigation } from '@react-navigation/native';




const HomeScreen = () => {
  const navigation = useNavigation();
  const safeAreaTop = { paddingTop: useSafeAreaInsets().top };
  const safeAreaBottom = { paddingBottom: useSafeAreaInsets().bottom };

  const [userProfile, setUserProfile] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topArtist, setTopArtist] = useState([]);
  const [loading, setLoading] = useState(false);


  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Moring"
    } else if (currentTime < 16){
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  }

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

  //console.log(userProfile);

  const getRecentlyPlayedSongs = async () => {
    setLoading(true);
    const accessToken = await AsyncStorage.getItem("token");
  
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",  // Fix the URL here
        headers: {
          Authorization: `Bearer ${accessToken}`,
          //'Content-Type': 'application/json',
        },
      });

      const tracks = response.data.items;

      setRecentlyPlayed(tracks);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("RecentlyPlayedErrorBelow")
      console.log(error.message);
    }
  };


  const getTopItems = async() => {
    setLoading(true)
    const accessToken = await AsyncStorage.getItem("token");

    try{
      if(!accessToken){
        console.log("Access Token not found");
        setLoading(false);
        return;
      }

      //api endpoints
      //https://api.spotify.com/v1/me/top/artists
      //https://api.spotify.com/v1/me/following?type=artist

      const type = "artist"
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/following?type=artist",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      })

      const myTopArtists = response.data.artists.items;
      //console.log(response);
      setTopArtist(myTopArtists);
      setLoading(false);
    } catch (error){
      setLoading(false);
      console.log(error.message)
    }
  }

  //console.log(topArtist.length)


  useEffect(() => {
    getProfile();
    getRecentlyPlayedSongs();
    getTopItems();
  }, []);
  
  //console.log (`recently played = ${recentlyPlayed}`)
  //console.log (topArtist);

  
  function LikedSongsNHiphop() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Liked Songs */}
        <TouchableOpacity
        onPress={() => navigation.navigate("LikedSongs")}
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
            gap: 10,
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 8,
            backgroundColor: "#202020",
            borderRadius: 4,
            elevation: 3,
          }}
        >
          <LinearGradient colors={['#33006F', '#FFFFFF']}>
            <TouchableOpacity
              style={{
                height: 55,
                width: 55,
                justifyContent: "center",
                alignItems: 'center'
              }}
            >
              <AntDesign name="heart" size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>
          <Text style={{ color: "white", fontSize: 13, fontWeight: 'bold' }}>Liked Songs</Text>
        </TouchableOpacity>
  
        {/* Hiphop Tamhiza */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
            gap: 10,
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 8,
            backgroundColor: "#202020",
            borderRadius: 4,
            elevation: 3,
          }}
        >
          <Image style={{ width: 55, height: 55 }} source={{uri: "https://i.pravatar.cc/100"}} />
          <View>
            <Text style={{ color: "white", fontSize: 13, fontWeight: 'bold' }}>Hiphop Tamhiza</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  

  function TopArtistNDownRecentlyPlayed () {
    return(
      <View style={{marginBottom: 90}}>
      <Text style={{
        color: "white", 
        fontSize: 19, 
        fontWeight: "bold", 
        marginHorizontal: 10, 
        marginTop: 10
        }}
      >
        Your Followed Artists
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {!loading ? (
          topArtist.length > 0 ? (
          topArtist?.map((item, index) => (
          <ArtistCard item={item} key={index}/>))
          ) : (
                <Text 
                  style={{
                  color: "white", 
                  textAlign: 'center',
                  alignItems: 'center',
                  marginLeft: 120,
                  marginTop: 15
                  }}
                >
                  No top artist yet
                </Text>
            )   
        ) : (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center', 
            alignItems: 'center',
            marginTop: 27,
            paddingLeft: 175,
            }}
          >
            <ActivityIndicator color={"white"} size={30}/>
          </View>
        )}
      </ScrollView>

      <View style={{height: 10}}/>

      <Text style={{
        color: "white", 
        fontSize: 19, 
        fontWeight: "bold", 
        marginHorizontal: 10, 
        marginTop: 10
        }}
      >
        Recently Played
      </Text>

        {!loading ? (
          <FlatList 
            data={recentlyPlayed}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => <RecentlyPlayedCard item={item}
            key={index}/>}
          />
        ) : (
          <View style={{
            justifyContent: 'center', 
            alignItems: 'center',
            marginTop: 27,
            }}
          >
            <ActivityIndicator color={"white"} size={30}/>
          </View>
        )}
      </View>
    )
  } //25 22

  function displayRecentlyPlayedSongs() {

    const renderItem =({item}) => {
      return(
        <TouchableOpacity 
          style={{
          flex: 1, 
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: "#282828",
          borderRadius: 4,
          elevation:3
          }}
        >
          <Image 
            style={{width: 55, height: 55}} 
            source={{uri: item.track.album.images[0].url}}
          />
          <View style={{flex: 1, marginHorizontal: 8, justifyContent: 'center'}}>
            <Text
            numberOfLines={2}
             style={{
              fontSize: 13,
              fontWeight: "bold",
              color: "white"
              }}
            >
                {item.track.name}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }

    return(
      !loading ? (
            <FlatList
              ListHeaderComponent={LikedSongsNHiphop} 
              data={recentlyPlayed}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={{justifyContent: 'space-between'}}
              //ListFooterComponent={TopArtistNDownRecentlyPlayed}
            />
      ) : (
        <View style={{
          justifyContent: 'center', 
          alignItems: 'center',
          marginTop: 25,
          }}
        >
          <ActivityIndicator color={"white"} size={22}/>
        </View>
      )
    )
  }
  

  return (
    <LinearGradient 
      colors={['#040306', '#131624']} 
      style={{ flex: 1 }}
    >
      <ScrollView style={safeAreaTop}>
            {/**User and greeting */}
          <View style={{flexDirection: 'row', alignItems: "center", padding: 10, justifyContent: "space-between"}}>
            <View 
              style={{
                flexDirection: 'row', 
                alignItems: "center", 
              }}
            >
              <Image source={{uri: userProfile?.images?.[0]?.url}}
                style={{width: 40, height: 40, borderRadius: 20, resizeMode: 'cover'}}
              />

              <Text style={{color: "white", marginLeft: 10, fontSize: 20, fontWeight: "bold"}}>{greetingMessage()}</Text>

            </View>

            <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="white" />
          </View>
                
                {/**Music and Podcast */}
          <View 
            style={{marginHorizontal: 12, marginVertical: 5, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10}}
          >
            <TouchableOpacity 
              style={{backgroundColor: "#282828", padding: 10, borderRadius: 30}}
            >
                <Text style={{fontSize: 15, color: "white"}}>
                  Music
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{backgroundColor: "#282828", padding: 10, borderRadius: 30}}
            >
                <Text style={{fontSize: 15, color: "white"}}>
                  Podcasts & Shows
                </Text>
            </TouchableOpacity>
          </View>
     
      
          {/**recentlyPlayed Songs */}
              {displayRecentlyPlayedSongs()}

          {/** TopArtist and downRecentlyPlayedSongs */}
              {TopArtistNDownRecentlyPlayed()}

        <View style={safeAreaBottom} />
      </ScrollView>       
    </LinearGradient>
    
  )
}

export default HomeScreen