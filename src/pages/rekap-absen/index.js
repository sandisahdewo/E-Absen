import React, {Component} from 'react'
import {View, Text} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ListItem } from 'react-native-elements'
import APIApel from '../../services/apel'
import { User } from '../../storage/async-storage'
import Spinner from 'react-native-loading-spinner-overlay'

export default class Index extends Component {
  
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#eeeeee',
      elevation: 0
    },
    headerTintColor: '#808080',
    title: 'Rekap Apel',
  };

  constructor(props) {
    super(props)

    this.state = {
      spinner: true,
      listApel: {
        
      },
      user: {
        pegawai: {}
      }
    }
  }

  componentDidMount() {
    this.getUserLogin();
  }

  getUserLogin = async () => {
    const user = await User.getUserLogin();
    this.getReport(user.id);
}

  keyExtractor = (item, index) => index.toString()

  renderItem = ({item}) => {
    const icon = item.keterangan.name == 'izin_apel' ? 'flight-takeoff' : item.keterangan.name == 'hadir_apel' ? 'check' : item.keterangan.name == 'tanpa_keterangan' ? 'close' : item.keterangan.name == 'sedang_berlangsung' ? 'schedule' : 'timer' 
    const concateTanggalAndPeriode = `${item.apel.tanggal_view} - ${item.apel.periode}`
    return (
      <ListItem
        containerStyle={{height:60}}
        title={concateTanggalAndPeriode}
        subtitle={item.keterangan.text}
        leftIcon={{name: icon}}
        bottomDivider={true}
      />
    )
  }

  getReport = (userid) => {
    APIApel.GetReportPegawaiPerMonth(userid)
      .then(res => {
        this.setState({
          listApel: res,
          spinner: false
        })
      })
      .catch(err => {
        this.setState({
          spinner: false
        })
      })
  }

  render() {
    return(
      <View>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{color:'#FFF'}}
        />
        <View style={{paddingTop:5}}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.listApel}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    )
  }
}
