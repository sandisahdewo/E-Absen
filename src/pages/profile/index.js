import React, { Component } from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { Thumbnail } from 'native-base';
import { ListItem, Button, Icon } from 'react-native-elements';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';

export default class Index extends Component {

  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#fff',
    headerLeft: (
      // <TouchableHighlight>
      //   <View style={{marginLeft: 15}}>
      //     <IconFA5 name="arrow-left" size={22} color="#808080"/>
      //   </View>
      // </TouchableHighlight>
      <View></View>
    ),
    headerRight: (
      <View style={{flexDirection:'row'}}>
        <TouchableHighlight style={{marginRight:15}}>
          <View>
            <IconFA5 name="star" size={22} color="#808080"/>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginHorizontal:15}}>
          <View>
            <IconFA5 name="ellipsis-v" size={22} color="#808080"/>
          </View>
        </TouchableHighlight>
      </View>
    )
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
      <View style={{flex:1}}>
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
        <View style={{alignItems:'center', marginTop:20}}>
          {/* <View style={{flex:1, alignItems:'flex-end', marginRight:4}}>
            <Button
              onPress={() => this.props.navigation.navigate('IzinIndex')}
              title="E-Izin"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'#696969'}}
              icon={
                <Icon
                  name="info-circle"
                  size={19}
                  type='font-awesome'
                  iconStyle={{marginRight:5}}
                  color='#696969'
                />
              }
            />
          </View> */}
          <View style={{alignItems:'flex-start', marginLeft:4}}>
            <Button
              onPress={() => this.props.navigation.navigate('ApelIndex')}
              title="E-Apel"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'#696969'}}
              icon={
                <Icon
                  name="users"
                  size={19}
                  type='font-awesome'
                  iconStyle={{marginRight:5}}
                  color='#696969'
                />
              }
            />
          </View>
        </View>
        <View style={{marginTop:10, alignItems:'center'}}>
          <View>
            <Button
              onPress={() => this.props.navigation.navigate('EselonIndex')}
              title="Statistik Peserta Apel"
              type="outline"
              buttonStyle={{borderColor:'#696969'}}
              titleStyle={{color:'red'}}
              icon={
                <Icon
                  name="bar-chart"
                  size={19}
                  type='font-awesome'
                  iconStyle={{marginRight:5}}
                  color='red'
                />
              }
            />
          </View>
        </View>
      </View>
    );
  }
}

const list = [
  {
    title: '18235468798',
    subtitle: 'NIP',
    iconName: 'heart',
    iconType: 'font-awesome'
  },
  {
    title: 'Penanaman Modal',
    subtitle: 'Dinas',
    iconName: 'university',
    iconType: 'font-awesome'
  },
  {
    title: 'Jalan Margosuko, Kenawa, Probolinggo',
    subtitle: 'Alamat',
    iconName: 'map',
    iconType: 'font-awesome'
  },
  {
    title: '-',
    subtitle: 'Status Izin',
    iconName: 'bell',
    iconType: 'font-awesome'
  }
]