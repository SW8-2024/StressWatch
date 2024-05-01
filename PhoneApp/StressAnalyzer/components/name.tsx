import React from 'react';
import {View, Text} from 'react-native';
import MaskedView from "@react-native-masked-view/masked-view"
import { Image } from 'expo-image';

export function ChillChaser()
{
    return (
        <MaskedView
          style={{ flexDirection: 'row', height: '30%', width: '100%',gap:-40, top:-40}}
          maskElement={
            <View
              style={{
                // Transparent background because mask is based off alpha channel.
                backgroundColor: 'transparent',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 60,
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                ChillChaser
              </Text>
            </View>
          }
        >
          <Image style={{ flex: 1, height: '100%', backgroundColor: '#6bbde0' }}
          source={require("../assets/images/flowers.jpeg")}
          />
          
        </MaskedView>
    );
}