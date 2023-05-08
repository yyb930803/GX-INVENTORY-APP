import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, StatusBar, View } from 'react-native';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    this.props.navigation.navigate(this.props.base.accessToken ? 'App' : 'Auth');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar hidden/>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps)(AuthLoadingScreen);
