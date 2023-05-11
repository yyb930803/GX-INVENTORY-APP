import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text } from 'react-native';
import CStyles from '../styles/CommonStyles';
import Button from './Button';
import { setScreenLoading, setDiffCommodity, setSign1, setSign2, setSign3, setDiffPhotos } from '../reducers/BaseReducer';
import { DB, tbName, getDiffNewData } from '../hooks/dbHooks';
import ApiObject from '../support/Api';
import { PROGRAM_NAME, DIF_TYPE } from '../constants';

const DiffEndModal = (props) => {
    const dispatch = useDispatch();
    const { user, project, mistakes, diffCommodity, diffBia, diffPhotos, sign1, sign2, sign3 } = useSelector(state => state.base);
    const { differenceSurveyTb } = tbName(user.id);

    const uploadDiffData = async () => {
        dispatch(setScreenLoading(true));

        const diffNewData = await getDiffNewData(user.id);

        if (diffNewData.length === 0) {
            checkBackNavi();
        } else {
            var result = await ApiObject.uploadScanData({ data: diffNewData, work_type: DIF_TYPE, qrcode: project.qrcode });

            if (result !== null) {
                DB.transaction((tx) => {
                    tx.executeSql(`DELETE FROM ${differenceSurveyTb}`, [], (tx, results) => {
                        checkBackNavi();
                    });
                });
            } else {
                checkBackNavi();
            }
        }

    };

    const checkBackNavi = async () => {
        var diff_causes = mistakes.filter(item => item.count != null && item.count != undefined && item.count != '');

        await ApiObject.uploadDiffResult({
            qrcode: project.qrcode,
            data: {
                commodity_code: diffCommodity.commodity_code,
                diff_cause_id: JSON.stringify(diff_causes),
                diff_bia: diffBia,
                diff_photo: diffPhotos,
                sign1: sign1,
                sign2: sign2,
                sign3: sign3
            }
        });

        dispatch(setDiffCommodity({}));
        dispatch(setSign1(''));
        dispatch(setSign2(''));
        dispatch(setSign3(''));
        dispatch(setDiffPhotos([]));

        dispatch(setScreenLoading(false));

        props.navigation.push('DifferenceSurvey');
    };

    return (
        <View style={CStyles.ModalContainer}>
            <View style={CStyles.ModalBack} />
            <View style={CStyles.ModalBoxBack}>
                <Text style={{ fontSize: 18 }}>{PROGRAM_NAME}</Text>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 30 }}>
                        您要关闭此产品差异调查吗？
                    </Text>
                </View>

                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <Button
                        ButtonTitle={'是(Y)'}
                        BtnPress={() => uploadDiffData()}
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

export default DiffEndModal;
