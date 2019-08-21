import React, { Component } from 'react'
import MapView from 'react-native-maps'
import { View, Text, Alert, DeviceEventEmitter, Platform, StyleSheet } from 'react-native'
import Geolocation from '@react-native-community/geolocation';
const LATITUDE_DELTA = 0.01
const LONGITUDE_DELTA = 0.01

const initialRegion = {
  latitude: -7.765437,
  longitude: 113.243183,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}
export default class Maps extends Component {

  constructor(props) {
    super(props)

    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      ready: true,
    }

  }

  componentDidMount = () => {
    // this.checkIsLocation();
    this.getCurrentPosition();
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }
  
  setRegion=(region)=>{
    if (this.state.ready) {
      setTimeout(() => this.map.animateToRegion(region), 10);
    }
    this.setState({ region });
    this.props.onMapsChangeLocation(region)
  }

  getCurrentPosition=()=> {
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
              // Alert.alert("", "Error detecting your location" + error.message);
              Alert.alert('Peringatan!', 'Kesalahan mengambil lokasi, periksa GPS Anda')
              // console.log();
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
      );
    } catch (e) {
      alert(e.message || "");
    }
  };

  onMapReady = (e) => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  };

  render() {
    return (
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
    )
  }
}

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
})