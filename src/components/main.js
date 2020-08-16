const mainComponent = {
    template: (function(){/*
        <div>
            <main>
                <div class="inContent crearfix">
                    <div v-if="readyFlg">
                        <h2>会議に参加する人を選択し「確定」を押下してください。</h2>
                        <div class="checkbox">
                            <input id ="allSelect" value="allSelect" type="checkbox" :checked="isAllSelect" @click="allSelect">
                            <label for="allSelect" class="choice-sentence">全選択</label>
                        </div>
                        <div v-for="(user,index) in userList" class="checkbox">
                            <input :id="user.userId" :value="user.userName" v-model="selectUsers" type="checkbox">
                            <label :for="user.userId" class="choice-sentence">{{user.userName}}</label>
                        </div>
                        <button class="button confirmButton" @click="confirm">確定</button>
                    </div>
                    <h2>本日の会議参加者</h2>
                    <ul>
                    <li v-for="(joinUser,index) in selectUsers">
                        {{joinUser}}
                    </li>
                    </ul>
                    <div v-if="confirmFlg">
                        <p v-if="joinUsers.length !== 1">次の報告者</p> 
                        <p v-if="joinUsers.length === 1">最後の報告者</p> 
                        <button v-if="waitFlg" class="button" @click="randomStart">ランダム開始</button>
                        <button v-if="actionFlg" class="button" @click="randomStop">ランダム終了</button>
                        <button v-if="stopFlg" class="button" @click="reportStop">報告完了</button>
                        {{displayUser}}
                        <p>報告完了した人</p>
                        <ul>
                            <li v-for="(reportEndUser,index) in reportEndUsers">
                                {{reportEndUser}}
                            </li>
                        </ul>                
                    </div>
                    <div v-if="reportAllEndFlg">
                        全員分の報告が完了しました。
                    </div>
                </div>
            </main>
        </div>
        */}).toString().match(/(?:\/\*(?:[\s\S]*?)\*\/)/).pop().replace(/^\/\*/, "").replace(/\*\/$/, ""),
        data:function() {
            return {
                readyFlg: true,
                confirmFlg: false,
                userList: defaultUsers,
                selectUsers: [],
                joinUsers: [],
                reportEndUsers: [],
                isAllSelect: false,
                waitFlg: false,
                actionFlg: false,
                stopFlg: false,
                reportAllEndFlg: false,
                displayUser: '',
                saveTime: 0
            }
        },
        methods:{
            allSelect: function () {
                if(this.isAllSelect) {
                    this.selectUsers = []
                    this.isAllSelect = false
                } else {
                    this.selectUsers = []
                    for (var joinUser of this.userList) {
                        this.selectUsers.push(joinUser.userName)
                    }
                    this.isAllSelect = true
                }
            },
            confirm: function() {
                if (this.selectUsers.length === 0) {
                    alert("会議参加者が選択されていないので、選択してください。")
                    return
                }
                this.readyFlg = false
                this.confirmFlg = true
                this.joinUsers = this.selectUsers.slice()
                if(this.joinUsers.length === 1){
                    this.displayUser = this.joinUsers[0]
                    this.stopFlg = true
                    return
                }
                this.waitFlg = true
            },
            randomStart: function(){
                this.waitFlg = false
                this.actionFlg = true
                this.saveTime = setInterval(this.randomProcess, 8)
            },
            randomStop: function() {
                this.actionFlg = false
                this.stopFlg = true
                clearInterval(this.saveTime)
            },
            reportStop: function () {
                this.reportEndUsers.push(this.displayUser)
                var deleteIndex = this.joinUsers.indexOf(this.displayUser);
                this.joinUsers.splice(deleteIndex,1)
                if(this.joinUsers.length === 1){
                    this.displayUser = this.joinUsers[0]
                    return
                }
                this.displayUser = ''
                this.stopFlg = false
                if(this.joinUsers.length === 0){
                    this.confirmFlg = false
                    this.reportAllEndFlg = true
                    return
                }
                this.waitFlg = true
            },
            randomProcess: function() {
                var randomIndex = Math.floor(Math.random() * this.joinUsers.length)
                this.displayUser =  this.joinUsers[randomIndex]
            }
        }
}