<template>
  <div id="dial-wrapper" v-touch:moving="moveDial" @mousemove="moveDial">
    <svg ref="dial" viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg">
      <path :d="outerArc" fill="yellow"/>
      <path :d="middleArc" fill="orange"/>
      <path :d="innerArc" fill="lightskyblue"/>
    </svg>      
    <svg :class="['cover', {revealed : isRevealed}]" viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cover-gradient" cy="1">
          <stop offset="0%" stop-color="lightcyan"/>
          <stop offset="100%" stop-color="lightskyblue"/>
        </radialGradient>
      </defs>
      <path d="M 360 180
         A 180 180, 0, 0, 0, 0 180
         L 180 180 Z" fill="url(#cover-gradient)"/>
    </svg>
    <svg id="dialbase" viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg">
      <path d="M 200 180
         A 20 20, 0, 0, 0, 160 200
         L 180 180 Z" fill="red"/>
    </svg>
    <svg id="dial" viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg">
      <path :d="dialPosition" stroke-width="2" stroke="red"/>
    </svg>
  </div>
</template>
<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

let mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown; 
}

export default {
  name: 'WlDial',
  props: {
    target: Number,
    isRevealed: Boolean
  },
  data: function () {
    return {
      radius: 180,
      dialX: 180,
      dialY: 0,
      touchScreen: false,
      maxSizes: {x: 0, y: 0},
    }
  },
  computed: {
    correct: function () {
      return this.target * 2 * this.radius;
    },
    dialPosition: function () {
      return "M " + this.dialX + " " + this.dialY + " L 180 180 Z"
    },
    innerArc: function () {
      return this.arcParams(Math.PI/54);
    },
    middleArc: function () {
      return this.arcParams(Math.PI/18);
    },
    outerArc: function () {
      return this.arcParams((5*Math.PI)/54);
    },
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.getSize);

      //Init
      this.getSize()
    })

  },
  created: function () {
    this.$store.state.socket.on('wavelengthDialMoved', function (d) {
      this.dialX = d.x; 
      this.dialY = d.y 
    }.bind(this));
  },
  methods: {
    arcParams: function (angle) {
      let x = this.correct;
      let r = this.radius;
      let y = r - Math.sqrt(Math.pow(r,2) - Math.pow(x - r, 2));
      let x1 = (x-r) * Math.cos(-angle) - (y-r) * Math.sin(-angle) + r;
      let y1 = (x-r) * Math.sin(-angle) + (y-r) * Math.cos(-angle) + r;
      let x2 = (x1-r) * Math.cos(2 * angle) - (y1-r) * Math.sin(2 * angle) + r;
      let y2 = (x1-r) * Math.sin(2 * angle) + (y1-r) * Math.cos(2 * angle) + r;
      return "M "+ x2 + " " + y2 + " A 180 180, 0, 0, 0, " + x1 + " " + y1 + " L 180 180 Z";
    },
    moveDial: function (event) {
      if (mouseDown || event.touches?.length > 0) {
        let x = event.clientX
        let y = event.clientY

        if (event.type === 'touchmove') {
          x = event.touches[0].clientX
          y = event.touches[0].clientY
        }
        x -= this.sizes.l;
        y -= this.sizes.t;

        let x1 = x - this.sizes.w / 2;
        let y1 = this.sizes.h - y;
        let hyp = Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2));
        let x2 = x1 * this.sizes.w / (2 * hyp);
        let y2 = y1 * this.sizes.h / hyp;
        x1 = x2 + this.sizes.w / 2;
        y1 =  this.sizes.h - y2;
        this.dialX = this.radius * 2 * Math.max(0, Math.min(x1, this.sizes.w)) / this.sizes.w;
        this.dialY = this.radius * Math.max(0, Math.min(y1, this.sizes.h)) / this.sizes.h;
        this.$store.state.socket.emit('wavelengthMoveDial', {roomId: this.$route.params.id, playerId: this.$store.state.playerId, x: this.dialX, y: this.dialY })
      }
    },
    getSize() {
      let dialBox = this.$refs.dial.getBoundingClientRect();
      this.sizes = {l: dialBox.left,
                    t: dialBox.top,
                    w: dialBox.right - dialBox.left,
                    h: dialBox.bottom - dialBox.top};
    }
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.getSize);
  }
}  
</script>
<style scoped>
 #dial-wrapper {
    position: relative;
    width:50vw;
    height:25vw;
    overflow: hidden;
  }
  #dial-wrapper svg {
    pointer-events: none;
    position: absolute;
  }
  .cover {
    transition: 1s;
    transform-origin: 50% 100%;
    transform: rotate(0deg);
  }
  .revealed {
    transition: 1s;
    transform: rotate(180deg);
  }
</style>