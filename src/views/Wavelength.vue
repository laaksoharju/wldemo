<template>
  <div>
    <p>
      Invite other players with this link:
      <input type="text" class="link" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
    </p>
    <main>
      <WlDial :target="target" :isRevealed="isRevealed" />
      <div class="card-slot">
        <WlCard :card="card" />
      </div>
      <button v-show="!isRevealed" class="button reveal" @click="reveal"> {{labels.reveal}} </button>
      <button v-show="isRevealed" class="button hide" @click="hide"> {{labels.hide}} </button>
      <button v-show="isRevealed" class="button next" @click="next"> {{labels.new}} </button>
    </main>
    <div class="new">
      <router-link to="/">Create a new session!</router-link>
    </div>
  </div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import WlCard from '@/components/WlCard.vue'
import WlDial from '@/components/WlDial.vue'

export default {
  name: 'Wavelength',
  components: {
    WlCard,
    WlDial
  },
  data: function () {
    return {
      publicPath: "wldemo.herokuapp.com/#", //"localhost:8080/#"
      card: {left: '', right: ''},
      radius: 180,
      target: 0,
      dialX: 180,
      dialY: 0,
      isRevealed: false,
      touchScreen: false,
      maxSizes: {x: 0, y: 0},
      labels: {}
    }
  },
  created: function () {
    this.$store.commit('SET_PLAYER_ID', this.$route.query.id)
    //TODO! Fix this ugly shit
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.$store.state.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);
    this.$store.state.socket.emit('wavelengthLoaded', {roomId: this.$route.params.id, playerId: this.$store.state.playerId } );
    this.$store.state.socket.on('wavelengthLabels', labels =>
      this.labels = labels)
    this.$store.state.socket.on('newMission', function (mission) {
      this.card = mission.card;
      this.target = mission.target;
    }.bind(this));
    this.$store.state.socket.on('wavelengthRevealed', () => this.isRevealed = true);
    this.$store.state.socket.on('wavelengthHidden', () => this.isRevealed = false);
  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },
    reveal: function () {
      this.$store.state.socket.emit("wavelengthReveal", {roomId: this.$route.params.id, playerId: this.$store.state.playerId });
    },
    hide: function () {
      this.$store.state.socket.emit("wavelengthHide", {roomId: this.$route.params.id, playerId: this.$store.state.playerId });
    },
    next: function () {
      let time = 0;
      if (this.isRevealed) {
        time = 1000;
        this.hide();
      }
      //wait until blind closes
      window.setTimeout(() =>
        this.$store.state.socket.emit("wavelengthUpdate", {roomId: this.$route.params.id, playerId: this.$store.state.playerId }), time);
    },
  },
}
</script>
<style scoped>
  main {
    margin: auto;
    width: 50vw;
  }
  p {
    width:25vw;
    margin:1rem auto;
  }
  .card-slot {
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .card-slot div {
    margin:auto;
  }
 
  .new a {
    position: fixed;
    text-decoration: none;
    bottom: calc(2vw + 1rem);
    left: 2vw;
    color:ivory;
    border-bottom: 2px dotted ivory;
  }
  .new a:visited {
    color:ivory;
  }
  .link {
    font-family: inherit;
    border: 0;
    background: unset;
    width: 20em;
    font-size: 1em;
    border-bottom: 2px dotted ivory;
    text-align: center;
    padding: 0;
    color:ivory;
  }
  button {
    font-family: inherit;
    display: block;
    text-transform: uppercase;
    border-radius: 1rem;
    height: 6rem;
    width: 12rem;
    margin: 1rem auto;
    border: 0;
    box-shadow: 0 1rem 1rem rgba(0,0,0,0.5);
    color: white;
    font-size: 1.5em;
    text-shadow: 0 0 1rem rgba(0,0,0,0.5);
    user-select: none;
  }

  .reveal {
    background: linear-gradient(lightgreen,green);
  }
  .hide {
    background: linear-gradient(orange, firebrick);
  }
  .next {
    background: linear-gradient(lightskyblue,cornflowerblue);
    position: fixed;
    height:3rem;
    width: 7rem;
    font-size: 1em;
    bottom: 2vw;
    right: 2vw;
  }
  @media screen and (max-width: 800px) {
    main {
      width:90vw;
    }

    p {
      width:90vw;
    }

    #dial-wrapper {
      position: relative;
      width:90vw;
      height:45vw;
      overflow: hidden;
    }
  }
</style>
