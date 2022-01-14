<template>
  <div id="app">
    <v-app theme="dark">
      <v-app-bar app>
        <div
          class="font-weight-bold site-title text-truncate"
          title="Community Sound Library"
        >
          Community Sound Library
        </div>
        <v-dialog v-model="showInfo" scrollable max-width="512px">
          <template #activator="{ on, attrs }">
            <v-btn
              class="show-info-btn"
              dark
              x-small
              fab
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-help</v-icon>
            </v-btn>
          </template>
          <BlipIntroduction @close="showInfo = false" />
        </v-dialog>

        <v-spacer />
        <v-text-field
          v-model="search"
          class="search-bar"
          append-icon="mdi-magnify"
          label="Search for a sound..."
          single-line
          hide-details
        />
        <v-spacer />
        <v-dialog v-model="showZips" scrollable max-width="768px">
          <template #activator="{ on, attrs }">
            <v-btn class="zips" small color="primary" v-bind="attrs" v-on="on">
              <span class="upload-inner">Download</span>
              <v-icon right> mdi-cloud-download </v-icon>
            </v-btn>
          </template>
          <BlipZips :zips-data="zipsData" @close="showZips = false" />
        </v-dialog>
        <v-btn
          class="upload"
          small
          color="primary"
          href="https://forms.gle/LC1xt1YiVccrZxSe7"
          target="_blank"
        >
          <span class="upload-inner">Upload</span>
          <v-icon right> mdi-cloud-upload </v-icon>
        </v-btn>
      </v-app-bar>

      <v-main style="padding-top: 5px">
        <v-container fluid>
          <v-card>
            <template v-if="!sheetData.length">
              <v-progress-circular
                class="loader"
                indeterminate
                size="64"
                color="primary"
              />
            </template>
            <template v-else>
              <v-data-table
                :headers="headers"
                :items="sheetData"
                :search="search"
                :expanded="expanded"
                :footer-props="{ itemsPerPageOptions: [100, 75, 50, -1] }"
                height="calc(100vh - 150px)"
                item-key="link"
                single-expand
              >
                <template #item[author]="{ item }">
                  <!-- :set attr is a hack to set local template variable -->
                  <div
                    class="text-truncate field-author"
                    :title="item.author"
                    :set="(authorWebsite = getAuthorWebsite(item.author))"
                    :set2="(authorDiscord = getAuthorDiscord(item.author))"
                  >
                    <template v-if="authorWebsite">
                      <a
                        :href="authorWebsite"
                        class="info--text"
                        target="_blank"
                        >{{ item.author }}</a
                      >
                    </template>
                    <template v-else>
                      {{ item.author }}
                    </template>
                    <template v-if="authorDiscord">
                      <div class="on-discord" :title="authorDiscord">
                        {{ authorDiscord }}
                      </div>
                    </template>
                  </div>
                </template>
                <template #item[filename]="{ item }">
                  <div
                    class="text-truncate field-filename"
                    :title="item.filename"
                  >
                    {{ item.filename }}
                  </div>
                </template>
                <template #item[tags]="{ item }">
                  <div class="field-tags" :title="item.tags">
                    {{ item.tags }}
                  </div>
                </template>
                <template #expanded-item="{ item, headers: h }">
                  <td :colspan="h.length">
                    <iframe
                      :src="createIframeSrc(item.link)"
                      width="100%"
                      height="120"
                      frameborder="0"
                    />
                  </td>
                </template>
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template #item.actions="{ item }">
                  <div style="margin: 4px 0" data-iframe-height>
                    <v-btn
                      style="margin: 2px"
                      rounded
                      small
                      color="primary darken-4"
                      :href="createDownloadLink(item.link)"
                      target="_blank"
                    >
                      Download
                      <v-icon right> mdi-cloud-download </v-icon>
                    </v-btn>
                    <v-btn
                      style="margin: 2px"
                      rounded
                      small
                      my-2
                      color="secondary lighten-1"
                      @click="expandItem(item)"
                    >
                      Preview
                      <v-icon right> mdi-volume-high </v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </template>
          </v-card>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import BlipIntroduction from "./components/BlipIntroduction"
import BlipZips from "./components/BlipZips"
import { parse } from "csv-parse"

const sheetDataCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSphNZ_lnHkZjsWHJl0D9OKsOX7aZ4MEwoflkYGNl0XcOalspwQ-DH8G12hFimg9L5EdM7L2ZTA0v5D/pub?gid=1484031240&single=true&output=csv"
const zipsDataCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSphNZ_lnHkZjsWHJl0D9OKsOX7aZ4MEwoflkYGNl0XcOalspwQ-DH8G12hFimg9L5EdM7L2ZTA0v5D/pub?gid=1327133211&single=true&output=csv"

