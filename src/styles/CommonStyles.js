import { StyleSheet } from 'react-native';

const MAIN_Yellow_COLOR = '#F8B502'
const MAIN_Blue_COLOR = '#012964'
const MODAL_BACK_COLOR = '#323232'
const TEXT_WHITE_COLOR = '#ffffff'
const TEXT_DARK_COLOR = '#121212'
const TEXT_DEFAULT_COLOR = '#212121'
const TEXT_GRAY_COLOR = '#B1B6C2'
const TEXTINPU_LIGHT_BLUE = '#e4e8ee'

export default (styles = StyleSheet.create({
    YellowLogoBtn:{
        backgroundColor:MAIN_Yellow_COLOR,
        width: 280,
        height: 40,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grayBtn:{
        position: 'relative',
        backgroundColor:TEXTINPU_LIGHT_BLUE,
        height: 36,
        borderRadius: 5,
        margin: 5,
        paddingLeft: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    grayBlueBtn:{
        position: 'relative',
        backgroundColor:TEXTINPU_LIGHT_BLUE,
        height: 36,
        borderRadius: 5,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    grayText:{
        justifyContent: 'center',
        alignItems: 'center',        
        color:"#000",
        fontSize: 16,
    },
    grayIcon:{
        position: 'absolute',
        right: 10,
        alignItems: 'center',
        color:"#000",
    },
    LogoBtnText:{
        color:TEXT_WHITE_COLOR,
        fontSize: 20,
    },
    DisableLogoBtn:{
        backgroundColor:TEXT_WHITE_COLOR,
        width: 280,
        height: 40,
        borderColor: TEXT_GRAY_COLOR,
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    DisableLogoBtnText:{
        color:TEXT_GRAY_COLOR,
        fontSize: 20,
    },
    YellowBtn:{
        backgroundColor:MAIN_Yellow_COLOR,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    BlueBtn:{
        backgroundColor:MAIN_Blue_COLOR,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    BtnText:{
        color:TEXT_WHITE_COLOR,
        fontSize: 14,
    },
    InputStyle:{
        backgroundColor:'white',
        height: 36,
        paddingLeft: 10,
        fontSize: 10,
        flex: 1,
        borderWidth:1,
        borderColor:'#dedbdb',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    TextStyle:{
        color:TEXT_DEFAULT_COLOR,
        height: 36,
        lineHeight: 36,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center",
        fontSize: 10,
    },
    TxTStyle:{
        color:TEXT_DARK_COLOR,
        marginTop: 10,
        fontSize: 10,
    },
    ModalContainer:{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        zIndex: 100,
    },
    ModalBack:{
        backgroundColor: MODAL_BACK_COLOR,
        opacity: 0.8,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    ModalBoxBack:{
        backgroundColor: TEXT_WHITE_COLOR,
        width: 320,
        bottom: 120,
        borderRadius: 15,
        padding: 20,
    },
    txt_Style:{
        flex:1,
        color:TEXT_DARK_COLOR,
        marginTop: 10,
        fontSize: 12,
    },
    txt_Style1:{
        flex:1,
        color:TEXT_DARK_COLOR,
        marginTop: 5,
        marginHorizontal: 2,
        fontSize: 12,
    },
    InventoryTxt:{
        fontSize: 10, 
        marginTop:5
    },
}))
