<script lang="ts">
    import Block from "$lib/components/Block.svelte";
    import type { BlockModel } from "$lib/models";
    export let id: string;
    export let blocks: Array<BlockModel>;
  </script>
  
  <div class="line" data-line-id={id}>
    {#each blocks as {id, text}}
      <Block {id} {text}/>
    {/each}
  </div>
  
  
  <style>
    .line {
      display: flex;
      gap: 5px;
    }
  </style>
  