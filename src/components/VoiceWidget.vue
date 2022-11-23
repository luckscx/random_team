<template>
  <div class="voice-widget">
    <h2>VoiceWidget</h2>
    <h3>
      <button class="start-button" v-on:click="initEngine">
        Start Porcupine
      </button>
    </h3>
    <h3>Loaded: {{ state.isLoaded }}</h3>
    <h3>Listening: {{ state.isListening }}</h3>
    <h3>Error: {{ state.error !== null }}</h3>
    <p class="error-message" v-if="state.error !== null">
      {{ state.error }}
    </p>
    <button v-on:click="start" :disabled="!state.isLoaded || state.error || state.isListening">
      Start
    </button>
    <button v-on:click="stop" :disabled="!state.isLoaded || state.error || !state.isListening">
      Stop
    </button>
    <button v-on:click="release" :disabled="!state.isLoaded || state.error">
      Release
    </button>
    <h3>Keyword Detections (Listening for "Grasshopper" and "Grapefruit"):</h3>
    <ul v-if="detections.length > 0">
      <li v-for="(item, index) in detections" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import { BuiltInKeyword } from "@picovoice/porcupine-web";
import { usePorcupine } from "@picovoice/porcupine-vue";
import porcupineParams from "@/lib/porcupine_params";

export default {
  name: "VoiceWidget",
  data() {
    return {
      porcupine: null,
      state: {},
      keywordDetection : null,
      accessKey: "7ZAFqX3F/5vRI2nZV6CD8317/WfUM5E1rF+L6JMN0ShJO0gVmwTyTw==",
      detections: [],
    };
  },
  methods : {
    initEngine : async () => {
      const porcupine = usePorcupine()
      await porcupine.init(
          this.accessKey,
          [BuiltInKeyword.Grasshopper, BuiltInKeyword.Grapefruit],
          { base64: porcupineParams }
      );
      this.state = porcupine.state
      this.keywordDetection = this.state.keywordDetection
    },
  },
  watch : {
    keywordDetection : function (val, oldVal) {
      console.log("keyword decection %s %s", val, oldVal)
    },
  },
  mounted() {
    //this.initEngine()
  }
}
</script>

<style scoped>
button {
  padding: 1rem;
  font-size: 1.5rem;
  margin-right: 1rem;
}

.start-button {
  padding: 0.1rem;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.voice-widget {
  border: 2px double #377dff;
  padding: 2rem;
}

.error-message {
  background-color: maroon;
  color: white;
  padding: 1rem;
  border-left: 5px solid red;
  font-family: monospace;
  font-weight: bold;
  font-size: 1.5rem;
}
</style>
