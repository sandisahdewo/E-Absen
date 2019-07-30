import React, { Component } from 'react';
import {ActivityIndicator, Text, View, StyleSheet, FlatList, Image, ScrollView} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import ActionButton from 'react-native-action-button';
import Camera from '../../components/camera';
import ListCekIn from './components/list-cekin';
import APIApel from '../../services/apel'
import { User } from '../../storage/async-storage'
import { Toast } from 'native-base';
import Maps from '../../components/maps'
import NetInfo from '../../components/netinfo'

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
        latitude: -7.761548, //koordinat pemkab
        longitude: 113.416132, //koordinat pemkab
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      user: {},
      // lat: '-8.034031', //koordinat pemkab
      // long: '112.648491', //koordinat pemkab
      lat: -7.761548, //koordinat pemkab
      long: 113.416132, //koordinat pemkab
      dist: 0,
      updatesEnabled: false,
      lastPosition:'',
      location:{},
      ready:false
    }

  }

  getUserLogin = async () => {
    const user = await User.getUserLogin()
    this.setState({
      user: user
    })
  }

  componentDidMount() {
    this.getUserLogin()
  }

  handleMapsChangeLocation = (data) => {
    this.setState({
      region:data
    }, () => {
      console.log('region', this.state.region)
        let dist = this.distance(this.state.lat, this.state.long, this.state.region.latitude, this.state.region.longitude, "K");
        this.setState({ dist })
        this.setState({ ready:true })
    })
  }

  distance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 * 1000 }
    if (unit == "M") { dist = dist * 0.8684 }
    return Math.round(dist)
  }


  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListCekIn status={item.status} nama={item.nama} waktu={item.waktu} />
  );
  
  buttonCheckinOrIzin=()=>{
    if (this.state.dist >= 20) {
      return <Button
          onPress={() => this.props.navigation.navigate('IzinIndex')}
          title="Izin Apel"
          type="outline"
          buttonStyle={{ borderColor: '#696969' }}
          titleStyle={{ color: '#696969' }}
        />
    } else {
      return <Button
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
    }
  }

  textDistance=()=>{
    if (this.state.ready == false) {
      return <ActivityIndicator></ActivityIndicator>
    }
    
    if (this.state.dist >= 20) {
      return <Text>Hai Sari, lokasi Anda berjarak {this.state.dist} Meter, Anda tidak boleh checkin</Text>
    } else {
      return <Text>Hai Sari, lokasi Anda berjarak {this.state.dist} Meter, silakan cek in untuk mengikuti apel.</Text>
    }
  }

  spinner=()=>{
    if (this.state.ready==false) {
      return <ActivityIndicator></ActivityIndicator>
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NetInfo>
        {(this.state.open_camera) &&
          <View style={{ flex: 1 }}>
            <Camera type='front' onPickFoto={(data) => { this.handlePickFoto(data) }} />
          </View>
        }
        {(!this.state.open_camera) &&
          <ScrollView style={{ margin: 8 }}>
            <View>
            {/* <Text>Hai Sari, lokasi Anda berjarak {this.state.dist} Meter, silakan cek in untuk mengikuti apel.</Text> */}
            {this.textDistance()}
            </View>
            <View style={styles.mapContainer}>
              <Maps onMapsChangeLocation={(data) => this.handleMapsChangeLocation(data) }/>
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
                {this.buttonCheckinOrIzin()}
                {this.spinner()}
            </View>
            <FlatList
              data={this.state.check_in}
              key={this.keyExtractor}
              renderItem={this.renderItem}
            />
          </ScrollView>
        }
        </NetInfo>
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