/**
 * @name SpyHandleMsg
 * @version v1.0.0
 * @author Aming
 * @origin 红灯区
 * @create_at 2033-10-27 11:12:09
 * @description 当触发的消息中没有 export线报时,触发的消息会经过此模块解析
 * @module true
 * @public false
 */


const request = require('util').promisify(require('request'));

module.exports = async msg => {
    /*
     当触发的消息中没有 export格式变量时,触发的消息会经过此模块解析
     因此,你可以在此模块中添加你对export以外的消息进行解析,返回一个export线报
    */
    const urlReg = /https:\/\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\*\+,%;\=]*/g;
    const codeReg = /[(|)|#|@|$|%|¥|￥|!|！][0-9a-zA-Z]{10,14}[(|)|#|@|$|%|¥|￥|!|！]/g;
    const urlArr = msg.match(urlReg)?.map(url => decodeURIComponent(url)) ?? [];
    const codeArr = msg.match(codeReg) ?? [];
    for (const [i, code] of codeArr.entries()) {
        const res = await nolanDecode(code);
        res ? (codeArr[i] = res) : codeArr.slice(i, 1);
    }
    let result = '';
    for (const link of [...urlArr, ...codeArr])
        urlToExport(link)?.forEach(e => (result += `export ${e.name}="${e.value}"\n`));
    /*
    如果该导出的函数返回值不是一个string或不是一个 export格式的线报时,该msg会被放弃
    如果该模块中的代码报错 将强制返回空字符串
    */
    return result ? `外部模块解析结果:\n${result}` : '';
};

/**
 * @Description 解析列表 取于白眼
 * 修改记录
 *   版本号[1.0.1] 修订日期[2023/4/13 9:57 AM]  修改内容 [增加多变量解析参数注释]
 *     {
 * 			keyword:"https://lzkj-isv.isvjcloud.com/app?a=xxxxx&b=xxxxxx",
 * 			trans:[
 * 				{
 * 					ori: "a b", // 当多变量的时候按顺序填写需要在链接中提取的参数
 * 					redi: "key",
 * 					sep:"&" // 连接符  结果  export key="a&b"
 * 				}
 * 		},
 *
 */
