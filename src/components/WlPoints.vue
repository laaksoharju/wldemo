<template>
  <div :class="['team-section', team]">
    <div>
      <button @click="addPoints(-1)" :class="['minusP', {'hidden': !isRevealed}]">
        <span>-</span>
      </button>
    </div>
    <div class="points">
      {{ points }}
    </div>
    <div>
      <button @click="addPoints(1)" :class="['oneP', {'hidden': !isRevealed}]">
        <span>+</span>
      </button>
    </div>
  </div>
</template>
<script>

export default {
  name: 'WlPoints',
  props: {
    team: String,
    points: Number,
    isRevealed: Boolean
  },
  methods: {
    addPoints(points) {
      if (this.isRevealed)
        this.$emit('pointsUpdate', points);
    }
  }
}
</script>
<style scoped>

.team-section {
  display: grid;
  grid-template-areas: "minusP pp oneP";
  grid-template-columns: 3vw 10vw 3vw;
  font-size: 5vw;
  pointer-events: all;
  margin-top: 0.5rem;
}
.points {
  grid-area: pp;
  display: flex;
  align-items: center;
  justify-content: center;
}
button {
  border:0;
  font-size: inherit;
  text-shadow: 0 0 0.7rem rgba(255,255,255,1);
  border-radius: 0 0 5vw 5vw;
  background: transparent;
  cursor: pointer;
  transition: 1s;
  opacity: 1;
  padding:0;
  touch-action: manipulation;
}
.hidden {
  opacity: 0;
}
button span {
  position: relative;
  top: -0.5vw; 
}
.team1 {
  color: cornflowerblue;
  text-shadow: 0 0 0.5rem cornflowerblue;
}

.team2 {
  color: lightcoral;
  text-shadow: 0 0 0.5rem lightcoral;
}

.oneP {
  grid-area: oneP;
  color: lightgreen;
}

.minusP {
  grid-area: minusP;
  color:red;
}

</style>