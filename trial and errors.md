### Week-4
#### Assignment-1
- error1: 在setTimeout裡不能直接用callback(params)傳參數，而應該用callback.bind(this, params)\
ref. [將參數傳送到 callback 函式](https://www.jstips.co/zh_tw/javascript/passing-arguments-to-callback-functions/)

#### Assignment-2
- JsrHint\
ref. [JSHint](https://jshint.com/)
- error2:\ 
在let info = document.getElementsByClassName("info") 下考慮以下三段code\
\
code-1 console.log(info[0])\
code-2 setTimeout(() => console.log(info[0]), 1000)\
code-3 console.log(info)\
\
code-1 會得到undifened，我想應該是頁面還沒載完就去抓info，所以抓不到\
於是在code-2設個timeout驗證，回傳div element，表示結果上述的假設沒錯\
ref. Arthur: 把javascript放在html的最底或是在body放onload可以確保讀完content之後才執行javascript\
alter. document.DOMContentLoaded\

- error3: 要注意到底傳回來的是array還是object\

#### Assignment-3

- error1:\
設定帳號密碼：先`sudo mysql`進mysql之後`use mysql` 然後`create user 'name'@'localhost' identified by 'password'`\
帳號密碼必須包含一個大寫、一個小寫、一個數字、一個特殊符號\

- error2:\
auto_increment對應的應該是int而非char

- error3:\
一定要搞清楚到底是在後端還是前端執行！

- error4:\
到mysql取資料也需要時間，所以得設定取完資料後的callback

- tip1:\
.vimrc中設定let curr=@% <---目前檔案的名稱，再用:execute '!node ' . curr來啟動執行

- error5:\
無法取得form data，還不是非常確定原因，但是有找到解法\
ref. [multipart/form-data](https://medium.com/cubemail88/node-js-express-js-body-parser-%E8%99%95%E7%90%86multipart-form-data%E7%9A%84%E8%A7%A3%E6%B1%BA%E6%96%B9%E6%A1%88-d89d2699b9f)

- error6:\
先送ajax request，會使server先建立一個user資料，於是等到真正要submit時，反而會回傳已被註冊

---
Batch11 open

#### 5/13
- git i
1. fork > PR

#### 5/14
- aws
1. instance
2. Elastic IP
3. key pair
4. secure group
5. nvm npm
6. mysql (install mysql-server)
7. nginx
8. pm2 
9. ssh
10. service

- 設定sql table的field時，屬性的順序怎麼寫會有差。
- 請確認找出mysql的root再開始mysql

#### 5/15
- mysql
1. show columns;
2. 找資料庫相關的資訊，要去information.schema
3. 刪除foreign key時，要用constraint_name
4. 抓form data請用multer[form-data](https://medium.com/cubemail88/node-js-express-js-body-parser-%E8%99%95%E7%90%86multipart-form-data%E7%9A%84%E8%A7%A3%E6%B1%BA%E6%96%B9%E6%A1%88-d89d2699b9f)

#### 5/17
- express
1. get的時候用req.query抓資料，post的時候用req.body (with body-parser and multer)
- multer
1. form的input可以設定multiple
- async
1. async會把return塞到resolve裡回傳
- sequelize
1. sequelize的操作就類似一種async function, 通常是回傳一個row, 就可以用.then(result => console.log(result))來捕捉

#### 5/18
- postman
1. 用chrome去post可以成功，但用postman去post卻無法取得req.body.category
- chrome dev tool
1. tip: 可以在console中設定某個element為變數，chrome會根據在console的輸入自動render出相應的DOM操作，而且還有autocomplete
2. tip: 找到一個element後點滑鼠左鍵 > store as variable，非常實用
- css
1. 以為是css的問題找半天，結果是因為在瀏覽器ctrl + "+"，事實證明不要太鐵齒，該問就要問

#### 5/20
- javascript
1. in 不像python的in，要改用array.includes()
2. switch 要記得在case裡設break
3. 不是primitive的物件比較要小心
4. filter和map好用
5. interpolation時要用`xxx`而非"xxx"或'xxx'
6. regex語法: let re= /ab+c/; <---要有分號
7. slice語法: arr.slice(begin, end)

#### 5/21
- DB (recap)
1. race condition
2. transcation
3. dead lock
4. linter

#### 5/22
- debug
1. 改完html記得重刷瀏覽器！！！
2. shell script裡空格matters
- git
1. git add 後面加的是檔名或目錄！(. 不是all的意思)
- ec2
1. key-pair必須登入instance才能改
2. proceedure of running an service on ec2
    - create an instance on ec2
    - create key-pair
    - set security grounp(allowing the inbounds for ip and ports, ex.80 for http, 22 for ssh)
    - set elastic ip
    - yum install git, nginx, myslq-server
    - nvm install node (follow the instructins on AWS site)
    - npm install pm2
    - set skip-grant table in /etc/my.conf
    - restart mysql server by service mysqld restart
    - set reverse proxy of nginx in /etc/nginx/nginx.conf
            server {
            listen         80 default_server;
            listen         [::]:80 default_server;
            server_name    localhost;
            root           /usr/share/nginx/html;   location / {
               proxy_pass http://127.0.0.1:3000;
               proxy_http_version 1.1;
               proxy_set_header Upgrade $http_upgrade;
               proxy_set_header Connection 'upgrade';
               proxy_set_header Host $host;
               proxy_cache_bypass $http_upgrade;
               }
            }
    - reastart nginx by service nginx restart
    - create mysql user by sudo login in mysql
    - git clone
    - npm install
    - mysql user database < db_backup.sql
    - pm2 start app
- javascript
1. 善用typeof
2. merge objects using mergedOb = {...Ob1, ...Ob2}

#### 5/23
- mysql 
1. 設定skip-grant-table off 的條件下不能順利啟動mysqld，重啟app的時候記得關掉

#### 5/24
- javascript
1. 記得interpolation要用特殊符號包起來`${xxx}`, 不是用單引號'${xxx}'！！！！
2. 跟http get, post相關的操作，記得json format！！
3. pem等加密檔案，要注意header或footer的格式

#### 5/26
- mysql
1. 不確定語法，就直接拿範例參考！硬試很浪費時間
- JSON
1. json string裡的數字必須是正常的數字格式，不能接受0001這種格式
- javascript
1. for (let x of y)   <---- x必須要用let宣告
- express
1. res.send(n)  <---- res.send不能傳int，要先把n改成字串(n.toString())
2. req header的content type要用application/json才抓得到資料

#### 5/27
- hack(recap)
1. beware of SQL or html render injection attack
2. to prevent SQL injection, use the formal syntax with '?' symbol e.g. `select * from ? where foo= ?`

#### 5/28
- data structure
1. to merge objects in seperate arrays, instead of double for loop, applying hash would be better (O(n^2) --> O(n))
- css
1. 用css塞background-image，必須給定width和height

#### 5/29
- mysql
1. 可以在mysql裡直接存stringify過的物件，再json parse出來
2. 可以試試loadash 的小工具組
- css
1. background-image是'某元素'的屬性，所以若某元素沒有大小，那背景自然不會顯示

#### 5/30
- javascript
1. interpolation要用 `xxxxxx` !!!!!!!
- vue
1. 不要把自訂element的屬性搞混了，那是傳值給component用的
2. 直接把一包大object存進componet，在template再做多次v-for就可以nested insert
- git
1. fetch過後，remote的branch不會自動出現在local的git branch裡(但加選項 -a可以看到)，這時不用在local再創一個new branch，而是直接checkout到要去的那個branch就行
- nginx
1. 網址列http自動跳https，去/etc/nginx/nginx.conf修改:
```
server {
  listen [::]:80;
  listen 80;
  # redirect http to https www
  return 301 https://my.set.url <--- 加上這行
}
```
- git
1. git add . 只會add當前資料夾內有追蹤的文件，記得到git的根目錄看有哪些東西沒add到
- scp
1. `scp -v -i ~/.myServer/myKey.pem -r ./images ec2-user@ec2-18-217-59-27.us-east-2.compute.amazonaws.com:~` local這邊不用加user@host
- bachrc
1. 寫一個myFunction(){cp '$1' '$2'} 可以吃$1和$2這兩個參數，這樣myFunction用起來就像alias
- vue
1. component有自己的tag name, 建立之後是被包在root裡(root則是要用id來掛載)
2. component要宣告在root之前！！！

#### 6/1
- vue
1. 善用$refs和:ref來識別v-for生成的element，$data可以取component的data
- css
1. 尺寸加px！！
- vim
1. `ctrl+o` 和 `ctrl+i' 往返cursor跳轉前/後位置，好
- js
1. 善用合併object, Object.assign({}, ...array)
- express
1. 要設定cookie再跳轉，要把res的method連著用 --> res.cookie(xxx).redirect(xxx)
2. res.cookie的編碼可以設定 --> .cookie('email', user.email, {encode: String})

#### 6/10
- assymetric encryptograpy
1. 別人用public key加密的訊息，只有我的private key可以解
2. 我用private key加密的訊息，任何有我的public key的人都可以解，而且只有這把public可以解(確認訊息一定是經過我加密的)
3. 要發一個只有A能解密的訊息，就先用我的private key加密，再用他的public key加密
