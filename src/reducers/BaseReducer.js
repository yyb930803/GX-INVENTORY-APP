import { createSlice } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"

const BaseReducer = createSlice({
  name: "Base",
  initialState: {
    accessToken: '',
    user: {},
    project: {},
    gongweiPos: {},
    rowPos: 1,
    columnPos: 1,
    diffCommodity: {},
    screenLoading: false,
    generalTime: null,
    inventoryTime: null,
    categoryTime: null,
    piangongTime: null,
    skuCount: 0,
    sign1: '',
    sign2: '',
    sign3: '',
    diffPhotos: [],
    mistakes: [],
    diffBia: '',
  },
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload
    },
    setUser(state, action) {
      state.user = action.payload
    },
    setProject(state, action) {
      state.project = action.payload
    },
    setGongweiPos(state, action) {
      state.gongweiPos = action.payload
    },
    setRowPos(state, action) {
      state.rowPos = action.payload
    },
    setColumnPos(state, action) {
      state.columnPos = action.payload
    },
    setDiffCommodity(state, action) {
      state.diffCommodity = action.payload
    },
    setScreenLoading(state, action) {
      state.screenLoading = action.payload
    },
    setGeneralTime(state, action) {
      state.generalTime = action.payload
    },
    setInventoryTime(state, action) {
      state.inventoryTime = action.payload
    },
    setCategoryTime(state, action) {
      state.categoryTime = action.payload
    },
    setPiangongTime(state, action) {
      state.piangongTime = action.payload
    },
    setSkuCount(state, action) {
      state.skuCount = action.payload
    },
    setSign1(state, action) {
      state.sign1 = action.payload
    },
    setSign2(state, action) {
      state.sign2 = action.payload
    },
    setSign3(state, action) {
      state.sign3 = action.payload
    },
    setDiffPhotos(state, action) {
      state.diffPhotos = action.payload
    },
    setMistakes(state, action) {
      state.mistakes = action.payload
    },
    setDiffBia(state, action) {
      state.diffBia = action.payload
    },
  }
})

export const {
  setAccessToken,
  setUser,
  setProject,
  setGongweiPos,
  setRowPos,
  setColumnPos,
  setDiffCommodity,
  setScreenLoading,
  setGeneralTime,
  setInventoryTime,
  setCategoryTime,
  setPiangongTime,
  setSkuCount,
  setSign1,
  setSign2,
  setSign3,
  setDiffPhotos,
  setMistakes,
  setDiffBia,
} = BaseReducer.actions

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
}

export default persistReducer(persistConfig, BaseReducer.reducer)
