import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ApiObject from '../support/Api';
import { setScreenLoading } from '../reducers/BaseReducer';

const ScreenLoading = (props) => {
  const dispatch = useDispatch();
  const base = useSelector(state => state.base);

  useEffect(() => {
    ApiObject.setData(base, props);
  }, [base, props]);

  useEffect(() => {
    dispatch(setScreenLoading(false));
  }, []);

  return (
    <>
      {base.screenLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.horizontal}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "#e4e8ee",
    opacity: 0.6,
    justifyContent: "center",
    position: 'absolute'
  },

  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
});

export default ScreenLoading;
