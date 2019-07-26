import React, { Component } from 'react'
import MapView from 'react-native-maps'
import { View, Text, Alert, DeviceEventEmitter, Platform, StyleSheet } from 'react-native'
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box"

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

    this.checkIsLocation().catch(error => error);
    DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
      console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
    });
  }

  componentDidMount = () => {
    // this.checkIsLocation();
    this.getCurrentPosition();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    LocationServicesDialogBox.stopListener();
  }

  // async checkIsLocation(): Promise {
  async checkIsLocation() {
    let check = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "Use Location ?",
      ok: "YES",
      cancel: "NO",
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services window from closing when it is clicked outside
      preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
      providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    }).catch(error => error);

    return Object.is(check.status, "enabled");
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
      navigator.geolocation.getCurrentPosition(
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
              Alert.alert("", "Error detecting your location" + error.message);
              // console.log();
          }
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
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