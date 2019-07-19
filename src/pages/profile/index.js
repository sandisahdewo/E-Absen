import React, { Component } from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { Thumbnail, Card } from 'native-base';
import { ListItem, Button, Icon } from 'react-native-elements';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import { ScrollView } from 'react-native-gesture-handler';

export default class Index extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#fff',
    headerLeft: (
      <View>
        <TouchableHighlight>
          <View style={{marginLeft: 15}}>
            <IconFA5 name="sign-out-alt" size={22} color="#808080"/>
          </View>
        </TouchableHighlight>
      </View>
    ),
  };

  keyExtractor = (item, index) => index.toString();
  
  renderItem = ({ item }) => (
    <ListItem
      containerStyle={{padding:10}}
      title={item.title}
      titleStyle={{color:'black'}}
      subtitle={item.subtitle}
      leftIcon={{name:item.iconName, type:item.iconType}}
      topDivider={true}
    />
  );

  render() {
    return ( 
      <ScrollView style={{flex:1}}>
        <View style={{alignItems: 'center', backgroundColor:'#eeeeee', paddingBottom:20}}>
          <Thumbnail large source={require('../../assets/avatars/sari.jpg')}/> 
          <Text style={{fontSize: 20, fontWeight: 'bold'}}> Sandi Sahdewo</Text>
        </View>
        <View style={{marginTop:10, borderBottomColor:'#dcdcdc', borderBottomWidth:1}}>
          <FlatList
						keyExtractor={this.keyExtractor}
						data={list}
						renderItem={this.renderItem}
					/>
        </View>
        <View style={{margin:8}}>
          <Card style={{padding:15}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1}}>
                <Text style={{fontSize:14}}>Mengikuti Apel Pada: 15:02</Text>
                <Text style={{fontWeight:'bold', fontSize:17}}>Terimakasih telah hadir</Text>
              </View>
              <View style={{justifyContent:'center', flex:0.4}}>
                <Icon
                  name="street-view"
                  size={35}
                  type='font-awesome'
                  iconStyle={{marginRight:5}}
                  color='#696969'
                />
              </View>
            </View>
          </Card>
          <Card style={{padding:15}}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1}}>
                <Text style={{fontSize:14}}>Apel dilaksanakan pada: 15:02</Text>
                <Text style={{fontWeight:'bold', fontSize:17}}>Tidak berada dilokasi Apel</Text>
              </View>
              <View style={{justifyContent:'center', flex:0.4}}>
                <Icon
                  name="user-times"
                  size={29}
                  type='font-awesome'
                  iconStyle={{marginRight:5}}
                  color='#696969'
                />
              </View>
            </View>
          </Card>
        </View>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:1, margin:5}}>
            <Button
              onPress={() => this.props.navigation.navigate('ApelIndex')}
              title="Hadir Apel"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'#696969'}}
            />
          </View>
          <View style={{flex:1, margin:5}}>
            <Button
              onPress={() => this.props.navigation.navigate('IzinIndex')}
              title="Izin Apel"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'#696969'}}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const list = [
  {
    title: '18235468798',
    subtitle: 'Nomor Induk Pegawai',
    iconName: 'key',
    iconType: 'font-awesome'
  },
  {
    title: 'Penanaman Modal',
    subtitle: 'Satuan Kerja',
    iconName: 'university',
    iconType: 'font-awesome'
  },
  {
    title: 'Kepala Sub Bidang',
    subtitle: 'Jabatan',
    iconName: 'heart',
    iconType: 'font-awesome'
  }
]