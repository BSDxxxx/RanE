import execjs
import requests
import json
import hashlib
import random
import time


# 需要安装pyexecjs,requests

# 不确定client_key是否发生变化
client_key = "472770f9e581cffb09349f422af57c5d"

# 加载js文件
f = open("decode.js", 'r', encoding='utf-8')
htmlstr = f.read()
f.close()
ctx = execjs.compile(htmlstr)
session = requests.session()
ts = int(time.time())

# 对t，v格式的数据进行解码，获得原始格式
def decodemsg(t, v):
    return ctx.call('decode', t, v)

# 对原始数据进行编码获得t，v的格式
def encodemsg(t, v):
    return ctx.call('encode', t, v)

# 获取md5
def getmd5(a):
    m = hashlib.md5()
    m.update(a.encode("utf-8"))
    return m.hexdigest()

# 发送post指令，url为网址后面的指令部分，如/game/exchange，msg为map格式，只需要传parm内的数据
def commandpost(url, msg):
    global ts
    global uid
    headers = {
        "referer": "https://appservice.qq.com/1110797565/1.1.5/page-frame.html",
        "user-agent": "Mozilla/5.0 (Linux) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.185 Mobile Safari/537.36 QQ/8.5.5.5105 V1_AND_SQ_8.5.5_1630_YYB_D QQ/MiniApp",
        "content-type": "application/x-www-form-urlencoded",
        "accept-encoding": "gzip"}

    parm = json.dumps(msg).replace(" ", "")
    sign = getmd5(uid+str(ts)+parm+client_key) #计算sign
    
    datas = {"uid": uid, "ts": ts, "params": parm, "sign": sign} #拼凑数据包
    t = random.randint(10000000, 99999999)
    v = encodemsg(t, json.dumps(datas).replace(" ", "")) #将数据包转化为t，v格式

    res = session.post("https://rane.jwetech.com:9080/"+url,
                           't={}&v={}'.format(t, v), headers=headers, timeout=0.2)
    text = res.text
    js = json.loads(text)
    js = json.loads(decodemsg(js["t"], js["v"])) #解密返回数据
    print(ts, url, js)
    ts = ts+1
    return(js)

# post发送登录命令，datas可以留空
def loginpost(datas):
    global ts
    global uid
    headers = {
        "referer": "https://appservice.qq.com/1110797565/1.1.5/page-frame.html",
        "user-agent": "Mozilla/5.0 (Linux;) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.185 Mobile Safari/537.36 QQ/8.5.5.5105 V1_AND_SQ_8.5.5_1630_YYB_D QQ/MiniApp",
        "content-type": "application/x-www-form-urlencoded",
        "accept-encoding": "gzip"
    }
    # sign=getmd5(uid+str(ts)+parm+client_key)
    res = session.post(
    'https://rane.jwetech.com:9080//login/login', datas, headers=headers)
    text = res.text
    js = json.loads(text)
    js = json.loads(decodemsg(js["t"], js["v"]))
    print(js)

# 编解码测试
# print(decodemsg(16421077, "b262ac856f59a182dfc9f4ab6ca18710420ea551"))
# print(encodemsg(51907146, '{"errCode":0,"errMsg":"物品已被兑换完了"}'))

datas = "t=15081747&v=31aa59614a04219d4b5ae85b089ebadee37585cf7696a9cafab5a4d65582dbf020f6e2fc0353923d8a2a76e7fdcddecee1ec804c0b843644c300ea455c82aa6c77dd70e1783d76ba20573974c43e15e63b954cf577c4e5a6c7f71bba12e9532cb7d03414ff1e1de8a28fdd394a2eed8a7a24a373baf3895db0c024e11a68fc789d343d20b3b9c3cba5f00af1477862844f81f1aa63170043db7efd04099c7ecdb6cf069619586dd74cf455cdbaa5045a26b933e5055c364139bbc230eb03d1773aea63bc3c3ea090740ca3e283c54fba20db06d0fc5b6477e6df210c11a7dccfdcfca75b3a76c7f7be94675dc549100f428c12df86d95ab9d8472fbc473fc11fb78c86374d80"#此处可以填login抓包的全部参数，用于登录，实测不登录，只要ts足够大就能响应请求
uid = "F78D4B61834FEA0406A1BB6EC959FAA9" #个人的uid，右上角头像出可查看
loginpost(datas) #发送登陆数据

# gift id
# 超会月201 超会三月、六月、年 202 203 204
# 大会员月214 大会员年 215

# dat={"id":214}
# commandpost("/game/exchange",dat)
# 兑换测试

a=1
while a<10:
    dat={}
    commandpost("/game/fbStart",dat)
    dat={"score":250,"step":15}
    time.sleep(10)
    commandpost("/game/fbSingle",dat)
    a+=1
#单人模式刷分测试
