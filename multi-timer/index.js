var timer;

new Vue({
  el: "#app",
  filters: {
    toMinute(v) {
      const s = v % 60
      const m = (v - s) / 60
      return m + "分" + s + "秒"
    }
  },
  computed: {
    timers() {
      return this.timerSource.split("\n").filter(i => i.length > 0).map(i => {
        let s = i.split(" ")
        const minuteMatcher = /([0-9]*)m/
        let m = s[0].match(minuteMatcher)
        s[0] = s[0].replace(minuteMatcher, "")

        let result = 0;
        if (m && m[1]) {
          result += parseInt(m[1], 10) * 60
        }
        if (s[0]) {
          result += parseInt(s[0])
        }

        return {
          title: s[1] ? s[1] : i,
          time: result,
        }
      })
    }
  },
  methods: {
    tick() {
      this.timerRest--;
      if (this.timerRest === 0) {
        new Notification("完了:" + this.timers[0].title)
        this.timers.splice(0, 1)
        if (this.timers.length > 0) {
          this.timerRest = this.timers[0].time
        } else {
          this.stopTimer()
        }
      }
    },
    pauseTimer() {
      if (!this.timerPause) {
        clearInterval(timer)
      } else {
        timer = setInterval(() => {
          this.tick();
        }, 1000)
      }
      this.timerPause = !this.timerPause
    },
    startTimer() {
      this.timerPause = false;
      if (this.timerSource === "") {
        return;
      }


      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.timerStart = true;
          this.timerRest = this.timers[0].time
          timer = setInterval(() => {
            this.tick();
          }, 1000)
        }

      });
    },
    stopTimer() {
      this.timerStart = false;
      this.timerPause = false;
      clearInterval(timer)
      this.timerRest = this.timers[0].time
    },
  },
  data: {
    timerSource: "",
    timerStart: false,
    timerRest: 0,
    timerPause: false,
  },
  watch: {
    timerSource(value) {
      localStorage.setItem("hashrock-calc__timerSource", value)
    },

  },
  mounted() {
    if (localStorage.getItem("hashrock-calc__timerSource")) {
      this.timerSource = localStorage.getItem("hashrock-calc__timerSource")
    }

  }
})