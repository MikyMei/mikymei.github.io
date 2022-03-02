import {Effect, Reducer} from 'umi';
import {Row, Tag} from "antd";
import styles from "@/pages/ExtraModelCom/index.less";
import React from "react";
import {
  GetAllOrgaList,
  GetCommonScoreHistory,
  GetKeyHealthIndex,
  GetOrgaCommonScoreHistory,
  GetOrgaDetailInfo,
  GetOrgaHealthAdvice,
  GetOrgaScoreHistory,
  GetPersonalHealthInfo,
  GetPersonalScoreHistory,
  GetSignleWholeOrgaIll, GetSpecificIndexDetail
} from "@/services/healthEvaluate";
import {GetTop4AbnormalOrga} from "@/utils/dataReStructure";


export type StateType = {
  orgaName?: any;
  orgaDesc?: any;
  illList?: any;
  infoDisplay?: any;
  infoTop?: any;
  infoRight?: any;

  loadStatus?: any; // 定义一个全局地变量，用于页面加载状态，主要是根据模型地加载地完成度
  /**
   * 下面的变量均为请求接口得来的数据
   * 1，刚进入页面的请求
   * */

  personalInfo?: any;
  allOrgaList?: any; // 所有有的异常器官，包括异常器官内部的得分，异常指标数目， 包括全身性的异常标识
  personalHealthScore?: any; // 个人健康的分
  personalScoreHistory?: any; // 个人健康历史的分，以年为单位，
  commonScoreHistory?: any; // 同质人群健康历史的分，以年为单位，
  keyHealthIndex?: any;// 四种人体健康指标，BMI,心率，血糖，血压
  abnormalOrgaTop4?: any;// 异常器官中最差的四个
  abnormalOrgaTop4Detail?: any; // 异常器官中最差四个地详细信息，包括他们的历史的分和同质人群得分

  wholeOrgaIll?: any; // 全身性一个异常器官的所有异常标识

  selectedOrga?: any; // 当前选中的器官，里面会包含当前器官的再初次进入页面请求道的基础信息，如，健康得分，异常标识
  currentOrgaScoreHistory?: any; // 当前器官的历史的分
  currentOrgaCommonHistory?: any; // 当前器官的同质人群历史的分
  currentOrgaHealthAdvice?: any; // 当前器官的医生建议，数组，
  currentIindexDetail?: any; // 当前一场表示地异常指标


  /**
   * 2,点击器官需要的请求
   * */


};

export type ModelType = {
  namespace: string;
  state: StateType;
  effects: {
    changeOrgaInfo: Effect;

    getAllPersonalHealthInformation: Effect;  // 刚进入页面时，请求所有的个人健康相关信息接口

    getOrgaDetail: Effect;

    getWholeOrgaIllDetail: Effect;
    getSelectedOrgaDetail: Effect;
    getSelectedIndexProject:Effect; // 获得当前的选中的指标的项目细节

  };
  reducers: {
    initOrgaInfo: Reducer<StateType>;
    initInfoWindow: Reducer<StateType>;
    initIllList: Reducer<StateType>;

    initAllPersonalHealthInformation: Reducer<StateType>; // 初始化所有的个人健康信息

    changeLoadStatus: Reducer<StateType>;
    initWholeOrgaIll: Reducer<StateType>;

    initSelectedOrga: Reducer<StateType>;
    initSelectedOrgaDetail: Reducer<StateType>;
    initSelectedIndexDetail: Reducer<StateType>;
  };
};

