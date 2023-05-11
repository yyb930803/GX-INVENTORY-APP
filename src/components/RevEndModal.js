import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text } from 'react-native';
import CStyles from '../styles/CommonStyles';
import Button from './Button';
import { setScreenLoading, setGongweiPos } from '../reducers/BaseReducer';
import { DB, tbName, getRevNewData } from '../hooks/dbHooks';
import ApiObject from '../support/Api';
import { PROGRAM_NAME, REV_TYPE } from '../constants';

const RevEndModal = (props) => {
    const dispatch = useDispatch();
    const { user, project, gongweiPos } = useSelector(state => state.base);
    const { inventoryReviewTb } = tbName(user.id);

    const uploadScanDataFun = async () => {
        dispatch(setScreenLoading(true));

        const revNewRows = await getRevNewData(user.id);

        if (revNewRows.length > 0) {
            await uploadData(revNewRows);
        } else {
            await toNextGongWeiConfirm();
        }
    };

    const uploadData = async (data) => {
        var result = await ApiObject.uploadScanData({ data: data, work_type: REV_TYPE, qrcode: project.qrcode });
        
        if (result !== null) {
            DB.transaction((tx) => {
                tx.executeSql(
                    `UPDATE ${inventoryReviewTb} SET upload = "uploaded" WHERE gongwei_id = ?`,
                    [gongweiPos.id],
                    (tx, results) => {
                        toNextGongWeiConfirm();
                    },
                );
            });
        } else {
            toNextGongWeiConfirm();
        }
    }

    const toNextGongWeiConfirm = async () => {
        await ApiObject.gongweiEndUpdate({ qrcode: project.qrcode });
        dispatch(await setGongweiPos({}));
        await ApiObject.endInspection({ qrcode: project.qrcode, gongwei_id: gongweiPos.id });
        dispatch(setScreenLoading(false));
        props.navigation.push('InventoryReview');
    };

    return (
        <View style={CStyles.ModalContainer}>
            <View style={CStyles.ModalBack} />
            <View style={CStyles.ModalBoxBack}>
                <Text style={{ fontSize: 18 }}>{PROGRAM_NAME}</Text>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 30 }}>
                        您要结束此工位的复查工作吗？
                    </Text>
                </View>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <Button
                        ButtonTitle={'是(Y)'}
                        BtnPress={() => uploadScanDataFun()}
                        type={'YellowBtn'}
                        BTnWidth={135}
                    />
                    <Button
                        ButtonTitle={'否(N)'}
                        BtnPress={() => props.setEndModalOpen(false)}
                        type={'blueBtn'}
                        BTnWidth={135}
                    />
                </View>
            </View>
        </View>
    );
}

export default RevEndModal;
