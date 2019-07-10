import React, { Component } from 'react';
import { Text, View, TouchableHighlight, KeyboardAvoidingView, Image, ScrollView } from 'react-native';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import { CheckBox, Textarea, Content } from 'native-base';
import { Button } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import Camera from '../../components/camera';

export default class Index extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#808080',
    title:'E-Izin',
    // headerLeft: (
    //   <TouchableHighlight>
    //     <View style={{marginLeft: 15}}>
    //       <IconFA5 name="arrow-left" size={22} color="#808080"/>
    //     </View>
    //   </TouchableHighlight>
    // )
  };

  constructor(props) {
    super(props);
    this.state = {
      checkbox_selected: 'terlambat',
      open_swafoto: false,
      open_lampiran: false,
      image_swafoto_base64: '',
      image_lampiran_base64: '',
    }
  }

  render() {
    return ( 
      <View style={{flex:1}}>
        {(this.state.open_swafoto) && 
          <Camera type='front' onPickFoto={(data) => { this.handlePickSwaFoto(data) }}/>
        } 
        {(this.state.open_lampiran) && 
          <Camera onPickFoto={(data) => { this.handlePickLampiran(data) }}/>
        }
        { (!this.state.open_swafoto && !this.state.open_lampiran) &&
          <ScrollView>
            <KeyboardAvoidingView style={{flex:1}} behavior='padding' enabled>
            <View style={{flex:1, padding:8}}>
              <View>
                <Text>Hai Sari, Anda telat 28 menit</Text>
                <Text>Lokasi Anda saat ini adalah:</Text>
              </View> 
              {/* Maps */}
              <View style={{height:150, backgroundColor:'red'}}>

              </View>
              {/* Unggah Foto & Lampiran */}
              <View style={{height:180, flexDirection:'row'}}>
                <View style={{flex:1, marginVertical:5, marginRight:5}}>
                  <Text>Unggah Swafoto: </Text>
                  <View style={{backgroundColor:'white', borderColor:'#808080', height:150, borderWidth:1}}>
                    <Image style={{flex:1, height: undefined, width: undefined }} source={{ uri:this.state.image_swafoto_base64} } />
                  </View>
                  <ActionButton position='center' offsetY={5} 
                    renderIcon={()=>{
                      return <IconFA5 name="camera" size={22} color='white'/>;
                    }} 
                    buttonColor="#808080"
                    onPress={() => this.setState({open_swafoto: true}) }
                  />
                </View>
                <View style={{flex:1, marginVertical:5, marginLeft:5}}>
                  <Text>Unggah Bukti: </Text>
                  <View style={{backgroundColor:'white', borderColor:'#808080', height:150, borderWidth:1}}>
                    <Image style={{flex:1, height: undefined, width: undefined }} source={{ uri:this.state.image_lampiran_base64} } />
                  </View>
                  <ActionButton position='center' offsetY={5} 
                    renderIcon={()=>{
                      return <IconFA5 name="file" size={22} color='white'/>;
                    }} 
                    buttonColor="#808080"
                    onPress={() => this.setState({open_lampiran: true}) }
                  />
                </View>
              </View>
              
              {/* Status Perizinan */}
              <View>
                <Text>Status Perizinan: </Text>
                <View style={{flexDirection:'row', marginVertical:10}}>
                  <View style={{flex:1, flexDirection:'row'}}>
                    <CheckBox 
                      onPress={() => this.handleCheckBoxStatusIzin('terlambat')} 
                      checked={(this.state.checkbox_selected == 'terlambat')} 
                      color='#696969'
                    />
                    <Text style={{marginLeft:15}}>Terlambat</Text>
                  </View>
                  <View style={{flex:1, flexDirection:'row'}}>
                    <CheckBox 
                      onPress={() => this.handleCheckBoxStatusIzin('cuti')} 
                      checked={(this.state.checkbox_selected == 'cuti')} 
                      color='#696969'
                    />
                    <Text style={{marginLeft:15}}>Cuti</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:1, flexDirection:'row'}}>
                    <CheckBox 
                      onPress={() => this.handleCheckBoxStatusIzin('izin')} 
                      checked={(this.state.checkbox_selected == 'izin')} 
                      color='#696969'
                    />
                    <Text style={{marginLeft:15}}>Izin</Text>
                  </View>
                  <View style={{flex:1, flexDirection:'row'}}>
                    <CheckBox 
                      onPress={() => this.handleCheckBoxStatusIzin('tugas-dinas')} 
                      checked={(this.state.checkbox_selected == 'tugas-dinas')} 
                      color='#696969'
                    />
                    <Text style={{marginLeft:15}}>Tugas Dinas</Text>
                  </View>
                </View>
              </View>
              {/* Form Keterangan Izin */}
              <View style={{marginTop:10}}>
                <Textarea rowSpan={3} bordered placeholder="Keterangan Izin" />
              </View>
              {/* Tombol Kirim */}
              <View style={{marginTop:15}}>
                <Button
                  title="Kirim"
                  type="outline"
                  buttonStyle={{borderColor:'#696969'}}
                  titleStyle={{color:'#696969'}}
                  icon={
                    <IconFA5 name='telegram-plane' size={20} style={{marginRight:10}} />
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

  handleCheckBoxStatusIzin = (value) => {
    this.setState({checkbox_selected: value})
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
  
}