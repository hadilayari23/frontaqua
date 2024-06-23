import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'; // Importez useNavigation
import COLORS from '../Constants/Colors';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Devices = () => {
  const [waterIcon, setWaterIcon] = useState('water');
  const [filterData, setFilterData] = useState([]);
  const navigation = useNavigation();

  const toggleWaterIcon = () => {
    const newIcon = waterIcon === 'water' ? 'water-off' : 'water';
    setWaterIcon(newIcon);
  };

  const fetchData = async () => {
    try {
      const auth = await SecureStore.getItemAsync('user');
      if (!auth) {
        console.log("L'utilisateur n'est pas authentifié.");
        return;
      }
      const response = await axios.get('http://192.168.1.17:4000/device', {
        params: { id: auth._id },
      });
      const resultData = response.data;
      if (resultData.success === true) {
        setFilterData(resultData.data);
      } else {
        console.log(resultData.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const changeState = async (active) => {
    try {
      const result = await axios.post(`http://192.168.1.17:4000/device/state`, { active });
      console.log(result.data);
      if (result.data.success) {
        await axios.get('http://192.168.1.17:4000/py').then(success => console.log('done')).catch(error => console.log(error));
        //navigation.navigate('Devices'); // Utilisez la navigation pour naviguer vers l'écran "Devices"
        fetchData();
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'état:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View className="w-full h-max p-5 ">
      <Button className=" w-20 h-max bg-sky-600 mb-3 ">
        <Icon
          name="text-box-plus-outline"
          size={25}
          color={COLORS.black}
        />
      </Button>
      {filterData.map(({ _id, name, deveui, active }) => (
        <Card key={_id} className=" h-max bg-sky-600 mb-4" >
          <Card.Content>
            <View>
              <Text className="pb-4">Device Name: {name}</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <View>
              {active === "01" ?
                <Icon
                  name="water"
                  size={50}
                  onPress={() => changeState("00")}
                /> : <Icon
                  name="water-off"
                  size={50}
                  onPress={() => changeState("01")}
                />}
            </View>
            <View>
              <Icon
                name='delete'
                size={40}
              />
            </View>
            <View>
              <Icon
                name='update'
                size={40}
              />
            </View>
          </Card.Actions>
        </Card>
      ))}
    </View> 
  );
};

export default Devices;
