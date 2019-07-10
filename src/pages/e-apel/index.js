import React, { Component } from 'react';
import { Text, View, TouchableHighlight, FlatList, Image, ScrollView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import ActionButton from 'react-native-action-button';
import Camera from '../../components/camera';
import ListCekIn from './components/list-cekin';

export default class Index extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#808080',
    title:'E-Apel',
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
      open_camera: false,
      image_base64: '',
      image_uri: '',
      check_in: []
    }
  }

	keyExtractor = (item, index) => index.toString();

  renderItem = ({item}) => (
    <ListCekIn status={item.status} nama={item.nama} waktu={item.waktu} />
  );
  
  render() {
    return ( 
      <View style={{flex:1}}>
        {(this.state.open_camera) && 
          <View style={{flex:1}}>
            <Camera type='front' onPickFoto={(data) => { this.handlePickFoto(data) }}/>
          </View>
        } 
        { (!this.state.open_camera) && 
          <View>
            <View style={{marginHorizontal:10}}>
              <Text>Hai Sari, lokasi Anda berjarak 20 Meter, silakan cek in untuk mengikuti apel.</Text>
            </View>
            <View style={{marginHorizontal:10}}>
              <View style={{height:300, borderColor:'#808080', borderWidth:1, backgroundColor:'white', marginVertical:10}}>
                <Image style={{flex:1, height: undefined, width: undefined }} source={{ uri:this.state.image_base64} } />
              </View>
              <ActionButton position='center' offsetY={60} 
                renderIcon={()=>{
                  return <IconFA5 name="camera" size={22} color='white'/>;
                }} 
                onPress={() => this.setState({open_camera: true})}
                buttonColor="#808080"/>
              <Button
                title="Cek In"
                type="outline"
                disabled={(this.state.image_base64 == '') ? true : false}
                buttonStyle={{borderColor:'#696969'}}
                titleStyle={{color:'#696969'}}
                onPress={this.pushCekIn}
                icon={
                  <Icon
                    name="flag"
                    size={19}
                    type='font-awesome'
                    iconStyle={{marginRight:5}}
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
          </View>
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

  pushCekIn = () => {
    this.setState({ check_in: [...this.state.check_in, {
      'status': 'Cek In',
      'nama': 'Sari', 
      'waktu': '01-05-2019 08:20:21'
    }],
    image_base64: '' })
  }
}