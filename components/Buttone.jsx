import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';





const Buttone = ({ title, backgroundColor, icon, borderColor, borderWidth, onPress}) => {
    return (
        <TouchableOpacity
            //activeOpacity={0.5}
            onPress={onPress}
            style={{
                padding: 10,
                backgroundColor: backgroundColor,
                marginLeft: 'auto', 
                marginRight: "auto",
                width: 300,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                marginBottom: 15,
                borderColor : borderColor,
                borderWidth : borderWidth,
            }}
        >
            {icon}
            
            <Text style={{color: "white", fontWeight: 500, marginVertical: 4}}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Buttone;
