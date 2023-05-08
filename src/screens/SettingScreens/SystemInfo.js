import React, { Component } from 'react'
import { StyleSheet, Text, View, Slider, TouchableOpacity, Switch, ActivityIndicator, ScrollView, Platform } from 'react-native'
import Header from '../../components/Header';
import SystemSetting from 'react-native-system-setting'

export default class SystemInfo extends Component {
    isAndroid = Platform.OS === 'android'
    volumeListener = null
    wifiListener = null
    bluetoothListener = null
    locationListener = null
    airplaneListener = null

    volTypes = ['音乐', 'system', 'call', 'ring', 'alarm', 'notification']
    volIndex = 0

    constructor(props) {
        super(props)
        this.state = {
            volume: 0,
            volType: this.volTypes[this.volIndex],
            brightness: 0,
            wifiEnable: false,
            wifiStateLoading: false,
            locationEnable: false,
            locationStateLoading: false,
            bluetoothEnable: false,
            bluetoothStateLoading: false,
            airplaneEnable: false,
            airplaneStateLoading: false,
        }
    }

    async componentDidMount() {
        this.setState({
            volume: await SystemSetting.getVolume(this.state.volType),
            brightness: await SystemSetting.getBrightness(),
            wifiEnable: await SystemSetting.isWifiEnabled(),
            locationEnable: await SystemSetting.isLocationEnabled(),
            bluetoothEnable: await SystemSetting.isBluetoothEnabled(),
            airplaneEnable: await SystemSetting.isAirplaneEnabled(),
        })

        this._changeSliderNativeVol(this.sliderVol, this.state.volume)
        this._changeSliderNativeVol(this.sliderBri, this.state.brightness)

        this.volumeListener = SystemSetting.addVolumeListener((data) => {
            const volume = this.isAndroid ? data[this.state.volType] : data.value
            this._changeSliderNativeVol(this.sliderVol, volume)
            this.setState({
                volume: volume
            })
        })

        this.wifiListener = await SystemSetting.addWifiListener((enable) => {
            this.setState({ wifiEnable: enable })
        })

        this.bluetoothListener = await SystemSetting.addBluetoothListener((enable) => {
            this.setState({ bluetoothEnable: enable })
        })

        this.locationListener = await SystemSetting.addLocationListener((enable) => {
            this.setState({ locationEnable: enable })
        })

        this.airplaneListener = await SystemSetting.addAirplaneListener((enable) => {
            this.setState({ airplaneEnable: enable })
        })
    }

    _changeSliderNativeVol(slider, value) {
        slider.setNativeProps({
            value: value
        })
    }

    componentWillUnmount() {
        SystemSetting.removeListener(this.volumeListener)
        SystemSetting.removeListener(this.wifiListener)
        SystemSetting.removeListener(this.bluetoothListener)
        SystemSetting.removeListener(this.locationListener)
        SystemSetting.removeListener(this.airplaneListener)
    }

    _changeVol(value) {
        SystemSetting.setVolume(value, {
            type: this.state.volType,
            playSound: false,
            showUI: false
        })
        this.setState({
            volume: value
        })
    }

    _changeVolType = async () => {
        this.volIndex = ++this.volIndex % this.volTypes.length
        const volType = this.volTypes[this.volIndex]
        const vol = await SystemSetting.getVolume(volType)
        this._changeSliderNativeVol(this.sliderVol, vol)
        this.setState({
            volType: volType,
            volume: vol
        })
    }

    _changeBrightness = async (value) => {
        await SystemSetting.setBrightnessForce(value)
        this.setState({
            brightness: value,
        })
    }

    _restoreBrightness = () => {
        const saveBrightnessVal = SystemSetting.restoreBrightness()
        if (saveBrightnessVal > -1) {
            this.setState({
                brightness: saveBrightnessVal
            })
            this._changeSliderNativeVol(this.sliderBri, saveBrightnessVal)
        }
    }

    _openAppSetting = async () => {
        await SystemSetting.openAppSystemSettings()
    }

    _switchWifi() {
        this.setState({
            wifiStateLoading: true
        })
        SystemSetting.switchWifi(async () => {
            this.setState({
                wifiEnable: await SystemSetting.isWifiEnabled(),
                wifiStateLoading: false
            })
        })
    }

