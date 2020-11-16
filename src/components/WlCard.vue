<template>
    <div class="card">
        <div class="section left">
          <center>
            <h1>←</h1> 
            <p>
              {{card.left}} 
            </p>
          </center>
        </div>
        <div class="section right">
          <center>
            <h1>→</h1>
            <p>
              {{card.right}}
            </p>
          </center>
        </div>
    </div>
</template>

<script>
export default {
  name: 'WlCard',
  props: {
    card: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    margin-top: 1rem;
    margin-bottom: 0;
    line-height: 1rem;
    font-size: 2.5rem;
  }
  .card {
    font-size:1.25em;
    word-wrap: break-word;
    user-select: none;
    color: black;
    margin:auto;
    width:20rem;
  }
  .section {
    display: inline-block;
    vertical-align: bottom;
    width: 9rem;
    height: 9rem;
    padding:0.5rem;
  }
  .right {
    background: cornflowerblue;
    border-radius: 0 1rem 1rem 0;
  }
  .left {
    background: lightcoral;
    border-radius: 1rem 0 0 1rem;
  }

</style>
