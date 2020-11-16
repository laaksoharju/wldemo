<template>
  <div>
    <a class="link" @click="setupWavelength">Play Wavelength</a>
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
      this.$router.push("/wavelength/" + this.$store.state.roomId);
    },
  }
}
</script>
<style scoped>

  .link {
    text-decoration: underline;
    cursor: pointer;
  }

</style>
