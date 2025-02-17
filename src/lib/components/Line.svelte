<script lang="ts">
    import Block from "$lib/components/Block.svelte";
    import type { BlockModel } from "$lib/models";
    import type { LineId } from "$lib/types/line";
    export let line: {id: LineId, blocks: BlockModel[]}
  </script>
  
  <div class="line" data-line-id={line.id}>
    {#each line.blocks as block}
      <Block {block}/>
    {/each}
  </div>
  
  
  <style>
    .line {
      display: flex;
      gap: 5px;
    }
  </style>
  