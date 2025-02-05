export function isVariableName({name}) {
    const template = /^\p{L}[\p{L}\p{N}_]*$/u // \p{L} — буквы всех языков, \p{N} — числа
    return template.test(name)
}
