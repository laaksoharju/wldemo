<template>
  <div class="center">
    <div>
      <p>
        This web app is not a substitute for the game Wavelength and is not endorsed by the creators of the game. It is intended to temporarily give those who already know the rules an opportunity to play with friends during the pandemic.
      </p>
      <p>
        Buy the game, read the rules and <a class="link" @click="setupWavelength">play Wavelength</a>.
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
    setupWavelength: function () {
      this.$store.state.socket.emit('setupWavelength', this.$store.state.roomId);
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
  .link {
    text-decoration: underline;
    cursor: pointer;
  }
  p {
    font-size: 1.25em;
    max-width: 40em;
    margin: auto;
    margin-bottom: 0.5em;
  }

</style>
