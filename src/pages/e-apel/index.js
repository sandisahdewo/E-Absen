import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, ScrollView, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import ActionButton from 'react-native-action-button';
import Camera from '../../components/camera';
import ListCekIn from './components/list-cekin';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import APIApel from '../../services/apel'
import { User } from '../../storage/async-storage'
import { Toast } from 'native-base';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const initialRegion = {
  latitude: -7.765437,
  longitude: 113.243183,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

export default class Index extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#808080',
    title: 'E-Apel',
  };

  constructor(props) {
    super(props);
    this.state = {
      open_camera: false,
      image_base64: '',
      image_uri: '',
      check_in: [],
      region: {
        latitude: -7.765437,
        longitude: 113.243183,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      user: {}
    }

  }

  getUserLogin = async () => {
    const user = await User.getUserLogin()
    this.setState({
      user: user
    })
 }

  componentDidMount() {
    this.getCurrentPosition();
    this.getUserLogin()
  }

  setRegion = (region) => {
    if (this.state.ready) {
      setTimeout(() => this.map.animateToRegion(region), 10);
    }
    this.setState({ region });
  }

  getCurrentPosition = () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          this.setRegion(region);
        },
        (error) => {
          //TODO: better design
          switch (error.code) {
            case 1:
              if (Platform.OS === "ios") {
                Alert.alert("", "To locate your location enable permission for the application in Settings - Privacy - Location");
              } else {
                Alert.alert("", "To locate your location enable permission for the application in Settings - Apps - ExampleApp - Location");
              }
              break;
            default:
              Alert.alert("", "Error detecting your location " + error.message);
            // console.log();
          }
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 },
        // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
      this.watchID = Geolocation.watchPosition(position => {
        const lastPosition = JSON.stringify(position);
        this.setState({ lastPosition });
      });
    } catch (e) {
      alert(e.message || "");
    }
  };

  onMapReady = (e) => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  };

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListCekIn status={item.status} nama={item.nama} waktu={item.waktu} />
  );

  render() {
    return (
      <View style={{ flex: 1 }}>
        {(this.state.open_camera) &&
          <View style={{ flex: 1 }}>
            <Camera type='front' onPickFoto={(data) => { this.handlePickFoto(data) }} />
          </View>
        }
        {(!this.state.open_camera) &&
          <ScrollView style={{ margin: 8 }}>
            <View>
              <Text>Hai Sari, lokasi Anda berjarak 20 Meter, silakan cek in untuk mengikuti apel.</Text>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                ref={map => { this.map = map }}
                style={styles.map}
                region={this.state.region}
                showsUserLocation={true}
                followUserLocation={true}
                onMapReady={this.onMapReady}
              >
                <MapView.Marker
                  coordinate={{
                    latitude: (this.state.region.latitude + 0.00050) || -36.82339,
                    longitude: (this.state.region.longitude + 0.00050) || -73.03569,
                  }}
                >
                  <View>
                    <Text style={{ color: '#000' }}>
                      {this.state.region.latitude} / {this.state.region.longitude}
                    </Text>
                  </View>
                </MapView.Marker>
              </MapView>
            </View>
            <View>
              <View style={{ height: 300, borderColor: '#808080', borderWidth: 1, backgroundColor: 'white', marginVertical: 10 }}>
                <Image style={{ flex: 1, height: undefined, width: undefined }} source={{ uri: this.state.image_base64 }} />
              </View>
              <ActionButton position='center' offsetY={110}
                renderIcon={() => {
                  return <IconFA5 name="camera" size={22} color='white' />;
                }}
                onPress={() => this.setState({ open_camera: true })}
                buttonColor="#808080" />
              <Button
                title="Cek In"
                type="outline"
                disabled={(this.state.image_base64 == '') ? true : false}
                buttonStyle={{ borderColor: '#696969' }}
                titleStyle={{ color: '#696969' }}
                onPress={() => this.checkin()}
                icon={
                  <Icon
                    name="flag"
                    size={19}
                    type='font-awesome'
                    iconStyle={{ marginRight: 5 }}
                    color='#696969'
                  />
                }
              />
              <Button
                onPress={() => this.props.navigation.navigate('IzinIndex')}
                title="E-Izin"
                type="outline"
                buttonStyle={{ borderColor: '#696969', marginTop: 10 }}
                titleStyle={{ color: '#696969' }}
                icon={
                  <Icon
                    name="info-circle"
                    size={19}
                    type='font-awesome'
                    iconStyle={{ marginRight: 5 }}
                    color='#696969'
                  />
                }
              />
            </View>
            <FlatList
              data={this.state.check_in}
              key={this.keyExtractor}
              renderItem={this.renderItem}
            />
          </ScrollView>
        }
      </View>
    );
  }

  handlePickFoto = (data) => {
    this.setState({
      image_uri: data.uri,
      image_base64: `data:image/jpeg;base64,${data.base64}`,
      open_camera: false
    })
  }

  checkin = () => {
    const formData = {
      apel_id: 1,
      user_id: this.state.user.id,
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    }

    APIApel.Checkin(formData)
      .then(res => {
        Toast.show({
          text: 'Check in apel berhasil!',
          buttonText: 'Okay',
          type:'success'
        })
        this.props.navigation.navigate('ProfileIndex')
      })
      .catch(err => {
        Toast.show({
          text: err.message,
          buttonText: 'Okay',
          type:'danger'
        })
      })

  }
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 150,
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});