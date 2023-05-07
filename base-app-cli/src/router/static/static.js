const staticRoute = [
  {
    url: '/selectMap',
    name: 'selectMap',
    component: () => import('@/views/selectMap'),
    meta: {
      title: '地址选择'
    }
  },
  {
    url: '/report',
    name: 'report',
    component: () => import('@/views/report/'),
    meta: {
      title: '门前五包上报',
      keepAlive: true
    }
  },
  {
    url: '/merchant',
    name: 'merchant',
    component: () => import('@/views/merchant/'),
    meta: {
      title: '商户信息'
    }
  },
  {
    url: '/merchant/add',
    name: 'merchantEdit',
    component: () => import('@/views/merchant/src/edit'),
    meta: {
      title: '新增商户',
      keepAlive: true
    }
  },
  {
    url: '/merchant/edit',
    name: 'merchantEdit',
    component: () => import('@/views/merchant/src/edit'),
    meta: {
      title: '修改商户',
      keepAlive: true
    }
  },
  {
    url: '/merchant/view',
    name: 'merchantView',
    component: () => import('@/views/merchant/src/view'),
    meta: {
      title: '商户详情'
    }
  },
  {
    url: '/merchant/search',
    name: 'merchantSearch',
    component: () => import('@/views/merchant/src/search'),
    meta: {
      title: '商户查询'
    }
  },
  {
    url: '/signboard',
    name: 'signboard',
    component: () => import('@/views/signboard/'),
    meta: {
      title: '店牌店招'
    }
  },
  {
    url: '/signboard/add',
    name: 'signboardAdd',
    component: () => import('@/views/signboard/src/edit'),
    meta: {
      title: '新增招牌',
      keepAlive: true
    }
  },
  {
    url: '/signboard/edit',
    name: 'signboardEdit',
    component: () => import('@/views/signboard/src/edit'),
    meta: {
      title: '修改招牌',
      keepAlive: true
    }
  },
  {
    url: '/signboard/view',
    name: 'signboardView',
    component: () => import('@/views/signboard/src/view'),
    meta: {
      title: '招牌详情'
    }
  },
  {
    url: '/signboard/search',
    name: 'signboardSearch',
    component: () => import('@/views/signboard/src/search'),
    meta: {
      title: '店招查询'
    }
  },
  {
    url: '/statistics',
    name: 'statistics',
    component: () => import('@/views/statistics/'),
    meta: {
      title: '统计报表'
    }
  },
  {
    url: '/sysSetting',
    name: 'sysSetting',
    component: () => import('@/views/sysSetting/'),
    meta: {
      title: '系统设置'
    }
  },
  {
    url: '/sysSetting/help',
    name: 'sysSettingHelp',
    component: () => import('@/views/sysSetting/src/help'),
    meta: {
      title: '使用帮助'
    }
  },
  {
    url: '/sysSetting/detail',
    name: 'sysSettingDetail',
    component: () => import('@/views/sysSetting/src/detail'),
    meta: {
      title: '帮助详情'
    }
  },
  {
    url: '/mapLook',
    name: 'mapLook',
    component: () => import('@/views/mapLook/'),
    meta: {
      title: '地图浏览'
    }
  }
]
export default staticRoute
