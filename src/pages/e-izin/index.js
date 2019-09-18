import React, { Component } from 'react';
import APIIzin from '../../services/izin'
import Camera from '../../components/camera';
import { Button } from 'react-native-elements';
import Maps from '../../components/maps'
import ActionButton from 'react-native-action-button';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import Datepicker from '../../components/input/datepicker'
import { User } from '../../storage/async-storage'
import {Toast} from 'native-base'
import { Text, View, KeyboardAvoidingView, Image, ScrollView, StyleSheet, Picker, Alert } from 'react-native';
import NetInfo from '../../components/netinfo'
import Spinner from 'react-native-loading-spinner-overlay'

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
    
    this.state = {
      apelId: this.props.navigation.state.params.apelId,
      open_swafoto: false,
      open_lampiran: false,
      image_swafoto_base64: '',
      image_lampiran_base64: '',
      list_jenis_izin: [],
      jenis_izin: '',
      selected_jenis_izin: '',
      tanggal_mulai_izin: '',
      tanggal_selesai_izin: '',
      user: {
        pegawai: {}
      },
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      openCamera: false,
      spinner: true
    }
  }

  componentDidMount() {
    this.getJenisIzin();
    this.getUserLogin();
  }

  getUserLogin = async () => {
    const user = await User.getUserLogin()
    this.setState({
      user: user
    })
    // console.log(this.state.user)
  }

  getJenisIzin = () => {
    APIIzin.getJenisIzin()
      .then(res => {
        this.setState({
          list_jenis_izin: res.data,
          spinner: false
        })
      })
  }

  handleChangeStatusIzin = (data) => {
    let selected = this.state.list_jenis_izin[data]
    this.setState({
      jenis_izin: selected,
      selected_jenis_izin: data
    })
  }

  handlePickSwaFoto = (data) => {
    this.setState({
      image_swafoto_base64: `data:image/jpeg;base64,${data.base64}`,
      open_swafoto: false,
      openCamera: false
    })
  }

  handlePickLampiran = (data) => {
    this.setState({
      image_lampiran_base64: `data:image/jpeg;base64,${data.base64}`,
      open_lampiran: false,
      openCamera: false
    })
  }

  handleMapsChangeLocation = (data) => {
    this.setState({
      region:data
    })
  }

  storeIzin = () => {
    const {image_lampiran_base64, image_swafoto_base64} = this.state;
    if(image_lampiran_base64 == '' || image_swafoto_base64 == '') {
      Alert.alert('Peringatan!', 'Lengkapi swafoto dan bukti izin.')
    } else if(this.state.region.latitude == 0 || this.state.region.longitude == 0) {
      Alert.alert('Peringatan!', 'Lokasi belum ditemukan.')
    }else {
      const formData = { 
        jenis_izin_id: this.state.jenis_izin.id,
        user_id: this.state.user.id,
        apel_id: this.state.apelId,
        foto_bukti: this.state.image_swafoto_base64,
        dokumen_bukti: this.state.image_lampiran_base64,
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude,
        tanggal_mulai_izin: this.state.tanggal_mulai_izin,
        tanggal_selesai_izin: this.state.tanggal_selesai_izin
      }
      
      this.setState({spinner: true})
      APIIzin.postIzin(formData)
        .then(res => {
          if(res.success) {
            Toast.show({
              text: 'Izin apel berhasil!',
              buttonText: 'Okay',
              type:'success',
              duration: 5000
            })
            this.setState({spinner: false})
            this.props.navigation.navigate('ProfileIndex')
          } else {
            this.setState({spinner: false})
            Toast.show({
              text: 'Izin apel gagal disimpan!',
              buttonText: 'Okay',
              type:'danger',
              duration: 5000
            })
          }
        })
        .catch(err => {
          this.setState({spinner: false})
          Toast.show({
            text: err.message,
            buttonText: 'Okay',
            type:'danger',
            duration: 5000
          })
        })
    }
  }

  render() {
    const showView = !this.state.openCamera

    return (
      <View style={{ flex: 1 }}>
        <NetInfo>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color:'#FFF'}}
        />
        {(this.state.open_swafoto) &&
          <Camera type='front' onPickFoto={(data) => { this.handlePickSwaFoto(data) }} />
        }
        {(this.state.open_lampiran) &&
          <Camera onPickFoto={(data) => { this.handlePickLampiran(data) }} />
        }
        {showView &&
          <ScrollView>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
              <View style={{ flex: 1, padding: 8 }}>
              
                <View>
                  <Text style={{fontWeight:'bold', fontSize:16}}>Anda saat ini izin tidak mengikuti apel, silakan isi data dibawah ini:</Text>
                </View>
                {/* Maps */}
                <View style={styles.mapContainer}>
                  <Maps onMapsChangeLocation={(data) => this.handleMapsChangeLocation(data) }/>
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
                      onPress={() => this.setState({ open_swafoto: true, openCamera: true })}
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
                      onPress={() => this.setState({ open_lampiran: true, openCamera: true })}
                    />
                  </View>
                </View>

                {/* Status Perizinan */}
                <View>
                  <Text style={{fontSize:14, fontWeight:'bold'}}>Status Perizinan: </Text>
                  <Picker
                    note
                    mode="dropdown"
                    selectedValue={this.state.selected_jenis_izin}
                    onValueChange={(key) => this.handleChangeStatusIzin(key) }
                  >
                  {this.state.list_jenis_izin.map((list, key) => {
                    return (
                      <Picker.Item key={key} label={list.jenis_izin} value={key} />
                    )
                  })}
                  </Picker>
                </View>
                {this.state.jenis_izin.periode_hari &&
                  <View>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>Terhitung Mulai Tanggal:</Text>
                    <View style={{flexDirection:'row'}}>
                      <View style={{flex:1, marginTop:10}}>
                        <Datepicker title="Tanggal Mulai Izin" value={this.state.tanggal_mulai_izin} onSelected={(tanggal_mulai_izin) => this.setState({tanggal_mulai_izin})} />
                      </View>
                      <View style={{flex:1, marginTop:10}}>
                        <Datepicker title="Tanggal Selesai Izin" value={this.state.tanggal_selesai_izin} onSelected={(tanggal_selesai_izin) => this.setState({tanggal_selesai_izin})} />
                      </View>
                    </View>
                  </View>
                }
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
                    onPress={() => this.storeIzin()}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        }
        </NetInfo>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 150,
  }
});