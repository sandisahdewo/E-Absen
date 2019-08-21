import React, {Component} from 'react'
import {View, Text} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ListItem } from 'react-native-elements'
import APIApel from '../../services/apel'

export default class Index extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      listApel: {
        
      }
    }
  }

  componentDidMount() {
    this.getReport();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({item}) => {
    const icon = item.keterangan.name == 'izin_apel' ? 'flight-takeoff' : item.keterangan.name == 'hadir_apel' ? 'check' : item.keterangan.name == 'tanpa_keterangan' ? 'close' : 'timer' 
    const concateTanggalAndPeriode = `${item.apel.tanggal_view} - ${item.apel.periode}`
    return (
      <ListItem
        containerStyle={{height:50}}
        title={concateTanggalAndPeriode}
        subtitle={item.keterangan.text}
        leftIcon={{name: icon}}
        bottomDivider={true}
      />
    )
  }

  getReport = () => {
    APIApel.GetReportPegawaiPerMonth(614)
      .then(res => {
        this.setState({
          listApel: res,
        }, () => {
          console.log('list apel', this.state.listApel)
        })
      })
  }

  render() {
    return(
      <View>
        <View style={{alignItems:'center'}}>
        </View>
        <View>
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