const Model: ModelType = {
  namespace: 'bodyModel',

  state: {
    orgaName: '55',
    orgaDesc: '55',
    illList: {},
    infoDisplay: 'none',
    infoTop: "50px",
    infoRight: "50px",
    loadStatus: false,

    personalInfo: {},
    allOrgaList: {}, // 以部位进行器官分类， 部位为属性名，value为数组，数组中的元素为器官的相关信息对象
    personalHealthScore: '', // 个人健康的分, 字符串即可
    personalScoreHistory: [], // 数组里面的元素为对象如：{2015:78}, 需要注意个人与同质人群的一致性，当数据缺失的时候补齐
    commonScoreHistory: [], // 同质人群健康历史的分，以年为单位，
    keyHealthIndex: {},// 四种人体健康指标，key值为指标的名字如： BMI:{score：55， min:30, max:65}
    abnormalOrgaTop4: [], // 异常器官中最差的四个,
    abnormalOrgaTop4Detail: [], // 异常器官中最差的四个, "心脏":{score:55, commonHistory:[], scoreHistory:[]}， 在第二次调用的时候调用·

    wholeOrgaIll: [],


    selectedOrga: null, // 当前选中的器官，里面会包含当前器官的再初次进入页面请求道的基础信息，如，健康得分，异常标识
    currentOrgaScoreHistory: [], // 当前器官的历史的分
    currentOrgaCommonHistory: [], // 当前器官的同质人群历史的分
    currentOrgaHealthAdvice: [], // 当前器官的医生建议，数组，
    currentIindexDetail: [], // 当前一场表示地异常指标
  },

  effects: {
    * changeOrgaInfo({payload}, {call, put}) {

    },

    * getAllPersonalHealthInformation({payload}, {call, put}) {
      const newPersonalHealthInfo = yield call(GetPersonalHealthInfo, payload.params.personalHealthInfoParams);
      const newAllOrgaList = yield call(GetAllOrgaList, payload.params.allOrgaListParams);
      const newPersonalScoreHistory = yield call(GetPersonalScoreHistory, payload.params.personalScoreHistoryParams);
      const newCommonScoreHistory = yield call(GetCommonScoreHistory, payload.params.personalScoreHistoryParams);// 个人的历年参数一样
      const newKeyHealthIndex = yield call(GetKeyHealthIndex, payload.params.keyHealthIndexParams);// 个人的历年参数一样


      /**
       * 获取四个，top4地器官的相关信息
       * */
      const newAbnormalTop4 = GetTop4AbnormalOrga(newAllOrgaList.data[0]);
      const tempList = JSON.parse(JSON.stringify(newAbnormalTop4));
      // payload.abnormalTop4

      if (tempList.length > 0) {
        tempList[0].historyScore = (yield call(GetOrgaScoreHistory, tempList[0].name)).data;
        tempList[0].commonScore = (yield call(GetOrgaCommonScoreHistory, tempList[0].name)).data;

        tempList[1] ? tempList[1].historyScore = (yield call(GetOrgaScoreHistory, tempList[1].name)).data : null;
        tempList[1] ? tempList[1].commonScore = (yield call(GetOrgaCommonScoreHistory, tempList[1].name)).data : null;

        tempList[2] ? tempList[2].historyScore = (yield call(GetOrgaScoreHistory, tempList[2].name)).data : null;
        tempList[2] ? tempList[2].commonScore = (yield call(GetOrgaCommonScoreHistory, tempList[2].name)).data : null;

        tempList[3] ? tempList[3].historyScore = (yield call(GetOrgaScoreHistory, tempList[3].name)).data : null;
        tempList[3] ? tempList[3].commonScore = (yield call(GetOrgaCommonScoreHistory, tempList[3].name)).data : null;

      }


      if (newPersonalHealthInfo[0]
        && newAllOrgaList.data[0]
        && newPersonalScoreHistory[0]
        && newCommonScoreHistory
        && newKeyHealthIndex.data) {


        yield put({
          type: "initAllPersonalHealthInformation",
          payload: {
            PersonalHealthInfo: newPersonalHealthInfo[0],
            AllOrgaList: newAllOrgaList.data[0],
            PersonalScoreHistory: newPersonalScoreHistory[0],
            CommonScoreHistory: newCommonScoreHistory,
            KeyHealthIndex: newKeyHealthIndex.data,
            AbnorMalTop4: newAbnormalTop4,
            PersonalHealthScore: newPersonalHealthInfo[0].last_check_score || 0,
            AbnormalTop4Detail: tempList,

          }
        })
      }


    },

    * getOrgaDetail({payload}, {call, put}) {
      const detailResponse = yield call(GetOrgaDetailInfo, payload.orgaParams);
      if (detailResponse.code === 200) {
        yield put({
          type: "initIllList",
          payload: {
            newIllList: detailResponse.data[0],
          }
        })
      }
    },

    * getWholeOrgaIllDetail({payload}, {call, put}) {
      const illDetailResponse = yield call(GetSignleWholeOrgaIll, payload.params);

      if (illDetailResponse.code === 200) {

        yield put({
          type: "initWholeOrgaIll",
          payload: {
            newWholeOrgaIll: illDetailResponse.data[0]
          }
        })
      }
    },

    * getSelectedOrgaDetail({payload}, {call, put}) {
      const scoreHistoryResponse = yield call(GetOrgaScoreHistory, payload.orgaParams);
      const commonHistoryResponse = yield call(GetOrgaCommonScoreHistory, payload.orgaParams);
      const healthAdviceResponse = yield call(GetOrgaHealthAdvice, payload.orgaParams);
    // 在初始化的时候，请求第一个异常标识地异常项目

      yield put({
        type:"initSelectedOrgaDetail",
        payload:{
          newOrgaHistory:scoreHistoryResponse.data||[],
          newCommonHistory:commonHistoryResponse.data||[],
          newHealthAdvice:healthAdviceResponse.data||[],
        }
      });
      yield put({
        type:"initSelectedOrga",
        payload:{newSelectedOrga:payload.orgaAll}
      })
    },

    * getSelectedIndexProject({payload},{call, put}){
      /**
       * 获得当前选中指标地
       * */

      const indexDetailResponse=yield call(GetSpecificIndexDetail, payload.indexParams);
      yield put({
        type:"initSelectedIndexDetail",
        payload:{
          newIndexDetail:indexDetailResponse.data||[],
        }
      })

    }


  },

  reducers: {

    initOrgaInfo(state, {payload}) {
      return {
        ...state,
        orgaName: payload.newOrgaName,
        orgaDesc: payload.newOrgaDesc,
        illList: payload.newIllList,
      };
    },
    initIllList(state, {payload}) {
      return {
        ...state,
        illList: payload.newIllList,
      };
    },
    initInfoWindow(state, {payload}) {
      const bodyPart = {
        Body002: "包在身体表面，直接同外界环境接触，具有保护、排泄、调节体温和感受外界刺激等作用的一种器官，是人的身体器官中最大的器官",
        Circulatory_Heart001: "心脏主要功能是为血液流动提供动力，把血液运行至身体各个部分。人类的心脏位于胸腔中部偏左下方，体积约相当于一个拳头大小，重量约250克。女性的心脏通常要比男性的体积小且重量轻",
        Skeletal001: "人或动物体内或体表坚硬的组织。分内骨骼和外骨骼两种，人和高等动物的骨骼在体内，由许多块骨头组成，叫内骨骼；软体动物体外的硬壳以及某些脊椎动物（如鱼、龟等）体表的鳞、甲等叫外骨骼。",

      }
      const contentlist1: any = [];
      contentlist1.push({
        illType: "肺占位性病变",
        illDesc: "占位性病变通常泛指肿瘤（良性的、恶性的）、寄生虫等，而不涉及疾病的病因。"
      })
      contentlist1.push({
        illType: "肺占位性病变",
        illDesc: "占位性病变通常泛指肿瘤（良性的、恶性的）、寄生虫等，而不涉及疾病的病因。"
      })


      return {
        ...state,
        infoDisplay: payload.newInfoDisplay,
        infoTop: payload.newInfoTop,
        infoRight: payload.newInfoRight,
        orgaName: payload.newOrgaName,
        orgaDesc: bodyPart[`${payload.newOrgaName}`],
        illList: contentlist1,
      };
    },
    initAllPersonalHealthInformation(state, {payload}) {
      return {
        ...state,
        personalInfo: payload.PersonalHealthInfo,
        allOrgaList: payload.AllOrgaList,
        personalHealthScore: payload.PersonalHealthScore,
        personalScoreHistory: payload.PersonalScoreHistory,
        commonScoreHistory: payload.CommonScoreHistory,
        keyHealthIndex: payload.KeyHealthIndex,
        abnormalOrgaTop4: payload.AbnorMalTop4,
        abnormalOrgaTop4Detail: payload.AbnormalTop4Detail
      }
    },

    changeLoadStatus(state, {payload}) {
      return {...state, loadStatus: payload.newLoadStatus}
    },

    initWholeOrgaIll(state, {payload}) {
      return {
        ...state,
        wholeOrgaIll: payload.newWholeOrgaIll,
      }
    },
    initSelectedOrga(state, {payload}) {
      let orgaTemp:any;
      if (payload.newSelectedOrga===state.selectedOrga){
        orgaTemp=null;
      }else{
        orgaTemp=payload.newSelectedOrga;
      }
      return {
        ...state,
        selectedOrga: orgaTemp,
      }
    },
    initSelectedOrgaDetail(state, {payload}){
      return {
        ...state,
        currentOrgaScoreHistory: payload.newOrgaHistory, // 当前器官的历史的分
        currentOrgaCommonHistory: payload.newCommonHistory, // 当前器官的同质人群历史的分
        currentOrgaHealthAdvice: payload.newHealthAdvice, // 当前器官的医生建议，数组，
        // currentIindexDetail: payload.newIndexDetail, // 当前一场表示地异常指标,buzai
      }
    },
    initSelectedIndexDetail(state, {payload}){
      return {
        ...state,
        currentIindexDetail: payload.newIndexDetail, // 当前一场表示地异常指标

      }
    }

  },
};

export default Model;

