import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text } from 'react-native';
import ApiObject from '../../../support/Api';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import CStyles from '../../../styles/CommonStyles';
import { getGenMtCount, getCatMtCount, getInvMtCount, getGongMtCount, insertGenMt, insertInvMt, insertCatMt, insertGongMt } from '../../../hooks/dbHooks';
import { setCategoryTime, setGeneralTime, setInventoryTime, setPiangongTime, setScreenLoading } from '../../../reducers/BaseReducer';

const MasterFile = (props) => {
  const dispatch = useDispatch();
  const { user, project, generalTime, inventoryTime, categoryTime, piangongTime } = useSelector((state) => state.base);

  const [genMtCount, setGenMtCount] = useState(0);
  const [invMtCount, setInvMtCount] = useState(0);
  const [catMtCount, setCatMtCount] = useState(0);
  const [gongMtCount, setGongMtCount] = useState(0);

  const [generalDiff, setGeneralDiff] = useState(false);
  const [inventoryDiff, setInventoryDiff] = useState(false);
  const [categoryDiff, setCategoryDiff] = useState(false);
  const [gongweiDiff, setGongweiDiff] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setInvMtCount(await getInvMtCount(user.id));
      setGenMtCount(await getGenMtCount(user.id));
      setCatMtCount(await getCatMtCount(user.id));
      setGongMtCount(await getGongMtCount(user.id));

      const data = await ApiObject.updateCheck({ qrcode: project.qrcode, general_time: generalTime, inventory_time: inventoryTime, category_time: categoryTime, piangong_time: piangongTime });
      if (data) {
        setGeneralDiff(data.general);
        setInventoryDiff(data.inventory);
        setCategoryDiff(data.category);
        setGongweiDiff(data.piangong);
      }
    };

    fetchData();
  }, []);

  const genMtDown = async () => {
    dispatch(setScreenLoading(true));

    var data = await ApiObject.getGeneralList({ qrcode: project.qrcode });
    if (data) {
      await insertGenMt(user.id, data);

      var date = new Date();
      var general_time = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

      dispatch(setGeneralTime(general_time));
      setGenMtCount(data.length);
      setGeneralDiff(false);
    }

    dispatch(setScreenLoading(false));
  }

  const catMtDown = async () => {
    dispatch(setScreenLoading(true));

    var data = await ApiObject.getCategoryList({ qrcode: project.qrcode });
    if (data) {
      await insertCatMt(user.id, data);

      var date = new Date();
      var downloadTime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

      dispatch(setCategoryTime(downloadTime));
      setCatMtCount(data.length);
      setCategoryDiff(false);
    }

    dispatch(setScreenLoading(false));
  }

  const invMtDown = async () => {
    dispatch(setScreenLoading(true));

    var data = await ApiObject.getInventoryList({ qrcode: project.qrcode });
    if (data) {
      await insertInvMt(user.id, data);

      var date = new Date();
      var downloadTime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

      dispatch(setInventoryTime(downloadTime));
      setInvMtCount(data.length);
      setInventoryDiff(false);
    }

    dispatch(setScreenLoading(false));
  }

  const gongMtDown = async () => {
    dispatch(setScreenLoading(true));

    var data = await ApiObject.getPianGongList({ qrcode: project.qrcode });
    if (data) {
      await insertGongMt(user.id, data);

      var date = new Date();
      var downloadTime = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

      dispatch(setPiangongTime(downloadTime));
      setGongMtCount(data.length);
      setGongweiDiff(false);
    }

    dispatch(setScreenLoading(false));
  }

  const BackBtnPress = () => {
    props.navigation.push('Inventory');
  };

  const toInventory = async () => {
    props.navigation.push('AreaValue');
  };

  return (
    <View style={{ position: 'relative' }}>
      <View style={{}}>
        <Header
          {...props}
          BtnPress={BackBtnPress}
          title={'主档'}
        />
      </View>

      {project.general && (
        <View style={{ alignItems: 'center', marginTop: 5 }}>
          <Button
            ButtonTitle={'下载新版通用主档'}
            BtnPress={() => genMtDown()}
            type={'blueBtn'}
            notification={generalDiff}
            BTnWidth={320}
          />
        </View>
      )}

      <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Button
          ButtonTitle={'下载新版库存主档'}
          BtnPress={() => invMtDown()}
          notification={inventoryDiff}
          type={'blueBtn'}
          BTnWidth={320}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Button
          ButtonTitle={'下载新版类别主档'}
          BtnPress={() => catMtDown()}
          notification={categoryDiff}
          type={'blueBtn'}
          BTnWidth={320}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: 5 }}>
        <Button
          ButtonTitle={'下载新版区域主档'}
          BtnPress={() => gongMtDown()}
          notification={gongweiDiff}
          type={'blueBtn'}
          BTnWidth={320}
        />
      </View>

      <View style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
        {project.general && (
          <Text style={CStyles.TxTStyle}>
            通用主档数：{genMtCount}
          </Text>
        )}

        <Text style={CStyles.TxTStyle}>
          库存主档数：{invMtCount}
        </Text>

        <Text style={CStyles.TxTStyle}>
          类别主档数：{catMtCount}
        </Text>

        <Text style={CStyles.TxTStyle}>
          货架主档数：{gongMtCount}
        </Text>
      </View>

      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <Button
          ButtonTitle={'下一步'}
          BtnPress={() => toInventory()}
          type={'yellowBtn'}
          BTnWidth={320}
        />
      </View>
    </View>
  );
}

export default MasterFile;
