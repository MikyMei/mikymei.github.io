export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },


  {
    path: '/SliderBody',
    name: 'SliderBody',
    icon: 'smile',
    component: './SliderOrga',
  },

  {
    path: '/ThreeDBody',
    name: '3D Body',
    icon: 'smile',
    component: './3DBody',
  },
  {
    path: '/extraModeCom',
    name: 'extraModeCom',
    icon: 'smile',
    component: './ExtraModelCom',
  },
  {
    path: '/normalProject',
    name: 'normalProject',
    icon: 'smile',
    component: './NormalProject',
  },

  {
    path: '/CubeCamera',
    name: 'cubeCamera',
    icon: 'smile',
    component: './CubeCamera',
  },
  {
    path: '/Solider',
    name: 'Solider',
    icon: 'smile',
    component: './AnimateSolider',
  },
  {
    path: '/Airflight',
    name: 'Airflight',
    icon: 'smile',
    component: './Airflight',
  },
  {
    path: '/JokerBody',
    name: 'JokerBody',
    icon: 'smile',
    component: './Joker',
  },
  {
    path: '/three3D',
    name: 'Three3D',
    icon: 'smile',
    component: './Three3D',
  },
  // {
  //   path: '/scanModule',
  //   name: 'scanModule',
  //   icon: 'smile',
  //   component: './scanModule',
  // },
  {
    path: '/scanCity',
    name: 'scanCity',
    icon: 'smile',
    component: './scanCity',
  },
  {
    path: '/pointsMove',
    name: 'pointsMove',
    icon: 'smile',
    component: './PointsMove',
  },
  {
    path: '/GetVertexPosition',
    name: 'GetVertexPosition',
    icon: 'smile',
    component: './GetVertexPosition',
  },

  // 以下页面主要为3d地图，
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: '高德地图',
    icon: 'table',
    path: '/gaoMap',
    component: './Gao3D',
  },
  {
    path: '/',
    redirect: '/SliderBody',
  },
  {
    component: './404',
  },
];
