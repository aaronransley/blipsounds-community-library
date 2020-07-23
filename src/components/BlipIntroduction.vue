<template>
  <v-card>
    <v-card-title>The Deets 🔍</v-card-title>
    <v-card-text>
      <h4>What is this?</h4>
      <v-divider />
      <p>
        The Blipsounds Community Sound Library is a hub for the Blipsounds community to publicly share homemade audio
        assets with one-another.
      </p>
      <p>
        Join the
        <a href="https://invite.gg/blipsounds" target="_blank">Blipsounds Discord</a>
        and hop into the <code>#community-library</code> channel to chat with fellow sound designers!
      </p>

      <h4>How can I use these sounds?</h4>
      <v-divider />
      <p>
        All of the audio assets posted to this library are free for use in any product, commercial or non-commercial,
        provided that the sounds are played alongside or in support of other media.
      </p>
      <p>
        Resale or distribution of isolated audio is
        <strong>not allowed</strong>!
      </p>

      <h4>How can I contribute?</h4>
      <v-divider />
      <p>
        We&#39;re glad you asked! To submit audio assets to the library, head on over to the
        <a href="https://forms.gle/LC1xt1YiVccrZxSe7" target="_blank">submission form</a>.
      </p>
      <p>
        This library thrives on the generosity of individuals willing to contribute their creative ideas to help sound
        designers access quality content. All that we ask is you <em>please read the rules</em> before submission!
      </p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue darken-1" text @click="$emit('close')">Neato!</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {}
</script>

<style>
h4 {
  margin-top: 0.5em;
}

hr {
  margin: 0.15em 0 0.5em 0;
}
</style>
