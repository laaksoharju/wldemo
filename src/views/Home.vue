<template>
  <div class="center">
    <div>
      <h1>Wavelength over video call</h1>
      <p>
        This web app is intended to temporarily give those who already own the game <a href="https://boardgamegeek.com/boardgame/262543/wavelength">Wavelength</a> an opportunity to play with friends over video call during the pandemic. It is not endorsed by the creators of the game.
      </p>
      <p>
        To play successfully you need to understand two things:
        <ul>
          <li>
            Every room is its own little universe so in order to play together, you need to share the invite link with your friends.
          </li>
          <li>
            Everyone in a room sees the same things so you have to close your eyes when you're not the clue giver. And if you try to cheat, others will probably notice.
          </li>
        </ul>
      </p>
      <p>
        So buy the game, read the rules and <a @click="setupWavelength('en')">play Wavelength responsibly</a>.
      </p>
      <p>
        For certain groups, <a @click="setupWavelength('sc')">the scientific version</a> may be fun.
      </p>
      <p>
        Eller <a @click="setupWavelength('se')">spela på svenska</a>.
      </p>
      <p>
        -------
      </p>
      <p>
        <small>
          Disclaimer: this web app runs only as long as nobody complains and until my free heroku dynos run out. No warranties etc.
        </small>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  created: function () {
    this.$store.commit('SET_ROOM_ID');
  },
  methods: {
    setupWavelength: function (lang="en") {
      this.$store.state.socket.emit('setupWavelength', {roomId: this.$store.state.roomId, 
        lang: lang });
      this.$router.push("/room/" + this.$store.state.roomId);
    },
  }
}
</script>
<style scoped>
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 1em;
  }
  a {
    text-decoration: underline;
    cursor: pointer;
    color: lightcoral;
  }
  p {
    font-size: 1.25em;
    max-width: 40em;
    margin: auto;
    margin-bottom: 0.5em;
  }

</style>