    _switchLocation() {
        this.setState({
            locationStateLoading: true
        })
        SystemSetting.switchLocation(async () => {
            this.setState({
                locationEnable: await SystemSetting.isLocationEnabled(),
                locationStateLoading: false
            })
        })
    }

    _switchBluetooth() {
        this.setState({
            bluetoothStateLoading: true
        })
        SystemSetting.switchBluetooth(async () => {
            this.setState({
                bluetoothEnable: await SystemSetting.isBluetoothEnabled(),
                bluetoothStateLoading: false
            })
        })
    }

    _switchAirplane() {
        this.setState({
            airplaneStateLoading: true
        })
        SystemSetting.switchAirplane(async () => {
            this.setState({
                airplaneEnable: await SystemSetting.isAirplaneEnabled(),
                airplaneStateLoading: false
            })
        })
    }

    BackBtnPress = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { volume, brightness,
            wifiEnable, wifiStateLoading,
            locationEnable, locationStateLoading,
            bluetoothEnable, bluetoothStateLoading,
            airplaneEnable, airplaneStateLoading,
        } = this.state
        return (
            <ScrollView style={styles.container}>
                <View style={{ position: 'relative' }}>
                    <View style={{}}>
                        <Header {...this.props} BtnPress={this.BackBtnPress} title={'我的信息'} proNoName={true} />
                    </View>
                    <ValueView
                        title='音量'
                        btn={this.isAndroid && {
                            title: this.state.volType,
                            onPress: this._changeVolType
                        }}
                        value={volume.toString().substring(0, 5)}
                        changeVal={(val) => this._changeVol(val)}
                        refFunc={(sliderVol) => this.sliderVol = sliderVol}
                    />
                    <ValueView
                        title='明亮'
                        value={brightness.toString().substring(0, 5)}
                        changeVal={(val) => this._changeBrightness(val)}
                        refFunc={(sliderBri) => this.sliderBri = sliderBri}
                    />
                    <StatusView
                        title='Wifi'
                        value={wifiEnable}
                        loading={wifiStateLoading}
                        switchFunc={(value) => this._switchWifi()} />
                    <StatusView
                        title='位置'
                        value={locationEnable}
                        loading={locationStateLoading}
                        switchFunc={(value) => this._switchLocation()} />
                    <StatusView
                        title='蓝牙'
                        value={bluetoothEnable}
                        loading={bluetoothStateLoading}
                        switchFunc={(value) => this._switchBluetooth()} />
                    <StatusView
                        title='飞机'
                        value={airplaneEnable}
                        loading={airplaneStateLoading}
                        switchFunc={(value) => this._switchAirplane()} />
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={[styles.title, { flex: 1 }]}>其他功能</Text>
                            <TouchableOpacity onPress={this._openAppSetting}>
                                <Text style={styles.btn}>开启应用程式设定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const ValueView = (props) => {
    const { title, value, changeVal, refFunc, btn } = props
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.title}>{title}</Text>
                {btn && <TouchableOpacity onPress={btn.onPress}>
                    <Text style={styles.btn}>{btn.title}</Text>
                </TouchableOpacity>}
                <Text style={styles.value}>{value}</Text>
            </View>
            <Slider ref={refFunc} style={styles.slider} onValueChange={changeVal} />
        </View>
    )
}

const StatusView = (props) => {
    const { title, switchFunc, value, loading } = props
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.title}>{title}</Text>
                <Text style={{ flex: 1, opacity: 0.4, paddingHorizontal: 8 }}>当前状态为{loading ? 'switching' : (value ? '开' : '关闭')} </Text>
                {loading && <ActivityIndicator animating={loading} />}
                <Switch onValueChange={switchFunc} value={value} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E7E8',
    },
    card: {
        padding: 8,
        backgroundColor: '#fff',
        marginVertical: 4
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8
    },
    title: {
        fontSize: 14,
        color: '#6F6F6F'
    },
    value: {
        fontSize: 12,
        flex: 1,
        textAlign: 'right',
        color: '#904ED9'
    },
    btn: {
        fontSize: 14,
        padding: 8,
        paddingVertical: 8,
        color: '#405EFF'
    }
})
