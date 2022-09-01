import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, View, StyleSheet, ScrollView} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import WalletOffchainMain from './WalletOffchainMain';
import WalletOnchainMain from './WalletOnchainMain';
import {Icon} from 'react-native-vector-icons/MaterialIcons';
import WalletOffchainRecieve from './WalletOffchainRecieve';
import SingleModal from '../../components/common/SingleModal';
// import useAuthActions from '../utils/hooks/UseAuthActions';
const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
function WalletMain() {
  const [modalVisible, setModalVisible] = useState(true);
  // const {updateTokenAmount} = useAuthActions();
  // useEffect(() => {
  //   updateTokenAmount();
  // }, []);
  return (
    <>
      <Tab.Navigator
        initialRouteName="WalletOffchain"
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: '#009688',
          },
          tabBarActiveTintColor: '#009688',
        }}>
        <Tab.Screen
          name="WalletOffchain"
          component={WalletOffchainScreen}
          options={{
            tabBarLabel: 'fafaf',
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="WalletOnchain"
          component={WalletOnchainScreen}
          options={{
            tabBarLabel: 'asd',
            tabBarIcon: ({color}) => (
              <Icon name="home" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
      {modalVisible ? (
        <SingleModal
          text="MEMINT 지갑 내 모든 거래는 Baobab Network에서 이루어집니다"
          //body={<Text>정말로?</Text>}
          buttonText="확인"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          pFunction={() => {
            setModalVisible(false);
          }}
        />
      ) : null}
    </>
  );
}

const WalletOffchainScreen = () => {
  return (
    //     <Stack.Navigator initialRouteName="WalletOffchainMain">
    //       <Stack.Screen
    //         name="WalletOffchainMain"
    //         component={WalletOffchainMain}
    //         // options={{headerShown: false}}
    //       />
    //       <Stack.Screen
    //         name="WalletOffchainRecieve"
    //         component={WalletOffchainRecieve}
    //         // options={{headerShown: false}}
    //       />
    //     </Stack.Navigator>
    //   );
    <Text>test</Text>
  );
};

const WalletOnchainScreen = () => {
  return (
    //     <Stack.Navigator initialRouteName="WalletOnchainMain">
    //       <Stack.Screen
    //         name="WalletOnchainMain"
    //         component={WalletOnchainMain}
    //         options={{headerShown: false}}
    //       />
    //     </Stack.Navigator>
    //   );
    <Text>test</Text>
  );
};

export default WalletMain;
