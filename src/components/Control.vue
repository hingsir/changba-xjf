<template>
    <span @click="handler">{{text}}</span>
</template>
<script>
    export default {
      name: 'control',
      props: ['text', 'handler'],
      data(){
          return {

          }
      }
    }
</script>
