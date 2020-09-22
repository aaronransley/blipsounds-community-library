<template>
  <v-card>
    <v-card-title>The Zips 📦</v-card-title>
    <v-card-text>
      <h4>Zips? Zippers? PANTS?!</h4>
      <v-divider />
      <p>
        Below you can find archives of sounds from previous months of the Blipsounds Community Library. Download these
        to quickly access a bunch of great content for use in your projects!
      </p>
      <p>
        <em>Newest zips are at the top!</em>
      </p>
      <v-simple-table class="zips-table">
        <template v-slot:default>
          <thead>
            <tr class="zips-header">
              <th class="text-left">Title</th>
              <th>Notes</th>
              <th># Files</th>
              <th>Size</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in zipsData" :key="item.title">
              <td>{{ item.title }}</td>
              <td>{{ item.notes }}</td>
              <td>{{ item.numFiles }}</td>
              <td>{{ item.size }}</td>
              <td>
                <v-btn
                  v-if="item.link"
                  style="margin: 2px;"
                  color="primary"
                  :href="item.link"
                  target="_blank"
                  rounded
                  small
                  >Download
                  <v-icon right>mdi-cloud-download</v-icon>
                </v-btn>
                <span v-else>Coming soon... ⌚</span>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer />
      <v-btn color="blue darken-1" text @click="$emit('close')">Got 'em!</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    zipsData: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
h4 {
  margin-top: 0.5em;
}

hr {
  margin: 0.15em 0 0.5em 0;
}

.zips-table {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.zips-table .zips-header {
  background-color: #4caf50;
}

.zips-table .zips-header.zips-header th {
  color: white;
}

.zips-table .zips-header.zips-header th:first-child {
  border-top-left-radius: 4px;
}

.zips-table .zips-header.zips-header th:last-child {
  border-top-right-radius: 4px;
}

.table-header.table-header.table-header th {
}
</style>
