import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Buttone from '../components/Buttone';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { generateRandom } from 'expo-auth-session/build/PKCE';

const LoginScreen = () => {
    const navigation = useNavigation();
    const safeAreaTop = { paddingTop: useSafeAreaInsets().top };
    const safeAreaBottom = { paddingBottom: useSafeAreaInsets().bottom };

    useEffect(() => {
        const checkTokenValidity = async () => {
           const accessToken = await AsyncStorage.getItem("token");
            const expirationDate = await AsyncStorage.getItem("expirationDate");

            

            if (accessToken && expirationDate) {
                const currentTime = Date.now();
                if (currentTime < parseInt(expirationDate)) {
                    // Token is still valid here
                    navigation.replace("Main");
                } else {
                    // Token expired, so we need to remove from AsyncStorage
                    AsyncStorage.removeItem("token");
                    AsyncStorage.removeItem("expirationDate");
                }
            }
        }
        checkTokenValidity();
    }, [navigation]);

    const authenticate = async () => {
        const config = {
          issuer: "https://accounts.spotify.com",
          clientId: "1703944df905479e927c0968c973e743",
          scopes: [
            "user-read-email",
            "user-library-read",
            "user-read-recently-played",
            "user-top-read",
            "playlist-read-private",
            "playlist-read-collaborative",
            "playlist-modify-public"
          ],
          state: generateRandom(16), //optional (just for extra security)...
          redirectUrl: "exp://192.168.43.92:8081/--/spotify-auth-callback"
        };
      
        const authUrl =
          `https://accounts.spotify.com/authorize` +
          `?response_type=token` +
          `&client_id=${config.clientId}` +
          `&scope=${encodeURIComponent(config.scopes.join(" "))}` +
          `&redirect_uri=${encodeURIComponent(config.redirectUrl)}` +
          `&state=${config.state}`;
      
          try {
            const result = await WebBrowser.openAuthSessionAsync(authUrl, config.redirectUrl);

      
            if (result.type === 'success') {
              const accessToken = result.url.split('access_token=')[1].split('&')[0];
              const expirationDate = new Date().getTime() + 30000; // exp in 30sec. Assuming token expires in 1 hour (3600000)...
              

              AsyncStorage.setItem('token', accessToken);
              AsyncStorage.setItem('expirationDate', expirationDate.toString());
              navigation.navigate('Main');
            } else {
              console.log('Authentication failed');
            }

          } catch (error) {
            console.error('Error during authentication:', error);
          }
    };
    
    

    return (
        <LinearGradient
            colors={['#040306', '#131624']} 
            style={{ flex: 1 }}
        >
            <SafeAreaView style={safeAreaTop}>
                <View style={{height: 80}}/>
                <Entypo style={{textAlign: "center"}} name="spotify" size={80} color="white" />
                <Text style={{
                    color: "white", 
                    fontSize: 40, 
                    fontWeight: 'bold', 
                    textAlign: 'center', 
                    marginTop: 40}}
                >
                        Millions of songs Free on Spotify!
                </Text>

                <View style={{height: 80}}/>

                <Buttone 
                    title="Sign In with spotify"
                    backgroundColor="#1DB954"
                    onPress={authenticate}
                />
                <Buttone 
                    title="Continue with phone number"
                    backgroundColor="#131624"
                    borderColor="#C0C0C0"
                    borderWidth={0.8}
                    icon={<MaterialIcons style={{position: 'absolute',bottom: 0, left: 10, right: 0, top: 12, }} name="phone-android" size={24} color="white" />}
                />
                <Buttone 
                    title="Continue with Google"
                    backgroundColor="#131624"
                    borderColor="#C0C0C0"
                    borderWidth={0.8}
                    icon={<AntDesign  name="google" size={24} color="red" style={{position: 'absolute',bottom: 0, left: 10, right: 0, top: 12, }} />}
                />
                <Buttone 
                    title="Signin with Facebook"
                    backgroundColor="#131624"
                    borderColor="#C0C0C0"
                    borderWidth={0.8}
                    icon={<Entypo name="facebook" size={24} color="blue" style={{position: 'absolute',bottom: 0, left: 10, right: 0, top: 12, }}/>}
                />
            </SafeAreaView>
            <View style={safeAreaBottom} />
        </LinearGradient>
    );
};

export default LoginScreen;
