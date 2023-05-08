import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import CStyles from '../../../styles/CommonStyles';
import FooterBar1 from '../../../components/FooterBar1';
import { setColumnPos, setRowPos } from '../../../reducers/BaseReducer';
import { DB, tbName } from '../../../hooks/dbHooks';
import InvEndModal from '../../../components/InvEndModal';

const InventoryLayer = (props) => {
    const dispatch = useDispatch();
    const { user, project, gongweiPos, rowPos } = useSelector(state => state.base);
    const { scandataTb } = tbName(user.id);

    const [rowCount, setRowCount] = useState('');
    const [columnCount, setColumnCount] = useState('');
    const [sumCount, setSumCount] = useState('');
    const [pandianAmount, setPandianAmount] = useState('');
    const [tableData, setTableData] = useState([]);
    const [endModalOpen, setEndModalOpen] = useState(false);

    const tableHead = ['层', '条数', '件数', '金额'];

    useEffect(() => {
        DB.transaction(tx => {
            tx.executeSql(`SELECT MAX("row") as row, COUNT("column") as countColumn, SUM("count") as sumCount, SUM(commodity_price*"count") as pandianAmount FROM ${scandataTb} WHERE gongwei_id = ?`,
                [gongweiPos.id],
                (tx, results) => {
                    if (results.rows.item(0).row != null) {
                        setRowCount(results.rows.item(0).row);
                        setColumnCount(results.rows.item(0).countColumn);
                        setSumCount(results.rows.item(0).sumCount);
                        setPandianAmount(results.rows.item(0).pandianAmount);
                    }
                }
            )

            tx.executeSql(`SELECT row, COUNT("column") as countcolumn, SUM("count") as sumCount, SUM(commodity_price*"count") as pandianAmount FROM ${scandataTb} WHERE gongwei_id = ? GROUP BY "row"`,
                [gongweiPos.id],
                (tx, results) => {
                    let item = [];
                    let tableDataArray = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        item.push(results.rows.item(i).row);
                        item.push(results.rows.item(i).countcolumn);
                        item.push(results.rows.item(i).sumCount);
                        item.push(results.rows.item(i).pandianAmount ?? 0);
                        tableDataArray.push(item);
                        item = [];
                    }
                    setTableData(tableDataArray);
                }
            )
        });
    }, []);


    const BackBtnPress = async () => {
        setEndModalOpen(true);
    };

    const screenNavigate = (id) => {
        if (id == 1) {
            props.navigation.push('InventoryMain');
        } else if (id == 2) {
            props.navigation.push('InventoryLayer');
        } else if (id == 3) {
            props.navigation.push('InventoryEditData');
        }
    }

    const toInventoryMain = async () => {
        dispatch(setRowPos(Number(rowPos) + 1));
        dispatch(setColumnPos(1));
        props.navigation.push('InventoryMain');
    }

    return (
        <View style={{ position: 'relative', height: Dimensions.get('window').height }}>
            <View style={{}}>
                <Header {...props} BtnPress={BackBtnPress} title={'盘点'} />
            </View>

            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ ...CStyles.InventoryTxt, fontSize: 14 }}>{gongweiPos.pianqu}片区   {gongweiPos.gongwei?.toString().padStart(project.gongwei_max, "0")}工位</Text>
                </View>

                <ScrollView style={styles.container}>
                    <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                        <Rows data={tableData} textStyle={styles.text} />
                    </Table>
                </ScrollView>

                <View style={{ marginHorizontal: 30, marginTop: 0 }}>
                    <Text style={CStyles.TxTStyle}>合计:</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingLeft: 90 }}>
                    <Text style={{ flex: 1, fontSize: 14 }}>{rowCount}</Text>
                    <Text style={{ flex: 1, fontSize: 14 }}>{columnCount}</Text>
                    <Text style={{ flex: 1, fontSize: 14 }}>{sumCount}</Text>
                    <Text style={{ flex: 1, fontSize: 14 }}>{pandianAmount ?? 0}</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginVertical: 20, }}>
                    <Button ButtonTitle={"升层"} BtnPress={() => toInventoryMain()} type={"yellowBtn"} BTnWidth={300} />
                </View>
            </View>

            <FooterBar1 screenNavigate={screenNavigate} activeBtn={2} />

            {endModalOpen && (
                <InvEndModal setEndModalOpen={setEndModalOpen} navigation={props.navigation} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 10,
    },

    head: {
        height: 32,
        backgroundColor: '#f1f8ff'
    },

    text: { margin: 3 }
});

export default InventoryLayer;
