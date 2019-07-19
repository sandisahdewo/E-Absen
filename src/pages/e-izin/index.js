import React, { Component } from 'react';
import { Picker, Item, Label, Input } from 'native-base';
import { format } from 'date-fns'
import MapView from 'react-native-maps';
import Camera from '../../components/camera';
import { Button } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from '@react-native-community/geolocation';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { Alert,Text, View, KeyboardAvoidingView, Image, ScrollView, StyleSheet, Platform, BackHandler, DeviceEventEmitter, DatePickerAndroid } from 'react-native';

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
    title: 'E-Izin',
  };

  constructor(props) {
    super(props);
    this.checkIsLocation().catch(error => error);
    DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
      console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
    });
    this.state = {
      status_izin: '',
      open_swafoto: false,
      open_lampiran: false,
      image_swafoto_base64: '',
      image_lampiran_base64: '',
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      ready: true,
      lama_izin: '0',
      list_lama_izin : [
        'sakit', 'dinas_luar', 'tugas_belajar', 'cuti'
      ],
      tanggal_awal_izin: '',
      tanggal_akhir_izin: ''
    }
  }
  async checkIsLocation(): Promise {
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

  componentDidMount() {
    // this.checkIsLocation();
    this.getCurrentPosition();
  }

  setRegion=(region)=>{
    if (this.state.ready) {
      setTimeout(() => this.map.animateToRegion(region), 10);
    }
    this.setState({ region });
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

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    LocationServicesDialogBox.stopListener();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {(this.state.open_swafoto) &&
          <Camera type='front' onPickFoto={(data) => { this.handlePickSwaFoto(data) }} />
        }
        {(this.state.open_lampiran) &&
          <Camera onPickFoto={(data) => { this.handlePickLampiran(data) }} />
        }
        {(!this.state.open_swafoto && !this.state.open_lampiran) &&
          <ScrollView>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
              <View style={{ flex: 1, padding: 8 }}>
              
                <View>
                  <Text style={{fontWeight:'bold', fontSize:16}}>Anda saat ini izin tidak mengikuti apel, silakan isi data dibawah ini:</Text>
                </View>
                {/* Maps */}
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
                {/* Unggah Foto & Lampiran */}
                <View style={{ height: 180, flexDirection: 'row' }}>
                  <View style={{ flex: 1, marginVertical: 5, marginRight: 5 }}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>Ambil Swafoto: </Text>
                    <View style={{ backgroundColor: 'white', borderColor: '#808080', height: 150, borderWidth: 1 }}>
                      <Image style={{ flex: 1, height: undefined, width: undefined }} source={{ uri: this.state.image_swafoto_base64 }} />
                    </View>
                    <ActionButton position='center' offsetY={5}
                      renderIcon={() => {
                        return <IconFA5 name="camera" size={22} color='white' />;
                      }}
                      buttonColor="#808080"
                      onPress={() => this.setState({ open_swafoto: true })}
                    />
                  </View>
                  <View style={{ flex: 1, marginVertical: 5, marginLeft: 5 }}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>Unggah Bukti Izin: </Text>
                    <View style={{ backgroundColor: 'white', borderColor: '#808080', height: 150, borderWidth: 1 }}>
                      <Image style={{ flex: 1, height: undefined, width: undefined }} source={{ uri: this.state.image_lampiran_base64 }} />
                    </View>
                    <ActionButton position='center' offsetY={5}
                      renderIcon={() => {
                        return <IconFA5 name="file" size={22} color='white' />;
                      }}
                      buttonColor="#808080"
                      onPress={() => this.setState({ open_lampiran: true })}
                    />
                  </View>
                </View>

                {/* Status Perizinan */}
                <View>
                  <Text style={{fontSize:14, fontWeight:'bold'}}>Status Perizinan: </Text>
                  <Picker
                    note
                    mode="dropdown"
                    selectedValue={this.state.status_izin}
                    onValueChange={(status_izin) => this.setState({status_izin}) }
                  >
                    <Picker.Item label="Dinas Luar" value="dinas_luar" />
                    <Picker.Item label="Diklat" value="diklat" />
                    <Picker.Item label="Lepas Piket" value="lepas_piket" />
                    <Picker.Item label="Tugas Belajar" value="tugas_belajar" />
                    <Picker.Item label="Sakit" value="sakit" />
                    <Picker.Item label="Cuti" value="cuti" />
                  </Picker>
                </View>
                <View>
                  <Text style={{fontSize:14, fontWeight:'bold'}}>Terhitung Mulai Tanggal:</Text>
                  <View style={{flexDirection:'row'}}>
                    <View style={{flex:1, marginTop:10}}>
                      <Item floatingLabel>
                        <Label style={{fontSize:13}}>Tanggal Awal Izin:</Label>
                        <Input value={this.state.tanggal_awal_izin} onTouchStart={() => this.openDate('tanggal_awal_izin')} />
                      </Item>
                    </View>
                    <View style={{flex:1, marginTop:10}}>
                      <Item floatingLabel>
                        <Label style={{fontSize:13}}>Tanggal Akhir Izin:</Label>
                        <Input value={this.state.tanggal_akhir_izin} onTouchStart={() => this.openDate('tanggal_akhir_izin')} />
                      </Item>
                    </View>
                  </View>
                </View>
                {/* Tombol Kirim */}
                <View style={{ marginTop: 15 }}>
                  <Button
                    title="Simpan"
                    type="outline"
                    buttonStyle={{ borderColor: '#696969' }}
                    titleStyle={{ color: '#696969' }}
                    icon={
                      <IconFA5 name='telegram-plane' size={20} style={{ marginRight: 10 }} />
                    }
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        }
      </View>
    );
  }

  handlePickSwaFoto = (data) => {
    this.setState({
      image_swafoto_base64: `data:image/jpeg;base64,${data.base64}`,
      open_swafoto: false
    })
  }

  handlePickLampiran = (data) => {
    this.setState({
      image_lampiran_base64: `data:image/jpeg;base64,${data.base64}`,
      open_lampiran: false
    })
  }

  openDate = async (jenis) => {
    try {
      const {
        action, year, month, day,
      } = await DatePickerAndroid.open({
      date: new Date(),
      maxDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        let value = String(format(new Date(year, month, day), 'DD-MM-YYYY'))
        if(jenis == 'tanggal_awal_izin') {
          this.setState({tanggal_awal_izin: value})
        } 
        if(jenis == 'tanggal_akhir_izin') {
          this.setState({tanggal_akhir_izin: value})
        }
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

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