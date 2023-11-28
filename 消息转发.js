/**
 * @author Aming
 * @description 监听某个人或群,当触发关键字,转发到指定目的地
 * @origin 红灯区
 * @version v1.0.0
 * @name 消息转发
 * @rule [\s\S]+
 * @priority 100000
 * @admin false
 * @disable false
 */

/* 
这个插件会拦截所有消息进行处理,控制台日志会由此增多
/*
南辞二改自用
修改后的代码去除了头部消息（head 变量）、尾部增加的消息（config.addText）以及需要替换的功能（config.replace）。现在，代码将以原样转发收到的消息，不进行任何修改。
*/

/* 配置 */
const configs = [
  {
    listen: {
      /* 监听的群 */
      id: 277243301,
      from: 'qq',
      type: 'groupId',
    },
    rule: ['你好', '明天', '测试'], /* 触发关键词将进行转发 */
    toSender: [
      /* 转发目的地，可以是人，可以是群，可以是多个 */
      {
        id: 1629887728, /* id */
        from: 'tgBot',
        type: 'userId',
      },
      {
        id: -1001744932665, /* id */
        from: 'tgBot',
        type: 'groupId',
      },
    ],
  },
];

/* 主函数 */
module.exports = async s => {
  /* 异步处理 */
  await new Promise(resolve => {
    const msgInfo = s.msgInfo;
    for (const config of configs) {
      if (msgInfo.from !== config.listen.from || +msgInfo[config.listen.type] !== config.listen.id) continue;
      for (const rule of config.rule) {
        if (msgInfo.msg.includes(rule)) {
          config.toSender.forEach(e => {
            let obj = {
              platform: e.from,
              msg: msgInfo.msg,
            };
            obj[e.type] = e.id;
            sysMethod.push(obj);
          });
          break;
        }
      }
    }
    resolve();
  });
  return 'next';
};
