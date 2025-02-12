<script lang="ts">
    import Line from '$lib/components/Line.svelte';
    import { ARITHMETIC_OPERATORS } from '$lib/constants/arithOperators';
    import { addBlock, addLine, addOperator, currentBlock, currentLine, store } from '$lib/stores/store';
    import { isVariableName } from '$lib/utils/isVariableName';
    import { getLines } from '$lib/utils/selectors/getLines';
    import { derived } from 'svelte/store';
  
    const lines = derived(store, ($state) => getLines({state: $state}))

    $: console.log('lines', $lines.map(line => line.blocks.map(block => block.id)))

    // Обработка нажатия клавиши
    function handleKeyDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;

        // Найти ближайший блок и строку
        const blockElement = target.closest('[data-block-id]');
        const lineElement = target.closest('[data-line-id]');

        const blockId = blockElement?.getAttribute('data-block-id');
        const lineId = lineElement?.getAttribute('data-line-id');

        if (blockId && lineId) {
            console.log(`Key pressed in Block ID: ${blockId}, Line ID: ${lineId}`);
            
            if (event.key === ' ') {
                handleSpace({event})                
            }    
            else if (event.key === "ArrowDown") {
                const [lastLineId] = $store.linesId.slice(-1)

                if (lastLineId === lineId) {
                    addLine({lineId})
                }
            }
            // Если нажата арифметическая операция
            else if (ARITHMETIC_OPERATORS.includes(event.key)) {
                event.preventDefault(); // Предотвращаем ввод символа

                addOperator({lineId, blockId, text: event.key})                
            }
        }
    }

    function handleSpace({event}: {event: KeyboardEvent}) {
        // Обработка пробела для создания переменной и нового блока
        event.preventDefault();

        if (isVariableName({name: $currentBlock.text})) {
            addBlock({lineId: $currentLine.id, blockId: $currentBlock.id, text: '', parentBlockId: ''})            
        }        
    }

    $: console.log('state', JSON.stringify($store))
</script>

<div id="editor" on:keydown={handleKeyDown}>
    {#each $lines as { id, blocks }}
      <Line {id} {blocks} /> <!-- Передаём уже готовый массив блоков -->
    {/each}
</div>

<style>
    #editor {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>