export default {
  name: "App",
  components: {
    BlipIntroduction,
    BlipZips,
  },
  data() {
    return {
      sheetDataRaw: null,
      zipsDataRaw: null,
      loadError: false,
      showInfo: false,
      showZips: false,
      search: "",
      expanded: [],
      headers: [
        {
          text: "Author & Discord Handle",
          align: "start",
          value: "author",
        },
        { text: "Filename", value: "filename" },
        { text: "Tags", value: "tags" },
        { text: "Info", value: "info" },
        { text: "Actions", value: "actions", sortable: false, align: "end" },
      ],
    }
  },
  computed: {
    sheetData() {
      if (!this.sheetDataRaw) return []
      return this.sheetDataRaw.map((entry) => {
        return {
          author: entry["Author"],
          filename: entry["Filename"],
          link: entry["Link"],
          info: entry["Other Info"],
          tags: entry["Tags"],
          website: entry["Website"],
          discord: entry["Discord"],
          actions: "",
        }
      })
    },
    zipsData() {
      if (!this.zipsDataRaw) return []
      return this.zipsDataRaw.map((entry) => {
        return {
          title: entry["Title"],
          link: entry["Link"],
          notes: entry["Notes"],
          numFiles: entry["Num Files"],
          size: entry["Size"],
        }
      })
    },
    authorWebsites() {
      let authorWebsitesTable = {}
      if (this.sheetData.length) {
        this.sheetData.forEach((item) => {
          let authorTrimmed = item.author.trim()
          if (authorTrimmed && item.website && item.website.trim() !== "") {
            if (!authorWebsitesTable[authorTrimmed]) {
              let websiteUrl = item.website
              if (websiteUrl.search(/^http[s]?:\/\//) === -1) {
                websiteUrl = "https://" + websiteUrl
              }
              authorWebsitesTable[authorTrimmed] = websiteUrl
            }
          }
        })
      }
      return authorWebsitesTable
    },
    authorDiscords() {
      let authorDiscordsTable = {}
      if (this.sheetData.length) {
        this.sheetData.forEach((item) => {
          let authorTrimmed = item.author.trim()
          if (authorTrimmed && item.discord && item.discord.trim() !== "") {
            if (!authorDiscordsTable[authorTrimmed]) {
              authorDiscordsTable[authorTrimmed] = item.discord
            }
          }
        })
      }
      return authorDiscordsTable
    },
  },
  mounted() {
    if (!this.$cookies.isKey("has-seen-info")) {
      if (!window.location.href.includes("localhost")) {
        this.showInfo = true
        this.$cookies.set("has-seen-info", true, Infinity)
      }
    }

    fetch(sheetDataCsvUrl).then((response) => {
      response
        .text()
        .then(async (data) => (this.sheetDataRaw = await this.parseCsv(data)))
    })

    fetch(zipsDataCsvUrl).then((response) => {
      response
        .text()
        .then(async (data) => (this.zipsDataRaw = await this.parseCsv(data)))
    })
  },
  methods: {
    parseCsv(csvText) {
      return new Promise((resolve) => {
        parse(csvText, { columns: true }, (err, output) => {
          output.reverse()
          resolve(output)
        })
      })
    },
    getAuthorWebsite(author) {
      return this.authorWebsites[author.trim()] || ""
    },
    getAuthorDiscord(author) {
      return this.authorDiscords[author.trim()] || ""
    },
    expandItem(item) {
      this.expanded = [item]
    },
    createDownloadLink(link) {
      try {
        var fileId = link.split("=")[1]
        return `https://drive.google.com/uc?export=download&id=${fileId}`
      } catch (error) {}
    },
    createIframeSrc(link) {
      try {
        var fileId = link.split("=")[1]
        return `https://drive.google.com/file/d/${fileId}/preview`
      } catch (error) {}
    },
  },
}
</script>

<style>
html {
  overflow: auto;
}

body {
  background-color: #121212;
}

#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.theme--dark.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background-color: var(--v-secondary-lighten1);
}

.v-application--wrap {
  min-height: 0;
}

.v-application code {
  background-color: var(--v-info-darken4);
  color: var(--v-primary-lighten4);
}

.field-author {
  min-width: 165px;
}

.field-filename {
  max-width: 230px;
}

.field-tags {
  max-width: 280px;
}

.show-info-btn {
  margin: 0 1em;
}

.on-discord {
  padding-right: 4px;
  padding-top: 4px;
  font-size: 10px;
  font-style: italic;
  white-space: normal;
  line-height: 1;
  color: grey;
}

.v-btn {
  margin-left: 1em;
}

.loader {
  margin: 0 auto;
  min-height: 320px;
  display: block;
  color: #4caf50;
}

@media (max-width: 550px) {
  .zips.zips.zips {
    padding: 0 5px;
    margin-left: 1em;
    min-width: 0;
  }

  .zips.zips.zips i {
    margin: 0;
  }

  .zips-inner {
    display: none;
  }
}

@media (max-width: 550px) {
  .upload.upload.upload {
    padding: 0 5px;
    margin-left: 1em;
    min-width: 0;
  }

  .upload.upload.upload i {
    margin: 0;
  }

  .upload-inner {
    display: none;
  }
}

@media (max-width: 710px) {
  .site-title {
    font-size: 14px;
  }

  .search-bar {
    max-width: 150px;
  }
}
</style>
