import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import LoginScreen from './screens/LoginScreen';
import LikedSongsScreen from './screens/LikedSongsScreen';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{
        tabBarStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            shadowOpacity: 4,
            shadowRadius: 4,
            elevation: 0,
            shadowOffset: {
                width: 0,
                height: -4
            },
            borderTopWidth: 0,
        },
        //tabBarActiveTintColor: "white",
        //tabBarInactiveTintColor: "black",
    }}>
      <Tab.Screen 
            name='Home' 
            component={HomeScreen} 
            options={{
                tabBarLabel: "Home",
                tabBarLabelStyle: {color: "white"},
                headerShown: false,
                tabBarIcon: ({focused}) => focused ? (<Entypo name="home" size={24} color="white" />) : (<AntDesign name="home" size={24} color="white" />)
            }}
        />
      <Tab.Screen 
            name='Profile' 
            component={ProfileScreen} 
            options={{
                tabBarLabel: "Home",
                tabBarLabelStyle: {color: "white"},
                headerShown: false,
                tabBarIcon: ({focused}) => focused ? (
                        <Ionicons name="person" size={24} color="white" />
                    ) : (
                        <Ionicons name="person-outline" size={24} color="white" />
                    )
            }}
        />
      
    </Tab.Navigator> 
  );
}


const Stack = createNativeStackNavigator();
function Navigation() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Main" component={BottomTabs} options={{headerShown: false}}/>
          <Stack.Screen name="LikedSongs" component={LikedSongsScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer> 
    );
  }
  
  export default Navigation