function ListS() {
    return [
        /****By南辞编辑解***部分改自Tg @Yun_Chenga***********适配麦基库*************俗称M库********* */
        {
            keyword: /wxDrawActivity|wxPointDrawActivity/,
            name: 'M佬幸运抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_LUCK_DRAW_URL',
                },
            ],
        },
        {
            keyword: /showTaskDraw|showDrawOne|lzclient|wxDrawActivity/,
            name: 'M佬幸运抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_LUCK_DRAW_URL',
                },
            ],
        },
				{
            keyword: /(?=.*gzsl-isv)(?=.*game)/,
            name: 'M佬幸运抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_LUCK_DRAW_URL',
                },
            ],
        },
        {
            keyword: /pointDraw|luckyGrid|turntable/,
            name: 'M佬幸运抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_LUCK_DRAW_URL',
                },
            ],
        },
        {
            keyword: /activityType=(10020|10021|10026|10031|10042|10046|10063|10073|10080)/,
            name: 'M佬幸运抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_LUCK_DRAW_URL',
                },
            ],
        },
        {
            keyword: /wxCollectionActivity|showCart/,
            name: 'M佬加购有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_ADD_CART_URL',
                },
            ],
        },
        {
            keyword: /activityType=(10024)/,
            name: 'M佬加购有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_ADD_CART_URL',
                },
            ],
        },
        {
            keyword: /plusGift|extraGift/,
            name: 'M佬加购有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_ADD_CART_URL',
                },
            ],
        },
        {
            keyword: /pointExgBeans|pointExgShiWu|pointExgECard/,
            name: 'M佬积分兑换',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_POINT_DRAW_URL',
                },
            ],
        },
        {
            keyword: /wxTeam|activityType=(10033)|showPartition|partitionTeam/,
            name: 'M佬组队瓜分',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_TEAM_URL',
                },
            ],
        },
        {
            keyword: /activityType=(10082|10084|10086|10089|10091|10092|10093|10094|10095)/,
            name: 'M佬无线游戏',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_GAME_URL',
                },
            ],
        },
        {
            keyword: /wxGameActivity/,
            name: 'M佬无线游戏',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_GAME_URL',
                },
            ],
        },
        {
            keyword: /showFavoriteShop|wxShopFollowActivity|activityType=(10053|10069)/,
            name: 'M佬关注抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_FOLLOW_DRAW_URL',
                },
            ],
        },
        {
            keyword: /wxShareActivity|shareGift|activityType=(10043|10068)/,
            name: 'M佬分享有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_SHARE_URL',
                },
            ],
        },
				{
            keyword: /wxUnPackingActivity/,
            name: 'M佬分享福袋',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_UNPACK_DRAW_URL',
                },
            ],
        },
        {
            keyword: /showPerfectInformation|completeInfoActivity|activityType=(10049)/,
            name: 'M佬完善有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_COMPLETE_DRAW_URL',
                },
            ],
        },
        {
            keyword: /wxCartKoi|activityType=(10036)/,
            name: 'M佬购物车锦鲤',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_CARTKOI_URL',
                },
            ],
        },
        {
            keyword: /wxMcLevelAndBirthGifts/,
            name: 'M佬生日等级礼包',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_LEVEL_BIRTH_URL',
                },
            ],
        },
        {
            keyword: /wxKnowledgeActivity|activityType=(10039)/,
            name: 'M佬知识超人',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_KNOWLEDGE_URL',
                },
            ],
        },
        {
            keyword: /activityType=(10006|10070)/,
            name: 'M佬邀请有礼INTERACT',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_INTERACT_INVITE_URL',
                },
            ],
        },
				{
            keyword: /ajinggeng-isv\.isvj(clou)?d\.com\/ql\/front\/showInviteJoin/,
            name: 'M佬邀请有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_JINGGENG_INVITE_URL',
                },
            ],
        },
				{
            keyword: /(dingzhi\/joinCommon\/activity|lzdz1-isv.(isvjcloud|isvjd).com\/m\/(unite\/|\d+\/dz)|jdbeverage\/pages)/,
            name: 'M佬通用开卡',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_OPENCARD_M_URL',
                },
            ],
        },
				{
            keyword: /fansactiveall|videofangrowth|fansactivecopy/,
            name: 'M佬粉丝红包',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_FANS_RED_PACKET_URL',
                },
            ],
        },
				{
            keyword: /wxFansInterActionActivity/,
            name: 'M佬粉丝互动',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_FANS_DRAW_URL',
                },
            ],
        },
				{
            keyword: /wxShopGift|shopGiftBag.html|newShopGiftBag.html/,
            name: 'M佬无线关注',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_SHOP_GIFT_URL',
                },
            ],
        },
				{
            keyword: /activityType=(10058)|(10069)|(10053)/,
            name: 'M佬无线关注',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_SHOP_GIFT_URL',
                },
            ],
        },
				{
            keyword: /SignIn|showSign|activityType=(10002|10023|10040)/,
            name: 'M佬签到有礼',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_SHOP_SIGN_URL',
                },
            ],
        },
				{
            keyword: /wxSecond/,
            name: 'M佬读秒手速',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_SECOND_DRAW_URL',
                },
            ],
        },
				{
            keyword: /activityType=(10044)/,
            name: 'M佬投票抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_VOTE_DRAW_URL',
                },
            ],
        },
				{
            keyword: /wxgame/,
            name: 'M佬打豆豆',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_DADOUDOU_URL',
                },
            ],
        },
				{
            keyword: /lzkj-isv.isvj(clou)?d.com\/drawCenter|activityType=10054/,
            name: 'M佬老虎机抽奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WX_CENTER_DRAW_URL',
                },
            ],
        },
				{
            keyword: /.jd.com\/mshop\/shopdraw|lottery/,
            name: 'M佬店铺刮奖',
            trans: [
                {
                    ori: '-1',
                    redi: 'M_WXM_GYG_SHOP_ARGV',
                },
            ],
        },
        {
            keyword: /activityType=10022/,
            name: 'Super每日抢好礼（100系列）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_lzkj_loreal_dailyGrabs_url', //SuperMan
                },
            ],
        },
        {
            keyword: /daily/,
            name: 'Super每日抢好礼（超级无线）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_daily_activityUrl', //SuperMan
                },
            ],
        },
        {
            keyword: /signActivity2|signActivity/,
            name: 'Super店铺签到（超级无线）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_shopSign_activityUrl', //SuperMan
                },
            ],
        },
        {
            keyword: /activityType=(10001|10002|10003|10004)/,
            name: 'Super签到抽奖（超级无线）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_lzkj_loreal_sign_url', //SuperMan
                },
            ],
        },
        {
            keyword: /activityType=(10023|10040)/,
            name: 'Super签到有礼（超级无线.100）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_lzkj_loreal_daySign_url', //SuperMan
                },
            ],
        },
        {
            keyword: /txzj-isv\.isvjcloud\.com\/sign_in/,
            name: 'Super签到有礼（收藏大师）',
            trans: [
                {
                    ori: '-1',
                    redi: 'jd_sign_in_activityUrl', //SuperMan
                },
            ],
        },
    ];
}

/* 诺兰口令解析接口 */
async function nolanDecode(code) {
    try {
        const dbUrl = await new BncrDB('AmingScript').get('deCodeHost', 'https://api.nolanstore.cc');
        return (
            await request({
                url: `${dbUrl}/JComExchange`,
                method: 'post',
                body: {
                    code,
                },
                json: true,
            })
        )?.body?.data?.jumpUrl;
    } catch (e) {
        console.log('nolanDecode ' + e);
        return void 0;
    }
}
/* 解析函数 ,改于白眼 */
function urlToExport(url) {
    // console.log('urlToExport', url);
    let ResArr = [];
    const listS = ListS();
    for (const oneList of listS) {
        if (!url.match(oneList.keyword)) continue;
        for (const r of oneList.trans) {
            let temp = {
                act: oneList.name,
                name: r.redi,
            };
            if (+r.ori === -1) {
                temp['value'] = encodeURI(url);
            } else if (r.ori.indexOf(' ') !== -1) {
                //提取多参数作为变量值
                let pn = r.ori.split(' ');
                let pv = [];
                pn.forEach(ele => {
                    console.log(ele);
                    if (!ele) return;
                    let reg = new RegExp('(?<=' + ele + '(=|%3D))[^&%]+'),
                        actid = url.match(reg);
                    if (actid) pv.push(actid[0]);
                    else console.log(url + '\n中未找到活动参数:' + ele);
                });
                if (!pv.length) break;
                if (r.sep) temp['value'] = pv.join(r.sep);
                else console.log('内置解析规则' + JSON.stringify(oneList) + '缺少分割符');
            } else {
                // 提取参数作为变量
                let reg = new RegExp(`(?<=${r.ori}(=|%3D))[^&%]+`),
                    actid = url.match(reg);
                if (!actid) break;
                temp['value'] = actid[0];
            }
            temp['value'] && ResArr.push(temp);
        }
    }
    return ResArr;
}
