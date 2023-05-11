import { Alert } from 'react-native';
import { PROGRAM_NAME, SERVER_API_URL } from '../constants';

class Api {
  constructor() {
    this.base = null;
    this.props = null;
  }

  setData(base, props) {
    this.base = base;
    this.props = props;
  }

  timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(new Error("Request timeout!"))
      }, ms)
      promise.then(resolve, reject)
    })
  }

  async postApi(apiUrl, data, limitTime = 10000) {
    var url = SERVER_API_URL + apiUrl;
    var result = null;

    await this.timeout(limitTime, fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: this.base?.accessToken,
      },
      body: JSON.stringify(data),
    }))
      .then(async (response) => {
        if (response.status === 200) {
          let responseJson = await response.json();
          if (responseJson.status) {
            result = responseJson.data;
          } else {
            switch (responseJson.error) {
              case 'verifyNo':
                props.navigation.navigate('PhoneVerifyScreen');
                break;

              case 'endInvGongwei':
              case 'endRevGongwei':
              case 'otherUserGongwei':
                await new Promise(resolve => {
                  Alert.alert(
                    PROGRAM_NAME,
                    responseJson.message ?? 'Error!!',
                    [
                      { text: '是(Y)', onPress: () => { result = 'reApiForce'; resolve(); } },
                      { text: '不(N)', onPress: () => resolve() },
                    ],
                    { cancelable: false },
                  );
                });
                break;

              case 'loginFailed':
              case 'projectEnd':
              case 'projectNo':
              case 'projectUnAuth':
              case 'projectIsNotOpen':
              case 'projectBlock':
              case 'duplicatePhone':
              case 'verifyCodeFailed':
              case 'noPhone':
              case 'userUpdateFailed':
              default:
                Alert.alert(
                  PROGRAM_NAME,
                  responseJson.message ?? 'Error!!',
                  [{ text: '是(Y)', onPress: () => { } }],
                  { cancelable: false },
                );
                break;
            }
          }
        } else if (response.status === 401) {
          Alert.alert(
            PROGRAM_NAME,
            '登录有效期已过。请重新登录。',
            [{ text: '是(Y)', onPress: () => this.props?.navigation.push('Login') }],
            { cancelable: false },
          );
        } else if (response.status === 500) {
          Alert.alert(
            PROGRAM_NAME,
            'Server Error!',
            [{ text: '是(Y)', onPress: () => { } }],
            { cancelable: false },
          );
        } else {
          Alert.alert(
            PROGRAM_NAME,
            response.status,
            [{ text: '是(Y)', onPress: () => { } }],
            { cancelable: false },
          );
        }
      })
      .catch((error) => {
        // 网络不给力。请稍后再试。
        Alert.alert(
          PROGRAM_NAME,
          error.message ?? 'Error!',
          [{ text: '是(Y)', onPress: () => { } }],
          { cancelable: false },
        );
      });

    return result;
  }

  async getAddressList() {
    let result = await this.postApi('basic/adresslist', {});
    return result;
  }

  async doSignInAction(data) {
    let result = await this.postApi('auth/login', data);
    return result;
  }

  async doSignUpAction(data) {
    let result = await this.postApi('auth/register', data);
    return result;
  }

  async verifyAction(data) {
    let result = await this.postApi('auth/verify', data);
    return result;
  }

  async resendCodeAction(data) {
    let result = await this.postApi('auth/fogotPassword', data);
    return result;
  }

  async logoutAction() {
    let result = await this.postApi('auth/logout', {});
    return result;
  }

  async changePasswordAction(data) {
    let result = await this.postApi('auth/changePassword', data);
    return result;
  }

  async getUserData() {
    let result = await this.postApi('auth/me', {});
    return result;
  }

  async uploadUserData(data) {
    let result = await this.postApi('updateUserInfo', data);
    return result;
  }

  async getProjectManageList() {
    let result = await this.postApi('getUserScheduleList', {});
    return result;
  }

  async getAreasList() {
    let result = await this.postApi('areas/getList', {});
    return result;
  }

  async getProjectInfo(data) {
    let result = await this.postApi('projectList/getProjectInfo', data);
    return result;
  }

  async uploadScanData(data) {
    let result = await this.postApi('uploadScandata', data);
    return result;
  }

  async updateCheck(data) {
    let result = await this.postApi('master/updateCheck', data);
    return result;
  }

  async getGeneralList(data) {
    let result = await this.postApi('master/getGeneralList', data, 5 * 60 * 1000);
    return result;
  }

  async getCategoryList(data) {
    let result = await this.postApi('master/getCategoryList', data, 1 * 60 * 1000);
    return result;
  }

  async getInventoryList(data) {
    let result = await this.postApi('master/getInventoryList', data, 3 * 60 * 1000);
    return result;
  }

  async getPianGongList(data) {
    let result = await this.postApi('master/getPianGongList', data, 1 * 60 * 1000);
    return result;
  }

  async gongweiCheck(data) {
    let result = await this.postApi('positionCheck', data);
    return result;
  }

  async newGongweiAdd(data) {
    let result = await this.postApi('newGongweiAdd', data);
    return result;
  }

  async gongweiEndUpdate(data) {
    let result = await this.postApi('positionOut', data);
    return result;
  }

  async gongweiScandata(data) {
    let result = await this.postApi('gongweiScandata', data);
    return result;
  }

  async getMistakesCausesList(data) {
    let result = await this.postApi('getMistakesCausesList', data);
    return result;
  }

  async endInspection(data) {
    let result = await this.postApi('endInspection', data);
    return result;
  }

  async getCodelist(data) {
    let result = await this.postApi('getDiffCodelist', data);
    return result;
  }

  async getSKUlist(data) {
    let result = await this.postApi('commodityScandata', data);
    return result;
  }

  async getDiffCausesList(data) {
    let result = await this.postApi('getDiffCausesList', data);
    return result;
  }

  async uploadDiffResult(data) {
    let result = await this.postApi('uploadDiffResult', data);
    return result;
  }
}

const ApiObject = new Api();
export default ApiObject;
