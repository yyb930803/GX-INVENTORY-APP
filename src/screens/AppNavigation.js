import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';

import AuthLoadingScreen from './AuthLoading';

import InventoryScreen from './InventoryScreens/Main';
import LoginScreen from './LoginScreens/Login';
import RegisterScreen from './LoginScreens/Register';
import PhoneVerifyScreen from './LoginScreens/PhoneVerifyScreen';
import InputPhoneScreen from './LoginScreens/InputPhoneScreen';
import ForgotPasswordScreen from './LoginScreens/ForgotPasswordScreen';

import SettingMain from './SettingScreens/SettingMain';
import Management from './SettingScreens/Management';
import UserInfo from './SettingScreens/UserInfo';
import SystemInfo from './SettingScreens/SystemInfo';

import SignatureScreen from './InventoryScreens/Others/SignatureScreen';
import InventoryInit from './InventoryScreens/Others/InventoryInit';
import QuantityInit from './InventoryScreens/Others/QuantityInit';

import MasterFile from './InventoryScreens/MasterFile/MasterFile';
import ProjectMainScreen from './InventoryScreens/ProjectList/ProjectMainScreen';
import InventoryMain from './InventoryScreens/Inventory/InventoryMain';
import InventoryLayer from './InventoryScreens/Inventory/InventoryLayer';
import InventoryEditData from './InventoryScreens/Inventory/InventoryEditData';

import AreaValue from './InventoryScreens/Inventory/AreaValue';
import InventoryReview from './InventoryScreens/InventoryReview/InventoryReview';
import InventoryReviewEditList from './InventoryScreens/InventoryReview/InventoryReviewEditList';
import InventoryReviewAdd from './InventoryScreens/InventoryReview/InventoryReviewAdd';

import DifferenceSurvey from './InventoryScreens/DifferenceSurvey/DifferenceSurvey';
import DifferenceSurveyEdit from './InventoryScreens/DifferenceSurvey/DifferenceSurveyEdit';
import DifferenceSurveyAdd from './InventoryScreens/DifferenceSurvey/DifferenceSurveyAdd';
import DifferenceSurveyDelete from './InventoryScreens/DifferenceSurvey/DifferenceSurveyDelete';

import RestDataUploadScreen from './InventoryScreens/RestDataUploadScreen/RestDataUpload';


const AppStack = createStackNavigator(
  {
    Management: {
      screen: Management,
      navigationOptions: {
        headerShown: false,
      },
    },
    Inventory: {
      screen: InventoryScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    RestDataUpload: {
      screen: RestDataUploadScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SettingMain: {
      screen: SettingMain,
      navigationOptions: {
        headerShown: false,
      },
    },
    UserInfo: {
      screen: UserInfo,
      navigationOptions: {
        headerShown: false,
      },
    },
    SystemInfo: {
      screen: SystemInfo,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignatureScreen: {
      screen: SignatureScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    MasterFile: {
      screen: MasterFile,
      navigationOptions: {
        headerShown: false,
      },
    },
    ProjectMainScreen: {
      screen: ProjectMainScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    InventoryInit: {
      screen: InventoryInit,
      navigationOptions: {
        headerShown: false,
      },
    },
    QuantityInit: {
      screen: QuantityInit,
      navigationOptions: {
        headerShown: false,
      },
    },
    InventoryMain: {
      screen: InventoryMain,
      navigationOptions: {
        headerShown: false,
      },
    },
    InventoryLayer: {
      screen: InventoryLayer,
      navigationOptions: {
        headerShown: false,
      },
    },
    InventoryEditData: {
      screen: InventoryEditData,
      navigationOptions: {
        headerShown: false,
      },
    },
    AreaValue: {
      screen: AreaValue,
      navigationOptions: {
        headerShown: false,
      },
    },
    InventoryReview: {
      screen: InventoryReview,
      navigationOptions: {
        headerShown: false,
      },
    },
    InventoryReviewEditList: {
      screen: InventoryReviewEditList,
      navigationOptions: {
        headerShown: false,
      },
    },
    InventoryReviewAdd: {
      screen: InventoryReviewAdd,
      navigationOptions: {
        headerShown: false,
      },
    },
    DifferenceSurvey: {
      screen: DifferenceSurvey,
      navigationOptions: {
        headerShown: false,
      },
    },
    DifferenceSurveyEdit: {
      screen: DifferenceSurveyEdit,
      navigationOptions: {
        headerShown: false,
      },
    },
    DifferenceSurveyAdd: {
      screen: DifferenceSurveyAdd,
      navigationOptions: {
        headerShown: false,
      },
    },
    DifferenceSurveyDelete: {
      screen: DifferenceSurveyDelete,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'Management',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  }
);

const AuthStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    PhoneVerifyScreen: {
      screen: PhoneVerifyScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    InputPhoneScreen: {
      screen: InputPhoneScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ForgotPasswordScreen: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
