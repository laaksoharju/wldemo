<template>
  <div>
    <header>
      <WlPoints :team="'team1'" :points="points.team1" :isRevealed="isRevealed" @pointsUpdate="addPoints('team1', $event)"/>
      <div></div>
      <WlPoints :team="'team2'" :points="points.team2" :isRevealed="isRevealed" @pointsUpdate="addPoints('team2', $event)"/>
    </header>
    <main>
      <div class="dial">
        <WlDial :target="target" :isRevealed="isRevealed"/>
      </div>
      <div class="card-slot">
        <WlCard :card="card" />
      </div>
      <div class="buttons">
        <button :class="['button', 'reveal', {'hidden' : isRevealed}]" @click="reveal">
          {{ labels.reveal }} 
        </button>
        <button :class="['button', 'hide', {'hidden': !isRevealed}]" @click="hide">
          {{ labels.hide }} 
        </button>
        <button :class="['button', 'next', {'hidden': !isRevealed}]" @click="next">
          {{ labels.new }}
        </button>
      </div>
    </main>
    <footer>
      <div class="new">
        <p>
          {{ labels.invite }}
          <input type="text" class="link" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
        </p>
        <p>
          <router-link to="/">{{ labels.create }}</router-link>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import WlCard from '@/components/WlCard.vue'
import WlDial from '@/components/WlDial.vue'
import WlPoints from '@/components/WlPoints.vue'

export default {
  name: 'Wavelength',
  components: {
    WlCard,
    WlDial,
    WlPoints
  },
  data: function () {
    return {
      publicPath: "wavelengthdemo.herokuapp.com/#", //"localhost:8080/#"
      card: { left: '', 
              right: '' },
      radius: 180,
      target: 0,
      dialX: 180,
      dialY: 0,
      isRevealed: false,
      touchScreen: false,
      maxSizes: { x: 0, 
                  y: 0 },
      labels: {},
      points: {team1: 0,
               team2: 0 }
    }
  },
  created: function () {
    this.$store.commit('SET_PLAYER_ID', this.$route.query.id)
    //TODO! Fix this ugly shit
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.$store.state.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);
    this.$store.state.socket.emit('wavelengthLoaded', {roomId: this.$route.params.id, 
      playerId: this.$store.state.playerId } );
    this.$store.state.socket.on('wavelengthLabels', labels =>
      this.labels = labels)
    this.$store.state.socket.on('newMission', function (mission) {
      this.card = mission.card;
      this.target = mission.target;
      this.points = mission.points;
    }.bind(this));
    this.$store.state.socket.on('wavelengthPointsUpdated', (d) => this.points = d );
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
    addPoints: function (team, points) {
      this.$store.state.socket.emit("wavelengthUpdatePoints", {roomId: this.$route.params.id, team: team, points: points});
    }
  },
}
</script>
<style scoped>
  header {
    user-select: none;
    position: fixed;
    width:100%;
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    z-index: 4;
    pointer-events: none;
  }
  main {
    user-select: none;
    margin: auto;
    width: 50vw;
  }
  footer {
    margin-top: 5em;
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
  .new {
    margin:auto;
  }
  .new a {
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
  .buttons {
    height: 8rem;
  }
  button {
    font-family: inherit;
    display: block;
    cursor: pointer;
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
    opacity: 1;
    transition: 1s;
    transition-timing-function: linear;
  }

  .reveal {
    background: linear-gradient(lightgreen,green);
  }
  .hide {
    background: linear-gradient(orange, firebrick);
  }

  .hidden {
    opacity: 0;
    height:0;
  }
  .next {
    background: linear-gradient(lightskyblue,cornflowerblue);
    height:3rem;
    width: 7rem;
    font-size: 1em;
  }

  @media screen and (max-width: 800px) {
    main {
      width:90vw;
    }

    p {
      width:90vw;
    }

    #dial-wrapper {
      position: fixed;
      width:90vw;
      height:45vw;
      overflow: hidden;
      background: rgba(0,0,0,0.7);
      box-shadow: 0 0 5vw rgba(0,0,0,1)
    }
    .dial {
      height: 50vw;
    }
    .team-section {
      font-size: 10vw;
    }
  }
</style>
